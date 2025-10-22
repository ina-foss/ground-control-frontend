import _ from 'lodash'
import AtomSpanTag from './AtomSpanTag.vue'
import { DisplayZone } from '~/api/generate'

export default defineNuxtComponent({
  name:"MoleculeSpanControlPanel",
  emits: ['handleNewGroup'],
  components: {AtomSpanTag},
    props: {
    isReadMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}){

    const { readPluginValues ,mainPluginIndex, recolorSpan, decolorSpan, extractTextFromSpanNodes, spanForm, spanArray, newFocus,computeColorByLabel,isForResearch , createSpanColorPalette, mainPluginId} = useSpanService()
    const { unixToTimestamp } = useService().$application

    const { pluginList } = storeToRefs(usePluginStore())
    const { getPluginList, getAllPluginOptionList } = usePluginStore()


    const groupDeleted = ref<SpanGroup | null>(null)
    const spanFilter = ref()
    const groupFilter = ref()

    const layout = ref('grid')

    const mainGroupPluginId = computed(()=>{
      return pluginList.value.find(plugin=>plugin.display_zone==DisplayZone.GROUP_MODAL)?.id
    })
    const mainGroupPluginIndex = computed(()=> readPluginValues(pluginList.value.find(p=>p.id == mainGroupPluginId.value)))

    onMounted(()=>{
      mainPluginId.value = pluginList.value.find(plugin=>plugin.display_config?.main_plugin == true)?.id
    })


    const groupIsSelected = computed(()=> newFocus?.value != null && !spanArray?.value[newFocus?.value]?.tcin)
    const groupArray = computed(()=>spanArray.value.filter(span=>{
      if(!span) return false
      return span.spans
    }).filter(span=> !groupFilter.value || _.some(span.plugins?.[mainGroupPluginIndex.value], item=> _.isEqual(item,groupFilter.value))
    ))

    const spanOnlyArray = computed(()=>
      _.difference(spanArray.value,groupArray.value)
      .filter(span=>span)
      // .filter(span=>span?.tcin && span?.tcout && span?.plugins)
      .filter(span => !spanFilter.value || _.some(span?.plugins?.[mainPluginIndex.value], item => _.isEqual(item, spanFilter.value)))
      .sort((a,b)=> unixToTimestamp(a.tcin) - unixToTimestamp(b.tcin)  )
    )
    const selectedGroup = computed((oldValue)=>{
      const group =  _.find(groupArray.value,group => group?.id == newFocus.value)
      if(group) return group
      return oldValue ?? undefined
    })

    const mainPluginName = computed(() => {
      const plugin = pluginList.value.find(plugin => plugin.id == mainPluginId.value)
      return plugin?.display_config?.label || plugin?.name
    })
    const mainGroupPluginName = computed(() => {
      const plugin = pluginList.value.find(plugin => plugin.id == mainGroupPluginId.value)
      return plugin?.display_config?.label || plugin?.name
    })


    function handleGroupClick (id: number) {
      if(newFocus.value == id) newFocus.value = undefined
      else newFocus.value = id
    }

    function previewSpanDrop (event : DragEvent) {
      const target : HTMLDivElement = event.target
      if (target.getAttribute('data-pc-name') == 'scrollpanel') return
      const previewElement = document.createElement('preview')
      previewElement.textContent = 'new span'
      previewElement.classList.add('bg-gray-200')
      target.appendChild(previewElement)
    }

    function handleCancelRemoveGroup(){
      groupDeleted.value = null
    }

    function handleRemoveGroup (targetGroup? : SpanGroup){
      if(!groupDeleted.value){
        groupDeleted.value = targetGroup
      }
      else{
        const removeId = spanArray.value.findIndex( group=> group == groupDeleted.value)
        if(removeId >= 0) spanArray.value[removeId] = undefined
        groupDeleted.value = null
        newFocus.value = undefined
      }
    }

    function unpreviewSpanDrop (event: DragEvent)  {
      const target : HTMLDivElement = event.target
      if (target.getAttribute('data-pc-name') == 'scrollpanel') return
      target.lastChild?.remove()
    }

    const dropSpan = (event : DragEvent, group, role)=>{
      recolorSpan(group)
      const target : HTMLDivElement = event.target
      target.querySelector('preview')?.remove()
      const spanId = event.dataTransfer.getData('span')
      if(!_.some(group.spans,span=>_.isEqual(span,{spanId: parseInt(spanId), role: role}))){
        group.spans = [...group.spans, {spanId: parseInt(spanId), role: role}]
      }
      decolorSpan(group)
    }

    function unlinkSpan (span:{spanId : number | string, role: {value : string, label: string } }, group: SpanGroup,){
      if(span && group){
        _.remove(group.spans,groupSpan => groupSpan == span )
      }
    }

    return {
    spanForm,
    groupArray,
    emit,
    spanArray,
    newFocus,
    groupIsSelected,
    selectedGroup,
    computeColorByLabel,
    dropSpan,
    previewSpanDrop,
    unpreviewSpanDrop,
    extractTextFromSpanNodes,
    spanOnlyArray,
    handleGroupClick,
    unixToTimestamp,
    isForResearch,
    createSpanColorPalette,
    mainPluginId,
    lodashOrder: _.orderBy,
    findKey :_.findKey,
    pluginList: getPluginList,
    mainPluginIndex,
    handleRemoveGroup,
    groupDeleted,
    spanFilter,
    pluginOptionsList : getAllPluginOptionList,
    mainPluginName,
    groupFilter,
    mainGroupPluginId,
    mainGroupPluginName,
    mainGroupPluginIndex,
    unlinkSpan,
    handleCancelRemoveGroup,
    layout
    }
  }
})
