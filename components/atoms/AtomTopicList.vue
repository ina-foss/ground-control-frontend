<template>
  <div class=" rounded-lg w-[250px] gap-3">
    <Accordion  class="w-full !bg-white rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Topics</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title">
            <div class="flex ">
              <div v-if="cleanedColors?.length != 0" :items="cleanedColors" :itemSize="50" class="w-full ml-[-5px] " style="height:130px; overflow-x: auto">
                <div v-for="(color, index) in cleanedColors" :key="index" >
                  <div class="flex pb-2 items-start gap-2 w-full">
                    <div v-if="index != 0" class="flex h-8 items-center " >
                      <div :style="`background-color: ${color}`" class="w-4 h-4 rounded-full flex justify-center z-10 items-center text-white text-[10px] ">{{index}}</div>
                      <h2 class="px-2 font-semibold" >{{preventDefaultTitle(topicList[index])}}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
<script setup lang="js">

  import _ from 'lodash';
  import { useTopicList } from '~/composables/useTopicList';

  const props = defineProps({
    colors: {
      type: Array,
      default: () => []
    },
    topics: {
      type: Array,
      default: ()=>[]
    },

  });

  const { colors, topics } = props;
  const { topicList} = useTopicList()

function preventDefaultTitle(topic){
    if( !topic.title ) return "Topic "+ topic.id
    return topic.title
  }




  const cleanedColors = computed(()=>{ // delete the first element
    const cleaned = {}
    colors.forEach((color,index)=>{
      if (index != 0 && _.findIndex(topics,(el)=> el == index) != -1 ) {
        cleaned[index]= color
      }
    })
    return cleaned
  })


</script>
