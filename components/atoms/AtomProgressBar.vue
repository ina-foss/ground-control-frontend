<template>
  <div class="h-full flex justify-center content-center p-4">
    <div
      class="bg-gradient-to-t flex flex-col overflow-hidden from-surface-200 to-surface-200 h-full w-7 rounded-lg">
      <div
        v-for="(group, index) in groupedTopics" :key="index" v-tooltip="{value:'Aller à '+ topicList[parseInt(group.topic)]?.title} "
        class="cursor-pointer w-full h-[--length] bg-[--color] hover:opacity-50" :style="`--color:${colors[parseInt(group.topic)]}; --length:${((100 / totalLength) * group.count) + '%'}`"
        @click="$emit('progressBarJump',{topic: group.topic})"/>

    </div>


  </div>
</template>

<script setup lang="js">
const {topics, colors, totalLength, topicList} = defineProps({
topics:{
  type: Array,
  default: () => []
},
  colors: {
    type: Array,
    default: () => []
  },
  totalLength:{
    type: Number,
},
  topicList:{
  type : Array,
    default: () => []
  },
})
defineEmits(['progressBarJump']);


const groupedTopics = computed(() => {
  const grouped = {};
  let ignoreCount = 1
  topics.forEach((topic,index) => {
    if(topic != 0){
      if (!grouped[' ' + topic]) {
        grouped[' ' + topic] = 0;
      }
      grouped[' ' + topic] += 1;
    }
    else{
      if(!grouped[' null'+ignoreCount]){
        grouped[' null'+ignoreCount] = 0
      }
        grouped[' null'+ignoreCount] ++
      if(topics[index+1] != 0){
        ignoreCount += 1
      }
    }
  });

  return Object.entries(grouped).map(([topic, count]) => ({
    topic,
    count
  }));

});

</script>

<style></style>
