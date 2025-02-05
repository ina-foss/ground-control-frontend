<template>
  <div class="h-full" >
    <OrganismBase
 :data="data" :all-fetched="allFetched" :annotations-in="annotations_in"
               :annotations-out="annotations_out"
               @submit-annotation="handleSubmit($event,'submit')"
               @finish-annotation="handleSubmit($event,'end')"/>
  </div>
</template>


<script setup>

import {ref} from 'vue';
import { AnnotationService, AnnotationStatus} from '../../api/generate';
import {useAuth} from '../../stores/auth';
import {storeToRefs} from 'pinia';
import {useRefreshStore} from '#imports';
import OrganismBase from '~/components/organisms/OrganismBase.vue';

const refresh = useRefreshStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuth()

const {getData} = storeToRefs(refresh)
const {userEmail} = storeToRefs(authStore)
const {fetchAnnotations} = refresh

const data = ref(getData)


onBeforeRouteLeave((to,from,next)=>{
  if(window.onbeforeunload != null) {
    const answer = window.confirm("Vous n'avez pas sauvegarder votre travail. Voulez-vous quitter cette page ?")
    if (answer) {
      window.onbeforeunload = null;
      next();
    }
  }
  else  next()
})

await fetchAnnotations(route.params.id)


const annotation_bool = reactive({
  in: false,
  out: false
})
const annotations_out = ref([])
const annotations_in = ref([])
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id,userEmail.value, 'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id,'','in').then((res) => annotations_in.value = res).then(() => annotation_bool.in = true)


const allFetched = computed(() => {
  return annotation_bool.in && annotation_bool.out
})

const annotationInfo = computed(() => {
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

const submitExistantAnnotation =(locals,action)=>{

    const result = annotations_out.value[annotationInfo.value.index].result
    result.data.localisation[0].sublocalisations.localisation = locals
    // L'utilisateur a déjà une annotation associée à cette tâche
    let promise;
    if (action === 'submit') {
      promise = AnnotationService.updateAnnotationResultAnnotationIdPatch(
        annotationInfo.value.id,
        annotations_out.value[annotationInfo.value.index].result
      )
    } else {
      promise = AnnotationService.finishAnnotationAnnotationFinishIdPatch(
        annotationInfo.value.id,
        annotations_out.value[annotationInfo.value.index].result
      )
    }
    promise.then(() => {
      toast.add({
        severity: 'info',
        summary: action === "submit" ? 'Cette annotation a été mise à jour' : 'Cette annotation est terminée',
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
        AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, userEmail.value,'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
      })
}

const submitNewAnnotation =(locals,action)=>{
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
      AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(data.value.id, userEmail.value,'out').then((res) => annotations_out.value = res).then(() => annotation_bool.out = true)
    })
    .then(() => {
      window.onbeforeunload = null
    })
    .then(() => {
      toast.add(
        {
          severity: 'info',
          summary: action === "submit" ? 'Annotation créée' : 'Annotation créée et terminée',
          life: 5000
        })
      if (action === "end") {

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    })}
const handleSubmit = (event, action) => {
  const locals = JSON.parse(JSON.stringify(event.locals))

  if (annotationInfo.value != null) {
    submitExistantAnnotation(locals,action);

  } else {
    submitNewAnnotation(locals,action);
  }

}

</script>
