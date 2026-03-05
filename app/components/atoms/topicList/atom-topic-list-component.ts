import _ from 'lodash';
import { useTopicList } from '~/composables/useTopicList';
import { useService } from '#imports';



export default defineComponent({
  name: "AtomTopicList",
  emits: ["topicClick"],
  props: {
    topics: {
      type: Array,
      default: () => []
    },
  },
  setup(props, { emit }) {

    const { topicList } = useTopicList()
    const { $application } = useService()
    const { extractRGB } = $application;

    const { topics } = toRefs(props)

    function preventDefaultTitle(topic) {
      if (!topic) return ''
      return topic?.title ? topic.title : "Topic " + topic.id
    }

    function styleTopicCircle(hex: string): string {
      const [r, g, b] = extractRGB(hex);
      return `background-color: rgba(${r},${g},${b}, 0.25); border: solid 3px rgba(${r},${g},${b}, 0.50);`;
    }

    const cleanedColors = computed(() => { // delete the first element
      const cleanedSort = {}

      topics.value.forEach((topic: number) => {
        // Add to cleanedSort object each topic in the order
        // they appear in the transcription
        if (!_.findKey(cleanedSort, (el) => el === topic) && topic) {
          cleanedSort[" " + topic.toString()] = computeColor(topic).hex
        }


      })

      return cleanedSort
    })

    return {
      cleanedColors,
      topicList,
      emit,
      preventDefaultTitle,
      styleTopicCircle,
      computeColor
    }
  }



})
