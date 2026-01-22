import _ from 'lodash'
import AtomPluginItemslist from "../pluginItemsList/AtomPluginItemslist.vue";
import {usePluginStore} from '~/stores/plugins'
import {DisplayZone} from '~/api/generate'
import { useI18n } from '#imports'

export default defineNuxtComponent({
  name:'AtomSpanForm',
  emits:['new-group'],
  components: {AtomPluginItemslist},
  setup(props,{emit,expose}) {

    let currentSpan : AnySpan
    const { t } = useI18n()
    const textSpan=ref()
    const visible = ref()
    const labelTitle = ref()
    const nodesCount=ref<number>()
    const suppWarning = computed(() =>
      t('spanForm.suppressionWarning')
    )
    const {getPluginList} = storeToRefs(usePluginStore())
    const { selectComponent } = usePluginStore()
    let filteredPlugins=[]
    const {readPluginValues,pluginValues,extractTextFromSpanNodes, affectPluginValues, initPluginValues, deleteSpan ,reccursiveSibling ,computeColorByLabel, spanMenuSelected, labelSelected, spanArray, applySpan, defaultLabel ,newFocus,isForResearch,deletedNum, mainPluginIndex } = useSpanService()
    const {$application} = useService()
    const tidiedPluginList = computed(()=>{
      const listPlugin= getPluginList.value
      const childIds = new Set(
          listPlugin.flatMap(plugin => plugin.children?.map(child => child.id) ?? [])
      );
       filteredPlugins = listPlugin.filter(plugin => !childIds.has(plugin.id));
      return Object.groupBy( filteredPlugins,({display_zone})=>display_zone)
    })
    const showErrorMessage = ref(false)

    const isGroup = ref<boolean>(false)
    const {computeColor} = $application
    const showContext = computed(()=>nodes.value.length == 0)
    const groupDisplay = computed(()=>isGroup.value)
    const expandedContext = ref(false)
    const isVirtualSpan = ref(false)
    const selectedGroupValue = ref()
    const mainGroupPluginIndexValue = ref()
    const virtualSpanCategory = ref('')

    const unauthorizedVirtualSpan = ref(false)
    const authorizedTypeList = ref<string[]>([])

    const modalHeader= computed(()=>{
      if(deleteLayout.value) return t('spanForm.deleteHeader')
      if(isVirtualSpan.value) return t('spanForm.virtualSpan.virtualSpanHeader')
      return groupDisplay.value ? t('spanForm.groupHeader') : t('spanForm.spanHeader')
    })


    onMounted(()=>{
      initPluginValues(getPluginList.value)
    })


    function pluginChangeValue(plugin: PluginWithIdDto,event){
      if( (plugin.display_config.main_plugin || groupDisplay.value ) && event.length != 0 && event[0] != null   ) showErrorMessage.value = false
      else if( (plugin.display_config.main_plugin || groupDisplay.value) && ( event.length == 0 || event[0] == null)) showErrorMessage.value = true
    }

    let nodes = ref<Nodes[]>([])
    let prevNodes = ref<Nodes[]>([])
    let nextNodes = ref<Nodes[]>([])

    const deleteLayout = ref(false)
    let roleSelected = null
    let pluginSelected=ref('');

    const extIdMap = computed(()=>{
      const newVal = pluginValues
      const firstObj = Array.isArray(newVal) ? newVal[0] ?? {} : newVal ?? {};
      const result = Object.entries(firstObj).reduce<Record<string, string>>((acc, [dataProperty, value]) => {
        const val = Array.isArray(value) ? value[0] : value;
        acc[dataProperty] = "";
        if (val && typeof val === "object" && "ext_id" in val) {
          acc[dataProperty] = val.ext_id;
        }
        return acc;
      }, {})
      return result
    })


    const childPluginMap = computed(()=>{
      const result = {}
      Object.entries(extIdMap.value).forEach(([dataProperty, extId]) => {
        const usedPlugin = getPluginList.value?.find(
          plugin =>{
            return readPluginValues(plugin) === dataProperty
          }
        );
        if (usedPlugin?.available_plugins && usedPlugin.children?.length !== 0) {
          const pName = (usedPlugin.available_plugins as Record<string, any>)[extId];
          if (pName) {
            const childrenPlugin = getPluginList.value?.find(plugin => plugin.name === pName);
            if (childrenPlugin) {
              if (!result[dataProperty]) {
                result[dataProperty] = [];
                pluginSelected.value = "";
              }
              result[dataProperty].push(childrenPlugin);
            } else {
              pluginSelected.value = pName;
            }
          }
          else{
            pluginSelected.value = "";
          }
        }
      });
      return result
    })

    const showLabelInput = computed(() => {
      if(!isForResearch.value) {
        if (!mainPluginIndex.value) return true
        const selected = pluginValues[mainPluginIndex.value]?.[0]
        if (!selected || selected.editable ==="") return false
        labelTitle.value=selected.editable
        if(selected){
          if(spanArray.value[currentSpanId].label && spanArray.value[currentSpanId].label !== "")defaultLabel.value=spanArray.value[currentSpanId].label
          else {
            defaultLabel.value=selected.copyable ==='false'? "":(textSpan.value)?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()

          }
        }


      }
      return true
    })

    function expandContext() {
      expandedContext.value = true
    }

    function shrinkContext() {
      expandedContext.value = false
    }

    function createGroup() {
      const spanId = spanArray.value.length
      let spanGroup = {
        plugins: _.cloneDeep(pluginValues),
        id : spanId,
        label: defaultLabel.value,
        spans: [],
      }
      spanArray.value[spanId]=spanGroup
      defaultLabel.value = null
      emit('new-group',{groupId: spanId})
    }

    function createSpan () {
      if(nodes.value.length > 0){ // real spans
        applySpan(currentSpan)
        spanArray.value[currentSpan.id] = currentSpan
      }
      else{ // virtual spans
        /*const category = virtualSpanCategory.value
        const mainDataProperty = Object.keys(pluginValues)[0]
        const spanType =pluginValues[mainDataProperty]?.[0]?.label

        const authorizedTypes = category?.authorized_types

        const isAuthorized = !authorizedTypes || authorizedTypes.includes(spanType)

        if (!isAuthorized) {
          authorizedTypeList.value = authorizedTypes
          unauthorizedVirtualSpan.value = true
          return false
        }*/
        const spanId =spanArray.value.length
        /*const spanId =spanArray.value.length
        spanArray.value[spanId] = {
          id: spanId,
          label: defaultLabel.value
        }
        selectedGroupValue.value.spans = [...selectedGroupValue.value.spans,{spanId: spanId, role: virtualSpanCategory.value}]
        virtualSpanCategory.value = false
        defaultLabel.value=null
      }
      return true*/
        const span = {
          id: spanId,
          plugins: _.cloneDeep(pluginValues),
          deletedItems: deletedNum.value,
          label: defaultLabel.value
        }
        spanArray.value[spanId] = span
        const group = spanArray.value[newFocus.value]
        defaultLabel.value = null
        group.spans = [...group.spans, {spanId : spanId.toString(),  role: roleSelected}]
      }

    }

    /**
     * Callback after clicking on the "Confirmed" button
     */
    function handleConfirmationButton (){
      if (
        // validation for span case (with mainPlugin only)
        ( mainPluginIndex.value && !groupDisplay.value && (pluginValues[mainPluginIndex.value].length == 0 || !pluginValues[mainPluginIndex.value][0] ) ) ||
        // validation for group case (check every plugin in the form)
        groupDisplay.value && tidiedPluginList.value[DisplayZone.GROUP_MODAL]?.every( groupPlugin =>
          pluginValues[readPluginValues(groupPlugin)].length == 0 ||
          pluginValues[readPluginValues(groupPlugin)][0]?.id == ''
        )
      ) showErrorMessage.value = true
      else{
        showErrorMessage.value = false
        let success = true // pour ouvrir la popup d'erreur dans la modale
        if (deleteLayout.value) {
          deleteSpan(currentSpan)
        } else if (isGroup.value) {
          createGroup()
        } else {
          success = createSpan()
        }

        if (success) {
          close()
        }
      }
    }

    /**
      * Open the span form in a Primevue Dialog
      * @param span Object whose parameters will be dispay in the form.
      * @param suppression If true, the form will ask whether or not you want to delete the {span}
      */
    function open(args:{span: Span, suppression?: boolean,  role: {value: string, label:string}} ){
      if (!args || !args.span) return
      const {span, suppression, role} = args
      currentSpan = span
      isGroup.value= isSpanGroup(span)
      if(role) roleSelected = role
      pluginSelected.value=''
      affectPluginValues(span.plugins)
      deletedNum.value =  span.deletedItems
      // labelSelected.value = spanArray.value[spanId]?.type ?? []
      nodes.value = span.nodes ?? []
      textSpan.value=extractTextFromSpanNodes(nodes.value)
      defaultLabel.value =  (span.label == "" ? textSpan.value : span.label )?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
      nodesCount.value = nodes.value.length
      if(isSpan(span)){
        prevNodes.value = reccursiveSibling(nodes.value[0], -20 )
        nextNodes.value = reccursiveSibling(nodes.value[nodes.value.length-1], 20 )
      }
      if(suppression) deleteLayout.value = suppression
      visible.value = true
    }

    function close(){
      visible.value = false
    }

    function onClose(){
      showErrorMessage.value = false
      deleteLayout.value = false
      spanMenuSelected.value = undefined
      defaultLabel.value = undefined
      initPluginValues(getPluginList.value)
      deletedNum.value = undefined
      nodes.value = []
    }

    expose({open})

    return {
      computeColorByLabel,
      visible,
      labelSelected,
      handleConfirmationButton,
      createSpan,
      nodes,
      prevNodes,
      nextNodes,
      close,
      computeColor,
      defaultLabel,
      groupDisplay,
      showContext,
      onClose,
      expandedContext,
      expandContext,
      shrinkContext,
      deleteSpan,
      deleteLayout,
      modalHeader,
      isForResearch,
      deletedNum,
      nodesCount,
      suppWarning,
      tidiedPluginList,
      selectComponent,
      pluginValues,
      pluginSelected,
      childPluginMap,
      textSpan,
      readPluginValues,
      showErrorMessage,
      pluginChangeValue,
      extractTextFromSpanNodes,
      selectedGroupValue,
      mainGroupPluginIndexValue,
      virtualSpanCategory,
      isVirtualSpan,
      unauthorizedVirtualSpan,
      authorizedTypeList,
      showLabelInput,
      labelTitle,
      getPluginList,
      t
    }
  },
})
