<template>
  <div class="h-full" >
    <div class="fixed bottom-10 right-20 ">
      <Button label="Submit" size="large" @click="handleSubmit()" />
    </div>
    <Toast />
    <div class="grid grid-cols-9 h-full">
      <div class="col-span-3 bg-surface-700 px-5 py-5 h-full" >
        <video ref="video" class="w-full" controls @seeked="handleSeeking()" />
        <AtomTopicList :colors="colors" />
        <h2 class="text-white text-3xl p-3 font-semibold">Segmentation</h2>
        <p class="text-white p-3">
          Dans le cadre d'une segmentation par thématique, une transcription est découpée en segment.<br >
          Chaque segment correspond à une thématique différente de la précédente.<br >
          Chaque changement de segment correspond à un changement d'interlocuteur ou de sujet.<br ><span class="underline">Exemple</span> :
          <br >si on souhaite retranscrire le contenu d'une émission qui dure 1h, grâce à la segmentation, nous pouvons
          avoir un "résumé" du contenu de l'émission grâce aux différents segments. Ces derniers retracent les divers sujets ayant été traités, différencie les interlocuteurs.
        </p>
      </div>
      <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-hidden" >
        <ProgressBar :colors="colors" :topics="topics" :total_length="locals.length" @progress-bar-jump="jumpToTopic($event)" />
        <ol class="flex flex-col gap-5 overflow-y-auto h-full py-4">
          <ScrollTop
            :pt="{ root: { style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
            :threshold="100"
            :unstyled="true"
            class="absolute"
            target="parent"
          />
          <li
            v-for="(phrase, index) in locals"
            :key="index"
            :ref="el => segmentationRefs.push(el)"
            class="rounded-lg scroll-mt-5"
          >
            <SegmentationMolecules
              :colors="colors"
              :index="index"
              :phrase="phrase"
              :topics="topics"
              @segmentation="handleSegmentation()"
              @on-segment-click="handleSegmentClick($event)"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup >
  import { useAuth } from "../../stores/auth"
  import AtomTopicList from "../atoms/AtomTopicList.vue";
  import { Hls } from 'hls.js'

  const authStore = useAuth()

  const { data } = defineProps(['data'])

  const emits = defineEmits([ 'submit-annotation', 'refresh-data' ]);

  const colors = $ref(['#BEBEBE'])
  const topics = $ref([])
  const segmentationRefs = $ref([])
  const { userEmail } = storeToRefs(authStore)
  const video = $ref(null)
  let lastTimecode = 0
  let lastIndex = 0

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




  const handleSegmentation = () => {

    window.onbeforeunload = function () {
      return confirm("You didn't saved your progression")
    }
  }




  const handleSeeking = () => {


    const currentTime = video.currentTime

    if (Math.abs(video.currentTime - lastTimecode) > 1) {
      let bestIndex = null
      let bestDiff = 100000
      locals.forEach((phrase, index) => {
        if ((Math.abs(video.currentTime - unixToTimestamp(phrase.tcin)) < bestDiff)) {
          bestDiff = video.currentTime - unixToTimestamp(phrase.tcin)
          bestIndex = index

        }
      });
      console.log(segmentationRefs[bestIndex])
      segmentationRefs[lastIndex].classList.remove('selected-segment')
      segmentationRefs[bestIndex].classList.add('selected-segment')
      segmentationRefs[bestIndex].scrollIntoView({ behavior: "smooth" });
      lastIndex = bestIndex
    }
    lastTimecode = currentTime

  }

  async function fetchVideoStream(url) {
    const response = await fetch(url);
    const videoHls = response.text();

    return videoHls;
  }



  function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
    return videoTime
  }

  const handleSegmentClick = (event) => {

    segmentationRefs[event.index].scrollIntoView({ behavior: "smooth" });
    video.currentTime = unixToTimestamp(event.tcin)
  }

  const jumpToTopic= (event) => {
    const firstIndex = topics.findIndex((topic) =>  topic == event.topic )
    segmentationRefs[firstIndex].scrollIntoView({ behavior: "smooth"})

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
    loadTopics()
    hlsPlayer()
  })


</script>

<style scoped lang="postcss">
.selected-segment{
  @apply border-black border-2;
}

</style>
