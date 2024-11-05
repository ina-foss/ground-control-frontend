<template>
  <div v-if="data.annotations[0]?.annotation_status !== annotationStatus"
       class="fixed right-12 mr-4 absolute top-[-50px] z-[5]" >
    <Button class="button button-prev mr-4" label="Soumettre" size="small" @click="handleSubmit()"/>
    <Button
      class="button"
      label="Terminer"
      size="small"
      @click="handleFinish()"
    />
  </div>
  <div v-if=" !allFetched ">
    <div class="grid grid-cols-9  ">
      <div class="col-span-3 h-screen  bg-surface-700 gap-3 px-5 py-5">
        <Skeleton
:pt="{
          root: {
             style: 'height: auto'
          }
        }"  class="aspect-video"/>
        <Skeleton class="m-3" height="3rem" width="70%" />
        <Skeleton height="500px" />
      </div>
      <div class=" p-4 flex flex-row w-full gap-5 justify-center col-span-5">
        <Skeleton  height="100%" width="28px" />
      <div class="flex flex-col w-full gap-5 col-span-5">
          <Skeleton height="150px" />
          <Skeleton height="100px"/>
          <Skeleton height="70px" />
          <Skeleton height="150px"/>
          <Skeleton height="75px"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-full" >

    <Toast />
    <div class="grid grid-cols-9 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :video-src="videoSrc" :data="data" :colors="colors" :locals="locals" :topics="topics" @scroll-to-segment="scrollToSegment">
        <h2 class="text-white text-3xl md:block xs:hidden p-3 font-semibold">{{data.step?.annotation_type}}</h2>
        <p class="text-white p-3 md:block xs:hidden ">
          Dans le cadre d'une segmentation par thématique, une transcription est découpée en segment.<br>
          Chaque segment correspond à une thématique différente de la précédente.<br>
          Chaque changement de segment correspond à un changement d'interlocuteur ou de sujet.<br><span
            class="underline">Exemple</span> :
          <br>si on souhaite retranscrire le contenu d'une émission qui dure 1h, grâce à la segmentation, nous pouvons
          avoir un "résumé" du contenu de l'émission grâce aux différents segments. Ces derniers retracent les divers
          sujets
          ayant été traités, différencie les interlocuteurs.
        </p>
      </MoleculeAnnotationLeftPanel>
      <component :is="annotationComponent.component" v-bind="annotationComponent.props" ref="moleculeAnnotationRef" v-model:locals="locals"  @on-segment-click="updateVideoTimecode" />
    </div>
  </div>
</template>

<script setup >
  import { useAuth } from "../../stores/auth"
  import MoleculeAnnotationLeftPanel from "../molecules/MoleculeAnnotationLeftPanel.vue";
  import MoleculeSpan from "../molecules/MoleculeSpan.vue";
  import MoleculeSegmentation from "../molecules/MoleculeSegmentation.vue";
  import MoleculeTranscription from "../molecules/MoleculeTranscription.vue";
  import _ from 'lodash'
  import {AnnotationStatus} from '../../api/generate';
  import { useService } from "#imports";

  const authStore = useAuth()
  const { $application } = useService()


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


  const emits = defineEmits([ 'submit-annotation', 'finish-annotation' ]);

  let colors = $ref(['#BEBEBE'])
  let topics = $ref([])
  let videoSrc = $ref(annotationsIn[0]?.result.asset.url)
  const moleculeAnnotationRef = $ref()
  const moleculeAnnotationLeftPanelRef= $ref()
  const { userEmail } = storeToRefs(authStore)
  const annotationStatus = AnnotationStatus.ENDED
  const { computeColor } = $application

  const annotationInfo = $computed(() => {
    let info = null
    if (allFetched ) {
      annotationsOut.forEach((annotation, index) => {
        if (annotation.user_email == userEmail.value) {
          info = { index: index, id: annotation.id }
        }
      })
      return info
    }
  });

  const userAnnotations = $computed(() => { // return array of users annotations
    let response = []
    if (allFetched && annotationInfo != null) {
      const annotation = annotationsOut[annotationInfo.index];

      if (annotation?.result?.data?.localisation?.[0]?.sublocalisations?.localisation) {
        response = [...annotation.result.data.localisation[0].sublocalisations.localisation];
      }  }
    return response
  })

  const locals = $computed(() => {
    if(allFetched){
    return (annotationInfo == null)
      ? annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation
      : annotationsOut[annotationInfo.index]?.result.data.localisation[0].sublocalisations.localisation
    }
    return []
  })

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

const algos = $computed(() => { // List the name of the algorithm
  const res = []
  if (allFetched) {
    annotationsIn.forEach((annotation) => {
      res.push(annotation.result.data.algorithm)
    })
  }
  return res
})

  const updateVideoTimecode = (event) => {
    moleculeAnnotationLeftPanelRef.updateVideoTimecode(event)
  }

  const scrollToSegment = (event) => {
    moleculeAnnotationRef.listRefs[event.lastIndex].classList.remove('selected-segment')
    moleculeAnnotationRef.listRefs[event.bestIndex].scrollIntoView({ behavior: "smooth" });
    moleculeAnnotationRef.listRefs[event.bestIndex].classList.add('selected-segment')
  }

const annotationComponent = $computed(() => {
  switch (data.step?.annotation_type) {
    case 'segmentation':
        return {component: MoleculeSegmentation, props: {
          locals: locals,
          colors: colors,
          topics: topics
        }}
    case 'transcription':
      return {component: MoleculeTranscription, props: {
        transcriptions: transcriptions,
        userAnnotations: userAnnotations,
        algos: algos,
        status: data.annotations[0]?.annotation_status
        }}

    case 'span':
        return { component :MoleculeSpan, props: {}}
  }

})

  const handleSubmit = () => {
    let localSubmit = locals
    if(moleculeAnnotationRef.locals) localSubmit = moleculeAnnotationRef.locals
    emits('submit-annotation',{ locals: moleculeAnnotationRef.annotationFunction(localSubmit) })
  }
  const handleFinish = () => {
    let localSubmit = locals
    if(moleculeAnnotationRef.locals) localSubmit = moleculeAnnotationRef.locals
    emits('finish-annotation', {locals: moleculeAnnotationRef.annotationFunction(localSubmit) })
  }


  const loadTopics = () => {
    const max = _.maxBy(locals, (local)=> local.data.topic) // Search for maximum topic number
    while (colors.length <= max?.data.topic){ // Create all colors below this max
     const randomcolor = computeColor(colors.length-1).hex
      colors.push(randomcolor)
    }
    locals.forEach((phrase, index) => { // apppend topic number to each segments
      if (![0, undefined].includes(phrase.data.topic)) {
        topics[index] = phrase.data.topic
      }
    })
  }
  onMounted(()=>{

  watch(()=> allFetched,() => {
      if(allFetched == true){
        videoSrc = annotationsIn[0]?.result.asset.url

          loadTopics()
      }
  })
  })


</script>


