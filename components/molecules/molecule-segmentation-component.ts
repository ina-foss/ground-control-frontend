import { defineComponent } from 'vue';
import AtomSegmentation from "~/components/atoms/AtomSegmentation.vue";
import AtomProgressBar from "~/components/atoms/AtomProgressBar.vue";
import _ from 'lodash'


export default defineComponent({
  name: 'MoleculeSegmentation',
  components: { AtomSegmentation, AtomProgressBar },
  emit: ['on-segment-click'],
  props: {
    colors:{ type:  Array<string>, default: () => ['#BEBEBE']},
    topics: {type: Array<number>, default: ()=> []},
    locals: {type: Array, default: ()=> []}
  },
  setup({ colors, topics, locals }, { emit, expose }) {

    const { $application } = useService()
    const { topicList, deleteTopic, createTopic, fusionTopicData } = useTopicList()
    const { computeColor } = $application

    const segmentationRefs = ref<Array<HTMLDivElement>>([])

    const handleSegmentation = (event) => {
      window.onbeforeunload = function () {
        return confirm("You didn't saved your progression")
      }

      if (topics[event.index] == topics[event.index + 1]) {
        createBreak(event.index)
      }
      else {
        removeBreak(event.index)
      }
    }

    const filteredLocals = computed(() => {
      return _.filter(locals, (local) => local?.sublocalisations)
    })

    const deactivateTopic = ({ index }:{index: number}) => {
      let currentIndex = index
      const topic = 0
      const previousTopic = topics[currentIndex]
      do {
        topics[currentIndex] = topic
        currentIndex++
      } while (previousTopic == topics[currentIndex])
    }

    const createBreak = (index: number) => {
      let currentIndex = index
      const topic = newTopic()
      const topTopic = topics[currentIndex]
      createTopic({ id: topic, title: topicList.value[topTopic]?.title || null, labels: [] })
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
        topics[currentIndex] = bottomTopic
        currentIndex--
      } while ((currentIndex >= 0) && (topTopic == topics[currentIndex]))
    }


    const newTopic = (): number => {
      let result
      colors.forEach((color, index) => {
        if (parseInt(index) != 0 && _.findIndex(topics, (el) => el == parseInt(index)) == -1) {
          result = parseInt(index)
        }
      })
      if (!result) {
        result = _.max(topics) + 1 || 1
        const randomColor = computeColor(result).hex
        colors.push(randomColor)
      }
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
      locals.filter((phrase) => !phrase?.sublocalisations).forEach((phrase ) => {
        console.log(phrase)
        topicList.value[phrase?.id] = phrase
      })
    }

    const handleSegmentClick = (event: {tcin: string|number, tcout: string|number, index:number}) => {
      emit('on-segment-click', { tcin: event.tcin, tcout: event.tcout, index:event.index })
    }

    const jumpToTopic = (event: {topic: number }) => {
      const firstIndex = topics.findIndex((topic) => topic == event.topic)
      segmentationRefs.value[firstIndex].scrollIntoView({ behavior: "smooth" })
    }

    const segmentationFunction = (localSubmit: any[]) => {
      localSubmit.forEach((phrase, index) => {
        if (![undefined].includes(topics[index])) {
          phrase.data.topic = topics[index]
        }
      })
      _.remove(localSubmit, (el) => !el?.sublocalisations)
      topicList.value.forEach((topic) => {
        localSubmit.push(topic)
      })
      return localSubmit
    }

    onMounted(() => {
      loadTopics()
    })

    expose( {listRefs: segmentationRefs, annotationFunction: segmentationFunction })

    return {
      locals,
      colors,
      topics,
      topicList,
      filteredLocals,
      segmentationRefs,
      handleSegmentation,
      handleSegmentClick,
      deactivateTopic,
      jumpToTopic,
    }

  }
})
