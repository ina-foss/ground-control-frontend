<template>
  <div class="h-full flex justify-center content-center p-4">
    <div
      class="bg-gradient-to-t flex flex-col overflow-hidden from-surface-200 to-surface-200 h-full w-7 rounded-lg">
      <div v-for="(group, index) in groupedTopics" :key="index" class="cursor-pointer w-full h-[--length] bg-[--color] hover:opacity-50"
        v-tooltip="`Jump to topic ${group.topic}`" @click="$emit('progressBarJump',{topic: group.topic})"
        :style="`--color:${colors[group.topic]}; --length:${((100 / total_length) * group.count) + '%'}`">
      </div>

    </div>


  </div>
</template>

<script setup lang="js">
const {topics, colors, total_length} = defineProps(['topics', 'colors', 'total_length'])
const emits = defineEmits(['progressBarJump']);

const groupedTopics = computed(() => {
  const grouped = {};

  topics.forEach(topic => {
    if(topic != 0){
      if (!grouped[topic]) {
        grouped[topic] = 0;
      }
      grouped[topic] += 1;
    }
  });

  return Object.entries(grouped).map(([topic, count]) => ({
    topic,
    count
  }));
});

</script>

<style></style>
