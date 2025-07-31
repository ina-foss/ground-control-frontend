import _ from 'lodash'

export default defineNuxtComponent({
  name:"AtomSpanControlPanel",
  emits: ['handleNewGroup'],
  setup(props, {emit}){

    const { extractTextFromSpanNodes, spanForm, applySpan, spanArray, newFocus,computeColorByLabel, spanGroupTypeOptions, spanTypeOptions,isForResearch } = useSpanService()
    const { unixToTimestamp } = useService().$application


    const groupIsSelected = computed(()=> newFocus?.value != null && !spanArray?.value[newFocus?.value]?.tcin)
    const groupArray = computed(()=>spanArray.value.filter(span=>{
      if(!span) return false
      return span.spans
    }) )
    const spanOnlyArray = computed(()=>
      _.difference(spanArray.value,groupArray.value)
      .filter(span=>span?.type)
      .sort((a,b)=> unixToTimestamp(a.tcin) - unixToTimestamp(b.tcin)  )
    )
    const selectedGroup = computed((oldValue)=>{
      const group =  _.find(groupArray.value,group => group?.id == newFocus.value)
      if(group) return group
      return oldValue ?? undefined
    })

    function handleGroupClick (id: number) {
      newFocus.value = id
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
      const target : HTMLDivElement = event.target
      target.querySelector('preview')?.remove()
      const spanId = event.dataTransfer.getData('span')
      group.spans = [...group.spans, {spanId: parseInt(spanId), role: role}]
      applySpan(parseInt(spanId))
    }


    function getMinSizeText(span: any){
      const tempDiv =  document.createElement('div')
      tempDiv.classList.add('w-auto', 'p-1', 'rounded', 'border-4', 'inline-block', 'text-xs/3', 'h-fit', 'text-center')
      tempDiv.innerText = span.type?.label
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
    spanGroupTypeOptions,
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
    }
  }
})
