<template>
  <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-auto" >
    <!-- <AtomProgressBar :colors="colors" :topics="topics" :total_length="locals.length" @progress-bar-jump="jumpToTopic($event)" /> -->
      <ol class=" overflow-y-auto h-full ">
        <ScrollTop
          :pt="{ root: { style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
          :threshold="100"
          :unstyled="true"
          class="absolute"
          target="parent"
        />
        <div  class=" rounded flex flex-col gap-2 p-3 " >
          <AtomTrancription v-for="(transcription, index) in transcriptions" :algos="algos" :transcriptions="transcription"/>
        </div>
      </ol>
  </div>
</template>


<script setup>
import AtomTrancription from '../atoms/AtomTrancription.vue';
const { transcriptions,algos } = defineProps({
  transcriptions:{
    type: Array,
    required: true
  },
  algos:{
    type: Array,
    required: true
  }
})

console.log(algos)
</script>
