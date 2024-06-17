<template>
  <div v-if="data.data.data == null || locals == undefined">
    <span>data is not in the right format</span>
  </div>
  <div v-else>
    <div class="fixed bottom-10 right-20 ">
      <Button label="Submit" size="large" @click="handleSubmit" />
    </div>
    <div class="fixed right-20 top-40">
      <div v-for="(color, index) in colors" :key="index">
        <div v-if="index != 0" class="flex items-center gap-2">
          <div :style="`background-color: ${color}`" class="w-7 h-7 " />
          <h2>Topic #{{ index }}</h2>
        </div>
      </div>
    </div>
    <Toast />
    <div class="grid grid-cols-9 ">
      <div class="col-span-3  bg-surface-700 px-5 py-5">
        <video ref="video" class="w-full" controls @seeked="handleSeeking()" />

        <h2 class="text-white text-3xl p-3 font-semibold">Segmentation</h2>
        <p class=" text-white p-3 "> Dans le cadre d'une segmentation par thématique, une transcription est découpée en
          segment.<br> Chaque segment correspond à une thématique différente de la précédente.<br> Chaque changement de
          segment correspond à un changement d'interlocuteur ou de sujet. <br><span class="underline">Exemple </span> :
          <br>si on souhaite retranscrire le contenu d'une émission qui dure 1h, grâce à la segmentation, nous pouvons
          avoir un "résumé" du contenu de l'émission grâce aux différents segments. Ces derniers retracent les divers
          sujets ayant été traités, différencie les interlocuteurs.
        </p>

      </div>
      <ol class="flex flex-col gap-5 overflow-y-auto h-[calc(100vh-51px)] col-span-4 pl-4 py-4">
        <ScrollTop :pt="{
          root: {
            style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black'
          }
        }" :threshold=100 :unstyled="true" class="absolute" target="parent" />
        <li v-for="(phrase, index) in data.data.data.localisation[0].sublocalisations.localisation" :key="index"
          :ref="el => segmentationRefs.push(el)" class="rounded-lg ">
          <SegmentationMolecules :colors="colors" :index="index" :phrase="phrase" :topics="topics"
            @segmentation="handleSegmentation()" @on-segment-click="handleSegmentClick($event)" />
        </li>
      </ol>
      <div />

    </div>

  </div>
</template>


<script setup>

import { ref } from 'vue';
import { bcStore } from '~/stores/breadcrumbs';
import { Hls } from 'hls.js'
import { TaskService, AnnotationService } from '../../api/generate';


const store = bcStore()
const route = useRoute()
const toast = useToast()

const segmentationRefs = ref([])


const colors = ref(['#BEBEBE'])
const topics = ref([])

const annotation_id = ref(null)
const video = ref(null)
let lastTimecode = 0
let lastIndex = 0

const topicsLoaded = ref(false)

const data = ref(await TaskService.readTaskTaskTaskIdGet(route.params.id))


const checkAnnotation = () =>  {
  data.value.annotations.forEach(annotation => {
    if (annotation.user_email == "john@example.com") {
      console.log("annotation found")
      annotation.created_at
      annotation_id.value = annotation.id
    }
  })
}


const handleSegmentation = () => {

  window.onbeforeunload = function () {
    return confirm("You didn't saved your progression")
  }
}


// const locals = data.value.data.data.localisation[0].sublocalisations.localisation

// TODO: Changer pour utiliser Annotation plutot
const locals = (annotation_id.value == null)
  ? data.value.data.data.localisation[0].sublocalisations.localisation
  : data.value.annotations.result.localisation[0].sublocalisations.localisation

console.log(locals.value)

const handleSeeking = () => {


  const currentTime = video.value.currentTime

  if (Math.abs(video.value.currentTime - lastTimecode) > 1) {
    let bestIndex = null
    let bestDiff = 100000
    locals.forEach((phrase, index) => {
      if ((Math.abs(video.value.currentTime - unixToTimestamp(phrase.tcin)) < bestDiff)) {
        bestDiff = video.value.currentTime - unixToTimestamp(phrase.tcin)
        bestIndex = index

      }
    });

    segmentationRefs.value[lastIndex].style.border = "none"
    segmentationRefs.value[bestIndex].scrollIntoView({ behavior: "smooth" });
    segmentationRefs.value[bestIndex].style.border = "solid black"
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

  segmentationRefs.value[event.index].scrollIntoView({ behavior: "smooth" });
  video.value.currentTime = unixToTimestamp(event.tcin)
}

const handleSubmit = () => {
  locals.forEach((phrase, index) => {
    if (![0, undefined].includes(topics.value[index])) {
      phrase.data.topic = topics.value[index]
    }
  })
  data.value.data.data.localisation[0].sublocalisations.localisation = locals

  checkAnnotation()
  // TaskService.updateDataTaskTaskTaskIdPatch(data.value.id, { data: data.value.data.data }).then((response) => console.log(response)).then(() => {
  //   window.onbeforeunload = null
  // }).then(() => {
  //   toast.add({ severity: 'info', detail: 'Your progression has been saved', life: 5000 })
  // })

  console.log("annotation Id " + annotation_id.value)

  if (annotation_id.value != null) {

    // L'utilisateur a déjà une annotation associée à cette tâche
    AnnotationService.updateAnnotationResultAnnotationIdPatch(
      annotation_id.value,
      { "data": data.value.data }
    ) .then((response) => console.log(response))
      .then(() => { window.onbeforeunload = null })
      .then((response) =>{
        if (response.status == 200){
          toast.add({
            severity: 'info',
            detail: 'Annotation has been updated',
            life: 4000
          })
        }
      })
    }

  else {
    // L'utilisateur n'a jamais annoté cette tâche
    AnnotationService.createAnnotationAnnotationPost({
      user_email: "john@example.com",
      task_id: data.value.id,
      project_id: data.value.project_id,
      result: data.value.data.data,
      status: "In progress"
    }).then((response) => console.log(response))
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created', life: 5000 })
      })
  }

}


const videoId = data.value.data.data.id
const videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`

const hlsPlayer = () => {
  fetchVideoStream(videoSrc).then((content) => {
    const src = `data:application/vnd.apple.mpegurl;base64,${content}`
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.attachMedia(video.value);
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log("video and hls.js are now bound together !");
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          console.log("manifest loaded, found " + data.levels.length + " quality level");
        });
      });


    } else if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
      video.value.src = videoSrc;
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
      topics.value[index] = phrase.data.topic
      if (index == 0 || topics.value[index] != topics.value[index - 1]) {
        const randomColor = generatePastelColor(index + 1)
        colors.value.push(randomColor)
        console.log(index)
      }
    }
  })

  topicsLoaded.value = true
}


onMounted(() => { // Une fois la page chargee, on stream la video
  loadTopics()
  hlsPlayer()
})

if (store.items.length == 0) {
  store.addCrumb({ label: data.value.project.title, url: `/projects/${data.value.project_id}` })
}
if (store.items[store.items.length - 1].url != `/tasks/${data.value.id}`) {
  store.addCrumb({ label: data.value.name, url: `/tasks/${data.value.id}` })

}
console.log(store.items)
console.log(data.value.data)

</script>
