import commentIcon from '/icons/icons-svg/icons-svg/comment-icon.svg';

import _, { remove } from 'lodash'
import { defineExpose } from 'vue';
import AtomPluginBlock from '~/components/atoms/plugin/pluginBlock/AtomPluginBlock.vue';
import AtomComment from '~/components/atoms/AtomComment.vue';
import AtomPluginAutocompleteList from "~/components/atoms/AtomPluginAutocompleteList.vue";
import AtomTranscriptionSpan from "~/components/atoms/AtomTranscriptionSpan.vue";
import type {PluginAutocompleteValueDTO} from "~/api/generate"
import {DisplayZone, AnnotationType} from "~/api/generate"
import {parseRgba} from '~/utils/color'

export default defineComponent({
  name: "AtomSegmentation",
  emits: ['segmentation', 'on-segment-click','activateTopic', 'deactivateTopic','dragging-start','dragging-end','create-span'],
  props: ['phrase', 'colors', 'topics', 'index', 'topicList', 'segmentationRefs','tcOffset','transcriptions'],
  components: {AtomPluginBlock,AtomPluginAutocompleteList,AtomTranscriptionSpan,AtomComment},
  setup(props, {emit,expose}){

  const { phrase, colors, topics, index, topicList, segmentationRefs,tcOffset, transcriptions} = props
  const { $application } = useService()
  const { userEmail } = useAuth()
  const { options } = storeToRefs(useOptions())
  const { timestampToUnix , unixToTimestamp,extractRGB,  } = $application
  const jumpToTopic = inject('jumpToTopic',null)
  const segment = ref(null)
  const toast = useToast()
  const topicIndex = computed(() => topics[index])
  const iconBool = ref('pi pi-tag')
  const topicText = ref(null)
  const titleContainer = ref(null)
  const editTitle = ref(false)
  iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
  topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
  const editedTitle = ref(null)
  const ruptureTemplate = ref()
  const comment = ref(null)
  const dialogVisible = ref(false);
  const title = computed(()=>{
    if(isTopicFirstSegment.value){
      return editedTitle.value ? editedTitle.value : 'Topic '+ topicIndex.value
    }
    else return null
  })

  const annotation_type = inject('annotation_type') as AnnotationType
  const autoSummaries = inject('transcriptions')
  const isAnnotationEditable = inject('isAnnotationEditable') && annotation_type.includes('segmentation')

  const showSecondaryButtons = computed(()=>{
    return topicIndex != 0 && isAnnotationEditable && annotation_type == AnnotationType.SEGMENTATION
    })

  type pluginValues= Record<string,PluginAutocompleteValueDTO[]>

  /**
  * Object contenant les variables utilisees pour recueuillir les inputs des plugins
  * les proprietes de `pluginValues` sont de la forme "plugin-[pluginId]" et contiennent un tableau de valeurs
  *
  * @example
  * {
  *  'plugin-4' : [
  *   {
  *    extId: "4264545",
  *    id: "HIS",
  *     label: "Histoire",
  *    plugin_id: 4
  *   }
  *  ]
  * }
  **/
  const pluginValues = reactive<pluginValues>({})

  onMounted(()=>{
    watch(()=>topicList[topicIndex.value],
      (newTopicList) => {
        // Assignation des valeurs presentes dans la topicList aux inputs
        newTopicList?.labels.forEach(label=>{
          if(!pluginValues[`plugin-${label.plugin_id}`]) pluginValues[`plugin-${label.plugin_id}`] = [] // Creation des variables utilisee en tant qu'input
          pluginValues[`plugin-${label.plugin_id}`].push(label)
        })
      },{once:true})
  })


  const topicHeader = ref<HTMLDivElement>()
  const commentWrapper = ref<HTMLDivElement>()
  const firstSegmentPadding = ref<HTMLDivElement>()

  const chipList = computed(()=>{
    const resultList = []
    for (const pluginId in pluginValues) {
      resultList.push(...pluginValues[pluginId])
      topicList[topicIndex.value].labels = resultList
    }

    if(topicList[topicIndex.value]){
    }
    return resultList
  })

  function handleRemove(index){
    const pluginId = chipList.value[index].plugin_id
    remove(pluginValues[`plugin-${pluginId}`],value=>value == chipList.value[index])
  }

  onMounted(()=>{
    watch(()=>topics,()=>{
      setTimeout(()=>computeTopicHeight(),200)
    },{deep:true})


    watch(()=>chipList.value?.length,async (value)=>{
        await nextTick()
        if(isTopicFirstSegment.value && firstSegmentPadding.value){
            firstSegmentPadding.value.style.paddingBottom = topicHeader.value?.getBoundingClientRect().height-20  +'px'
            commentWrapper.value.style.top = topicHeader.value?.getBoundingClientRect().height + 'px'
            setTimeout(()=>computeTopicHeight(),200)
        }
    })

    watch(()=>options.number_segment,()=>{
            setTimeout(()=>computeTopicHeight(),200)
    })

    watch(()=>options.timecode_segment,()=>{
            setTimeout(()=>computeTopicHeight(),200)
    })
  })
  function startDrag(event: DragEvent) {
    event.stopPropagation()
    const target: HTMLDivElement = event.target as HTMLDivElement
    target.style.opacity = '0.4'
  }

  function getLiList(element,count) {
    if (element.children.item(1)?.tagName== 'OL') return {list: element.children, deep: count}
    return getLiList(element.parentElement,count+1)
  }

  function getDeepElement(element,deep){
    if(deep==0) return element
    return getDeepElement(element.parentElement, deep-1)
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    const target: HTMLDivElement = event.target as HTMLDivElement
    const result = getLiList(target,0)
    const listLiElement : HTMLCollection = result.list
    const index = Array.from(listLiElement).filter((el)=>el.type!='button').indexOf(getDeepElement(target,result.deep-1))
    if( index != -1) emit('dragging-end',index)
    isDragOver.value = false
  }

  function toggleComment(event) {
      comment.value.toggle(event)
  }


  function endDrag(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    const target: HTMLDivElement = event.target as HTMLDivElement
    target.style.opacity = '1'
    const result = getLiList(target,0)
    const listLiElement : HTMLCollection = result.list
    const index = Array.from(listLiElement).filter((el)=>el.type!='button').indexOf(getDeepElement(target,result.deep-1))
    emit('dragging-start',index)
  }


  const isDragOver = ref(false)

  function previewDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    isDragOver.value = true
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    if(segment.value && !segment.value.contains(event.relatedTarget as Node)){
        isDragOver.value = false
    }

  }


  function computeDrag(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  const isTopicFirstSegment = computed(() => {
    if (topics[index] != undefined) {
      return topics[index] != topics[index - 1]
    }
    else return false
  })

  const computeTopicHeight = async () => {
    if (isTopicFirstSegment.value) {
      await nextTick()
      let id = index
      let topicHeight = 0
      do {
        topicHeight += segmentationRefs[id].clientHeight
        id++
      } while (topics[id] == topics[id - 1]);
      titleContainer.value.style.height = topicHeight + 'px'
    }
  }


  onMounted( ()=>{
    watchEffect(()=>{
    })
    watch(()=>editTitle.value,(newValue, oldValue)=>{
      if(isTopicFirstSegment.value && newValue == false ){
        topicList[topicIndex.value].title = editedTitle.value
      }
    })
    watch(()=>isTopicFirstSegment.value,(newValue)=>{
      if(newValue == true){
        editedTitle.value =  topicList[topicIndex.value]?.title
      }
    })
    watch(()=>isTopicFirstSegment.value,()=>{
        setTimeout(()=>computeTopicHeight(),200)
    })
    watch(()=>topicList[topicIndex.value]?.title,(newTitle)=>{
      if(isTopicFirstSegment.value ){
        editedTitle.value = newTitle
      }
    },{immediate: true})


    window.addEventListener('resize', computeTopicHeight,{})

  })


  const isTopicsLastSegment = computed(() => {
    if (topics[index + 1] == undefined) return true
    return topics[index] != topics[index + 1]
  })

  function applyHeaderColor(hex) {
    if(topicIndex.value == 0)return 'background-color: #BEBEBE4c;'
        const [r, g, b] = extractRGB(hex);
        return `background-color: rgba(${r},${g},${b}, 0.25);`;
  }

  function dynamicStyle(color) {

    const hexMatch = color?.match(/^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/);

    // const hexMatch = color?.match(/^#([0-9A-F]{3}|[0-9A-F]{6})$/);
    if (topics[index] == topics[index - 1] && topics.length !== 0 && topics[index] != undefined) {
      if (hexMatch) {
        const [r, g, b] = extractRGB(color);
        if (index < 2) {
        }
        return `background-color: rgba(${r},${g},${b}, 0.25); margin-top: 0px;  `;
      }
      else {
        return `background-color: ${reduceOpacityOfColor(color, 0.25)}; margin-top: 0px;   `;
      }
    } else {
      if (hexMatch) {
        const [r, g, b] = extractRGB(color);
        return `background-color: rgba(${r},${g},${b}, 0.25);`;
      }
      return {
        margintop: '1.25rem',
        backgroundColor: reduceOpacityOfColor(color, 0.25),
      };
    }
  }
  function reduceOpacityOfColor(rgbaColor, opacity) {
    const [r,g,b,a] = parseRgba(rgbaColor) ?? []
    const newOpacity = Math.max(a - opacity, 0); // Réduire l'opacité sans descendre en dessous de 0
    return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
  }


  const handleSegmentation = () => {
    emit('segmentation', { index: index })
    iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
    topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
  }


  expose({  id: topicIndex, })


    return {
     findIndex :  _.findIndex,
      computeTopicHeight,
      applyHeaderColor,
      dynamicStyle,
      computeColor,
      startDrag,
      computeDrag,
      previewDrop,
      handleDragLeave,
      handleDrop,
      endDrag,
      handleSegmentation,
      handleRemove,
      isDragOver,
      isTopicFirstSegment,
      isTopicsLastSegment,
      annotation_type,
      firstSegmentPadding,
      editTitle,
      segment,
      editedTitle,
      jumpToTopic,
      isAnnotationEditable,
      autoSummaries,
      commentWrapper,
      phrase,
      toggleComment,
      options,
      topicIndex,
      comment,
      emit,
      topics,
      commentIcon,
      chipList,
      timestampToUnix,
      unixToTimestamp,
      userEmail,
      ruptureTemplate,
      pluginValues,
      titleContainer,
      title,
      toast,
      dialogVisible,
      showSecondaryButtons,
      topicHeader,
    }
  }
})
