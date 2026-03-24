import {defineComponent, inject, createVNode, render } from "vue";
import type { PropType } from "vue";
import { useOptions } from "~/stores/annotation-options";
import _,{pullAt, find}  from 'lodash';
import { Tag } from 'primevue';
import AtomSpanDetail from "~/components/atoms/AtomSpanDetail.vue";
import AtomSpanOption from "~/components/atoms/AtomSpanOption.vue";
import AtomSearch from "~/components/atoms/search/AtomSearch.vue";
import AtomTranscriptionSpan from "../atoms/AtomTranscriptionSpan.vue";
import AtomTaskComment from "../atoms/AtomTaskComment.vue";
import atomVideoOption from '../atoms/atom-video-option.vue';
import AtomSpanForm from '../atoms/spanForm/AtomSpanForm.vue'
import MoleculeSpanControlPanel from './spanControlPanel/MoleculeSpanControlPanel.vue'
import {Status} from "~/api/generate";


export default defineComponent({
  name: "MoleculeSpan",
  components: {MoleculeSpanControlPanel, AtomSpanDetail, AtomSpanOption,AtomSearch,AtomTranscriptionSpan, atomVideoOption,AtomTaskComment, AtomSpanForm},
  emits: ['on-segment-click', 'update:spansChanged'],
  props: {
    state: {type: String as PropType<Status>},
    isAnnotationEditable: { type: Boolean, default: true }
  },
  async setup(props, { emit, expose }) {

    const { $application } = useService()
    const { timestampToUnix, unixToTimestamp } = $application
    const store = useOptions()
    const { options } = storeToRefs(store)

    const {$amalia}  = useService()

    const playerTime = ref()

    let intervalCheckTime : NodeJS.Timeout

    onMounted(() => {
      intervalCheckTime = setInterval(() => {
        playerTime.value = $amalia.callSeek()
      }, 50);
    })

    const {focusGroup,newFocus,spanForm, op,spanMenuSelected, spanMenu, spanArray, handleSelectionV2,  onDeleteSpan, loadSpan, saveSpan, contextMenuOptions, mainPluginId, appendAllSpansToDOM} = useSpanService()

    onUnmounted(()=>{
      clearInterval(intervalCheckTime)
    })

    const {pluginList } = storeToRefs(usePluginStore())
    const moleculeSpanControlPanelRef = ref()


    watch(() => spanArray.value.length, () => {
      emit('update:spansChanged', true)
    })

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

    let doubleClickTimeout : NodeJS.Timeout | null = null

    function handleWordClick (event: {tcin: number | string, event: MouseEvent}){
      if (options.value.ctrlWordClick) {
        emit('on-segment-click', event)
      } else {
        if (doubleClickTimeout) {
          // if the handler is triggered 2 times in less than 500ms
          clearTimeout(doubleClickTimeout); // cancel the timeout
          doubleClickTimeout = null
        } else {
          if (window.getSelection()?.rangeCount) {
            // won't emit if user selected the word
            doubleClickTimeout = setTimeout(() => {
              emit('on-segment-click', event)
              doubleClickTimeout = null
            }, 500);
          }
        }
      }

    }

    onMounted(async () => {
      await nextTick()
      appendAllSpansToDOM()
    })

    expose({annotationFunction: saveSpan, listRefs: listSegment })

    await loadSpan(locals)

    return{
      Status,
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
      handleWordClick,
      playerTime,
    }

  }

})



