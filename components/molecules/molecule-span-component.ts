import {defineComponent, inject, createApp, createVNode, render } from "vue";
import type { PropType } from "vue";
import { useOptions } from "~/stores/annotation-options";
import BadgeDirective from 'primevue/badgedirective';
import _,{pullAt, find}  from 'lodash';
import { Tag } from 'primevue';
import AtomSpan from "../atoms/AtomSpan.vue";
import AtomSpanDetail from "~/components/atoms/AtomSpanDetail.vue";
import AtomSpanOption from "~/components/atoms/AtomSpanOption.vue";
import AtomSearch from "~/components/atoms/AtomSearch.vue";
import AtomTranscriptionSpan from "../atoms/AtomTranscriptionSpan.vue";
import AtomTaskComment from "../atoms/AtomTaskComment.vue";
import atomVideoOption from '../atoms/atom-video-option.vue';
import {AnnotationStatus} from "~/api/generate";

export default defineComponent({
  name: "MoleculeSpan",
  components: {AtomSpanDetail, AtomSpanOption,AtomSearch,AtomTranscriptionSpan, AtomSpan, atomVideoOption,AtomTaskComment},
  emits: ['on-segment-click'],
  props: {
    state: {type: String as PropType<AnnotationStatus>},
  },
  setup(props, { emit, expose }) {

    type AtomSpanType = InstanceType<typeof AtomSpan>

    const { $application } = useService()
    const { timestampToUnix, unixToTimestamp } = $application
    const { options } = storeToRefs(useOptions())

    const blockArray = ref<HTMLDivElement|null>(null)
    const listSegment = computed(() => blockArray.value?.children)
    const {locals} = inject('span')
    const isAnnotationEditable = inject('isAnnotationEditable')

    const aggregatedLocals = computed(() => {
      const result : any = []
      locals.value.forEach((local: any) => {
        local.sublocalisations?.localisation.forEach((word: any) => {
          result.push(word)
        })

      })
      return result
    })

    const app = createApp()
    app.directive('badge', BadgeDirective)
    const spanClicked = ref(false)
    const spanRefArray = ref<AtomSpanType[]>([])
    const elementArray = ref([])
    const newLabel = ref<string>('')
    const linkMode = ref(false)
    const linkCss = computed<string>(() => linkMode.value ? ' hover:border-2 ' : '')
    const spanCount = ref<number>(spanRefArray.value.length)
    const spanIndex = ref<number>()
    const relationArray = ref<any[]>([])
    const lastFocus = ref<number | undefined>(undefined)
    const currentFocus = ref<number | undefined>(undefined)
    const labelSelected = ref([])
    const labels = ref<string[]>(['Person', 'Citation', 'Verbe'])
    const filteredLocal = computed(() => {
      return _.filter(locals.value, (local) => local.sublocalisations)
    })

    interface State {
      selection: Selection | null,
      range: Range | null
    }

    const state: State = reactive({
      selection: null,
      range: null
    })

watch(()=>labelSelected.value,(labels)=>{
      if(currentFocus.value != undefined){
          spanRefArray.value[currentFocus.value].label = labels
      }
    })

watch(() => options.value.timecode_bloc,async (timecode : boolean ) => {
  await nextTick()
  blockArray.value?.childNodes.forEach((blocEl)   => {
    removeTimecodeDiv(blocEl)
    if (timecode) {
      addTimecodeDiv(blocEl)
    }
  })
  },)

const removeTimecodeDiv = (blocEl: ChildNode) => {
  if (blocEl.nodeType == 1) {
    if (blocEl.firstElementChild?.classList.contains('timecode')) blocEl.removeChild(blocEl.firstElementChild)
  }
}
const addTimecodeDiv = (blocEl : ChildNode ,target?: HTMLDivElement) => {
    if (blocEl.nodeType == 1) {
      const divTag : HTMLDivElement = document.createElement('div')
      divTag.addEventListener('click', ()=> emit('on-segment-click', {tcin: blocEl.firstElementChild.nextSibling.getAttribute('tcin'),tcout: blocEl.lastElementChild?.getAttribute('tcout'), index: computeDivPositionInList(blocEl) }))
      divTag.classList.add("timecode")
      divTag.classList.add("cursor-pointer")
      const tag : VNode = h(createVNode(Tag, { value: timestampToUnix(blocEl.firstElementChild.getAttribute('tcin')), severity: 'secondary' }))
      render(tag, divTag)
      if (target) target.insertBefore(divTag, target.firstElementChild )
      else blocEl.insertBefore(divTag, blocEl.firstElementChild)

    }
}
    function computeDivPositionInList(el: HTMLDivElement) {
      return Array.prototype.indexOf.call(el.parentElement.children, el)
    }

  watch(()=>options.value.bloc,async ()=> {
    await nextTick()
    spanCount.value = 0
    loadSpan()

  })


watch(()=>currentFocus.value,(newFocus:any, oldFocus:any)=>{
  lastFocus.value = oldFocus
  if( typeof lastFocus.value == 'number' && spanRefArray.value[oldFocus]) spanRefArray.value[oldFocus].focus = false
  if( typeof currentFocus.value == 'number') spanRefArray.value[newFocus].focus = true

},{immediate:true})


  const addLabel = () => {
    if(newLabel.value != ''){
      labels.value.push(newLabel.value)
      newLabel.value = ''
    }
  }

    const onDeleteSpan = ({ index }: { index: number }) => {
      const element: Element = elementArray.value[index]
      const text = spanRefArray.value[index].text
      if (element && element.parentNode) {
        const parent = element.parentNode // on recupere la div contenant la phrase
        parent.replaceChild(document.createTextNode(text), element) // on remplace le span par du text
        parent.normalize(); // On fusionne les 3 textes

      }
      _.remove(relationArray.value, (relation) => relation.to == index || relation.from == index)
      spanRefArray.value.splice(index, 1)
      spanRefArray.value.forEach((span, index) => {
        span.index = index
      })
      currentFocus.value = undefined
      spanCount.value--
    }


    const handleUnselect = () => {
      spanRefArray.value[currentFocus.value].focus = false
      currentFocus.value = undefined
      labelSelected.value = []
    }

    const formatSpan: any = (spanRef: any) => {
      const span = {}
      span.id = spanRef.id
      span.tcin = spanRef.tcin
      span.tcout = spanRef.tcout
      const property = []
      spanRef.label.forEach(label => {
        property.push({ key: 'entityType', value: label })
      });
      span.property = property
      return span

    }



    const handleSelection = (spanArg: any) => {
      const currentSelection = window.getSelection()
      if (currentSelection && currentSelection.toString() !== '' && (labelSelected.value.length != 0 || spanArg?.tcin)) {
        state.selection = currentSelection
        const id = spanArg.id != undefined ? spanArg.id : markRaw(spanCount.value)
        const label: Array<string> = spanArg?.property?.map((label: { value: any; }) => label.value) || spanArg?.label || markRaw(labelSelected.value)
        state.range = currentSelection.getRangeAt(0)
        let direction
        let indexStart
        let indexEnd
        let spanTcin = null
        let spanTcout = null
        if (!spanArg.tcin) {
          if (currentSelection.anchorNode?.parentElement?.parentNode == currentSelection.focusNode?.parentElement?.parentNode) {
            indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.childNodes, currentSelection.anchorNode?.parentElement)
            indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.childNodes, currentSelection.focusNode?.parentElement)
            direction = (indexStart <= indexEnd) ? 'forward' : 'backward'
          }
          else {
            indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.parentNode?.childNodes, currentSelection.anchorNode?.parentElement?.parentElement)
            indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.parentNode?.childNodes, currentSelection.focusNode?.parentElement?.parentElement)
            direction = (indexStart <= indexEnd) ? 'forward' : 'backward'

          }
          if (indexStart == indexEnd) {
            direction = (state.selection.anchorOffset < state.selection.extentOffset) ? 'forward' : 'backward'
          }
          spanTcin = getAttribute(direction, currentSelection, 'tcin')
          spanTcout = getAttribute(direction, currentSelection, 'tcout')
          if (direction == 'forward') {
            state.range.setEndAfter(state.selection.focusNode)
            state.range.setStartBefore(state.selection.anchorNode?.parentNode)
          }
          else {
            const startWord = state.selection.focusNode.parentNode
            state.range.setEndAfter(state.selection.anchorNode)
            state.range.setStartBefore(startWord)
          }
        }
        if (spanTcin == null) spanTcin = spanArg?.tcin
        if (spanTcout == null) spanTcout = spanArg?.tcout
        state.selection.removeAllRanges()
        const nextContainerSibling = state.range.endContainer.nextSibling
        const span = document.createElement('span') // temporary Element to create the span DOM
        const docFragment = state.range.extractContents() // extract all the HTMLElements in the range
        state.selection.empty()
        state.selection = null
        if (!spanClicked.value) {
          const app = createApp({
            render() {
              return h(AtomSpan, {
                label: label,
                tcIn: spanTcin,
                tcOut: spanTcout,
                id: id,
                linkCss: linkCss.value,
                options: options,
                ref: el => spanRefArray.value[id] = el,
                onSpanReady: ({ element, index }) => {
                  elementArray.value[index] = element
                },
                onEditSpan: ({ index }) => {
                  spanClicked.value = true
                  spanIndex.value = index
                },
                onFocusSpan: (event) => handleFocusSpan(event)
              })
            }
          })
          spanCount.value++
          app.mount(span) // Render the Span
          const fragment = document.createDocumentFragment()
          Array.from(span.childNodes).forEach(node => { // Add the content of the temporary element inside a document Fragment
            fragment.appendChild(node)
          });
          if (docFragment.firstChild?.firstChild?.nodeType == 1) {
            const blocs = docFragment.childNodes
            const border = docFragment.firstChild.cloneNode(false)
            const blocNb = blocs.length


            blocs.forEach((previousBlock) => {
              const wordArray = previousBlock.childNodes
              wordArray.forEach((word) => {
                if ((word.nodeType == 1) && word.getAttribute('tcin'))
                  docFragment.appendChild(word.cloneNode(true))
              })
            })
            let i = 0
            while (i < blocNb) {
              docFragment.firstChild?.remove()
              i++
            }
            fragment.firstChild?.firstChild?.appendChild(docFragment) // Add all the word inside the final div
            border.appendChild(fragment)
            if (options.value.timecode_bloc) {
              addTimecodeDiv(border.firstChild.firstElementChild, border)
              if (nextContainerSibling?.getAttribute('tcin')) addTimecodeDiv(nextContainerSibling?.parentNode)
            }
            state.range.insertNode(border) // Add this document fragment to the DOM

          }

          else {
            fragment.firstChild?.firstChild?.appendChild(docFragment) // Add all the word inside the final div
            state.range.insertNode(fragment) // Add this document fragment to the DOM
          }

        }
        else {
          direction == 'forward' ? spanRefArray.value[spanIndex.value].addRight(docFragment) : spanRefArray.value[spanIndex.value].addLeft(docFragment)
          spanClicked.value = false
        }
        spanIndex.value = undefined
        formatSpan(spanRefArray.value[spanRefArray.value.length - 1])
      }
    }


    const getAttribute = (direction, selection, tc) => {
      if ((direction == 'forward' && tc == 'tcin') || (direction == 'backward' && tc == 'tcout')) return selection.anchorNode?.parentElement?.getAttribute(tc)
      else if ((direction == 'forward' && tc == 'tcout') || (direction == 'backward' && tc == 'tcin')) return selection.focusNode?.parentElement.getAttribute(tc)
    }

    const loadSpan = () => {
      if (spanRefArray.value.length == 0) {
        locals.value?.forEach((segment) => {
          if ((!segment.sublocalisations) && (segment.property?.[0].key == "entityType")) {
            createSpan(segment)
          }
        });
      }
      else {
        spanRefArray.value?.forEach((segment) => {
          createSpan(segment)
        });
      }
      if (relationArray.value.length == 0)
        locals.value?.forEach(segment => {
          if ((!segment.sublocalisations) && (segment.property?.[0].key == 'relationType')) {
            relationArray.value.push({ from: segment.from, to: segment.to })
          }
        });
    }

    const createSpan = (span) => {
      const startNode = document.querySelector(`[tcin="${span.tcin}"]`) as Node
      const endNode = document.querySelector(`[tcout="${span.tcout}"]`) as Node
      const range: Range = new Range()
      range.setStartBefore(startNode)
      range.setEndAfter(endNode)
      const selection: Selection | null = window.getSelection()
      selection?.empty()
      selection?.addRange(range)

      handleSelection(span)
    }

    const handleFocusSpan = ({ index }) => {
      if (linkMode.value) {
        relationArray.value.push({ from: currentFocus.value, to: index })
        linkMode.value = false
      }
      else if(index != undefined){
        spanClicked.value = false
        currentFocus.value = index
        labelSelected.value = spanRefArray.value[currentFocus.value].label
      }
    }

    function formatRelation(relationArg: never): any {
      const relation = {}
      relation.property = []
      const property = {}
      property.key = 'relationType'
      property.value = 'Indiciates'
      relation.property.push(property)
      relation.from = relationArg.from
      relation.to = relationArg.to
      return relation
    }

    onMounted(async () => {
      await nextTick()
      loadSpan()
    })

    const saveSpan = (local) => {
      _.remove(local, (el) => !el.sublocalisations)
      spanRefArray.value.forEach((span) => {
        local.push(formatSpan(span))
      })
      relationArray.value.forEach((relation) => {
        local.push(formatRelation(relation))
      })
      return local
    }


      expose({annotationFunction: saveSpan, listRefs: listSegment })

    return{
      labelSelected,
      relationArray,
      aggregatedLocals,
      labels: labels,
      newLabel,
      addLabel,
      spanRefArray,
      handleFocusSpan,
      handleSelection,
      blockArray,
      isAnnotationEditable,
      AtomTranscriptionSpan,
      AtomSearch,
      filteredLocal,
      unixToTimestamp,
      AtomSpanOption,
      AtomSpanDetail,
      onDeleteSpan,
      handleUnselect,
      options,
      currentFocus : currentFocus,
      locals,
      pullAt,
      find
    }

  }

})



