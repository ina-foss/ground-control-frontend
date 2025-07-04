import _ from 'lodash'

export default defineNuxtComponent({
  name:"AtomSpanControlPanel",
  emits: ['handleNewGroup'],
  setup(props, {emit}){

    const { dropSpan, spanArray, newFocus,computeColorByLabel, spanGroupTypeOptions, spanTypeOptions} = inject('spanService')


    const groupIsSelected = computed(()=> newFocus.value != null && !spanArray.value[newFocus.value].tcin)
    const groupArray = computed(()=>spanArray.value.filter(span=>{
      if(!span) return false
      return !span.tcin
    }) )
    const spanOnlyArray = computed(()=>_.difference(spanArray.value,groupArray.value).filter(span=>span?.type))
    const selectedGroup = ref()
    watch(()=>newFocus.value,(focus)=>{
     const group =  _.find(groupArray.value,group => group?.id == focus)
      selectedGroup.value = group ?? selectedGroup.value

    })

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

    function extractTextFromSpanNodes (nodesArray: Array<Node>[]){
      return nodesArray.map(node=>document.evaluate('text()', node, null, XPathResult.STRING_TYPE).stringValue).join(' ')
    }



    return {
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
    spanOnlyArray
    }
  }
})
