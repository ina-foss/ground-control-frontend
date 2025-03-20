import { useAuth } from "~/stores/auth"
import MoleculeAnnotationLeftPanel from "~/components/molecules/MoleculeAnnotationLeftPanel.vue";
import MoleculeSpan from "~/components/molecules/MoleculeSpan.vue";
import MoleculeSegmentation from "~/components/molecules/MoleculeSegmentation.vue";
import MoleculeTranscription from "~/components/molecules/MoleculeTranscription.vue";
import _,{sortBy} from 'lodash';
import {AnnotationStatus, PluginService} from '~/api/generate';
import { useService } from "#imports";
import MoleculeTabs from "~/components/molecules/MoleculeTabs.vue";
import {useTcOffset} from "~/composables/useTcOffset";
import AtomSearch from "~/components/atoms/AtomSearch.vue";
import type AtomSpan from "~/components/atoms/AtomSpan.vue";

export default defineComponent({
  name: "OrganismAnnotation",
  components:{
    MoleculeAnnotationLeftPanel,
    MoleculeSpan,
    MoleculeSegmentation,
    MoleculeTabs,
    AtomSearch,
    MoleculeTranscription,
  },
  props: {
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
  },
  emits: [ 'submit-annotation', 'finish-annotation' ],
  setup(props, {emit}) {

    const { data, annotationsIn, annotationsOut, allFetched } = toRefs(props)

    const authStore = useAuth()
    const optionStore = useOptions()
    const {$application} = useService()
    const {addTimecodeHistory} = useTimecodeHistory()
    const { unixToTimestamp  } = $application
    const{setTcOffset}= useTcOffset()

    type AtomSpanType = InstanceType<typeof AtomSpan>
    const spanRefArray = ref<[]>([])

    const handleFocusElement = ({ div }:{div: HTMLDivElement}) => {
        let index = _.findIndex(moleculeAnnotationRef.value.listRefs,(el)=> el == div)
        scrollToSegment({bestIndex: index})
    }
    const handleSelection = (spanArg: any) => {
      getSelectedSegment()?.classList?.remove('selected-segment')
    }
    const listRefs = computed(()=>{
        return _.uniq(moleculeAnnotationRef.value?.listRefs)
    });

    const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));
    const colors = ref(['#BEBEBE'])
    const topics = ref([])
    const videoSrc = ref(annotationsIn.value[0]?.result.asset.url)
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
      return annotationsOut.value.reduce<{index: number, id: number} | null>((info, annotation, index) => {
        if (annotation.user_email == userEmail.value || annotation.user_email == useRoute().query.email) {
          return { index, id: annotation.id };
        }
        return info;
      }, null);
    });

    const isAnnotationEditable = computed(()=> annotationsOut.value[0]?.annotation_status != AnnotationStatus.ENDED && (isAdmin.value && !useRoute().query.email || !isAdmin.value) )
    provide('isAnnotationEditable',isAnnotationEditable)

    PluginService.readPluginsPluginsStepStepIdPluginTypeDisplayZoneGet(data.value.step_id,"AUTOCOMPLETE","BLOC").then((response)=>{
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
      if(allFetched.value){
      return (annotationInfo.value == null)
        ? _.sortBy(annotationsIn.value[0]?.result.data.localisation[0].sublocalisations.localisation,(el)=>unixToTimestamp(el.tcin))
        : _.sortBy(annotationsOut.value[annotationInfo.value.index]?.result.data.localisation[0].sublocalisations.localisation,(el)=>unixToTimestamp(el.tcin))
      }
      return []
    })

    const result = computed(() => {
      if(allFetched.value){
      return (annotationInfo.value == null)
        ? annotationsIn.value[0]?.result.data
        : annotationsOut.value[annotationInfo.value.index]?.result.data
      }
      return {}
    })

  const transcriptions = computed(() => { // format array to have all transcription version in the same array element
    const res = []
    if (allFetched.value) {
      annotationsIn.value[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index) => {
        res.push([])
        annotationsIn.forEach((transcription) => {
          res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
        })
      })
    }
    return _.sortBy(res,(array)=>unixToTimestamp(array[0]?.tcin))
  })

  const algos = computed(() => { // List the name of the algorithm
    const res = []
    if (allFetched.value) {
      annotationsIn.value.forEach((annotation) => {
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
    switch (data.value.step?.annotation_type) {
      case 'segmentation':
          return {component: MoleculeSegmentation, props: {
            result: result.value,
            locals: locals.value,
            colors: colors.value,
            topics: topics.value,
            tcOffset : data.value.media?.player_parameters?.tc_offset ?? 0,
          },
          events:{ 'on-segment-click': handleSegmentClick }}
      case 'transcription':
        return {component: MoleculeTranscription, props: {
          transcriptions: transcriptions.value,
          userAnnotations: userAnnotations.value,
          algos: algos.value,
          status: annotationsOut.value[annotationInfo.value?.index]?.annotation_status
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
    emit('submit-annotation',{ locals: moleculeAnnotationRef.value.annotationFunction(localSubmit.value) })
  }
  const handleFinish = () => {
    const localSubmit = locals
    if(moleculeAnnotationRef.value.locals) localSubmit.value = moleculeAnnotationRef.value.locals
    emit('finish-annotation', {locals: moleculeAnnotationRef.value.annotationFunction(localSubmit.value) })
  }

  onMounted(()=>{
    window.addEventListener("keydown", globalKeydown);

  watch(()=> allFetched.value,() => {
      if(allFetched.value == true){
        videoSrc.value = annotationsIn.value[0]?.result.asset.url
        const tcOffset = data.value.media?.player_parameters?.tc_offset ?? 0;
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
          case "R":
            options.value.number_segment = !options.value.number_segment;
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
      handleSegmentClick({tcin: locals.value[bestIndex].tcin, tcout: '0', index: bestIndex})
    }

  }

  provide('plugin-config', config)

  provide('plugin-items-config', configItemPlugin)


  provide('data',data)

  provide('span',{
   locals :  locals
  })


  return {
    annotationInfo,
    isAdmin,
    annotationStatus,
    handleSubmit,
    handleFinish,
    allFetched,
    listRefs,
    handleFocusElement,
    handleSelection,
    videoSrc,
    data,
    moleculeAnnotationRef,
    handleVideoTimelineClick,
    annotationComponent,
    annotationsOut,
    annotationsIn,
    sortBy,
    unixToTimestamp,
    moleculeAnnotationLeftPanelRef,



  }

},
})
