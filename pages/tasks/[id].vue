<template>
  <div v-if="data.data?.data == null || locals == undefined">
    <div class="grid grid-cols-9  ">
      <div class="col-span-3  bg-surface-700 gap-3 px-5 py-5">
        <Skeleton height="220px" />
        <Skeleton class="m-3" height="3rem" width="70%" />
        <Skeleton height="500px" />
      </div>
      <div class=" p-4 flex flex-row w-full gap-5  justify-center col-span-5">
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
  <div v-else class="h-full">
    <OrganismSegmentation :data="data" class="overflow-y-hidden" @refresh-data="refreshTaskData()" @submit-annotation="handleSubmit($event)"   />
  </div>
</template>


<script setup>

import {  ref } from 'vue';
import { bcStore } from '~/stores/breadcrumbs';
import OrganismSegmentation from '~/components/organisms/OrganismSegmentation.vue';
import { TaskService, AnnotationService, AnnotationStatus } from '../../api/generate';
import { useAuth } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import { useRefreshStore } from '#imports';

const refresh = useRefreshStore()
const store = bcStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuth()

const segmentationRefs = ref([])
const { getData } = storeToRefs(refresh)
const { getItems } = storeToRefs(store)
const { userEmail } = storeToRefs(authStore)
const { fetchAnnotations } = refresh
const { addCrumb } = store



const colors = ref(['#BEBEBE'])
const topics = ref([])

const video = ref(null)
let lastTimecode = 0
let lastIndex = 0

const topicsLoaded = ref(false)

const data = ref(getData)

fetchAnnotations(route.params.id).then((res) => {
  if (getItems.value.length == 0){
    addCrumb({label: '...',url: '' })
    addCrumb({label: data.value.name, url: `/tasks/${data.value.id}`})
  }
  loadTopics()
} )

const annotationInfo = $computed(() => {
  let info = null
  if (data.value.annotations) {
    data.value.annotations.forEach((annotation, index) => {
      if (annotation.user_email == userEmail.value) {
        info = { index: index, id: annotation.id }
      }
    })
    return info
  }
});

const locals = $computed(() => {
  return (annotationInfo == null)
    ? data.value.data?.data.localisation[0].sublocalisations.localisation
    : data.value.annotations[annotationInfo.index]?.result.localisation[0].sublocalisations.localisation
})

const refreshTaskData = async () => {
  data.value = await TaskService.readTaskTaskTaskIdGet(route.params.id)
}

const handleSubmit = (event) => {
  const locals = event.locals

  if (annotationInfo != null) {
    // L'utilisateur a déjà une annotation associée à cette tâche
    data.value.annotations[annotationInfo.index].result.localisation[0].sublocalisations.localisation = locals
    AnnotationService.updateAnnotationResultAnnotationIdPatch(
      annotationInfo.id,
      data.value.annotations[annotationInfo.index].result
    ).then((response) => console.log(response))
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add({
          severity: 'info',
          detail: 'Annotation has been updated',
          life: 4000
        })
      })
      .then(() => refreshTaskData())
  }

  else {
    // L'utilisateur n'a jamais annoté cette tâche
    AnnotationService.createAnnotationAnnotationPost({
      user_email: userEmail.value,
      task_id: data.value.id,
      result: data.value.data.data,
      annotation_status: AnnotationStatus.DRAFT,
      version: 1
    }).then(() => refreshTaskData())
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created', life: 5000 })
      })
  }

}


const videoId = data.value.data?.data?.id
const videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`

const hlsPlayer = () => {
  fetchVideoStream(videoSrc).then((content) => {
    const src = `data:application/vnd.apple.mpegurl;base64,${content}`
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.attachMedia(video.value);
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
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
      }
    }
  })
  topicsLoaded.value = true
}


onMounted(async () => { // Une fois la page chargee, on stream la video
  hlsPlayer()
})


// if (store.items.length == 0) {
//   store.addCrumb({ label: data.value.project.title, url: `/projects/${data.value.project_id}` })
// }
// if (store.items[store.items.length - 1].url != `/tasks/${data.value.id}`) {
//   store.addCrumb({ label: data.value.name, url: `/tasks/${data.value.id}` })
//
// }
//
</script>
