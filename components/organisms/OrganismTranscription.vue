<template>
  <div v-if=" allFetched " class="h-full" >
    <div class="fixed bottom-10 right-20 ">
      <Button label="Submit" size="large" @click="handleSubmit()" />
    </div>
    <Toast />
    <div class="grid grid-cols-9 xs:block h-full">
      <MoleculeAnnotationLeftPanel class="xs:sticky" ref="moleculeAnnotationLeftPanelRef" :videoSrc="videoSrc" :locals="locals" :data="data" />
      <MoleculeTranscription class="overflow-y-auto" :transcriptions="transcriptions" :algos="algos" />
    </div>
  </div>
</template>


<script setup>
  import MoleculeAnnotationLeftPanel from '../molecules/MoleculeAnnotationLeftPanel.vue';
  import MoleculeTranscription from '../molecules/MoleculeTranscription.vue';

  const { data, annotations_in, annotations_out, allFetched } = defineProps(['data','annotations_in','annotations_out','allFetched'])

  let videoSrc = $ref(annotations_in[0]?.result.asset.url)

  const annotationInfo = $computed(() => {
    let info = null
    if (allFetched ) {
      annotations_out.forEach((annotation, index) => {
        if (annotation.user_email == userEmail.value) {
          info = { index: index, id: annotation.id }
        }
      })
      return info
    }
  });

  const transcriptions = $computed(() => {
    const res = []
    if(allFetched){
      annotations_in[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index)=>{
        res.push([])
        annotations_in.forEach((transcription)=>{
          res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
        })
      })
    }
    return res
  })

  const algos = $computed(()=> {
    const res = []
    if (allFetched){
      annotations_in.forEach((annotation)=>{
        res.push(annotation.result.data.algorithm)
      })
    }
    return res
  })


  watchEffect(() => {if(allFetched)
    videoSrc = annotations_in[0]?.result.asset.url

    })

</script>
