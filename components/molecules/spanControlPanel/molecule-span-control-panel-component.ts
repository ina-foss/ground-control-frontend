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
    const dialogVirtualSpan = ref()
    const virtualSpanLabel = ref()

    const layout = ref('grid')

    const mainGroupPluginId = computed(()=>{
      return pluginList.value.find(plugin=>plugin.display_zone==DisplayZone.GROUP_MODAL)?.id
    })
    const mainGroupPluginIndex = computed(()=> readPluginValues(pluginList.value.find(p=>p.id == mainGroupPluginId.value)))


    const groupIsSelected = computed(()=> newFocus?.value != null && !spanArray?.value[newFocus?.value]?.tcin)

const spanOnlyArray = computed(()=>{
  return spanArray.value
    .filter(span=> (span && span.nodes) || span?.id == 0)
    .filter(span => !spanFilter.value || _.some(span?.plugins?.[mainPluginIndex.value], item => _.isEqual(item, spanFilter.value)))
    .sort((a,b)=> unixToTimestamp(a.tcin) - unixToTimestamp(b.tcin))
})

    const groupArray = computed(()=>
      spanArray.value
      .filter(span=> span && span.spans)
      .filter(span=> !groupFilter.value || _.some(span.plugins?.[mainGroupPluginIndex.value], item=> _.isEqual(item,groupFilter.value))
    ))

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
      const currentTarget : HTMLDivElement = event.currentTarget
      if (currentTarget.tagName.toLowerCase() == 'role-dropzone') {
        const previewElement = document.createElement('preview')
        previewElement.textContent = '+'
        previewElement.classList.add( 'px-2', 'py-1' , 'font-bold', 'truncate' ,'w-[80px]','border',  'rounded', 'text-center', 'border-grey-400', 'leading-4')
        currentTarget.appendChild(previewElement)
      }

    }

    function handleCancelRemoveGroup(){
      groupDeleted.value = null
    }

    function handleCreateVirtualSpan(){
      const id = spanArray.value.length
      spanArray.value[id] = {
        id: id,
        label: virtualSpanLabel.value
      }
      selectedGroup.value.spans = [...selectedGroup.value.spans,{spanId: id, role: dialogVirtualSpan.value}]
      dialogVirtualSpan.value = false
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
      const currentTarget : HTMLDivElement = event.currentTarget
      if (currentTarget.tagName.toLowerCase() == 'role-dropzone') {
        currentTarget.lastElementChild?.remove()
      }
    }

    const dropSpan = (event : DragEvent, group, category)=>{
      recolorSpan(group)
      const target : HTMLDivElement = event.currentTarget
      target.querySelector('preview')?.remove()
      const spanId = event.dataTransfer.getData('span')
      if(!_.some(group.spans,span=>_.isEqual(span,{spanId: parseInt(spanId), role: category}))){
        group.spans = [...group.spans, {spanId: parseInt(spanId), role: category}]
      }
      if(category.options?.trigger_rename){ // renommer le groupe
        group.label = spanArray.value[parseInt(spanId)].label
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
      isEqual : _.isEqual,
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
      layout,
      dialogVirtualSpan,
      virtualSpanLabel,
      createVirtualSpan : handleCreateVirtualSpan
    }
  }
})
