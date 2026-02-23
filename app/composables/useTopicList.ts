import  _  from "lodash"

interface Topic {
  /**
   * Identifier of a topic
  */
  id: number,
  /**
  * Title of the topic, help defining its subject
  */
  title: string,
  /**
   * Text which summarize the original content of all the block of the topic
   */
  summary?: string,
  /**
   * Array containing some of the plugins labels
  */
  labels: Array<Label | string>

}

interface Label {
  /**
   * Identifier
   */
  id: string,
  /**
   * External identifier
   */
  extId: string,
  /**
   * Value of the label
   */
  label: string,
}

  const topicList = ref<Array<Topic | undefined>>([])

  function deleteTopic(topicIndex:number) {
    topicList.value[topicIndex] = undefined
  }

  /**
    * Alow to add a new topic to the `topicList`
    * @param (topic: Topic)
    */
  function createTopic(topic: Topic){
    topicList.value[topic.id]= topic
  }

  function copyTopicData(from: number, to:number){
    if( topicList.value[to] != undefined && topicList.value[from]!=undefined ) {
        topicList.value[to].title = topicList.value[from].title
        topicList.value[to].labels = topicList.value[from].labels.map(label => ({ ...label }))
    }
  }

  function fusionTopicData(from:number, to: number) {
    if( topicList.value[to] != undefined && topicList.value[from]!=undefined ){
      const previousTitle: string | null = topicList.value[to].title
      const currentTitle: string | null = topicList.value[from].title
      const resultStringArray = [currentTitle,previousTitle]
      topicList.value[to].title = resultStringArray.filter(el=>el!=null && el != '').join(' - ')
    }
  }

  function resetTopicList()  {
    topicList.value = []
  }

/**
 * @param reset True to reset the topicList array
  **/
export function useTopicList(reset?: boolean = false) {
  if(reset) {
    resetTopicList()
  }
  return {
    topicList,
    createTopic,
    deleteTopic,
    copyTopicData,
    fusionTopicData
  }
}


