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
  setup({ topics }, { emit }) {

    const { topicList } = useTopicList()
    const { $application } = useService()
    const { computeColor } = $application


    function preventDefaultTitle(topic) {
      if (!topic) return ''
      return topic?.title ? topic.title : "Topic " + topic.id
    }

    const cleanedColors = computed(() => { // delete the first element
      const cleanedSort = {}

      topics.forEach((topic: number, index: number) => {
        // Add to cleanedSort object each topic in the order
        // they appear in the transcription
        if (!_.findKey(cleanedSort, (el,index) => el === topic) && topic) {
          cleanedSort[" " + topic.toString()] = computeColor(topic).hex
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
