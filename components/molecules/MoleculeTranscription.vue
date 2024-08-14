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
          <AtomTrancription  @confirm="handleConfirm($event, index)" :userAnnotation="userAnnotation[index]" v-for="(transcription, index) in transcriptions" :algos="algos" :transcriptions="transcription"/>
        </div>
      </ol>
  </div>
</template>


<script setup>
import AtomTrancription from '../atoms/AtomTrancription.vue';
const { transcriptions,algos,userAnnotation } = defineProps({
  transcriptions:{
    type: Array,
    required: true
  },
  algos:{
    type: Array,
    required: true
  },
  userAnnotation:{
    type: Array
  }
})

console.log(userAnnotation)

const localChanges = ref([])

if(userAnnotation =! null){
  userAnnotation.forEach( (change,index)  => {
    if (change == null) localChanges.value[index] = null
    else{
      localChanges.value[index] = {}
      localChanges.value[index].index = change.data.algoIndex
      localChanges.value[index].algo = change.data.algo
      localChanges.value[index].edited = change.data.edited
      localChanges.value[index].phrase = change
    }
  })
}

const handleConfirm = (event,index) => {
  event.algo = algos[event.index]
  localChanges.value[index] = event
}

defineExpose({locals: localChanges })

</script>
