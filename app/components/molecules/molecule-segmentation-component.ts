import { defineComponent } from 'vue';
import { useOptions } from "~/stores/annotation-options";
import AtomSegmentation from "~/components/atoms/AtomSegmentation.vue";
import AtomProgressBar from "~/components/atoms/AtomProgressBar.vue";
import AtomSpanOption from "~/components/atoms/AtomSpanOption.vue";
import AtomSpanForm from "~/components/atoms/spanForm/AtomSpanForm.vue";
import AtomTaskComment from '../atoms/AtomTaskComment.vue';
import atomVideoOption from '../atoms/atom-video-option.vue';
import _ from 'lodash'
import AtomTopicList from "~/components/atoms/topicList/AtomTopicList.vue";
import {Status} from '~/api/generate';
import AtomHelp from "../atoms/AtomHelp.vue";


export default defineComponent({
  name: 'MoleculeSegmentation',
  components: { AtomTaskComment ,AtomSegmentation, AtomProgressBar, AtomSpanOption, atomVideoOption ,AtomTopicList,AtomHelp, AtomSpanForm},
  emits: ['on-segment-click'],
  props: {
    result: {type: Object, default: ()=> {} },
    colors:{ type:  Array<string>, default: () => ['#BEBEBE']},
    topics: {type: Array<number>, default: ()=> []},
    locals: {type: Array, default: ()=> []},
    state: {type: String as PropType<Status>},
    tcOffset: {type: Number, default: ()=> 0},
    transcriptions: {type: Array, default: ()=>['test']}
  },
  setup(props, { emit, expose }) {

    const { loadSpan, handleSelectionV2, spanMenu, contextMenuOptions, spanForm} = useSpanService()
    const { $application } = useService()
    const { topicList, deleteTopic, createTopic, fusionTopicData, copyTopicData } = useTopicList(true)
    const { computeColor } = $application
    const dragging = reactive<{start: number|null, end: number|null}>({start: null, end:null})
    const segmentationRefs = ref<Array<HTMLDivElement>>([])
    const { options } = storeToRefs(useOptions())
    const { colors, topics, locals ,tcOffset } = props
    const {result,transcriptions} = toRefs(props)
    const isAnnotationEditable = inject('isAnnotationEditable')


    const handleSegmentation = (event) => {
      if(!isAnnotationEditable) return
      if(window.onbeforeunload == null) {
        window.onbeforeunload = function () {
          return confirm("You didn't saved your progression")
        }
      }

      const referenceDiv = segmentationRefs.value[event.index] // Get the HTML element of the div where your create/break the topic
      const initialYPosition = referenceDiv.getBoundingClientRect().top // Get the vertical position of this div
      const scrollerHtml = segmentationRefs.value[event.index].parentElement
      let animationFrameId // Identify each animation frame

      const adjustScroll = (repeat?: boolean) =>{
        const newRect = referenceDiv.getBoundingClientRect();
        const newY = newRect.top;
        const scrollOffset = newY - initialYPosition;
        scrollerHtml.scrollBy(0, scrollOffset);
        // Continue the loop
        if(repeat ?? true){ animationFrameId = requestAnimationFrame(adjustScroll) }

      }

      if (topics[event.index] == topics[event.index + 1]) {
        createBreak(event.index)
      }
      else {
        removeBreak(event.index)
      }

      // Start callback loop on each frame
      animationFrameId = requestAnimationFrame(adjustScroll)

      referenceDiv.addEventListener('transitionend', function onTransitionEnd(event) {
          // Filter the animation related to rupture
          if (event.propertyName === 'margin-top' || event.propertyName === 'background-color' ) {
              // Stop the animation loop
              cancelAnimationFrame(animationFrameId);
              // Remove the event listener after it has been triggered
              referenceDiv.removeEventListener('transitionend', onTransitionEnd);
              adjustScroll(false)
          }
      });

    }

    watchEffect(()=>{
      if(dragging.start != null && dragging.end != null){
        if(dragging.start != dragging.end){
          let {start,end} = dragging
          const diff = end - start
          while(start != end){
            if ( diff > 0){
              const extendTopic = topics[dragging.start]
              start++
              topics[start] = extendTopic
            }
            else{
            const extendTopic = topics[dragging.start+1]
            topics[start] = extendTopic
            start --
            }
          }
      }
        dragging.start = null
        dragging.end = null
      }
    })

    const filteredLocals = computed(() => {
      return _.filter(locals, (local) => local?.sublocalisations)
    })

    const deactivateTopic = ({ index }:{index: number}) => {
      if(!isAnnotationEditable) return
      let currentIndex = index
      const topic = 0
      const previousTopic = topics[currentIndex]
      deleteTopic(previousTopic)
      do {
        topics[currentIndex] = topic
        currentIndex++
      } while (previousTopic == topics[currentIndex])
    }

    const activateTopic = ({ index }:{index: number})=>{
        let currentIndex = index
        const topic = generateTopicNumber()
        createTopic({ id: topic, labels: [] })
        do {
          topics[currentIndex] = topic
          currentIndex++
        }while(topics[currentIndex] == 0 )


    }

    const createBreak = (index: number) => {
      let currentIndex = index
      const topic = generateTopicNumber()
      const topTopic = topics[currentIndex]
      createTopic({ id: topic, labels: [] })
      copyTopicData(topTopic,topic)
      do {
        topics[currentIndex] = topic
        currentIndex--
      } while ((currentIndex >= 0) && (topTopic == topics[currentIndex]))
    }

    const removeBreak = (index: number) : void => {
      let currentIndex = index
      const bottomTopic= topics[currentIndex + 1]
      const topTopic = topics[currentIndex]
      fusionTopicData(topTopic, bottomTopic)
      deleteTopic(topTopic)
      do {
        topics[currentIndex] = bottomTopic == undefined ? null : bottomTopic
        currentIndex--
      } while ((currentIndex >= 0) && (topTopic == topics[currentIndex]))
    }


    const generateTopicNumber = (): number => {
      let result = _.max(topics) + 1 || 1
      const randomColor = computeColor(result).hex
      colors.push(randomColor)
      return result

    }


    const loadTopics = () => {
      const max = _.maxBy(locals, (local) => local?.data?.topic) // Search for maximum topic number
      while (colors.length <= max?.data.topic) { // Create all colors below this max
        const randomcolor = computeColor(colors.length).hex
        colors.push(randomcolor)
      }
      locals.forEach((phrase, index) => { // apppend topic number to each segments
        if (![undefined].includes(phrase?.data?.topic)) {
          topics[index] = phrase.data.topic
        }
      })
      if(result.value.topic_metadata ){
        result.value.topic_metadata.forEach((topic ) => {
          topicList.value[topic?.id] = topic
        })
      }
    }

    const handleSegmentClick = (event: {tcin: string|number, tcout: string|number, index:number}) => {
      emit('on-segment-click', event )
    }

    const jumpToTopic = inject('jumpToTopic')

    const segmentationFunction = (localSubmit: any[]) => {
      localSubmit.forEach((phrase, index) => {
        if (![undefined].includes(topics[index])) {
          phrase.data.topic = topics[index]
        }
      })
      result.value.topic_metadata = topicList.value
      return localSubmit
    }

    const spans = inject('spans')

    onMounted(() => {
      loadTopics()
      loadSpan(spans)
    })


    expose( {listRefs: segmentationRefs, annotationFunction: segmentationFunction,handleSegmentation })

    return {
      locals,
      colors,
      topics,
      options,
      topicList,
      dragging,
      filteredLocals,
      segmentationRefs,
      isAnnotationEditable,
      handleSegmentation,
      handleSegmentClick,
      deactivateTopic,
      activateTopic,
      jumpToTopic,
      tcOffset,
      transcriptions,
      spanForm,
      handleSelectionV2,
      contextMenuOptions,
      spanMenu,
    }


  }
})
