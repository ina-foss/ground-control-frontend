import _ from 'lodash';
import { useTopicList } from '~/composables/useTopicList';

export default defineComponent({
  name: "AtomTopicList",
  emits: ["topicClick"],
  props: {
    colors: {
      type: Array,
      default: () => []
    },
    topics: {
      type: Array,
      default: () => []
    },
  },
  setup({ colors, topics }, { emit }) {

    const { topicList } = useTopicList()

    function preventDefaultTitle(topic) {
      if (!topic) return ''
      return topic?.title ? topic.title : "Topic " + topic.id
    }

    const cleanedColors = computed(() => { // delete the first element
      const cleanedSort = {}

      topics.forEach((topic: number, index: number) => {
        // Add to cleanedSort object each topic in the order
        // they appear in the transcription
        if (!_.findKey(cleanedSort, (el) => el === colors[topic])) {
          cleanedSort[colors[topic]] = topic
        }
      })

      return cleanedSort
    })

    return {
      cleanedColors,
      topicList,
      emit,
      preventDefaultTitle
    }
  }



})
