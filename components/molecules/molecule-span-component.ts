import {defineComponent, inject, createApp, createVNode, render } from "vue";
import type { PropType } from "vue";
import { useOptions } from "~/stores/annotation-options";
import BadgeDirective from 'primevue/badgedirective';
import _,{pullAt, find}  from 'lodash';
import { Tag } from 'primevue';
import AtomSpan from "../atoms/AtomSpan.vue";
import AtomSpanDetail from "~/components/atoms/AtomSpanDetail.vue";
import AtomSpanOption from "~/components/atoms/AtomSpanOption.vue";
import AtomSearch from "~/components/atoms/search/AtomSearch.vue";
import AtomTranscriptionSpan from "../atoms/AtomTranscriptionSpan.vue";
import AtomTaskComment from "../atoms/AtomTaskComment.vue";
import atomVideoOption from '../atoms/atom-video-option.vue';
import AtomSpanForm from '../atoms/spanForm/AtomSpanForm.vue'
import AtomSpanControlPanel from '../atoms/spanControlPanel/AtomSpanControlPanel.vue'
import type {AnnotationStatus} from "~/api/generate";


export default defineComponent({
  name: "MoleculeSpan",
  components: {AtomSpanControlPanel, AtomSpanDetail, AtomSpanOption,AtomSearch,AtomTranscriptionSpan, AtomSpan, atomVideoOption,AtomTaskComment, AtomSpanForm},
  emits: ['on-segment-click'],
  props: {
    state: {type: String as PropType<AnnotationStatus>},
  },
  setup(props, { emit, expose }) {

    const { $application } = useService()
    const { timestampToUnix, unixToTimestamp } = $application
    const { options } = storeToRefs(useOptions())


    const {showDragPin, spanForm, op,spanMenuSelected, spanMenu, spanArray, handleSelectionV2,  onDeleteSpan, loadSpanv2, saveSpan, contextMenuOptions, mainPluginId} = useSpanService()
    const {pluginList } = storeToRefs(usePluginStore())


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
    loadSpanv2(locals)

})
    onMounted(async () => {
      await nextTick()
      loadSpanv2(locals)
    })

      expose({annotationFunction: saveSpan, listRefs: listSegment })

    return{
      aggregatedLocals,
      spanForm,
      contextMenuOptions,
      spanArray,
      handleSelectionV2,
      blockArray,
      isAnnotationEditable,
      AtomTranscriptionSpan,
      AtomSearch,
      filteredLocal,
      unixToTimestamp,
      AtomSpanOption,
      AtomSpanDetail,
      onDeleteSpan,
      spanMenuSelected,
      options,
      locals,
      pullAt,
      find,
      spanMenu,
      op,
      mainPluginId,
      pluginList
    }

  }

})



