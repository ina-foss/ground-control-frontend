import _, {isEqual} from 'lodash'
import AtomPluginItemslist from "../pluginItemsList/AtomPluginItemslist.vue";
import {usePluginStore} from '~/stores/plugins'
import {DisplayZone} from '~/api/generate'
import { useI18n } from '#imports'
import AtomDialogFilterGroup from "~/components/atoms/dialogFilterGroup/atom-dialog-filter-group-component";
import { cleanText } from '~/utils/span';


export default defineNuxtComponent({
  name:'AtomSpanForm',
  methods: {isEqual},
  components: {AtomDialogFilterGroup, AtomPluginItemslist},
  emits:['new-group','update:spansChanged'],
  setup(props,{emit,expose}) {

    const currentSpan = ref<AnySpan | undefined>()
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


    const showContext = computed(()=>nodes.value.length == 0)
    const isGroup = computed(()=>isSpanGroup(currentSpan.value))
    const expandedContext = ref(false)
    const isVirtual = computed(()=>isVirtualSpan(currentSpan.value))
    const selectedGroupValue = ref()
    const mainGroupPluginIndexValue = ref()
    const virtualSpanCategory = ref('')

    const unauthorizedVirtualSpan = ref(false)
    const authorizedTypeList = ref<string[]>([])

    const modalHeader= computed(()=>{
      if(deleteLayout.value) return t('spanForm.deleteHeader')
      if(isVirtual.value) return t('spanForm.virtualSpan.virtualSpanHeader')
      return isGroup.value ? t('spanForm.groupHeader') : t('spanForm.spanHeader')
    })


    onMounted(()=>{
      initPluginValues(getPluginList.value)
    })


    function pluginChangeValue(plugin: PluginWithIdDto,event){
      if( (plugin.display_config.main_plugin || isGroup.value || plugin.display_config.required_value ) && event.length != 0 && event[0] != null   ) showErrorMessage.value = false
      else if( (plugin.display_config.main_plugin || isGroup.value || plugin.display_config.required_value ) && ( event.length == 0 || event[0] == null)) showErrorMessage.value = true
    }

    const nodes = ref<Nodes[]>([])
    const prevNodes = ref<Nodes[]>([])
    const nextNodes = ref<Nodes[]>([])

    const deleteLayout = ref(false)
    const pluginSelected=ref('');

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
          if(currentSpan.value?.label && currentSpan.value.label !== "")defaultLabel.value=currentSpan.value?.label
          else {
            defaultLabel.value=selected.copyable ==='false'? "":cleanText(textSpan.value)

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
      const spanGroup = {
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
        spanArray.value[currentSpan.value.id] = currentSpan.value
        applySpan(currentSpan.value)
      }
    }
    function createSpanVirtuel(){
      const category = virtualSpanCategory.value
      const spanType =pluginValues[mainPluginIndex.value]?.[0]?.label
      const authorizedTypes = category?.authorized_types
      const isAuthorized = !authorizedTypes || authorizedTypes.includes(spanType)

      if (!isAuthorized) {
        authorizedTypeList.value = authorizedTypes
        unauthorizedVirtualSpan.value = true
        throw {}

      }
      //update label with user input
      if(currentSpan.value)
      {
        currentSpan.value.label = defaultLabel.value
        currentSpan.value.plugins = _.cloneDeep(pluginValues)

      }
      const index = selectedGroupValue.value.spans.findIndex(
        s => s.spanId === currentSpan.value.id
      )

      if (index !== -1) {// edit virtual span
        selectedGroupValue.value.spans.splice(index, 1, {
          spanId: currentSpan.value.id,
          role: virtualSpanCategory.value
        })
      } else {//add new
        selectedGroupValue.value.spans.push({
          spanId: currentSpan.value.id,
          role: virtualSpanCategory.value
        })
      }
      virtualSpanCategory.value = false
      defaultLabel.value=null
      spanArray.value[currentSpan.value.id] = currentSpan.value

    }

    /**
     * Callback after clicking on the "Confirmed" button
     */
    function handleConfirmationButton (){
      if(currentSpan.value) currentSpan.value.plugins = _.cloneDeep(pluginValues)
      showErrorMessage.value = false

      // When delete modal, don't check for validation
      if (deleteLayout.value) {
        deleteSpan(currentSpan.value)
      }
      else if (
        //validation for virtual span case (check every plugin in the form with label)
        (isVirtual.value && (!virtualSpanCategory.value ||  !defaultLabel.value) )
       ||
        // validation for group case (check every plugin in the form)
        isGroup.value && tidiedPluginList.value[DisplayZone.GROUP_MODAL]?.every( groupPlugin =>
          pluginValues[readPluginValues(groupPlugin)].length == 0 ||
          pluginValues[readPluginValues(groupPlugin)][0]?.id == ''
        )
        ||
        // validation for span case (with mainPlugin only)
        // ( mainPluginIndex.value && !isGroup.value && (pluginValues[mainPluginIndex.value].length == 0 || !pluginValues[mainPluginIndex.value][0] ) )
        // ||
        !Object.values(checkPluginValues()).every(value=>value)
        ||
        // validation for deletedNum when isForResearch is false (with suppression plugin selected)
        (!isForResearch.value && childPluginMap.value &&  pluginSelected.value !== '' && (nodesCount.value > 1
          || !deletedNum.value || deletedNum.value === 0))
      ) {
        showErrorMessage.value = checkPluginValues()
      }
      else{
        if (isGroup.value) {
          createGroup()
        } else if(isVirtual.value){
          createSpanVirtuel()
        }
          else {
          createSpan()
        }
          emit('update:spansChanged', true)
          close()
      }

      // Close the modal if no error
      if(!showErrorMessage.value) close()
    }

    function checkPluginValues(){
     const result =  tidiedPluginList.value[isGroup.value ? 'group_modal' : 'span_modal_left']?.reduce((acc,plugin) => {
        const pluginCheck = ( !plugin.display_config?.required_value && !plugin.display_config?.main_plugin) || isGroup.value  ||  Boolean(pluginValues[readPluginValues(plugin)]?.length )
        acc[plugin.name] = pluginCheck // store check value for main plugins
        plugin.children?.filter(child=>plugin.available_plugins?.[pluginValues[readPluginValues(plugin)]?.[0]?.ext_id] == child.name).forEach((child)=>{
         const childCheck = !child.display_config?.required_value ||  Boolean(pluginValues[readPluginValues(child)].length)
         acc[child.name] = childCheck // store check value for current child plugin
        })
        return acc
      },{})

      return result

    }

    /**
      * Open the span form in a Primevue Dialog
      * @param span Object whose parameters will be dispay in the form.
      * @param suppression If true, the form will ask whether or not you want to delete the {span}
      */
    function open(args:{span: Span, suppression?: boolean,  role: {value: string, label:string},selectedGroup?:any,mainGroupPluginIndex?:number} ){
      if (!args || !args.span) return
      const {span, suppression, role,selectedGroup,mainGroupPluginIndex} = args
      currentSpan.value = span
      selectedGroupValue.value=selectedGroup
      mainGroupPluginIndexValue.value=mainGroupPluginIndex
      if(role) virtualSpanCategory.value=role.value
      pluginSelected.value=''
      affectPluginValues(span.plugins)
      deletedNum.value =  span.deletedItems
      // labelSelected.value = spanArray.value[spanId]?.type ?? []
      nodes.value = span.nodes ?? []
      textSpan.value=extractTextFromSpanNodes(nodes.value)
      defaultLabel.value =  cleanText(span?.label ?? textSpan.value)
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
      virtualSpanCategory.value = undefined
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
      isGroup,
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
      isVirtual,
      unauthorizedVirtualSpan,
      authorizedTypeList,
      showLabelInput,
      labelTitle,
      getPluginList,
      t
    }
  },
})
