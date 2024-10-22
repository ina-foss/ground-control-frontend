<template>
  <div v-if="data.annotations[0]?.annotation_status !== annotationStatus" class="fixed z-30 right-12 mr-4" style="top: 18px;" >
    <Button class="button button-prev mr-4" label="Soumettre" size="small" @click="handleSubmit()"/>
    <Button
      class="button"
      label="Terminer"
      size="small"
      @click="handleFinish()"
    />
  </div>
  <div v-if=" allFetched " class="h-full">

    <Toast/>
    <div class="grid grid-cols-9 xs:block h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" class="xs:sticky"
                                   :video-src="videoSrc"
                                   :data="data"
                                   :locals="annotationsIn[0].result.data.localisation[0].sublocalisations.localisation"
                                   @scroll-to-segment="scrollToSegment">
        <h2 class="text-white text-3xl md:block xs:hidden p-3 font-semibold">Réconciliation de Transcriptions</h2>
        <p class="text-white p-3 md:block xs:hidden ">
          Dans le cadre d'une réconciliation de transcription, plusieurs versions d'une même transcription peuvent être comparées.<br>
          L'utilisateur peut selectionner, pour chaque segment, la meilleure version de la transcription.<br>
          Il peut egalement manuellement corriger la transcriptions si les deux versions comportent des erreurs par rapport a l'archive.<br>
        </p>

      </MoleculeAnnotationLeftPanel>
      <MoleculeTranscription
ref="MoleculeTranscriptionRef" class="overflow-y-auto" :transcriptions="transcriptions"
                             :user-annotations="userAnnotations" :algos="algos" :status="data.annotations[0]?.annotation_status"
                             @on-segment-click="updateVideoTimecode"/>
    </div>
  </div>
  <div v-else class="h-full">
    <div class="grid grid-cols-9 xs:block h-full overflow-y-auto">
      <div class="col-span-3 bg-surface-700 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">
        <div class=" xs:h-full w-full h-auto xs:flex xs:justify-center ">
          <Skeleton
:pt="{
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
import {AnnotationStatus} from '../../api/generate';

const authStore = useAuth()
const moleculeAnnotationLeftPanelRef = $ref()

  const { data, annotationsIn, annotationsOut, allFetched } = defineProps({
    data: {
      type: Object,
      default: () => {}
    },
    annotationsIn: {
      type: Array,
      default: () => []
    },
    annotationsOut: {
      type: Array,
      default: () => []
    },
    allFetched: {
      type: Boolean,

    },

  })
const {userEmail} = storeToRefs(authStore)

const emits = defineEmits(['submitAnnotation', 'finish-annotation']);
let info = null
let videoSrc = $ref(annotationsIn[0]?.result.asset.url)
const MoleculeTranscriptionRef = $ref()
const annotationStatus = AnnotationStatus.ENDED
const annotationInfo = $computed(() => { // get user annotation position

  if (allFetched) {
    annotationsOut.forEach((annotation, index) => {
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
    annotationsIn[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index) => {
      res.push([])
      annotationsIn.forEach((transcription) => {
        res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
      })
    })
  }
  return res
})

const userAnnotations = $computed(() => { // return array of users annotations
  let response = []
  if (allFetched && annotationInfo != null) {
    const annotation = annotationsOut[annotationInfo.index];

    if (annotation?.result?.data?.localisation?.[0]?.sublocalisations?.localisation) {
      response = [...annotation.result.data.localisation[0].sublocalisations.localisation];
    }  }
  return response
})

const scrollToSegment = (event) => {
  MoleculeTranscriptionRef.transcriptionsRef[event.bestIndex].scrollIntoView({behavior: "smooth"});
}

const handleSubmit = () => {

  const locals = []
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

  const locals = []
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
    annotationsIn.forEach((annotation) => {
      res.push(annotation.result.data.algorithm)
    })
  }
  return res
})


watchEffect(() => {
  if (allFetched)
    videoSrc = annotationsIn[0]?.result.asset.url
})

</script>
<style>
.fixed{
  position: absolute !important;
}
</style>
