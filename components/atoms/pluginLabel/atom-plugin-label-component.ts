import { defineComponent } from 'vue'
import { useTopicList } from '../../../composables/useTopicList'


export default defineComponent({
  name:"AtomPluginLabel",
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean}
  },
  setup(props){
    const showInput = ref(false)
    const editedTitle = ref(null)
    const { topicList } = useTopicList()
    const {topicIndex,isTopicFirstSegment} = toRefs(props)
    const titleLabel = computed<string|undefined>(()=> topicList.value[topicIndex.value].labels.filter((label)=>typeof label === "string")[0] )

    function editTitle(newTitle: string){
      let arrayLabel: Array<any> = topicList.value[topicIndex.value].labels
      let index = arrayLabel.findIndex((label)=> typeof label === "string")
      arrayLabel[index] = newTitle
    }

    const title = computed(() => {
      if (isTopicFirstSegment.value) {
        return editedTitle.value ? editedTitle.value : 'Topic ' + topicIndex.value
      }
      else return null
    })

    onMounted(() => {

      if(isTopicFirstSegment.value == true){
          editedTitle.value = titleLabel.value
      }
      watch(() => showInput.value, (newValue, oldValue) => {
        if (isTopicFirstSegment.value && newValue == false && topicList.value[topicIndex.value]) {
          if(titleLabel.value != undefined){
            editTitle(editedTitle.value)
          }
          else topicList.value[topicIndex.value].labels.push(editedTitle.value)
        }
      })
      watch(() => isTopicFirstSegment.value, (newValue) => {
        if (newValue == true) {
          editedTitle.value = topicList.value[topicIndex.value]?.label
        }
      })
      // watch(() => topicList.value[topicIndex.value]?.title, (newTitle) => {
      //   if (isTopicFirstSegment.value) {
      //     editedTitle.value = newTitle
      //   }
      // }, { immediate: true })

    })

    return{
      title,
      showInput,
      editedTitle,
    }

  }
})
