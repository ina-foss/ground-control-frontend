<template>
  <div v-if="allFetched" class="h-full">
    <div
    v-if="data.annotations[0]?.annotation_status !== annotationStatus"
         class="fixed z-30 right-12 mr-4" style="top: 18px;" >
      <Button class="button button-prev mr-4" label="Soumettre" size="small" @click="handleSubmit()"/>
      <Button
        label="Terminer"
        class="button"
        size="small"
        @click="handleFinish()"
      />
    </div>

    <Toast />

    <div class="grid grid-cols-9 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :video-src="videoSrc" :data="data" :colors="colors" :locals="locals" :topics="topics" >
        <h2 class="text-white text-3xl md:block xs:hidden p-3 font-semibold">Annotation Span</h2>
        <p class="text-white p-3 md:block xs:hidden ">
          Dans le cadre d'une segmentation par thématique, une transcription est découpée en segment.<br>
          Chaque segment correspond à une thématique différente de la précédente.<br>
          Chaque changement de segment correspond à un changement d'interlocuteur ou de sujet.<br><span
            class="underline">Exemple</span> :
          <br>si on souhaite retranscrire le contenu d'une émission qui dure 1h, grâce à la segmentation, nous pouvons
          avoir un "résumé" du contenu de l'émission grâce aux différents segments. Ces derniers retracent les divers
          sujets
          ayant été traités, différencie les interlocuteurs.
        </p>
      </MoleculeAnnotationLeftPanel>
      <MoleculeSpan v-model:locals="locals" />
    </div>
  </div>
</template>

<script setup lang="js">

  import MoleculeSpan from '../molecules/MoleculeSpan.vue';
  import MoleculeAnnotationLeftPanel from '../molecules/MoleculeAnnotationLeftPanel.vue';
  import {AnnotationStatus} from '../../api/generate';
  import { useAuth } from '#imports';

  const authStore = useAuth()
  const emits = defineEmits(['submit-annotation', 'finish-annotation']);

  const colors = $ref(['#BEBEBE'])
  const topics = $ref([])
  let videoSrc = $ref(annotationsIn[0]?.result.asset.url)
  const moleculeAnnotationLeftPanelRef= $ref()
  const { userEmail } = storeToRefs(authStore)
  const annotationStatus = AnnotationStatus.ENDED

  const { data, annotationsIn, annotationsOut, allFetched } = defineProps({
    data: {
      type: Object,
      default: () => {}
    },
    annotationsIn: {
      type: Array,
      default: () => []
    },
    annotationsOut: {
      type: Array,
      default: () => []
    },
    allFetched: {
      type: Boolean,

    },

  })

  const annotationInfo = $computed(() => {
    let info = null
    if (allFetched ) {
      annotationsOut.forEach((annotation, index) => {
        if (annotation.user_email == userEmail.value) {
          info = { index: index, id: annotation.id }
        }
      })
      return info
    }
  });

  const locals = $computed(() => {
    if(allFetched){
    return (annotationInfo == null)
      ? annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation
      : annotationsOut[annotationInfo.index]?.result.data.localisation[0].sublocalisations.localisation
    }
    return []
  })


  onMounted(()=>{


    watch(()=> allFetched, async() => {
        await nextTick()
        if(allFetched == true){

          videoSrc = annotationsIn[0]?.result.asset.url
        }
    })
  })

  const handleSubmit = () => {
    locals.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    emits('submit-annotation',{ locals: locals })
  }
  const handleFinish = () => {
    locals.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    emits('finish-annotation', {locals: locals})
  }

  onMounted(()=>{
    watch(()=> allFetched,() => {
        if(allFetched == true){
          videoSrc = annotationsIn[0]?.result.asset.url

        }
    })
  })

</script>
