import _ from 'lodash'

export default defineNuxtComponent({
  name:'AtomSpanForm',
  setup(props,{expose}) {

    const visible = ref()

    const {handleDeleteSpan ,reccursiveSibling ,computeColorByLabel, spanGroupTypeOptions, spanMenuSelected, labelSelected, spanArray, applySpan, freeLabel, spanTypeOptions   } = useSpanService()
    const {$application} = useService()
    const {computeColor} = $application
    const groupDisplay = computed(()=>nodes.value.length == 0)
    const expandedContext = ref(false)

    const modalHeader= computed(()=>{
      if(deleteLayout.value) return 'Confirmation de suppresion'
      return groupDisplay.value ? "Groupe : propriétés" : "Span : propriétés"
    })


    let nodes = ref<Nodes[]>([])
    let prevNodes = ref<Nodes[]>([])
    let nextNodes = ref<Nodes[]>([])

    const deleteLayout = ref(false)


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
      applySpan(_.findIndex(spanArray.value,span=>_.isEqual(span?.nodes,nodes.value)))
    }

    function handleConfirmationButton (){
      if(deleteLayout.value) handleDeleteSpan()
      else groupDisplay.value ?  createGroup() : createSpan()
      close()
    }

    function open( nodesInput? : Array<any> | null , event? : Event,suppression : boolean = false){
      if(nodesInput){ // form de creation de span
        nodes.value = nodesInput.selection
        prevNodes.value = nodesInput.prev
        nextNodes.value = nodesInput.next
      }
      else if (event && spanMenuSelected.value != undefined) { // form de modification de span
        nodes.value = spanArray.value[spanMenuSelected.value].nodes
        labelSelected.value = spanArray.value[spanMenuSelected.value].type
        freeLabel.value = spanArray.value[spanMenuSelected.value].label
        prevNodes.value = reccursiveSibling(nodes.value[0], -20 )
        nextNodes.value = reccursiveSibling(nodes.value[nodes.value.length-1], 20 )
      }
        else if( event && spanMenuSelected.value == undefined ){ // form  de creation de groupe
      }
      else return
      deleteLayout.value = suppression
      visible.value = true
    }

    function close(){
      visible.value = false
    }

    function onClose(){
      if(!spanArray.value[spanArray.value.length-1]?.type ) _.remove(spanArray.value,span => _.isEqual(span?.nodes, nodes.value))
      deleteLayout.value = false
      spanMenuSelected.value = undefined
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
      onClose,
      expandedContext,
      expandContext,
      shrinkContext,
      handleDeleteSpan,
      deleteLayout,
      modalHeader
    }
  },
})
