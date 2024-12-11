import  _  from "lodash"

interface Topic {
  /**
   * Identifier of a topic
  */
  id: number,
  /**
   * Title of the Topic
   */
  title: string | null,
  /**
   * Array of `Category`
  */
  labels: Array<string>
}

  const topicList = ref<Array<Topic | undefined>>([])

export function useTopicList() {


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
    }
  }

  function fusionTopicData(from:number, to: number) {
    if( topicList.value[to] != undefined && topicList.value[from]!=undefined ){
      const previousTitle: string | null = topicList.value[to].title
      topicList.value[to].title =  topicList.value[from].title + previousTitle
    }
  }





  return {
    topicList,
    createTopic,
    deleteTopic,
    copyTopicData,
    fusionTopicData
  }



}
