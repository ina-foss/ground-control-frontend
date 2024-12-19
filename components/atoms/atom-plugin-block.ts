import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'

export default defineComponent({
  name: 'AtomPluginBlock',
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean}
  },
  emits:['deactivateTopic'],
  setup(props, {emit}){

    const { topicList } = useTopicList()
    const editedTitle = ref(null)
    const editTitle = ref(false)
    const {topicIndex,isTopicFirstSegment} = toRefs(props)
    const localTitle = ref(editedTitle)
    const value = ref("");
    const items = ref([]);
    const search = (event) => {
        items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }

    const title = computed(() => {
      if (isTopicFirstSegment.value) {
        return editedTitle.value ? editedTitle.value : 'Topic ' + topicIndex.value
      }
      else return null
    })

    onMounted(() => {
      if(isTopicFirstSegment.value == true){
          editedTitle.value = topicList.value[topicIndex.value]?.title
      }
      watch(() => editTitle.value, (newValue, oldValue) => {
        if (isTopicFirstSegment.value && newValue == false && topicList.value[topicIndex.value]) {
          topicList.value[topicIndex.value].title = editedTitle.value
        }
      })
      watch(() => isTopicFirstSegment.value, (newValue) => {
        if (newValue == true) {
          editedTitle.value = topicList.value[topicIndex.value]?.title
        }
      })
      watch(() => topicList.value[topicIndex.value]?.title, (newTitle) => {
        if (isTopicFirstSegment.value) {
          editedTitle.value = newTitle
        }
      }, { immediate: true })

    })
    return {
      title,
      localTitle,
      editTitle,
      editedTitle,
      value,
      items,
      topicIndex,
      isTopicFirstSegment,
      search,
      emit
    }
  }
})
