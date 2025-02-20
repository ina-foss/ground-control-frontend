<template>
  <div class=" rounded-b-md  w-full gap-3 bg-white h-full ">
          <div class="flex flex-col gap-[10px] text-title p-lg  !h-full">
              <div v-if="cleanedColors?.length != 0" :items="cleanedColors" :itemSize="50" class="w-full h-full  " >
                <ScrollPanel class="h-full" :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'3px'
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
                <div v-for="(color, index) in cleanedColors" :key="index"   >
                  <div class="flex pb-2 items-start gap-2 w-full overflow-visible">
                      <div v-if="index != 0" class="flex h-8 items-center hover:bg-neutral   hover:cursor-pointer overflow-visible w-full " @click="emits('topicClick',{topic: index})" >
                        <div :style="`background-color: ${color}40; border: solid 3px ${color}80; line-height: 10px `" class="min-w-4 h-4 place-content-center relative rounded-full flex  font-bold overflow-visible justify-center z-10 items-center text-white text-[10px] ">
                        </div>
                        <h2 class="px-2 shrink  font-semibold h-fit overflow-hidden text-ellipsis line-clamp-2 " style="line-height: 16px;" >{{preventDefaultTitle(topicList[index])}}</h2>
                    </div>
                  </div>
                </div>
                </ScrollPanel>
            </div>
          </div>
  </div>
</template>
<script setup lang="js">

  import _ from 'lodash';
  import { useTopicList } from '~/composables/useTopicList';

  const emits = defineEmits(['topicClick'])

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
