<template>
  <!-- TODO: Find a way to render this while aynchronous calls -->
  <div  class="h-full">
    <OrganismSegmentation :data="data" :annotations_in="annotations_in" :annotations_out="annotations_out" class="overflow-y-hidden" @refresh-data="refreshTaskData()" @submit-annotation="handleSubmit($event)"   />
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

const { getData } = storeToRefs(refresh)
const { getItems } = storeToRefs(store)
const { userEmail } = storeToRefs(authStore)
const { fetchAnnotations } = refresh
const { addCrumb } = store

const data = ref(getData)
const savedItems = localStorage.getItem('breadcrumbItems');

await fetchAnnotations(route.params.id).then((res)=> {
  if (store.items.length === 0 ) { //reloading the page
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
    parsedItems.forEach((item) => {
      store.addCrumb({ label: item.label, url: item.url })
    });
    }
  }
})

const annotations_out = ref(await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out'))
const annotations_in = ref(await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'in'))



const annotationInfo = $computed(() => {
  let info = null
  if (annotations_out.value) {
    annotations_out.value.forEach((annotation, index) => {
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
    AnnotationService.updateAnnotationResultAnnotationIdPatch(
      annotationInfo.id,
      annotations_out.value[annotationInfo.index].result
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
      annotation: {
        user_email: userEmail.value,
        task_id: data.value.id,
        result: annotations_in.value[0].result,
        annotation_status: AnnotationStatus.DRAFT,
        version: 1
      },
      association: {
        annotation_id : 0,
        task_id: data.value.id,
        direction: 'out'
      }
    }).then(() => refreshTaskData())
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created', life: 5000 })
      })
  }

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



// if (store.items.length == 0) {
//   store.addCrumb({ label: data.value.project.title, url: `/projects/${data.value.project_id}` })
// }
// if (store.items[store.items.length - 1].url != `/tasks/${data.value.id}`) {
//   store.addCrumb({ label: data.value.name, url: `/tasks/${data.value.id}` })
//
// }
//
</script>
