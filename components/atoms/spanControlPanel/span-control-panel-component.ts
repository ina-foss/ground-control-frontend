import _, { sortBy } from 'lodash'

export default defineNuxtComponent({
  name:"AtomSpanControlPanel",
  emits: ['handleNewGroup'],
  setup(props, {emit}){

    const { mainPluginIndex, recolorSpan, decolorSpan, extractTextFromSpanNodes, spanForm, spanArray, newFocus,computeColorByLabel, spanTypeOptions,isForResearch , createSpanColorPalette, mainPluginId, pluginValues} = useSpanService()
    const { unixToTimestamp } = useService().$application

    const { pluginList } = storeToRefs(usePluginStore())


    onMounted(()=>{
      mainPluginId.value = pluginList.value.find(plugin=>plugin.display_config?.main_plugin == true)?.id
    })

    const groupIsSelected = computed(()=> newFocus?.value != null && !spanArray?.value[newFocus?.value]?.tcin)
    const groupArray = computed(()=>spanArray.value.filter(span=>{
      if(!span) return false
      return span.spans
    }) )
    const spanOnlyArray = computed(()=>
      _.difference(spanArray.value,groupArray.value)
      .filter(span=>span?.tcin && span?.tcout && span?.plugins)
      .sort((a,b)=> unixToTimestamp(a.tcin) - unixToTimestamp(b.tcin)  )
    )
    const selectedGroup = computed((oldValue)=>{
      const group =  _.find(groupArray.value,group => group?.id == newFocus.value)
      if(group) return group
      return oldValue ?? undefined
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
      group.spans = [...group.spans, {spanId: parseInt(spanId), role: role}]
      decolorSpan(group)
    }



    function getMinSizeText(span: any){
      const tempDiv =  document.createElement('div')
      tempDiv.classList.add('w-auto', 'p-1', 'rounded', 'border-4', 'inline-block', 'text-xs/3', 'h-fit', 'text-center')
      tempDiv.innerText = span.plugins[`plugin-${mainPluginId.value}`]?.[0]?.label ?? " "
      document.body.appendChild(tempDiv)
      const width = tempDiv.getBoundingClientRect().width
      document.body.removeChild(tempDiv)
      return width
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
    spanTypeOptions,
    spanOnlyArray,
    getMinSizeText,
    handleGroupClick,
    unixToTimestamp,
    isForResearch,
    createSpanColorPalette,
    mainPluginId,
    lodashOrder: _.orderBy,
    findKey :_.findKey,
    pluginList,
    mainPluginIndex
    }
  }
})
