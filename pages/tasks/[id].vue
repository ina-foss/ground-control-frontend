<template>
  <div class="h-full">
    <component
:is="annotationComponent" :data="data" :all-fetched="allFetched" :annotations_in="annotations_in"
               :annotations_out="annotations_out" class="overflow-y-hidden" @refresh-data="refreshTaskData()"
               @submit-annotation="handleSubmit($event,'submit')"
               @finish-annotation="handleSubmit($event,'end')"/>
  </div>
</template>


<script setup>

import {ref} from 'vue';
import {bcStore} from '~/stores/breadcrumbs';
import OrganismSegmentation from '~/components/organisms/OrganismSegmentation.vue';
import OrganismTranscription from '~/components/organisms/OrganismTranscription.vue'
import {TaskService, AnnotationService, AnnotationStatus} from '../../api/generate';
import {useAuth} from '../../stores/auth';
import {storeToRefs} from 'pinia';
import {useRefreshStore} from '#imports';

const refresh = useRefreshStore()
const store = bcStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuth()

const {getData} = storeToRefs(refresh)
const {getItems} = storeToRefs(store)
const {userEmail} = storeToRefs(authStore)
const {fetchAnnotations} = refresh

const data = ref(getData)
const savedItems = localStorage.getItem('breadcrumbItems');

const annotationComponent = $computed(() => {
  switch (data.value.step.annotation_type) {
    case 'segmentation':
      return OrganismSegmentation

    case 'transcription':
      return OrganismTranscription

  }

})


await fetchAnnotations(route.params.id)

if (getItems.value.length === 0 && JSON.parse(savedItems).length == 0) { // When coming from dashboard
  store.addCrumb({label: data.value.step.project.title, route: `/projects/${data.value.step.project.id}`})
}
if (getItems.value.length === 1 && JSON.parse(savedItems).length == 1) { // When coming from project view
  store.addCrumb({label: data.value.name, route: `/tasks/${data.value.id}`})
}

const annotation_bool = reactive({
  in: false,
  out: false
})
const annotations_out = ref([])
const annotations_in = ref([])
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'in').then((res) => annotations_in.value = res).then(() => annotation_bool.in = true)


const allFetched = $computed(() => {
  return annotation_bool.in && annotation_bool.out
})

const annotationInfo = $computed(() => {
  let info = null
  if (annotations_out.value) {
    annotations_out.value.forEach((annotation, index) => {
      if (annotation.user_email == userEmail.value) {
        info = {index: index, id: annotation.id}
      }
    })
    return info
  }
});

const refreshTaskData = async () => {
  data.value = await TaskService.readTaskTaskTaskIdGet(route.params.id)
}

const handleSubmit = (event, action) => {
  const locals = JSON.parse(JSON.stringify(event.locals))

  if (annotationInfo != null) {
    const result = annotations_out.value[annotationInfo.index].result
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur a déjà une annotation associée à cette tâche
    let promise;
    if (action === 'submit') {
      promise = AnnotationService.updateAnnotationResultAnnotationIdPatch(
        annotationInfo.id,
        annotations_out.value[annotationInfo.index].result
      )
    } else {
      promise = AnnotationService.finishAnnotationAnnotationFinishIdPatch(
        annotationInfo.id,
        annotations_out.value[annotationInfo.index].result
      )
    }
    promise.then(() => {
      toast.add({
        severity: 'info',
        detail: action === "submit" ? 'Annotation has been updated' : 'Annotation has been ended',
        life: 4000
      })
      if (action === "end") {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    })
      .then(() => {
        window.onbeforeunload = null
      })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
      })

  } else {
    const result = JSON.parse(JSON.stringify(annotations_in.value[0].result))
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur n'a jamais annoté cette tâche
    AnnotationService.createAnnotationAnnotationPost({
      annotation: {
        user_email: userEmail.value,
        task_id: data.value.id,
        result: result,
        annotation_status: action === "submit" ? AnnotationStatus.DRAFT : AnnotationStatus.ENDED,
        version: 1
      },
      association: {
        annotation_id: 0,
        task_id: data.value.id,
        direction: 'out'
      }
    })
      .then(() => {
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, 'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
      })
      .then(() => {
        window.onbeforeunload = null
      })
      .then(() => {
        toast.add(
          {
            severity: 'info',
            detail: action === "submit" ? 'Annotation created' : 'Annotation created and ended',
            life: 5000
          })
        if (action === "end") {

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
  }

}

</script>
