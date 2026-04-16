import {DisplayZone} from "~/api/generate"
import MoleculePlugins from "~/components/molecules/plugins/MoleculePlugins.vue"
import _ from "lodash"

export default defineComponent({
  name: "AtomSegmentForm",
  emits: ['create:segment'],
  components:{MoleculePlugins},
  setup(props, {emit,expose} ) {

    const {t} = useI18n()
    const {$application} = useService()
    const {timestampToUnix} = $application
    const isOpen = ref(false)
    const currentSegment = ref(null)
    const showErrorMessage = ref(false)
    const pluginComponent = ref()
    const {pluginValues,affectPluginValues} = useSpanService()

    function open(segment){
      isOpen.value = true
      currentSegment.value = segment
      affectPluginValues(segment.plugins)
    }

    function handleConfirmationButton(){
      showErrorMessage.value = pluginComponent.value.checkPluginValues()
      if(!showErrorMessage.value || Object.values(showErrorMessage.value).every(v=>v) ){
        isOpen.value =false
        emit('create:segment',{...currentSegment.value,plugins:_.cloneDeep(pluginValues)})
      }
    }

    function onClose(){
      showErrorMessage.value = false
    }


    expose({open})

    return {
      isOpen,
      DisplayZone,
      handleConfirmationButton,
      showErrorMessage,
      pluginComponent,
      currentSegment,
      timestampToUnix,
      onClose,
      t
    }
  },
})
