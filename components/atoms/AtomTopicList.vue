<template>
    <div class="flex flex-wrap justify-center gap-3 p-3 ">
        <div v-for="(color, index) in cleanedColors" :key="index">
          <div v-if="index != 0" class="flex h-8 items-center bg-white overflow-visible rounded border-surface-400 border-[1px]" >
            <div :style="`background-color: ${color}`" class="w-8 h-8 ml-[-1px]  rounded-sm flex justify-center z-10 items-center text-white font-bold text-sm ">#{{index}}</div>
        <h2 class="px-2 font-semibold" >{{preventDefaultTitle(topicList[index])}}</h2>
          </div>
        </div>
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

  function preventDefaultTitle(topic){
    if( !topic.title ) return "Topic "+ topic.id
    return topic.title
  }

  const { colors, topics } = props;
  const { topicList } = useTopicList()


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
