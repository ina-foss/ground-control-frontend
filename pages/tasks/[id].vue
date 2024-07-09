<template>
  <div v-if="data.data.data == null" >
    <span>data is not in the right format</span>
  </div>
  <div v-else class="h-full">
    <OrganismSegmentation :data="data" class="overflow-y-hidden" @refresh-data="refreshTaskData()" @submit-annotation="handleSubmit($event)"   />
  </div>
</template>


<script setup>

import {  ref } from 'vue';
import { bcStore } from '~/stores/breadcrumbs';
import { TaskService, AnnotationService } from '../../api/generate';
import { useAuth } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import OrganismSegmentation from '~/components/organisms/OrganismSegmentation.vue';


const store = bcStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuth()

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


onMounted(async () => { // Une fois la page chargee, on stream la video
})


if (store.items.length == 0) {
  store.addCrumb({ label: data.value.project.title, url: `/projects/${data.value.project_id}` })
}
if (store.items[store.items.length - 1].url != `/tasks/${data.value.id}`) {
  store.addCrumb({ label: data.value.name, url: `/tasks/${data.value.id}` })

}

</script>
