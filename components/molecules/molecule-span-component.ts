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
    const { timestampToUnix, unixToTimestamp ,computeColorByLabel} = $application
    const { options } = storeToRefs(useOptions())

    const {handleSelection,spanRefArray, createSpan, onDeleteSpan, spanClicked, linkMode, currentFocus,labelSelected,loadSpan} = inject('spanService',ref([]))

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
    const elementArray = ref([])
    const newLabel = ref<string>('')
    const linkCss = computed<string>(() => linkMode.value ? ' hover:border-2 ' : '')
    const spanCount = ref<number>(spanRefArray.value.length)
    const spanIndex = ref<number>()
    const relationArray = ref<any[]>([])
    const lastFocus = ref<number | undefined>(undefined)
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
      loadSpan(locals)
    })

    const saveSpan = (local) => {
      _.remove(local, (el) => !el.data)
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



