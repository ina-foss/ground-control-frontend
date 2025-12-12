import {defineComponent, inject, createVNode, render } from "vue";
import type { PropType } from "vue";
import { useOptions } from "~/stores/annotation-options";
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
import MoleculeSpanControlPanel from './spanControlPanel/MoleculeSpanControlPanel.vue'
import {AnnotationStatus} from "~/api/generate";


export default defineComponent({
  name: "MoleculeSpan",
  components: {MoleculeSpanControlPanel, AtomSpanDetail, AtomSpanOption,AtomSearch,AtomTranscriptionSpan, AtomSpan, atomVideoOption,AtomTaskComment, AtomSpanForm},
  emits: ['on-segment-click'],
  props: {
    state: {type: String as PropType<AnnotationStatus>},
    isAnnotationEditable: { type: Boolean, default: true }
  },
  async setup(props, { emit, expose }) {

    const { $application } = useService()
    const { timestampToUnix, unixToTimestamp } = $application
    const { options } = storeToRefs(useOptions())



    const {newFocus,spanForm, op,spanMenuSelected, spanMenu, spanArray, handleSelectionV2,  onDeleteSpan, loadSpan, saveSpan, contextMenuOptions, mainPluginId, appendAllSpansToDOM} = useSpanService()
    const {pluginList } = storeToRefs(usePluginStore())

    const moleculeSpanControlPanelRef = ref()

    function focusGroup({groupId}: {groupId: number}) {
      newFocus.value = groupId
    }


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
      return _.filter(locals.value, (local) => local?.sublocalisations).sort((a,b)=> unixToTimestamp(a?.tcin) - unixToTimestamp(b?.tcin) )
    })


    function handleWordClick (event: {tcin: number | string, event: MouseEvent}){
      if (event.event.ctrlKey || (event.event.target as Element).getAttribute('tcin') == undefined ){
        emit('on-segment-click', event)
      }
    }

    onMounted(async () => {
      await nextTick()
      appendAllSpansToDOM()
    })

    expose({annotationFunction: saveSpan, listRefs: listSegment })

    await loadSpan(locals)

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
      pluginList,
      moleculeSpanControlPanelRef,
      focusGroup,
      handleWordClick
    }

  }

})



