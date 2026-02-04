import { useAuth } from "~/stores/auth"
import MoleculeAnnotationLeftPanel from "~/components/molecules/MoleculeAnnotationLeftPanel.vue";
import MoleculeSpan from "~/components/molecules/MoleculeSpan.vue";
import MoleculeSegmentation from "~/components/molecules/MoleculeSegmentation.vue";
import MoleculeTranscription from "~/components/molecules/MoleculeTranscription.vue";
import _,{sortBy} from 'lodash';
import {AnnotationStatus, Permission, TaskStatus} from '~/api/generate';
import { useService, useI18n } from "#imports";
import MoleculeTabs from "~/components/molecules/MoleculeTabs.vue";
import {useTcOffset} from "~/composables/useTcOffset";
import AtomSearch from "~/components/atoms/search/AtomSearch.vue";
import SpanSkeleton from "~/components/molecules/SpanSkeleton.vue";
import MoleculeDialogConfirm from "~/components/molecules/moleculeDialogConfirm/MoleculeDialogConfirm.vue";

export default defineComponent({
  name: "OrganismAnnotation",
  components:{
    MoleculeAnnotationLeftPanel,
    MoleculeSpan,
    MoleculeSegmentation,
    MoleculeTabs,
    AtomSearch,
    MoleculeTranscription,
    SpanSkeleton,
    MoleculeDialogConfirm
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
  emits: [ 'submit-annotation', 'finish-annotation', 'skip-annotation' ],
  setup(props, {emit}) {

    const { data, annotationsIn, annotationsOut, allFetched } = toRefs(props)
    const { t } = useI18n()
    const authStore = useAuth()
    const optionStore = useOptions()
    const {$application} = useService()
    const {addTimecodeHistory} = useTimecodeHistory()
    const { unixToTimestamp  } = $application
    const{setTcOffset}= useTcOffset()
    const refresh = useRefreshStore()
    const { getParameters } = storeToRefs(refresh)
    const spansChanged = ref(false)
    const tabsRef = ref()
    const abondanDialog = ref(false)
    const finishDialog = ref(false)

    const isPlayerFocused = ref(false)
    const handleFocusElement = ({ div }:{div: HTMLDivElement}) => {
        let index = _.findIndex(moleculeAnnotationRef.value.listRefs,(el)=> el == div)
        index != -1 ? scrollToSegment({bestIndex: index}) : div.scrollIntoView({'behavior': 'smooth', 'block' : 'center'})
    }
    const handleSelection = () => {
      getSelectedSegment()?.classList?.remove('selected-segment')
    }
    const listRefs = computed(()=>{
        return _.uniq(moleculeAnnotationRef.value?.listRefs)
    });

    const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));
    const colors = ref(['#BEBEBE'])
    const topics = ref([])
    const videoSrc = ref(annotationsIn.value?.[0]?.result.asset.url)
    const moleculeAnnotationRef = ref()
    const moleculeAnnotationLeftPanelRef= ref()
    const { userEmail } = storeToRefs(authStore)
    const { options } = storeToRefs(optionStore)
    const annotationStatus = AnnotationStatus.DONE
    const config = ref(null)
    const route = useRoute();
    const configItemPlugin = ref<Array<{ id: any; data: any }>>([]);

    let bestIndex = 0
    const annotationInfo = computed< {index: number, id: number} | null>(() => {
      if (!allFetched) return null;
      return annotationsOut.value.reduce<{index: number, id: number} | null>((info, annotation, index) => {
        if (annotation.user_email == userEmail.value || annotation.user_email == route.query.email) {
          return { index, id: annotation.id };
        }
        return info;
      }, null);
    });

    const forbiddenStatuses = [
      TaskStatus.ARCHIVED,
      TaskStatus.SKIPPED
    ]

    const allow_skip = computed(() => getParameters.value.allow_skip && !forbiddenStatuses.includes(data.value.status) && annotationsOut.value?.[0]?.annotation_status != AnnotationStatus.DONE)
    const isAnnotationEditable = computed(()=> route.query.mode !='read' && !forbiddenStatuses.includes(data.value.status) && annotationsOut.value?.[0]?.annotation_status != AnnotationStatus.DONE &&
     (isAdmin.value && !route.query.email || !isAdmin.value))

    const annotation_type = data.value.step.annotation_type


    const userAnnotations = computed(() => { // return array of users annotations
      let response = []
      if (allFetched && annotationInfo.value != null) {
        const annotation = annotationsOut.value[annotationInfo.value.index];

        if (annotation?.result?.data?.localisation?.[0]?.sublocalisations?.localisation) {
          response = [...annotation.result.data.localisation[0].sublocalisations.localisation].filter(el=>el?.data);
        }  }
      return response
    })

    const spans = computed(()=>{
      let response = []
      if (allFetched && annotationInfo.value != null) {
        const annotation = annotationsOut.value[annotationInfo.value.index];

        if (annotation?.result?.data?.localisation?.[0]?.sublocalisations?.localisation) {
          response = [...annotation.result.data.localisation[0].sublocalisations.localisation].filter(el=>!el.data);
        }  }
      return response
    })

    const locals = computed(() => {
      if(allFetched.value){
      return (annotationInfo.value == null || data.value?.step?.annotation_type == 'auto-summary')
        ? _.sortBy(annotationsIn.value[0]?.result.data.localisation[0].sublocalisations.localisation,(el)=>unixToTimestamp(el?.tcin))
        : _.sortBy(annotationsOut.value[annotationInfo.value.index]?.result.data.localisation[0].sublocalisations.localisation,(el)=>unixToTimestamp(el?.tcin))
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
      if(annotation_type == 'transcription'){
        annotationsIn.value[0].result.data.localisation[0].sublocalisations.localisation.forEach((useless, index) => {
          res.push([])
          annotationsIn.value.forEach((transcription) => {
            res[index].push(transcription.result.data.localisation[0].sublocalisations.localisation[index])
          })
        })
      } else if(annotation_type == 'auto-summary'){
          annotationsIn.value[0].result.data.topic_metadata.forEach((topic)=>{
            if(topic){
              const firstTransciprtionInTopic = _.find(
                annotationsIn.value[0].result.data.localisation[0].sublocalisations.localisation,
                e=>e.data.topic == topic.id
              )
              if(firstTransciprtionInTopic){ // if the topic is used in the transcription
                res.push([
                  {
                    tcin: firstTransciprtionInTopic.tcin,
                    tcout: firstTransciprtionInTopic.tcout,
                    data: {
                      topic: topic.id,
                      text : [ topic.summary ]
                    },
                  }
                ])
              }
            }
          })
        }
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
    if (res.length == 0) return null
    return res
  })

  const tabsProps = computed(()=>{
      return {data: data.value,
              transcriptions: data.value.step.annotation_type == 'auto-summary' ? transcriptions.value  : undefined,
              userAnnotations: userAnnotations.value,
              algos: algos.value,
              status: annotationsOut.value[annotationInfo.value?.index]?.annotation_status
      }
    })

  const panelSize = computed(()=>{
    switch(annotation_type) {
      case 'span' :
        return 'col-span-2';
      default :
        return 'col-span-3'
    }
  })

    const layout = computed(() => {
      if(annotation_type ==='span'){
        if (isPlayerFocused.value) {
          return {
            left: 'col-span-3',
            center: 'col-span-7',
          }
        }
        // layout habituel
        return {
          left: panelSize.value,
          center: 'col-span-8',
        }
      }
      return {
        left: panelSize.value,
        center: 'col-span-7',
      }
    })

    watch(layout, () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    });



    const handleSegmentClick = (event: {tcin: string|number, index: number, fromVideo?: boolean }) => { // Lorsqu'un segment est cliqué
      if(event.index == undefined ){
        event.index = _.findIndex(locals.value,tr=>tr.tcin == event.tcin || (tr.tcin <= event.tcin && tr.tcout >= event.tcin) )
      }
      bestIndex = event.index
      scrollToSegment({bestIndex: event.index})
      if ( options.value.transcription === true ) {
        event.tcin = unixToTimestamp(event.tcin) - options.value.jump_before_offset
        moleculeAnnotationLeftPanelRef.value?.updateVideoTimecode(event)
      }
    }


    const highlightSegment = (index: number) => {
        getSelectedSegment()?.classList?.remove('selected-segment')
        moleculeAnnotationRef.value?.listRefs[index].classList.add('selected-segment')
    }

    const handleVideoTimelineClick = (event) => {
      if ( options.value.player === true && (event.bestIndex != event.lastIndex) ) {
        scrollToSegment(event)
      }
    }

    const scrollToSegment = (event : {bestIndex: number, fromHistory?: boolean, tcin?: number}) => { // Lorsque la video change de timecode
        bestIndex = event.bestIndex
        highlightSegment(event.bestIndex)
        if(!event.fromHistory) addTimecodeHistory(event.tcin ?? locals.value[event.bestIndex]?.tcin  )
        let segmentPosition =   moleculeAnnotationRef.value?.listRefs[event.bestIndex].getBoundingClientRect().top
        // Auto-scroll if the next segment is near the center of the screen
        // if the action comes from user, scroll every time
        if ((Math.abs(window.innerHeight/2 - segmentPosition)   < 200) || !event.fromHistory) {
          moleculeAnnotationRef.value?.listRefs[event.bestIndex].scrollIntoView({block: 'center', behavior: 'smooth'});
      }
    }

    const jumpToTopic = (event: {topic: number, event?: Event }) => {
      let firstTranscriptionIndex
      if(event.event?.ctrlKey){
        firstTranscriptionIndex = topics.value.findIndex((topic,index) => topics.value[index-1] == event.topic && topic != event.topic) - 1
      }
      else{
        firstTranscriptionIndex = topics.value.findIndex((topic) => topic == event.topic)
      }
      const firstTopicListIndex = topics.value.reduce((acc,topic,index)=>{
        if(_.indexOf(topics.value,topic) == index){
          acc.push(topic)
        }
        return acc
      },[] ).findIndex(topic => topic == event.topic)
      if(tabsRef.value.moleculeAnnotationRef) tabsRef.value.sentenceCarouselFunction(firstTopicListIndex)
      tabsRef.value.moleculeAnnotationRef?.carouselNavTo(firstTopicListIndex)
      moleculeAnnotationLeftPanelRef.value?.updateVideoTimecode({tcin:locals.value[firstTranscriptionIndex].tcin,tcout:locals.value[firstTranscriptionIndex].tcout,})
      moleculeAnnotationLeftPanelRef.value?.videoPlayer.seek()
      if (firstTranscriptionIndex >= 0) moleculeAnnotationRef.value.listRefs[firstTranscriptionIndex].firstElementChild.scrollIntoView({ behavior: "smooth"})
    }

  const annotationComponent = computed(() => {
    switch (annotation_type) {
      case 'segmentation':
      case 'auto-summary':
          return {component: MoleculeSegmentation, props: {
            result: result.value,
            locals: locals.value,
            colors: colors.value,
            topics: topics.value,
            tcOffset : data.value.media?.player_parameters?.tc_offset ?? 0,
            transcriptions: tabsRef.value?.moleculeAnnotationRef?.locals
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
            props: { isAnnotationEditable: isAnnotationEditable.value},
            events:{ 'on-segment-click': handleSegmentClick,
                    'update:spansChanged': (val) => {
                      spansChanged.value = val
                    }
             }
    }

  }
})

  const handleSubmit = ({ showToast = true, message = null }: { showToast?: boolean; message?: string | null })  => {
    let savingLocals
    if(annotation_type == 'auto-summary'){
      savingLocals = tabsRef.value.moleculeAnnotationRef.annotationFunction(tabsRef.value.moleculeAnnotationRef.locals)
      savingLocals = spanService.saveSpan(savingLocals)
    }
    else {
      const localSubmit = locals
      if (moleculeAnnotationRef.value.locals) localSubmit.value = moleculeAnnotationRef.value.locals
      savingLocals = moleculeAnnotationRef.value.annotationFunction(localSubmit.value)
    }
    emit('submit-annotation', { locals: savingLocals, options: { showToast, message}  })
  }

  const handleFinish = () => {
    let savingLocals
    if(annotation_type == 'auto-summary'){
      savingLocals = tabsRef.value.moleculeAnnotationRef.annotationFunction(tabsRef.value.moleculeAnnotationRef.locals)
      savingLocals = spanService.saveSpan(savingLocals)
    }
    else {
      const localSubmit = locals
      if (moleculeAnnotationRef.value.locals) localSubmit.value = moleculeAnnotationRef.value.locals
      savingLocals = moleculeAnnotationRef.value.annotationFunction(localSubmit.value)
    }
    emit('finish-annotation', { locals: savingLocals, options: {showToast: true} })
  }

  const handleSkip = () => emit('skip-annotation', { locals: {}, options: { showToast: true } })
  let autoSaveInterval = null;

   onMounted(()=>{
    autoSaveInterval = setInterval(() => {
      const lastAutoSave = new Date().toLocaleTimeString('fr-FR')
      spansChanged.value && handleSubmit({ showToast: true, message:  t('annotation.lastAutoSave', { time :lastAutoSave }) })
    }, 60 * 1000)

    window.addEventListener("keydown", globalKeydown);

    watch(()=> allFetched.value,() => {
        if(allFetched.value == true){
          videoSrc.value = annotationsIn.value[0]?.result.asset.url
          const tcOffset = data.value.media?.player_parameters?.tc_offset ?? 0;
          setTcOffset(tcOffset);
        }
    })

    watch(()=>moleculeAnnotationRef.value,(value)=>{
        if (value && annotationsOut.value.length < 1){
          handleSubmit({showToast: false})
        }
      })
  })

  onBeforeUnmount(() => {
    clearInterval(autoSaveInterval);
  });


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

  const spanService = useSpanService(true)
  provide('spanService',spanService)

  provide('plugin-config', config)

  provide('plugin-items-config', configItemPlugin)

  provide('handleSegmentClick', handleSegmentClick)

  provide('isAnnotationEditable',isAnnotationEditable)

  provide('annotation_type',annotation_type)

  provide('spans',spans)

  provide('transcriptions', transcriptions)

  provide('scrollToSegment',scrollToSegment)

  provide('jumpToTopic',jumpToTopic)

  provide('data',data)

  provide('span',{
   locals :  locals
  })

    provide('isPlayerFocused', isPlayerFocused)

  return {
    annotationInfo,
    isAdmin,
    annotationStatus,
    handleSubmit,
    handleFinish,
    handleSkip,
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
    transcriptions,
    annotationsIn,
    sortBy,
    unixToTimestamp,
    moleculeAnnotationLeftPanelRef,
    tabsProps,
    tabsRef,
    isAnnotationEditable,
    panelSize,
    getSelectedSegment,
    navigateWithkeyboard,
    globalKeydown,
    jumpToTopic,
    allow_skip,
    layout,
    t,
    abondanDialog,
    finishDialog
  }
},
})
