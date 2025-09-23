import _ from 'lodash'
import { PluginConfigType, TypePlugin } from '~/api/generate'
import {useOptions} from '~/stores/annotation-options'

let spanServiceInstance : ReturnType<typeof createSpanService> | null = null

 function createSpanService (){


const {options} = useOptions()

const { $application } = useService()
const { hexToRgba,computeColorByLabel,computeColor} = $application
const spanMenu = ref()
const op = ref()
const isForResearch= ref(true)
const {pluginList, pluginOptionsList} = storeToRefs(usePluginStore())


  const spanClicked = ref(false)
  const spanArray = ref<Array<Span | SpanGroup | VirtualSpan | null>>([])
  const linkMode = ref(false)
  const currentFocus = ref<number | undefined>(undefined)
  const spanCount = computed<number>(()=>spanArray.value.length)
  const newFocus = ref<number | undefined>()
  const spanMenuSelected = ref<number | undefined>(undefined)
  const mainPluginId = ref<undefined | number>() // Id du plugin servant à coloriser les spans
  const labelSelected = ref([])
  const freeLabel = ref()
  const deletedNum=ref<number>()
  const spanForm = ref()
  const dragData = reactive<{pin_position: string | undefined, spanid: number | undefined}>({
    pin_position : undefined,
    spanid : undefined,
  })
  const contextMenuOptions = ref([{label: 'Editer les proprietes', command: ()=>spanForm.value?.open({spanId:spanMenuSelected.value})},{id:1, label:'Editer les bornes', command:event=>showDragPin()},{id:2, label: 'Supprimer', command: (event)=>spanForm.value?.open({spanId:spanMenuSelected.value,suppression: true}) }])
  let spanTypeOptions =ref( [
    {value: 'function',label:'Fonction'},
    {value: 'verb', label:'Verbe'},
    {value: 'directCitation', label: 'Citation directe'},
    {value: 'physicalPerson', label: 'Personne physique'},
    {value: 'indirectPerson', label: 'Citation indirecte'},
    {value: 'pronoun', label: 'Pronom'},
    {value: 'geographic', label: 'Lieu géographique'},
  ])
  const spanTypeList =ref( [
    {value: 'en',label:'Entités nommées'},
    {value: 'suppr', label:'Suppressions'},
    {value: 'insert', label: 'Insertions'},
    {value: 'inv', label: 'Contre sens'},
  ])

  type pluginValues= Record<string,PluginAutocompleteValueDTO[]>
  let pluginValues = reactive<pluginValues>({})

  watch(
    ()=>mainPluginId.value,
    ()=> {
      spanArray.value.forEach(span=>{
        if(span){
          affectPluginValues(span.plugins)
          if (span.tcin) applySpan(span.id)
        }
      })
    },
    {immediate: false}
  )

  function initPluginValues (iterator){
    iterator.forEach(plugin=>{
      pluginValues[`plugin-${plugin.id}`] = [] // Creation des variables utilisee en tant qu'input
    })
  }

  function affectPluginValues(values : pluginValues){
   if(values){
      Object.assign(pluginValues,values)
    }
  }


   const setDisableGroup = (disable_group:boolean|false) => {
       isForResearch.value=!disable_group
   }

   watch(isForResearch, (newValue) => {
     spanTypeOptions.value = newValue ? spanTypeOptions.value : spanTypeList.value
   })

   const spanGroupTypeOptions = ref([
    {value: 'citation', label: 'Citation', roles: ['source', 'indice', 'citation']},
    {value: 'entity', label: 'Entitee nommee', roles: ['primaire','secondaire']},
  ])

  function rgbaToShadow(color: string) {
    return `${color} 0px 0px 0px 1000px inset`
  }

  function removeSpanFromDOM(spanId: number){
    const span = spanArray.value[spanId]
    let tag = document.querySelector(`tag[spanid="${spanId}"]`)
    if( tag ) tag.remove()
    if(span.nodes){
      span.nodes.forEach((node: HTMLDivElement)=>{
        node.querySelectorAll('border').forEach(border=>border.remove())
        node.querySelectorAll(`bg${spanId}`).forEach(border=>border.remove())
        node.querySelectorAll('pinWrapper').forEach(pin=>pin.remove())
      })
    }
  }

  const recordSpanId = (event: DragEvent, direction: string) =>{
      // Pour l'evenement drop
      event.dataTransfer?.setData('pin_position',direction)
      event.dataTransfer.setData('spanid',markRaw(spanMenuSelected.value) ?? markRaw(newFocus.value))

      // Pour l'evenement dragover et dragleave
      dragData.spanid = markRaw(spanMenuSelected.value) ?? markRaw(newFocus.value)
      dragData.pin_position = direction
  }

  const dropPin = () => {
    let nodesToAdd = [...document.querySelectorAll('div .dragged_outer ')]
    let nodesToRemove = [...document.querySelectorAll('div .dragged_inner ')]
    nodesToAdd.forEach(node=>node.classList.remove('dragged_outer'))
    nodesToRemove.forEach(node=>node.classList.remove('dragged_inner'))
    const spanId = event.dataTransfer.getData('spanid')
    const span = spanArray.value[spanId]
    if(!span?.deletedItems){
      removeSpanFromDOM(spanId)
      if (nodesToRemove.length > 0) span.nodes = _.difference(span.nodes, nodesToRemove)
      else if (event.dataTransfer.getData('pin_position') == 'left') {
        span.nodes = nodesToAdd.concat(span.nodes)
      } else {
        span.nodes = span.nodes.concat(nodesToAdd)
      }
      span.tcin = span.nodes[0].getAttribute('tcin')
      span.tcout = span.nodes[span.nodes.length - 1].getAttribute('tcout')
      deletedNum.value = span.deletedItems
      affectPluginValues(span.plugins)
      applySpan(spanId)
      newFocus.value = null
    }

  }


  const handleDrop = (event : DragEvent)  => {
    event.preventDefault()
    if(event.dataTransfer.getData('pin_position')) dropPin()
  }

  function handleDeleteSpan() {
    removeSpanFromDOM(spanMenuSelected.value)
    spanArray.value.filter(el=>el && el.spans).forEach(spanArrayElement => {
      // Retire les assignations de role du span que l'on supprime
      _.remove(spanArrayElement.spans,span=>span.spanId == spanMenuSelected.value)
    })

    spanArray.value[spanMenuSelected.value] = undefined


  }

  function decolorSpan(group){
    if(!group) return

    // List des id de spans qui appartiennent au group selectionne
    const spanIdList : Array<any> = group.spans.map(a=>a.spanId)
    // Spans auxquels on enleve leur couleur
    const targetSpans = spanArray.value.filter(span => !spanIdList.includes(span.id) && span.tcin )


    targetSpans.forEach(span=>{
      if(span.nodes && span.nodes.length > 0){
        span.nodes.forEach((node,index)=>{
          node.style.backgroundColor = 'var(--grey-200)'
          node.querySelectorAll(`bg${span.id}`).forEach(border=>border.remove())
          if(index == 0)  node.querySelector('tag').style.backgroundColor = 'var(--grey-200)'
        })
      }
    })
  }

  function recolorSpan(group){
    // List des id de spans qui appartiennent au group selectionne
    const spanIdList : Array<any> = group.spans.map(a=>a.spanId)
    // Spans auxquels on remet leur couleur
    const targetSpans = spanArray.value.filter(span => !spanIdList.includes(span.id) && span.tcin )
    targetSpans.forEach(span=>{
      affectPluginValues(span.plugins)
      applySpan(span.id)
    })
  }

  function createSpanColorPalette(pluginId: number, pluginValue: any, opacity? : number = 0.4){
    const index = pluginList.value.findIndex(plugin=>plugin.id == pluginId)
    const [plugin, options]= [pluginList.value[index], pluginOptionsList.value[index]]
    if(pluginList && plugin && pluginValue && pluginValue.length){
      if(plugin.type == TypePlugin.LISTITEMS  || ( plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'get plugin' ) ) {
        return hexToRgba(computeColorByLabel(options.data.map(option=>option.label),pluginValue.map(value=>value.label)).hex,opacity)
      }
      else if(plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'post plugin'){
        const seed = pluginValue?.map(value=>value.label.split('').reduce((acc,value)=>acc+=value.charCodeAt(0),0)).reduce((acc,value)=>acc+=value,0)
        return hexToRgba(computeColor(seed).hex,opacity)
      }
      else return "rgba(213,32,123)"
    }
    else return "rgba(170,170,170)"
  }

  function applySpan(spanId: number){

    function focusSpan(spanId: number, event: Event){
      newFocus.value = spanId
      event.stopPropagation()
    }

    removeSpanFromDOM(spanId)
    const span = spanArray.value[spanId]
    span.plugins = _.cloneDeep(pluginValues)
    span.deletedItems = deletedNum.value ? markRaw(deletedNum.value) : span.deletedItems
    deletedNum.value = null
    const color = createSpanColorPalette(mainPluginId.value,span.plugins[`plugin-${mainPluginId.value}`])
    span.nodes.forEach((element: HTMLDivElement,elementIndex:number)=>{
      const bgElement = document.createElement(`bg${spanId}`)
      bgElement.classList.add('absolute', 'w-full', 'h-full','left-0','mix-blend-multiply','pointer-events-none')
      element.style.backgroundColor='transparent'
      bgElement.style.backgroundColor = color
      const existingBg = [...element.querySelectorAll('bg')]
      if(existingBg.length == 0 ) element.appendChild(bgElement)
      else{
        for (const [index,bg] of existingBg.entries()) {
          if(bg.style.backgroundColor == color) {
            break
          }
          if(index == existingBg.length-1){
              element.appendChild(bgElement)
          }
        }
      }
        element.addEventListener('click', (event) => focusSpan(spanId,event))
        element.style.lineHeight = '14px'
        element.style.userSelect = 'text'
        element.classList.add('relative')
        if(elementIndex == 0) {
          const tag = document.createElement('tag')
          const listTags = element.querySelectorAll('tag')
          tag.innerText = span.plugins[`plugin-${mainPluginId.value}`]?.map(spanPlugin=>spanPlugin.label).join(', ') ?? ''
          tag.classList.add('absolute', 'h-3' , 'px-1', 'top-[-10px]', 'text-[0.75rem]', 'cursor-pointer', 'leading-[0.8]', 'truncate' , 'w-max','max-w-[80px]')
          tag.style.left= '0px'
          tag.draggable = true
          tag.style.backgroundColor = color
          tag.setAttribute('spanId',spanId)
          tag.style.zIndex= '50'
          element.appendChild(tag)
          tag.addEventListener('dragstart',event=> {
            event.dataTransfer.setData('span',spanId)
          })
          tag.addEventListener('click', (event) => focusSpan(spanId,event) )
          tag.addEventListener('contextmenu', (event )=>{
            spanMenuSelected.value = spanId
            spanMenu.value.show(event)
            })
          const tagCoord = tag.getBoundingClientRect()

          // Check for existing tag being overlap by the new tag on the LEFT side
          let elements = document.elementsFromPoint(tagCoord.x,tagCoord.y)
          let overlapingTags = elements.filter(element => element.tagName == "TAG" && element != tag )
          avoidOverlap(tag,overlapingTags)

          // Check for existing tag being overlap by the new tag on the RIGHT side
          elements = document.elementsFromPoint(tagCoord.right+50,tagCoord.y)
          let overlapingEndTags = elements.filter(element => element.tagName == "TAG" && element != tag )
          if(overlapingEndTags.length > 0 )
          if(overlapingEndTags.length >0 ) avoidOverlap(overlapingEndTags[0],[tag])

      }
    })
  }

  /**
    * Move the given `tag` element to the right until there is no more overlaping with any of the element in `avoidingTags` Array
    * @param movingTag The tag which will be moved horizontally
    * @param avoidingTags Array of tags which will be avoided
    *
    * @return void
    **/
  function avoidOverlap(movingTag: HtmlDivElement, avoidingTags: HtmlDivElement[]){
    if(!movingTag || !avoidingTags) throw new Error('function avoidOverlap missing parameters')
    let debugCounter = 0
    while(avoidingTags.length > 0 && debugCounter <10){
        const otherTag = avoidingTags[0]
        let elementCoord = otherTag.getBoundingClientRect()
        movingTag.classList.remove('left-0')
        let tagParent = movingTag.parentElement?.getBoundingClientRect()
        let otherTagRight = elementCoord.right
        movingTag.style.left = `${ (otherTagRight - tagParent.left ) }px`

        let {x,y} = movingTag.getBoundingClientRect()
        avoidingTags = document.elementsFromPoint(x,y).filter(element => element.tagName == "TAG" && element != movingTag )
        debugCounter++

      if(debugCounter == 10 ) console.error('trop de call')
    }
  }

  function showDragPin(){
    const nodes = spanArray.value[spanMenuSelected.value].nodes
    const rightDragPin = document.createElement('pinWrapper')
    rightDragPin.classList.add("h-full", "w-[10px]", 'absolute','cursor-ew-resize', 'flex', 'justify-center', 'top-0'  )
    rightDragPin.draggable = true
    rightDragPin.textContent = ' '
    const leftDragPin = rightDragPin.cloneNode() as HTMLDivElement
    nodes.forEach((span: HTMLDivElement, index: number)=>{
      if(index == 0){
        const visualPin = document.createElement('pin')
        visualPin.classList.add("h-full", "bg-accent", "w-[3px]", )
        leftDragPin.classList.add('left-[-5px]','z-20' )
        leftDragPin.addEventListener('dragstart',event => recordSpanId(event,'left'))
        leftDragPin.appendChild(visualPin)
        span.appendChild(leftDragPin)
      }
      if( nodes.length-1 ==  index){
        const visualPin = document.createElement('pin')
        visualPin.classList.add("h-full", "bg-accent", "w-[3px]", )
        rightDragPin.classList.add('right-[-5px]', 'z-20' )
        rightDragPin.addEventListener('dragstart',event => recordSpanId(event,'right'))
        rightDragPin.appendChild(visualPin)
        span.appendChild(rightDragPin)
      }
    })
  }

  function extractTextFromSpanNodes (nodesArray: Array<Node>){
    if(!nodesArray) return null
    return nodesArray.map(node=>document.evaluate('text()', node, null, XPathResult.STRING_TYPE).stringValue).join(' ')
  }

  watch(()=>newFocus.value,(newValue, oldValue)=>{
    if(oldValue != undefined){
      const oldElementArray = spanArray.value[oldValue]?.nodes
      if(!oldElementArray){
        recolorSpan(spanArray.value[oldValue])
      }
      else{
        oldElementArray.forEach((span: HTMLDivElement) =>{
          if(!span) return
          span.style.border = 'none'
          span.querySelectorAll('border').forEach(border=>border.remove())
          span.querySelectorAll('pinWrapper').forEach(pin=>pin.remove())
        })
      }

    }
    if(newValue != undefined){
      const elementArray = spanArray.value[newValue].nodes
      if(!elementArray) { // On a selectionne un groupe
          decolorSpan(spanArray.value[newValue])
      }
      else {
      elementArray.forEach((span: HTMLDivElement, index: number)=>{
        const tagBorder = document.createElement('border')
        tagBorder.textContent = ' '
        tagBorder.style.border = `2px black dashed`
        tagBorder.style.borderBottom = 'none'
        tagBorder.style.position = 'absolute'
        tagBorder.style.left = '0px'
        tagBorder.style.pointerEvents = 'none'
        tagBorder.style.minWidth = '100%'
        tagBorder.style.minHeight = '100%'
        const spanBorder = document.createElement('border')
        spanBorder.textContent = ' '
        spanBorder.style.borderTop = `2px black dashed`
        spanBorder.style.borderBottom = `2px black dashed`
        if( elementArray.length-1 ==  index){
          spanBorder.style.borderRight = `2px black dashed`
        }
        if(index == 0){
          spanBorder.style.borderLeft = `2px black dashed`
        }
        spanBorder.style.position = 'absolute'
        spanBorder.style.padding= '2px'
        spanBorder.style.left = '0px'
        spanBorder.style.pointerEvents = 'none'
        spanBorder.style.minWidth = '100%'
        spanBorder.style.minHeight = '100%'
        span.firstChild.before(spanBorder)
        span.querySelector(`tag[spanid="${newValue}"]`)?.firstChild.before(tagBorder)
      })
      }
    }
  })



  interface State {
    selection: Selection | null,
    range: Range | null
  }

  const state: State = reactive({
    selection: null,
    range: null

 })

  const handleSelectionV2 = ({spanArg, event} : {spanArg?: any, event?: Event}) =>{
    const currentSelection = window.getSelection()
    if (currentSelection && currentSelection.toString() !== '' ) {
      event?.stopPropagation()
      if( options.unlabelled_span || labelSelected.value.length != 0 || spanArg?.tcin ) {
        state.selection = currentSelection
        const id = spanArg?.id != undefined ? spanArg.id : markRaw(spanCount.value)
        state.range = currentSelection.getRangeAt(0)
        let spanTcin = spanArg?.tcin ?? null
        let spanTcout = spanArg?.tcout ?? null
        if(state.range.commonAncestorContainer.parentNode?.tagName == 'TAG') return
        if(state.range.commonAncestorContainer.nodeType == 3 ) {
            state.range.setEndAfter(state.selection.focusNode)
            state.range.setStartBefore(state.selection.anchorNode?.parentNode)
        }
        state.selection.removeAllRanges()


        const selectedNodes: Node[] = []
        const treeWalker = document.createTreeWalker(
          state.range.commonAncestorContainer,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode: (node) => {
              // On parcourt uniquement les noeuds qui intersectionnent la selection de l'utilisateur
              if (state.range.intersectsNode(node) ) {
                // Si le noeud est un wrapper on le skip et on passe a ses descendants
                if(node.nodeName == 'SPAN-TRANSCRIPTION-WRAPPER') return NodeFilter.FILTER_SKIP
                // Si le noeud est une div, on le parcourt, sinon (tag, border, bg... ) on le rejette
                return node.nodeName == 'DIV' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
              }
              return NodeFilter.FILTER_REJECT
            }
          }
        )

        while (treeWalker.nextNode()){
            selectedNodes.push(treeWalker.currentNode)
        }

        spanTcin = selectedNodes[0].getAttribute('tcin')
        spanTcout = selectedNodes[selectedNodes.length-1].getAttribute('tcout')
        spanArray.value[id] ={
          id: id,
          nodes : selectedNodes,
          tcin : spanTcin,
          tcout : spanTcout,
        }
        if(selectedNodes.length == 0) console.error("the span you atempt to create is empty")
        if(spanArg){
          deletedNum.value=spanArg.deletedItems
          affectPluginValues(spanArg.plugins)
          applySpan(id)
        }
        return {spanId: id}
      }
    }
  }

/**
    * Reccursivly go through the Document object and aggregate sibling nodes from a given node to return them in an array
      * @param startNode Starting node for seeking sibling nodes
      * @param value Number of sibling you seek. Can be either positive if you seek next siblings, or negative to look for previous siblings
      * @return The array of sibling which length equal `value`, or empty array if `value` was 0
**/
  function reccursiveSibling(startNode: ChildNode | null, value :number): (ChildNode | null)[] {
    if(value  == 0 || startNode == null ) return []
    if( value > 0 ) return startNode.nextSibling && startNode.nextSibling.nodeType == 1 ? [startNode.nextSibling].concat(reccursiveSibling(startNode.nextSibling,value-1)) : []
    else return startNode.previousSibling && startNode.previousSibling.nodeType == 1 ? reccursiveSibling(startNode.previousSibling,value+1).concat([startNode.previousSibling]) : []
  }

  const saveSpan = (local) => {
    const initialLength = local.filter(e=>e.data).length
    spanArray.value.map(span=>formatSpan(span)).forEach(span=>local[initialLength  + span.id] = span)
    return local
  }

  const createSpan = (span) => {
    const startNode = document.querySelector(`[tcin="${span.tcin}"]`) as Node
    const endNode = document.querySelector(`[tcout="${span.tcout}"]`) as Node
    const range: Range = new Range()
    range.setStartBefore(startNode)
    range.setEndAfter(endNode)
    const selection: Selection | null = window.getSelection()
    selection?.empty()
    selection?.addRange(range)

    handleSelectionV2({spanArg: span})
  }

  const formatSpan = (span : typeof spanArray.value[0]) => {
    if((span as Span).nodes){
      const spanJson = _.cloneDeep(span) as Span
      spanJson.text = extractTextFromSpanNodes(spanJson.nodes)
      return _.omit(spanJson,'nodes')
    }
    return span
  }

  function loadSpanv2 (locals){
    locals.value.forEach(segment =>{
      if (((!segment.sublocalisations) && (segment.property?.[0]?.key == "entityType") ) ||  !segment.data) {
        if(!segment.spans && segment.text) createSpan(segment)
        else {
            spanArray.value[segment.id] = segment
          }
      }
    })
  }

  const onDeleteSpan = ({ index }: { index: number }) => {
    removeSpanFromDOM(index)
    spanArray.value[index] = null
    currentFocus.value = undefined

  }

  return{
 recolorSpan,decolorSpan, saveSpan, extractTextFromSpanNodes, dragData,showDragPin, reccursiveSibling,  handleDeleteSpan, loadSpanv2, spanGroupTypeOptions, computeColorByLabel,  newFocus, handleDrop, recordSpanId, spanForm, op, spanTypeOptions, spanMenuSelected, freeLabel, applySpan, spanMenu, spanArray, handleSelectionV2, createSpan, onDeleteSpan, spanClicked,linkMode,currentFocus, labelSelected,isForResearch,deletedNum,
 affectPluginValues, initPluginValues, pluginValues,setDisableGroup,contextMenuOptions, mainPluginId, createSpanColorPalette
  }
}

/**
 * @param initialization True for forcing the creation of a new instance
  **/
export default function (initialization?: boolean){
  if(!spanServiceInstance || initialization) spanServiceInstance = createSpanService()
  return spanServiceInstance
}
