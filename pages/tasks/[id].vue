<template>
  <div  class="h-full">
    <component :is="annotationComponent" :data="data" :allFetched="allFetched" :annotations_in="annotations_in" :annotations_out="annotations_out" class="overflow-y-hidden" @refresh-data="refreshTaskData()" @submit-annotation="handleSubmit($event)" @finish-annotation="handleFinish($event)"></component>
    <!-- <OrganismSegmentation :data="data" :allFetched="allFetched" :annotations_in="annotations_in" :annotations_out="annotations_out" class="overflow-y-hidden" @refresh-data="refreshTaskData()" @submit-annotation="handleSubmit($event)"   /> -->
  </div>
</template>


<script setup>

import { ref } from 'vue';
import { bcStore } from '~/stores/breadcrumbs';
import OrganismSegmentation from '~/components/organisms/OrganismSegmentation.vue';
import OrganismTranscription from '~/components/organisms/OrganismTranscription.vue'
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

const annotationComponent = $computed(()=> {
  switch (data.value.step.annotation_type) {
    case 'segmentation':
      return OrganismSegmentation

    case 'transcription':
      return OrganismTranscription

  }

})



await fetchAnnotations(route.params.id)

if (getItems.value.length === 0 && JSON.parse(savedItems).length==0 ){ // When coming from dashboard
  store.addCrumb({ label: data.value.step.project.title, route: `/projects/${data.value.step.project.id}` })
}
if (getItems.value.length === 1 && JSON.parse(savedItems).length==1 ){ // When coming from project view
  store.addCrumb({ label: data.value.name, route: `/tasks/${data.value.id}` })
}

const annotation_bool = reactive({
  in : false,
  out : false
})
const annotations_out = ref([])
const annotations_in = ref([])
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res)=> annotations_out.value = res).then(()=> annotation_bool.out = true)
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'in').then((res)=> annotations_in.value = res).then(()=> annotation_bool.in = true  )


const allFetched = $computed(() => {
  return annotation_bool.in && annotation_bool.out
})

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
  const locals = JSON.parse(JSON.stringify(event.locals))

  if (annotationInfo != null) {
    let result = annotations_out.value[annotationInfo.index].result
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur a déjà une annotation associée à cette tâche
    AnnotationService.updateAnnotationResultAnnotationIdPatch(
      annotationInfo.id,
      annotations_out.value[annotationInfo.index].result
    )
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add({
          severity: 'info',
          detail: 'Annotation has been updated',
          life: 4000
        })
      })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res)=> annotations_out.value = res).then(()=> annotation_bool.out = true)
      })

  }

  else {
    let result = JSON.parse(JSON.stringify(annotations_in.value[0].result))
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur n'a jamais annoté cette tâche
    AnnotationService.createAnnotationAnnotationPost({
      annotation: {
        user_email: userEmail.value,
        task_id: data.value.id,
        result: result,
        annotation_status: AnnotationStatus.DRAFT,
        version: 1
      },
      association: {
        annotation_id : 0,
        task_id: data.value.id,
        direction: 'out'
      }
    })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res)=> annotations_out.value = res).then(()=> annotation_bool.out = true)
      })
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created', life: 5000 })
      })
  }

}
const handleFinish = (event) => {
  const locals = JSON.parse(JSON.stringify(event.locals))

  if (annotationInfo != null) {
    let result = annotations_out.value[annotationInfo.index].result
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur a déjà une annotation associée à cette tâche
    AnnotationService.finishAnnotationAnnotationFinishIdPatch(
      annotationInfo.id,
      annotations_out.value[annotationInfo.index].result
    )
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add({
          severity: 'info',
          detail: 'Annotation has been finished',
          life: 4000
        })
      })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res)=> annotations_out.value = res).then(()=> annotation_bool.out = true)
      })
      .then(window.location.reload())
  }

  else {
    let result = JSON.parse(JSON.stringify(annotations_in.value[0].result))
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur n'a jamais annoté cette tâche
    AnnotationService.createAnnotationAnnotationPost({
      annotation: {
        user_email: userEmail.value,
        task_id: data.value.id,
        result: result,
        annotation_status: AnnotationStatus.ENDED,

        version: 1
      },
      association: {
        annotation_id : 0,
        task_id: data.value.id,
        direction: 'out'
      }
    })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res)=> annotations_out.value = res).then(()=> annotation_bool.out = true)
      })
      .then(() => { window.onbeforeunload = null })
      .then(() => {
        toast.add(
          { severity: 'info', detail: 'Annotation created and finished', life: 5000 })
      })
      .then(window.location.reload())
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
</script>
