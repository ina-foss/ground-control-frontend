import _, { every } from 'lodash'
import AtomSpanTag from './AtomSpanTag.vue'
import { DisplayZone } from '~/api/generate'

export default defineComponent({
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

    const { readPluginValues ,mainPluginIndex, recolorSpan, decolorSpan, extractTextFromSpanNodes, spanForm, spanArray, newFocus,computeColorByLabel,isForResearch , createSpanColorPalette, mainPluginId,createdPluginOptionsList} = useSpanService()
    const { unixToTimestamp } = useService().$application

    const { pluginList } = storeToRefs(usePluginStore())
    const { getPluginList, getAllPluginOptionList } = usePluginStore()


    const groupDeleted = ref<SpanGroup | null>(null)
    const unauthorizedSpanDropped = ref(false);
    const authorizedGroupList = ref("");
    const spanFilter = ref()
    const groupFilter = ref()
    const spanLinkFilter = ref()
    const dialogVirtualSpan = ref()
    const virtualSpanLabel = ref()

    const layout = ref('grid')

    const mainGroupPluginId = computed(()=>{
      return pluginList.value.find(plugin=>plugin.display_zone==DisplayZone.GROUP_MODAL)?.id
    })
    const mainGroupPluginIndex = computed(()=> readPluginValues(pluginList.value.find(p=>p.id == mainGroupPluginId.value)))
    const groupIsSelected = computed(()=> newFocus?.value != null && !spanArray?.value[newFocus?.value]?.tcin)

    const groupLayoutSytle= computed(()=>
      layout.value == 'grid' ? 'repeat(auto-fit,minmax(150px,1fr))' : 'repeat(1fr)'
    )

    const spanOnlyArray = computed(()=>{
      return spanArray.value
        .filter((span: Span) => (span && span.nodes))
        .filter((span: Span) => !spanFilter.value || _.some(span?.plugins?.[mainPluginIndex.value], item => _.isEqual(item, spanFilter.value)))
        .filter((span: Span) => !spanLinkFilter.value ||
          (spanLinkFilter.value.value == 'linked' &&  _.some(groupArray.value.map(group=>group.spans),spanGroupArray=>{
            return _.some(spanGroupArray,spanGroup => spanGroup.spanId == span.id)  } ) ) ||
          (spanLinkFilter.value.value == 'unlinked' && groupArray.value.map(group=>group.spans).every(spanGroupArray =>{
            return every(spanGroupArray ,spanGroup=> spanGroup.spanId != span.id) } ) )
        )
        .sort((a,b)=> unixToTimestamp(a.tcin) - unixToTimestamp(b.tcin))
    })

    const spanNone = computed(()=>
        spanArray.value.filter(span=>span && span.id == 0).pop()
      )

    const groupArray = computed(()=>{
      return spanArray.value
      .filter(span=> span && span.spans)
      .filter(span=> !groupFilter.value || _.some(span.plugins?.[mainGroupPluginIndex.value], item=> item.id == groupFilter.value.id)
    )})

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

      if (currentTarget.tagName.toLowerCase() == 'role-dropzone' && event.dataTransfer.getData('span') ) {
        const previewElement = document.createElement('preview')
        previewElement.textContent = '+'
        previewElement.classList.add( 'px-2', 'py-1' , 'font-bold', 'truncate' ,'w-[80px]','border',  'rounded', 'text-center', 'border-grey-400', 'leading-4')
        currentTarget.appendChild(previewElement)
      }

    }

    function handleCancelRemoveGroup(){
      groupDeleted.value = null
    }

    function switchGroupLayout(newLayout: string){
      if(layout.value != newLayout) layout.value = newLayout
    }


    function whichCategoryTriggerRename(group ){
      if (group){
        return  group.plugins?.[mainGroupPluginIndex.value]?.[0].categories.find(el=>el.options?.trigger_rename)?.label
      }
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
      if (currentTarget.tagName.toLowerCase() == 'role-dropzone' && event.dataTransfer.getData('span') ) {
        currentTarget.lastElementChild?.remove()
      }
    }

    const dropSpan = (event : DragEvent, group, category)=>{
      recolorSpan(group)
      const target : HTMLDivElement = event.currentTarget
      target.querySelector('preview')?.remove()
      const spanId = event.dataTransfer.getData('span')
      if (spanId){
        const span = spanArray.value.find(span=>span?.id == parseInt(spanId))
        if(span?.plugins?.research_entity_type?.[0].label || span?.label ==""){
          const isAuthorized = category?.authorized_types?.includes(span?.plugins?.research_entity_type?.[0].label);

          if(isAuthorized || span?.label =="" || category?.authorized_types == undefined){
            if(!_.some(group.spans,span=>_.isEqual(span,{spanId: parseInt(spanId), role: category}))){
              group.spans = [...group.spans, {spanId: parseInt(spanId), role: category}]
            }
            decolorSpan(group)
          }
          else{
            authorizedGroupList.value=category?.authorized_types
            unauthorizedSpanDropped.value=!isAuthorized
          }
        }
      }
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
      createVirtualSpan : handleCreateVirtualSpan,
      spanNone,
      spanLinkFilter,
      switchGroupLayout,
      groupLayoutSytle,
      createdPluginOptionsList,
      whichCategoryTriggerRename,
      unauthorizedSpanDropped,
      authorizedGroupList
    }
  }
})
