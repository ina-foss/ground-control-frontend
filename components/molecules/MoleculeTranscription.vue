<template>
  <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-auto" >
      <ol class=" overflow-y-auto h-full ">
        <ScrollTop
          :pt="{ root: { style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
          :threshold="100"
          :unstyled="true"
          class="absolute"
          target="parent"
        />
        <div  class=" rounded flex flex-col gap-2 p-3 " >
          <div :ref="el => transcriptionsRef.push(el)" v-for="(transcription, index) in transcriptions" >
            <AtomTrancription   @confirm="handleConfirm($event, index)" :userAnnotation="userAnnotations[index]"  :algos="algos" :transcriptions="transcription"/>
          </div>
      </div>
    </ol>
  </div>
</template>


<script setup>
import AtomTrancription from '../atoms/AtomTrancription.vue';

let transcriptionsRef = $ref([])
const { transcriptions,algos, userAnnotations } = defineProps({
  transcriptions:{ // all transcriptions by all algorithm group by sentence
    type: Array,
    required: true
  },
  algos:{
    type: Array,
    required: true
  },
  userAnnotations:{
    type: Array
  }
})

const localChanges = ref([]) // store all the annotations confirmed by user before submitting

watchEffect(()=>{
    userAnnotations.forEach( (change,index)  => { // load annotation from DB into localChanges for them to be display
      if (change == null) localChanges.value[index] = null
      else{
        localChanges.value[index] = {}
        localChanges.value[index].index = change.data.algoIndex
        localChanges.value[index].algo = change.data.algo
        localChanges.value[index].edited = change.data.edited
        localChanges.value[index].phrase = change
      }
    })
})
const handleConfirm = (event,index) => {
  window.onbeforeunload = function () {
    return confirm("You didn't saved your progression")
  }
  event.algo = algos[event.index]
  localChanges.value[index] = event
}

defineExpose({locals: localChanges, transcriptionsRef:$$(transcriptionsRef) })

</script>
