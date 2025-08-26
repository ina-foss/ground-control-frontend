import _ from 'lodash'
import AtomPluginItemslist from "../pluginItemsList/AtomPluginItemslist.vue";
import {usePluginStore} from '~/stores/plugins'
import type {PluginAutocompleteValueDTO} from "~/api/generate"


export default defineNuxtComponent({
  name:'AtomSpanForm',
  components: {AtomPluginItemslist},
  setup(props,{expose}) {

    const visible = ref()
    const nodesCount=ref<number>()
    const suppWarning=ref("Pour créer un span de type “suppression”, seuls 2 mots doivent être sélectionnés")
    const {getPluginList} = storeToRefs(usePluginStore())
    const { selectComponent } = usePluginStore()

    const {pluginValues, affectPluginValues, initPluginValues, handleDeleteSpan ,reccursiveSibling ,computeColorByLabel, spanGroupTypeOptions, spanMenuSelected, labelSelected, spanArray, applySpan, freeLabel, spanTypeOptions ,newFocus,isForResearch,deletedNum  } = useSpanService()
    const {$application} = useService()

    const tidiedPluginList = computed(()=>{
      return Object.groupBy(getPluginList.value,({display_zone})=>display_zone)
    })

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

    let nodes = ref<Nodes[]>([])
    let prevNodes = ref<Nodes[]>([])
    let nextNodes = ref<Nodes[]>([])

    const deleteLayout = ref(false)
    let roleSelected = null
    let pluginSelected=ref('');
    watch(pluginValues, (newVal) => {

      const selected = Object.values(newVal).find(
        (plugin: any) => plugin?.ext_id === 'suppr'
      )
      pluginSelected.value = selected?.ext_id || ''
    }, { deep: true })

    function expandContext() {
      expandedContext.value = true
    }

    function shrinkContext() {
      expandedContext.value = false
    }

    function createGroup() {
      const spanId = spanArray.value.length
      let spanGroup = {
        type : labelSelected.value,
        id : spanId,
        label: freeLabel.value,
        spans: [],
      }
      spanArray.value[spanId]=spanGroup
      freeLabel.value = null
    }

    function createSpan () {
      if(nodes.value.length > 0){ // real spans
        applySpan(_.findIndex(spanArray.value,span=>_.isEqual(span?.nodes,nodes.value)) )
      }
      else{ // virtual spans
        const spanId =spanArray.value.length
        const span = {
          id: spanId,
          plugins: _.cloneDeep(pluginValues),
          type: labelSelected.value,
          label: freeLabel.value,
          deletedItems: deletedNum.value,
        }
        spanArray.value[spanId] = span
        const group = spanArray.value[newFocus.value]
        group.spans = [...group.spans, {spanId : spanId.toString(),  role: roleSelected}]
      }

    }

    function handleConfirmationButton (){
      if(deleteLayout.value) handleDeleteSpan()
      else if (isGroup.value)  createGroup()
      else createSpan()
      close()
    }

    function open(args:{spanId?: number, group?: boolean, suppression?: boolean, virtual?: boolean, role: {value: string, label:string}} ){
      if (!args) return
      const {spanId,group,suppression, virtual, role} = args
      if(group) isGroup.value=group
      else isGroup.value=false
      if(role) roleSelected = role
      pluginSelected.value=''
      affectPluginValues(spanArray.value[spanId]?.plugins)
      freeLabel.value =  spanArray.value[spanId]?.label
      deletedNum.value =  spanArray.value[spanId]?.deletedItems
      labelSelected.value = spanArray.value[spanId]?.type ?? []
      nodes.value = spanArray.value[spanId]?.nodes ?? []
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
      if(!spanArray.value[spanArray.value.length-1]?.type ) _.remove(spanArray.value,span => _.isEqual(span?.nodes, nodes.value))
      deleteLayout.value = false
      spanMenuSelected.value = undefined
      freeLabel.value = undefined
      initPluginValues(getPluginList.value)
      deletedNum.value = undefined
      nodes.value = []
    }

    expose({open})


    return {
      spanGroupTypeOptions,
      computeColorByLabel,
      visible,
      spanTypeOptions,
      labelSelected,
      handleConfirmationButton,
      createSpan,
      nodes,
      prevNodes,
      nextNodes,
      close,
      computeColor,
      freeLabel,
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
      pluginSelected
    }
  },
})
