<template>
  <div v-if="data.data.data == null || locals == undefined">
    <span>data is not in the right format</span>
  </div>
  <!-- TODO: Refactor into a Segmentation Component -->
  <div v-else class="h-full">
    <OrganismSegmentation :data="data" class="overflow-y-hidden" @refresh-data="refreshTaskData()" />
  </div>
</template>


<script setup>

import {  ref } from 'vue';
import { bcStore } from '~/stores/breadcrumbs';
import { Hls } from 'hls.js'
import { TaskService, AnnotationService } from '../../api/generate';
import { useAuth } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import AtomTopicList from '~/components/atoms/AtomTopicList.vue';
import OrganismSegmentation from '~/components/organisms/OrganismSegmentation.vue';


const store = bcStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuth()

const segmentationRefs = ref([])


const colors = $ref(['#BEBEBE'])
const topics = ref([])

const video = ref(null)
let lastTimecode = 0
let lastIndex = 0

const topicsLoaded = ref(false)

const data = ref(await TaskService.readTaskTaskTaskIdGet(route.params.id))

const { userEmail } = storeToRefs(authStore)
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
    ? data.value.data.data.localisation[0].sublocalisations.localisation
    : data.value.annotations[annotationInfo.index].result.localisation[0].sublocalisations.localisation
})

const refreshTaskData = async () => {
  data.value = await TaskService.readTaskTaskTaskIdGet(route.params.id)
}











function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
  const millisecond = tc.split('.')[1]
  const timeArray = tc.split('.')[0].split(':')
  const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
  return videoTime
}



const handleSubmit = () => {
  locals.forEach((phrase, index) => {
    if (![undefined].includes(topics[index])) {
      phrase.data.topic = topics[index]
    }
  })

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
      project_id: data.value.project_id,
      result: data.value.data.data,
      status: "In progress"
    }).then(() => refreshTaskData())
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created', life: 5000 })
      })
  }

}


const videoId = data.value.data.data.id
const videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`




onMounted(async () => { // Une fois la page chargee, on stream la video
})


if (store.items.length == 0) {
  store.addCrumb({ label: data.value.project.title, url: `/projects/${data.value.project_id}` })
}
if (store.items[store.items.length - 1].url != `/tasks/${data.value.id}`) {
  store.addCrumb({ label: data.value.name, url: `/tasks/${data.value.id}` })

}

</script>
