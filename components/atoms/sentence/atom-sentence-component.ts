
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
    const {spanArray, extractTextFromSpanNodes,onDeleteSpan} = useSpanService()
    const {locals} = inject('span')
    const { computeColor,textColorPicker,computeColorByLabel,timestampToUnix,unixToTimestamp } = $application

    const jumpToTopic = inject('jumpToTopic')
    const { transcriptions } = toRefs(props)
    const { topicList } = useTopicList()

    function getTopicFromSpan(span: Span){
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
      return  spanArray.value.filter(span=>getTopicFromSpan(span)==transcriptions.value[0].data.topic)
    })

    return {
       transcriptions,topicList,computeColor,textColorPicker,computeColorByLabel,timestampToUnix,unixToTimestamp,spanArrayByTopic,onDeleteSpan,jumpToTopic,getTopicFromSpan,extractTextFromSpanNodes
    }
  }
})
