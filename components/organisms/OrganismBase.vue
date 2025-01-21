<template>
  <div
v-if="data.annotations[0]?.annotation_status !== annotationStatus"
       class=" right-12 mr-4 absolute flex items-center top-[-70px] h-[70px] z-[5] !hover:red" >
    <Button  class="mr-4" outlined label="Soumettre"  @click="handleSubmit()"/>
    <Button class="button-overwrite"
            label="Terminer"
      @click="handleFinish()"
    />
  </div>
  <div v-if=" !allFetched ">
    <div class="grid grid-cols-9  ">
      <div class="col-span-3 h-screen  bg-surface-700 gap-3 px-5 py-5">
        <Skeleton
:pt="{
          root: {
             style: 'height: auto'
          }
        }"  class="aspect-video"/>
        <Skeleton class="m-3" height="3rem" width="70%" />
        <Skeleton height="500px" />
      </div>
      <div class=" p-4 flex flex-row w-full gap-5 justify-center col-span-5">
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
  <div v-else class="h-full " >

    <Toast />
    <div class="grid  grid-cols-9 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :video-src="videoSrc" :data="data" :colors="colors" :locals="annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation" :topics="topics" @scroll-to-segment="scrollToSegment">
        <h2 class="text-white text-3xl md:block xs:hidden p-3 font-semibold">{{data.step?.annotation_type}}</h2>
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
      <component :is="annotationComponent.component" v-bind="annotationComponent.props" ref="moleculeAnnotationRef"  v-on="annotationComponent.events" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { provide} from 'vue'
  import { useAuth } from "../../stores/auth"
  import MoleculeAnnotationLeftPanel from "../molecules/MoleculeAnnotationLeftPanel.vue";
  import MoleculeSpan from "../molecules/MoleculeSpan.vue";
  import MoleculeSegmentation from "../molecules/MoleculeSegmentation.vue";
  import MoleculeTranscription from "../molecules/MoleculeTranscription.vue";
  import _ from 'lodash'
  import {AnnotationStatus, PluginService} from '../../api/generate';
  import { useService } from "#imports";
  const authStore = useAuth()
  const optionStore = useOptions()
  const {$application} = useService()
  const { unixToTimestamp } = $application


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



  const emits = defineEmits([ 'submit-annotation', 'finish-annotation' ]);

  const colors = ref(['#BEBEBE'])
  const topics = ref([])
  const videoSrc = ref(annotationsIn[0]?.result.asset.url)
  const moleculeAnnotationRef = ref()
  const moleculeAnnotationLeftPanelRef= ref()
  const { userEmail } = storeToRefs(authStore)
  const { options } = storeToRefs(optionStore)
  const annotationStatus = AnnotationStatus.ENDED
  const config = ref(null)
  const configItemPlugin = ref<Array<{ id: any; data: any }>>([]);
  const timecodeHistory = ref([])
  let bestIndex = 0
  const annotationInfo = computed(() => {
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

  PluginService.readPluginsPluginsStepStepIdPluginTypeDisplayZoneGet(data.step_id,"AUTOCOMPLETE","BLOC").then((response)=>{
   config.value = response;
    const transformedData = Promise.all(
      response.map(async (item) => {
        const result = await PluginService.searchPluginsPluginsPluginIdSearchGet(item.id, ' ')
        return {
          id: item.id,
          data: result,
        };
      })
    );
    configItemPlugin.value = transformedData;
  } )



  const userAnnotations = computed(() => { // return array of users annotations
    let response = []
    if (allFetched && annotationInfo.value != null) {
      const annotation = annotationsOut[annotationInfo.value.index];

      if (annotation?.result?.data?.localisation?.[0]?.sublocalisations?.localisation) {
        response = [...annotation.result.data.localisation[0].sublocalisations.localisation];
      }  }
    return response
  })

  const locals = computed(() => {
    if(allFetched){
    return (annotationInfo.value == null)
      ? annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation
      : annotationsOut[annotationInfo.value.index]?.result.data.localisation[0].sublocalisations.localisation
    }
    return []
  })

  const result = computed(() => {
    if(allFetched){
    return (annotationInfo.value == null)
      ? annotationsIn[0]?.result.data
      : annotationsOut[annotationInfo.value.index]?.result.data
    }
    return {}
  })

const transcriptions = computed(() => { // format array to have all transcription version in the same array element
  const res = []
  if (allFetched) {
    annotationsIn[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index) => {
      res.push([])
      annotationsIn.forEach((transcription) => {
        res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
      })
    })
  }
  return res
})

const algos = computed(() => { // List the name of the algorithm
  const res = []
  if (allFetched) {
    annotationsIn.forEach((annotation) => {
      res.push(annotation.result.data.algorithm)
    })
  }
  return res
})

  function addTimecodeHistory (tc?: never){
    if(timecodeHistory.value.length == 0 || timecodeHistory.value[timecodeHistory.value.length-1] != tc) timecodeHistory.value.push(tc)

  }


  const updateVideoTimecode = (event) => {
    if ( options.value.transcription === true ) {
      moleculeAnnotationLeftPanelRef.value?.updateVideoTimecode(event)
        scrollToSegment({lastIndex: 0, bestIndex: event.index})
    }
  }

  const scrollToSegment = (event) => {
    console.log(event)
    if ( options.value.player === true) {
      if(!event.fromHistory) addTimecodeHistory(locals.value[event.bestIndex]?.tcin | event.tcin)
      bestIndex=event.bestIndex
      getSelectedSegment()?.classList?.remove('selected-segment')
      moleculeAnnotationRef.value?.listRefs[bestIndex].scrollIntoView({ behavior: "smooth" });
      moleculeAnnotationRef.value?.listRefs[bestIndex].classList.add('selected-segment')
    }
  }

const annotationComponent = computed(() => {
  switch (data.step?.annotation_type) {
    case 'segmentation':
        return {component: MoleculeSegmentation, props: {
          result: result.value,
          locals: locals.value,
          colors: colors.value,
          topics: topics.value
        },
        events:{ 'on-segment-click': updateVideoTimecode }}
    case 'transcription':
      return {component: MoleculeTranscription, props: {
        transcriptions: transcriptions.value,
        userAnnotations: userAnnotations.value,
        algos: algos.value,
        status: data.annotations[0]?.annotation_status
        },
        events:{ 'on-segment-click': updateVideoTimecode }}

    case 'span':
        return { component :MoleculeSpan,
          props: {},
          events:{ 'on-segment-click': updateVideoTimecode}
  }

}
})

  const handleSubmit = () => {
    const localSubmit = locals
    if(moleculeAnnotationRef.value.locals) localSubmit.value = moleculeAnnotationRef.value.locals
    emits('submit-annotation',{ locals: moleculeAnnotationRef.value.annotationFunction(localSubmit.value) })
  }
  const handleFinish = () => {
    const localSubmit = locals
    if(moleculeAnnotationRef.value.locals) localSubmit.value = moleculeAnnotationRef.value.locals
    emits('finish-annotation', {locals: moleculeAnnotationRef.value.annotationFunction(localSubmit.value) })
  }

  onMounted(()=>{
    window.addEventListener("keydown", globalKeydown);

  watch(()=> allFetched,() => {
      if(allFetched == true){
        videoSrc.value = annotationsIn[0]?.result.asset.url

      }
  })
  })

  const globalKeydown=(event) =>{
    if((event.key && event.target.tagName != "INPUT") && (event.key && event.target.tagName != "TEXTAREA") ){
      const key = event.key.toUpperCase();
        switch (key) {
          case "W"://recule de 10
            navigateWithkeyboard(-10,null);
            break;
          case "X"://recule de 5
            navigateWithkeyboard(-5,null);
            break;
          case "C"://recule de 1
            navigateWithkeyboard(-1,null);
            break;
          case "V"://avance de 1
            navigateWithkeyboard(1,null);
            break;
          case "B"://avance de 5
            navigateWithkeyboard(5,null);
            break;
          case "N"://avance de 10
            navigateWithkeyboard(10,null);
            break;
          case (" "): // Gérer l'espace
            if (event.ctrlKey) { //creation rupture apres
              navigateWithkeyboard(1,false);
            }
            else{ //creation rupture avant
              navigateWithkeyboard(1,true);
            }
            break;
          default:
        }
    }
  }

  const getSelectedSegment = () : HTMLDivElement =>{
    let segmentArray : Array<HTMLDivElement> | HTMLCollection = moleculeAnnotationRef.value?.listRefs
    if (segmentArray instanceof HTMLCollection) segmentArray = [...segmentArray]
    return segmentArray?.find(ref =>
      ref.classList?.contains('selected-segment')
    );
  }

  const navigateWithkeyboard = (param,action) => {
    let elementWithTestClass  = getSelectedSegment();
    if (bestIndex >= 0) {
      bestIndex = (elementWithTestClass && bestIndex < moleculeAnnotationRef.value?.listRefs.length - 1) ?
        bestIndex + param : bestIndex;
      if (elementWithTestClass && bestIndex === moleculeAnnotationRef.value?.listRefs.length - 1) {
        bestIndex = bestIndex + param
      }
      if (bestIndex > moleculeAnnotationRef.value?.listRefs.length - 1) {
        bestIndex = moleculeAnnotationRef.value?.listRefs.length - 1
      }
      if (bestIndex < 0) {
        bestIndex = 0
      }
      if(moleculeAnnotationRef.value && action === true){
        moleculeAnnotationRef.value.createBreak(bestIndex-1)
      }
      else if(moleculeAnnotationRef.value &&  action === false){
        moleculeAnnotationRef.value.removeBreak(bestIndex-1)
      }
      scrollToSegment({bestIndex})
      elementWithTestClass = getSelectedSegment();
      const dataTcValue = elementWithTestClass?.querySelector('[tcin]')?.getAttribute('tcin') // return the first tcin value inside the selectedElement
      updateVideoTimecode({tcin: dataTcValue, tcout: '0', index: bestIndex})
    }

  }

  provide('plugin-config', config)

  provide('plugin-items-config', configItemPlugin)

  provide('timecode-history', timecodeHistory)

  provide('data',data)

  provide('span',{
   locals :  locals
  })


</script>

<style>
.button-overwrite:hover {
  background-color: #0C7DA2 !important;
  border-color: #0C7DA2 !important;
}
</style>
