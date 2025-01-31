<template>
  <div class="col-span-4 flex relative flex-row w-full max-h-full justify-center overflow-y-auto">
    <ol class=" overflow-y-auto  h-full ">
      <ScrollTop
        :pt="{ root: { style: 'position: fixed !important; right: 42%; top: 88.5%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
        :threshold="100"
        target="parent"
      />
      <div class=" rounded flex flex-col gap-2 p-3 ">
        <div v-for="(transcription, index) in transcriptions" :key="index" :ref="el => transcriptionsRef.push(el)">
          <AtomTrancription
:user-annotation="userAnnotations[index]" :algos="algos"
            :transcriptions="transcription" :status="status" @on-segment-click="handleSegmentClick({...$event, index: index})"
                            @confirm="handleConfirm($event, index)" :tcOffset="tcOffset"/>
        </div>
      </div>
    </ol>
  </div>
  <div class=" col-span-2 overflow-y-auto flex flex-col items-center gap-3  ">
      <atom-video-option />
    </div>
</template>


<script setup>
import AtomTrancription from '../atoms/AtomTrancription.vue';
import AtomVideoOption from '../atoms/atom-video-option.vue'
import {AnnotationStatus} from '../../api/generate';
const emits = defineEmits(['on-segment-click'])
let isChanged = false
const transcriptionsRef = ref([])
const {transcriptions, algos, userAnnotations, status,tcOffset} = defineProps({
  transcriptions: { // all transcriptions by all algorithm group by sentence
    type: Array,
    required: true
  },
  algos: {
    type: Array,
    required: true
  },
  userAnnotations: {
    type: Array,
    default: null
  },
  status: {
    type: String,
    default: AnnotationStatus.DRAFT
  },
  tcOffset: {
    type: Object,
    default:  0
  }

})
const localChanges = ref([]) // store all the annotations confirmed by user before submitting

watchEffect(() => {
  userAnnotations.forEach((change, index) => { // load annotation from DB into localChanges for them to be display
    if (change == null) localChanges.value[index] = null
    else {
      if (isChanged === false) {
        localChanges.value[index] = {}
        localChanges.value[index].index = change.data.algoIndex
        localChanges.value[index].algo = change.data.algo
        localChanges.value[index].edited = change.data.edited
        localChanges.value[index].phrase = change
      }
    }
  })
})

const handleSegmentClick = (event) => {
   emits('on-segment-click', { tcin: event.tcin, tcout: event.tcout, index:event.index })
}

const handleConfirm = (event, index) => {
  window.onbeforeunload = function () {
    return confirm("You didn't saved your progression")
  }
  event.algo = algos[event.index]
  localChanges.value[index] = event
  isChanged = true
}

const transcriptionFunction = (localSubmit) => {
  const locals = []
  localChanges.value?.forEach((el, index) => {
    if (el == null) locals[index] = null
    else {
      el.phrase.data.algo = el.algo
      el.phrase.data.edited = el.edited
      el.phrase.data.algoIndex = el.index
      locals[index] = el.phrase
    }
  })
  return locals
}

defineExpose({locals: localChanges, listRefs: transcriptionsRef, annotationFunction: transcriptionFunction })

</script>
<style scoped lang="postcss">
.selected-segment {
@apply border-surface-500 border-2
}
</style>
