<template>
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
  <div v-else class="h-full " >
    <div v-if="data.annotations[0]?.annotation_status !== annotationStatus" class="fixed bottom-10 z-10 right-20  mb-8">
      <Button style="font-family: Lato,sans-serif;font-weight: bold;border-radius: 4px;color: black;background-color: #0B7698;
border-color: #0B7698"
              label="Soumettre" size="large" @click="handleSubmit()" />
      <Button style="font-family: Lato,sans-serif;font-weight: bold;border-radius: 4px;color: black;background-color: #9ADC82;
border-color: #9ADC82"
              class="ml-3" severity="success" label="Terminer" size="large" @click="handleFinish()"/>

    </div>
    <Toast />
    <div class="grid grid-cols-9 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :video-src="videoSrc" :data="data" :colors="colors" :locals="locals" @scroll-to-segment="scrollToSegment" />
      <MoleculeSegmentation ref="moleculeSegmentationRef" :colors="colors" :topics="topics" :locals="locals" @on-segment-click="updateVideoTimecode" />
    </div>
  </div>
</template>

<script setup >
  import { useAuth } from "../../stores/auth"
  import MoleculeAnnotationLeftPanel from "../molecules/MoleculeAnnotationLeftPanel.vue";
  import MoleculeSegmentation from '../molecules/MoleculeSegmentation.vue'
  import _ from 'lodash'
  import {AnnotationStatus} from '../../api/generate';

  const authStore = useAuth()


  const { data, annotations_in, annotations_out, allFetched } = defineProps(['data','annotations_in','annotations_out','allFetched'])



  const emits = defineEmits([ 'submit-annotation', 'refresh-data' ]);

  let colors = $ref(['#BEBEBE'])
  const topics = $ref([])
  let videoSrc = $ref(annotations_in[0]?.result.asset.url)
  const moleculeSegmentationRef = $ref()
  const moleculeAnnotationLeftPanelRef= $ref()
  const { userEmail } = storeToRefs(authStore)
  const annotationStatus = AnnotationStatus.ENDED

  const annotationInfo = $computed(() => {
    let info = null
    if (allFetched ) {
      annotations_out.forEach((annotation, index) => {
        if (annotation.user_email == userEmail.value) {
          info = { index: index, id: annotation.id }
        }
      })
      return info
    }
  });

  const locals = $computed(() => {
    if(allFetched){
    return (annotationInfo == null)
      ? annotations_in[0]?.result.data.localisation[0].sublocalisations.localisation
      : annotations_out[annotationInfo.index]?.result.data.localisation[0].sublocalisations.localisation
    }
    return []
  })


  const updateVideoTimecode = (event) => {
    moleculeAnnotationLeftPanelRef.updateVideoTimecode(event)
  }

  const scrollToSegment = (event) => {
    moleculeSegmentationRef.segmentationRefs[event.lastIndex].classList.remove('selected-segment')
    moleculeSegmentationRef.segmentationRefs[event.bestIndex].classList.add('selected-segment')
    moleculeSegmentationRef.segmentationRefs[event.bestIndex].scrollIntoView({ behavior: "smooth" });
  }


  const handleSubmit = () => {
    locals.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    emits('submit-annotation',{ locals: locals })
  }
  const handleFinish = () => {
    locals.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    emits('finish-annotation', {locals: locals})
  }

  function generatePastelColor(tagNumber) {
    // Use tag number to create a seed (this is a basic example, there are better ways to do this)
    const seed = tagNumber * 123456789;
    const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

    const r = random(3);
    const g = random(5);
    const b = random(7);

    return `rgb(${r}, ${g}, ${b}, 1)`;

  }

  const loadTopics = () => {
    colors = ['#BEBEBE'] // reset colors before loading
    const max = _.maxBy(locals, (local)=> local.data.topic) // Search for maximum topic number
    while (colors.length <= max?.data.topic){ // Create all colors below this max
     const randomcolor = generatePastelColor(colors.length)
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
        videoSrc = annotations_in[0]?.result.asset.url

          loadTopics()
      }
  })
  })


</script>

<style scoped lang="postcss">
.selected-segment{
  @apply border-black border-2;
}

</style>
