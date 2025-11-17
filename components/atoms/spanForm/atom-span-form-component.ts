import _ from 'lodash'
import AtomPluginItemslist from "../pluginItemsList/AtomPluginItemslist.vue";
import {usePluginStore} from '~/stores/plugins'
import { toRaw } from "vue"
import {DisplayZone} from '~/api/generate'

export default defineNuxtComponent({
  name:'AtomSpanForm',
  components: {AtomPluginItemslist},
  setup(props,{expose}) {
    let currentSpanId = undefined
    const textSpan=ref()
    const visible = ref()
    const nodesCount=ref<number>()
    const suppWarning=ref("Pour créer un span de type “suppression”, seuls 2 mots doivent être sélectionnés.")
    const {getPluginList} = storeToRefs(usePluginStore())
    const { selectComponent } = usePluginStore()
    let filteredPlugins=[]
    const {readPluginValues,pluginValues,extractTextFromSpanNodes, affectPluginValues, initPluginValues, handleDeleteSpan ,reccursiveSibling ,computeColorByLabel, spanMenuSelected, labelSelected, spanArray, applySpan, defaultLabel ,newFocus,isForResearch,deletedNum, mainPluginIndex } = useSpanService()
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

    const modalHeader= computed(()=>{
      if(deleteLayout.value) return 'Confirmation de suppresion'
      return groupDisplay.value ? "Groupe : propriétés" : "Span : propriétés"
    })


    onMounted(()=>{
      initPluginValues(getPluginList.value)
    })

    function onLastSelected(value:any) {
        defaultLabel.value = value ??  textSpan.value?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
    }

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
      return Object.entries(firstObj).reduce<Record<string, string>>((acc, [dataProperty, value]) => {
        const val = Array.isArray(value) ? value[0] : value;
        if (val && typeof val === "object" && "ext_id" in val) {
          acc[dataProperty] = val.ext_id;
        }
        return acc;
      }, {})
    })

    const childPluginMap = computed(()=>{
      if(_.isEqual(extIdMap.value,{})){
        let adultPlugin = getPluginList.value.find(plugin=>plugin.available_plugins)
        return {
          [readPluginValues(adultPlugin)] : [getPluginList.value.find(plugin=> plugin.name == adultPlugin.available_plugins[""])]
        }
      }
      else{
        let result = {}
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
                  }
                  result[dataProperty].push(childrenPlugin);
                } else {
                  pluginSelected.value = pName;
                }
              }
            }
          });
        return result
      }
    })


    // watch(pluginValues, (newVal) => {
    //   pluginSelected.value = "";
    //
    //   const rawVal = toRaw(newVal);
    //   const firstObj = Array.isArray(rawVal) ? rawVal[0] ?? {} : rawVal ?? {};
    //
    //   const extIdMap =
    //   if (extIdMap) {
    //     childPluginMap.value = {};
    //
    //     console.log({extIdMap})
    //
    //   }
    // }, { deep: true });

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
    }

    function createSpan () {
      if(nodes.value.length > 0){ // real spans
        applySpan(currentSpanId)
      }
      else{ // virtual spans
        const spanId =spanArray.value.length
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
        if(deleteLayout.value) handleDeleteSpan()
        else if (isGroup.value)  createGroup()
        else createSpan()
        close()
      }
    }

    function open(args:{spanId?: number, group?: boolean, suppression?: boolean, virtual?: boolean, role: {value: string, label:string}} ){
      if (!args) return
      const {spanId,group,suppression, virtual, role} = args
      if(group) isGroup.value=group
      else isGroup.value=false
      if(role) roleSelected = role
      pluginSelected.value=''
      currentSpanId = spanId
      affectPluginValues(spanArray.value[spanId]?.plugins)
      deletedNum.value =  spanArray.value[spanId]?.deletedItems
      labelSelected.value = spanArray.value[spanId]?.type ?? []
      nodes.value = spanArray.value[spanId]?.nodes ?? []
      textSpan.value=extractTextFromSpanNodes(nodes.value)
      defaultLabel.value =  (spanArray.value[spanId]?.label ?? textSpan.value)?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
      nodesCount.value = nodes.value.length
      if(!group && !virtual){
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
      if(!spanArray.value[spanArray.value.length-1]?.plugins ) _.remove(spanArray.value,span => _.isEqual(span?.nodes, nodes.value))
      showErrorMessage.value = false
      deleteLayout.value = false
      spanMenuSelected.value = undefined
      defaultLabel.value = undefined
      initPluginValues(getPluginList.value)
      deletedNum.value = undefined
      currentSpanId = undefined
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
      handleDeleteSpan,
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
      onLastSelected,
      showErrorMessage,
      pluginChangeValue
    }
  },
})
