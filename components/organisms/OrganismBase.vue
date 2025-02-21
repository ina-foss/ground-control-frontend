<template>
  <div
v-if="annotationsOut[annotationInfo?.index]?.annotation_status !== annotationStatus && (isAdmin && !useRoute().query.email || !isAdmin ) && allFetched"
       class=" right-12 mr-4 absolute flex items-center top-[0px] h-[70px] z-[5]" >
    <Button  class="mr-4" outlined label="Soumettre"  @click="handleSubmit()"/>
    <Button class="button-overwrite"
            label="Terminer"
      @click="handleFinish()"
    />
  </div>
    <div v-if=" !allFetched " class="grid grid-cols-10 h-0 min-h-full " >
      <div class="col-span-3 h-full pl-5 gap-3 ">
        <Skeleton
:pt="{
          root: {
             style: 'height: auto'
          }
        }"  class="aspect-video !rounded-t-lg !rounded-b-none"/>
        <Skeleton class="m-3" height="3rem" width="70%" />
        <Skeleton height="500px" />
      </div>
      <div class=" p-4 flex flex-row w-full gap-5 justify-center col-span-5  ">
        <Skeleton  height="100%" width="28px" />
      <div class=" flex flex-col w-fit gap-5 !justify-center overflow-auto h-0 min-h-full">
          <Skeleton height="90px" width="700px" />
          <Skeleton height="100px" width="700px"/>
          <Skeleton height="70px"  width="700px"/>
          <Skeleton height="150px" width="700px"/>
          <Skeleton height="75px" width="700px"/>
          <Skeleton height="90px" width="700px" />
          <Skeleton height="100px" width="700px"/>
          <Skeleton height="70px"  width="700px"/>
          <Skeleton height="75px" width="700px"/>
        </div>
      </div>
    <div class="col-span-2 h-full w-full ">
      <div class="w-[300px] flex flex-col gap-3">
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="110px" />
      </div>
    </div>
    </div>
  <div v-else class="h-full">
    <Toast />
    <AtomSearch class=" right-10 absolute flex items-center top-[75px] z-[5]" @click="getSegments()" :list="listRefsTest" @find-span="handleFocusSpan" @unselect="handleSelection" />
    <div class="grid  grid-cols-10 xs:flex xs:flex-col h-full">
      <MoleculeAnnotationLeftPanel ref="moleculeAnnotationLeftPanelRef" :video-src="videoSrc" :media_params="data.media?.player_parameters" :locals="_.sortBy(annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation,['tcin'])" @scroll-to-segment="handleVideoTimelineClick">
        <MoleculeTabs :data="data"/>
      </MoleculeAnnotationLeftPanel>
      <component :is="annotationComponent.component" v-bind="annotationComponent.props" ref="moleculeAnnotationRef"  v-on="annotationComponent.events" :state="annotationsOut[annotationInfo?.index]?.annotation_status" />
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
  import MoleculeTabs from "../molecules/MoleculeTabs.vue";
  import {useTcOffset} from "~/composables/useTcOffset";
  import AtomSearch from "../atoms/AtomSearch.vue";
  import AtomSpan from "~/components/atoms/AtomSpan.vue";
  import {createApp} from "vue/dist/vue";
  const authStore = useAuth()
  const optionStore = useOptions()
  const {$application} = useService()
  const {addTimecodeHistory} = useTimecodeHistory()
  const { unixToTimestamp, timestampToUnix } = $application
  const{setTcOffset}= useTcOffset()

  type AtomSpanType = InstanceType<typeof AtomSpan>
  const spanRefArray = ref<[]>([])
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

  const handleFocusSpan = ({ index }) => {


  }
  const handleSelection = (spanArg: any) => {

  }
  const listRefsTest = ref([]);
  const getSegments = () : HTMLDivElement => {
    let listRefsTest = moleculeAnnotationRef.value?.listRefs
    return listRefsTest
  }
  watch(() => allFetched, (newValue) => {
    if (newValue && moleculeAnnotationRef.value?.listRefs) {
      console.log("listRefs mis à jour :", moleculeAnnotationRef.value.listRefs);
    }
  });

  const emits = defineEmits([ 'submit-annotation', 'finish-annotation' ]);

  const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));
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
  let bestIndex = 0
  const annotationInfo = computed< {index: number, id: number} | null>(() => {
    if (!allFetched) return null;
    return annotationsOut.reduce<{index: number, id: number} | null>((info, annotation, index) => {
      if (annotation.user_email == userEmail.value || annotation.user_email == useRoute().query.email) {
        return { index, id: annotation.id };
      }
      return info;
    }, null);
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
      ? _.sortBy(annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation,['tcin'])
      : _.sortBy(annotationsOut[annotationInfo.value.index]?.result.data.localisation[0].sublocalisations.localisation,['tcin'])
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
  return _.sortBy(res,(array)=>array[0]?.tcin)
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


  const handleSegmentClick = (event: {tcin: string|number, index: number, fromVideo?: boolean }) => { // Lorsqu'un segment est cliqué
    bestIndex = event.index
    highlightSegment(event.index)
    scrollToSegment({bestIndex: event.index})
    if ( options.value.transcription === true ) {
      moleculeAnnotationLeftPanelRef.value?.updateVideoTimecode(event)
    }
  }


  const highlightSegment = (index: number) => {
      getSelectedSegment()?.classList?.remove('selected-segment')
      moleculeAnnotationRef.value?.listRefs[index].classList.add('selected-segment')
  }

  const handleVideoTimelineClick = (event) => {
    if ( options.value.player === true) {
      scrollToSegment(event)
    }
  }

  const scrollToSegment = (event : {bestIndex: number, fromHistory?: boolean, tcin?: number}) => { // Lorsque la video change de timecode
      bestIndex = event.bestIndex
      highlightSegment(event.bestIndex)
      if(!event.fromHistory) addTimecodeHistory(event.tcin ?? locals.value[event.bestIndex]?.tcin  )
      moleculeAnnotationRef.value?.listRefs[event.bestIndex].scrollIntoView({block: 'center', behavior: 'smooth'});
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
        events:{ 'on-segment-click': handleSegmentClick }}
    case 'transcription':
      return {component: MoleculeTranscription, props: {
        transcriptions: transcriptions.value,
        userAnnotations: userAnnotations.value,
        algos: algos.value,
        status: annotationsOut[annotationInfo.value?.index]?.annotation_status
        },
        events:{ 'on-segment-click': handleSegmentClick }}

    case 'span':
        return { component :MoleculeSpan,
          props: {},
          events:{ 'on-segment-click': handleSegmentClick }
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
        const tcOffset = data.media?.player_parameters?.tc_offset ?? 0;
        setTcOffset(tcOffset);
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
          case "A":
            options.value.timecode_bloc = !options.value.timecode_bloc;
            break;
          case "Z":
            options.value.timecode_segment = !options.value.timecode_segment;
            break;
          case "E":
            options.value.player = !options.value.player;
            break;
          case (" "): // Gérer l'espace
            if (event.ctrlKey) { //creation rupture apres
              navigateWithkeyboard(0,false);
            }
            else{ //creation rupture avant
              navigateWithkeyboard(0,true);
            }
            break;
          default:
        }
    }
  }

  const getSelectedSegment = () : HTMLDivElement =>{
    let segmentArray : Array<HTMLDivElement> | HTMLCollection = moleculeAnnotationRef.value?.listRefs
    if (segmentArray instanceof HTMLCollection) segmentArray = [...segmentArray]
    const selected_element : HTMLDivElement =  segmentArray?.find(ref =>
      ref.classList?.contains('selected-segment')
    );
    return selected_element
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
        moleculeAnnotationRef.value.handleSegmentation({index: bestIndex})
      }
      else if(moleculeAnnotationRef.value &&  action === false){
        moleculeAnnotationRef.value.handleSegmentation({index: bestIndex-1})
      }
      elementWithTestClass = getSelectedSegment();
      const dataTcValue = elementWithTestClass?.querySelector('[tcin]')?.getAttribute('tcin') // return the first tcin value inside the selectedElement
      handleSegmentClick({tcin: dataTcValue, tcout: '0', index: bestIndex})
    }

  }

  provide('plugin-config', config)

  provide('plugin-items-config', configItemPlugin)


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
