<template>
  <div class="h-full flex justify-center content-center p-4">
    <div
      class="cursor-pointer bg-gradient-to-t flex flex-col overflow-hidden from-surface-200 to-surface-200 h-full w-7 rounded-lg">
      <div v-for="(topic, index) in topics" class="  w-full h-[--length]  bg-[--color] "
        :style="`--color:${colors[topic]}; --length:${((100 / (props.total_length)) * 1) + '%'}`">

      </div>

    </div>


  </div>
</template>


<script setup lang="js">
// test
const props = defineProps(['topics', 'colors', 'total_length', 'topicOccurence'])
</script>

<style></style>
