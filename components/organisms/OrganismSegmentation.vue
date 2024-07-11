<template>
  <div class="h-full" >
    <div class="fixed bottom-10 right-20 ">
      <Button label="Submit" size="large" @click="handleSubmit()" />
    </div>
    <Toast />
    <div class="grid grid-cols-9 h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :data="data" :colors="colors" :locals="locals" @scroll-to-segment="scrollToSegment" />
      <MoleculeSegmentation ref="moleculeSegmentationRef" :colors="colors" :topics="topics" :locals="locals" @on-segment-click="updateVideoTimecode" />
    </div>
  </div>
</template>

<script setup >
  import { useAuth } from "../../stores/auth"
  import MoleculeAnnotationLeftPanel from "../molecules/MoleculeAnnotationLeftPanel.vue";
  import MoleculeSegmentation from '../molecules/MoleculeSegmentation.vue'
  import { Hls } from 'hls.js'

  const authStore = useAuth()

  const { data } = defineProps(['data'])

  const emits = defineEmits([ 'submit-annotation', 'refresh-data' ]);

  const colors = $ref(['#BEBEBE'])
  const topics = $ref([])
  const moleculeSegmentationRef = $ref()
  const moleculeAnnotationLeftPanelRef= $ref()
  const { userEmail } = storeToRefs(authStore)
  const video = $ref(null)

  const annotationInfo = $computed(() => {
    let info = null
    if (data.annotations) {
      data.annotations.forEach((annotation, index) => {
        if (annotation.user_email == userEmail.value) {
          info = { index: index, id: annotation.id }
        }
      })
      return info
      }
  });

  const locals = $computed(() => {
    return (annotationInfo == null)
      ? data.data.data.localisation[0].sublocalisations.localisation
      : data.annotations[annotationInfo.index].result.localisation[0].sublocalisations.localisation
  })


  const updateVideoTimecode = (event) => {
    moleculeAnnotationLeftPanelRef.updateVideoTimecode(event)
  }

  const scrollToSegment = (event) => {
    moleculeSegmentationRef.segmentationRefs[event.lastIndex].classList.remove('selected-segment')
    moleculeSegmentationRef.segmentationRefs[event.bestIndex].classList.add('selected-segment')
    moleculeSegmentationRef.segmentationRefs[event.bestIndex].scrollIntoView({ behavior: "smooth" });
  }

  async function fetchVideoStream(url) {
    const response = await fetch(url);
    const videoHls = response.text();

    return videoHls;
  }

  const handleSubmit = () => {
    locals.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    emits('submitAnnotation',{ locals: locals })
  }


  const videoId = data.data.data.id
  const videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`

  const hlsPlayer = () => {
    fetchVideoStream(videoSrc).then((content) => {
      const src = `data:application/vnd.apple.mpegurl;base64,${content}`
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(src);
          hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          });
        });


      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
      }
    })
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


  onMounted(async () => { // Une fois la page chargee, on stream la video
    hlsPlayer()
    loadTopics()
  })


</script>

<style scoped lang="postcss">
.selected-segment{
  @apply border-black border-2;
}

</style>
