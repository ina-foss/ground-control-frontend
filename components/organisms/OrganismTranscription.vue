<template>
  <div v-if=" allFetched " class="h-full">
    <div v-if="data.annotations[0]?.annotation_status !== annotationStatus" class="fixed z-10 bottom-10 right-4 ">
      <Button label="Soumettre" size="large" @click="handleSubmit()"/>
      <Button class="ml-3" severity="success" label="Terminer" size="large" @click="handleFinish()"/>
    </div>

    <Toast/>
    <div class="grid grid-cols-9 xs:block h-full">
      <MoleculeAnnotationLeftPanel class="xs:sticky" ref="moleculeAnnotationLeftPanelRef" :videoSrc="videoSrc"
                                   :data="data"
                                   :locals="annotations_in[0].result.data.localisation[0].sublocalisations.localisation"
                                   @scroll-to-segment="scrollToSegment"/>
      <MoleculeTranscription ref="MoleculeTranscriptionRef" class="overflow-y-auto" :transcriptions="transcriptions"
                             @on-segment-click="updateVideoTimecode" :userAnnotations="userAnnotations" :algos="algos"
                             :status="data.annotations[0]?.annotation_status"/>
    </div>
  </div>
  <div v-else class="h-full">
    <div class="grid grid-cols-9 xs:block h-full overflow-y-auto">
      <div class="col-span-3 bg-surface-700 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">
        <div class=" xs:h-full w-full h-auto xs:flex xs:justify-center ">
          <Skeleton :pt="{
            root: {
              style: 'height: 100%; width:auto'
            }
          }" class="aspect-video"/>
        </div>
        <div class="xs:hidden ">
          <Skeleton class="m-3" height="3rem" width="70%"/>
          <Skeleton height="500px"/>
        </div>
      </div>
      <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-auto">
        <div class=" rounded flex flex-col w-full gap-2 p-3 ">
          <Skeleton height="127px"/>
          <Skeleton height="150px"/>
          <Skeleton height="175px"/>
          <Skeleton height="150px"/>
          <Skeleton height="127px"/>
          <Skeleton height="150px"/>
          <Skeleton height="150px"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="js">
import MoleculeAnnotationLeftPanel from '../molecules/MoleculeAnnotationLeftPanel.vue';
import MoleculeTranscription from '../molecules/MoleculeTranscription.vue';

const authStore = useAuth()
const moleculeAnnotationLeftPanelRef = $ref()
import {AnnotationStatus} from '../../api/generate';

const {
  data,
  annotations_in,
  annotations_out,
  allFetched
} = defineProps(['data', 'annotations_in', 'annotations_out', 'allFetched'])
const {userEmail} = storeToRefs(authStore)

const emits = defineEmits(['submitAnnotation', 'finish-annotation']);
let info = null
let videoSrc = $ref(annotations_in[0]?.result.asset.url)
let MoleculeTranscriptionRef = $ref()
const annotationStatus = AnnotationStatus.ENDED
const annotationInfo = $computed(() => { // get user annotation position

  if (allFetched) {
    annotations_out.forEach((annotation, index) => {
      if (annotation.user_email == userEmail.value) {
        info = {index: index, id: annotation.id}
      }
    })
    return info
  }
});

const updateVideoTimecode = (event) => {
  moleculeAnnotationLeftPanelRef.updateVideoTimecode(event)
}

const transcriptions = $computed(() => { // format array to have all transcription version in the same array element
  const res = []
  if (allFetched) {
    annotations_in[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index) => {
      res.push([])
      annotations_in.forEach((transcription) => {
        res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
      })
    })
  }
  return res
})

const userAnnotations = $computed(() => { // return array of users annotations
  let response = []
  if (allFetched && annotationInfo != null) {
    response = [...annotations_out[annotationInfo.index]?.result.data.localisation[0].sublocalisations.localisation]
  }
  return response
})

const scrollToSegment = (event) => {
  MoleculeTranscriptionRef.transcriptionsRef[event.bestIndex].scrollIntoView({behavior: "smooth"});
}

const handleSubmit = () => {

  let locals = []
  MoleculeTranscriptionRef.locals.forEach((el, index) => { // format data sent to DB
    if (el == null) locals[index] = null
    else {
      el.phrase.data.algo = el.algo
      el.phrase.data.edited = el.edited
      el.phrase.data.algoIndex = el.index
      locals[index] = el.phrase
    }
  })
  emits('submitAnnotation', {locals: locals})
}
const handleFinish = () => {

  let locals = []
  MoleculeTranscriptionRef.locals.forEach((el, index) => { // format data sent to DB
    if (el == null) locals[index] = null
    else {
      el.phrase.data.algo = el.algo
      el.phrase.data.edited = el.edited
      el.phrase.data.algoIndex = el.index
      locals[index] = el.phrase
    }
  })
  emits('finish-annotation', {locals: locals})
}

const algos = $computed(() => { // List the name of the algorithm
  const res = []
  if (allFetched) {
    annotations_in.forEach((annotation) => {
      res.push(annotation.result.data.algorithm)
    })
  }
  return res
})


watchEffect(() => {
  if (allFetched)
    videoSrc = annotations_in[0]?.result.asset.url
})

</script>
