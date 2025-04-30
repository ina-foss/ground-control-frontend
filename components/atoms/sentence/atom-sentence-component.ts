
export default defineComponent({
  name: "AtomSentence",
  props: {
    transcriptions: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {

    const { $application } = useService()
    const {spanRefArray,onDeleteSpan} = inject('spanService',ref([]))
    const {locals} = inject('span')
    const { computeColor,textColorPicker,computeColorByLabel,timestampToUnix,unixToTimestamp } = $application

    const jumpToTopic = inject('jumpToTopic')
    const { transcriptions } = toRefs(props)
    const { topicList } = useTopicList()

    const borderColor = computed(()=>{
      return `border-extra-${transcriptions[0].data.topic%9+1}`
    })

    function getTopicFromSpan(span){
      if(span){
        return locals.value.reduce((topic,local)=>{
          if(unixToTimestamp(span.tcin) >= unixToTimestamp(local.tcin) && unixToTimestamp(span.tcout) <= unixToTimestamp(local.tcout) ) {
            topic = local.data.topic
          }

          return topic
        },undefined)
      }
      return 'no span'
    }

    const spanArrayByTopic =computed(()=>{
      return  spanRefArray.value.filter(span=>getTopicFromSpan(span)==transcriptions.value[0].data.topic)
    })

    return {
       transcriptions,topicList,computeColor,textColorPicker,computeColorByLabel,timestampToUnix,unixToTimestamp,borderColor,spanArrayByTopic,onDeleteSpan,jumpToTopic
    }
  }
})
