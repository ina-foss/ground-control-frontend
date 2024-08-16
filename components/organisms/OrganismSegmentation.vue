<template>
  <div v-if=" !allFetched ">
    <div class="grid grid-cols-9  ">
      <div class="col-span-3 h-screen  bg-surface-700 gap-3 px-5 py-5">
        <Skeleton :pt="{
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
    <div class="fixed bottom-10 right-20 ">
      <Button label="Submit" size="large" @click="handleSubmit()" />
    </div>
    <Toast />
    <div class="grid grid-cols-9 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :videoSrc="videoSrc" :data="data" :colors="colors" :locals="locals" @scroll-to-segment="scrollToSegment" />
      <MoleculeSegmentation ref="moleculeSegmentationRef" :colors="colors" :topics="topics" :locals="locals" @on-segment-click="updateVideoTimecode" />
    </div>
  </div>
</template>

<script setup >
  import { useAuth } from "../../stores/auth"
  import MoleculeAnnotationLeftPanel from "../molecules/MoleculeAnnotationLeftPanel.vue";
  import MoleculeSegmentation from '../molecules/MoleculeSegmentation.vue'
  import { TaskService, AnnotationService, AnnotationStatus } from '../../api/generate';
  import { Hls } from 'hls.js'

  const authStore = useAuth()


  const { data, annotations_in, annotations_out, allFetched } = defineProps(['data','annotations_in','annotations_out','allFetched'])



  const emits = defineEmits([ 'submit-annotation', 'refresh-data' ]);

  let colors = $ref(['#BEBEBE'])
  const topics = $ref([])
  let videoSrc = $ref(annotations_in[0]?.result.asset.url)
  const moleculeSegmentationRef = $ref()
  const moleculeAnnotationLeftPanelRef= $ref()
  const { userEmail } = storeToRefs(authStore)
  const video = $ref(null)

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
    emits('submitAnnotation',{ locals: locals })
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
    locals.forEach((phrase, index) => {
      if (![0, undefined].includes(phrase.data.topic)) {
        topics[index] = phrase.data.topic
        if (index == 0 || topics[index] != topics[index - 1]) {
          const randomColor = generatePastelColor(index + 1)
          colors.push(randomColor)
        }
      }
    })
  }

  onMounted(()=>
    loadTopics())

  watch(()=> allFetched,() => {
    if(allFetched)
    videoSrc = annotations_in[0]?.result.asset.url

    loadTopics()
  })



</script>

<style scoped lang="postcss">
.selected-segment{
  @apply border-black border-2;
}

</style>
