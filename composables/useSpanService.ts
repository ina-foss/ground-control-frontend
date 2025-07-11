import AtomSjan from "../components//atoms/AtomSpan.vue";
import {createApp} from "vue";
import _ from 'lodash'
import {useOptions} from '~/stores/annotation-options'

let spanServiceInstance : ReturnType<typeof createSpanService> | null = null

 function createSpanService (){

const {options} = useOptions()

const { $application } = useService()
const { computeColor,hexToRgba,computeColorByLabel} = $application
const spanMenu = ref()
const op = ref()

type AtomSpanType = InstanceType<typeof AtomSpan>
  const spanClicked = ref(false)
  const spanRefArray = ref<AtomSpanType[]>([])
  const spanArray = ref([])
  const elementArray = ref([])
  const linkMode = ref(false)
  const currentFocus = ref<number | undefined>(undefined)
  const linkCss = computed<string>(() => linkMode.value ? ' hover:border-2 ' : '')
  const spanCount = computed<number>(()=>spanArray.value.length)
  const newFocus = ref<number | undefined>()
  const spanMenuSelected = ref<number | undefined>(undefined)
  const labelSelected = ref([])
  const freeLabel = ref()
  const spanIndex = ref<number>()
  const relationArray = ref<any[]>([])
  const spanForm = ref()
  const dragData = reactive<{pin_position: string | undefined, spanid: number | undefined}>({
    pin_position : undefined,
    spanid : undefined,
  })
  const labels = ref<string[]>(['Person', 'Citation', 'Verbe'])
  const spanTypeOptions =ref( [
    {value: 'function',label:'Fonction'},
    {value: 'verb', label:'Verbe'},
    {value: 'directCitation', label: 'Citation directe'},
    {value: 'physicalPerson', label: 'Personne physique'},
    {value: 'indirectPerson', label: 'Citation indirecte'},
    {value: 'pronoun', label: 'Pronom'},
    {value: 'geographic', label: 'Lieu géographique'},
  ])
  const spanGroupTypeOptions = ref([
    {value: 'citation', label: 'Citation', roles: ['source', 'indice', 'citation']},
    {value: 'entity', label: 'Entitee nommee', roles: ['primaire','secondaire']},
  ])
  const filteredLocal = computed(() => {
    return _.filter(locals.value, (local) => local.sublocalisations)
  })

  function rgbaToShadow(color: string) {
    return `${color} 0px 0px 0px 1000px inset`
  }

  function removeSpanFromDOM(spanId: number){
    const span = spanArray.value[spanId]
    let tag = document.querySelector(`tag[spanid="${spanId}"]`)
    if( tag ) tag.remove()
    span.nodes.forEach((node: HTMLDivElement)=>{
      if(span?.type){
        let color = hexToRgba(computeColorByLabel(spanTypeOptions.value.map(opt=>opt.label),[span.type.label]).hex,0.33)
        node.style.boxShadow = node.style.boxShadow.replace(rgbaToShadow(color),'')
        node.querySelectorAll('border').forEach(border=>border.remove())
        node.querySelectorAll(`bg${spanId}`).forEach(border=>border.remove())
        node.querySelectorAll('pinWrapper').forEach(pin=>pin.remove())
      }
    })

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
    removeSpanFromDOM(spanId)
    if ( nodesToRemove.length > 0) span.nodes = _.difference(span.nodes,nodesToRemove)
    else if(event.dataTransfer.getData('pin_position') == 'left'){
      span.nodes = nodesToAdd.concat(span.nodes)
    }
    else{
      span.nodes = span.nodes.concat(nodesToAdd)
    }
    span.tcin = span.nodes[0].getAttribute('tcin')
    span.tcout = span.nodes[span.nodes.length-1].getAttribute('tcout')
    labelSelected.value = span.type
    freeLabel.value = span.label
    applySpan(spanId)
    newFocus.value = null
  }


  const handleDrop = (event : DragEvent)  => {
    event.preventDefault()
    if(event.dataTransfer.getData('pin_position')) dropPin()
  }

  function handleDeleteSpan() {
    removeSpanFromDOM(spanMenuSelected.value)
    spanArray.value.filter(el=>el.spans).forEach(spanArrayElement => {
      // Retire les assignations de role du span que l'on supprime
      _.remove(spanArrayElement.spans,span=>span.spanId == spanMenuSelected.value)
    })
    spanArray.value[spanMenuSelected.value] = undefined


  }

  function applySpan(spanId: number){

    function focusSpan(spanId: number, event: Event){
      newFocus.value = spanId
      event.stopPropagation()
    }


    removeSpanFromDOM(spanId)
    const span = spanArray.value[spanId]
    span.label = freeLabel.value ? markRaw(freeLabel.value) : null
    span.type = markRaw(labelSelected.value)
    freeLabel.value = null
    span.nodes.forEach((element: HTMLDivElement,elementIndex:number)=>{
      const color = hexToRgba(computeColorByLabel(spanTypeOptions.value.map(opt=>opt.label),[labelSelected.value.label]).hex,0.4)
      const bgElement = document.createElement(`bg${spanId}`)
      bgElement.classList.add('absolute', 'w-full', 'h-full','left-0','mix-blend-multiply','pointer-events-none')
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
      // if(!element.style.boxShadow.includes(color)) element.style.boxShadow = element.style.boxShadow.split(',').filter(e=>e != "").concat([rgbaToShadow(color)]).join(',')
      // if(element.style.backgroundColor == ''){
      //   element.style.backgroundColor = color
      //  }
      //  else {
      // const currentColor = element.style.backgroundColor
      // element.style.backgroundColor  = `color-mix(in hsl, ${currentColor}, ${color} )`
      //  }
        element.addEventListener('click', (event) => focusSpan(spanId,event))
        element.style.lineHeight = '14px'
        element.style.userSelect = 'text'
        element.classList.add('relative')
        if(elementIndex == 0) {
          const tag = document.createElement('tag')
          const listTags = element.querySelectorAll('tag')
          tag.innerText = labelSelected.value.label
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

  watch(()=>newFocus.value,(newValue, oldValue)=>{
    if(oldValue != undefined){
      const oldElementArray = spanArray.value[oldValue]?.nodes
      if(!oldElementArray){}  // On a selectionne un groupe
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
      if(!elementArray) return  // On a selectionne un groupe
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
        const prevNodes = reccursiveSibling(selectedNodes[0],-25)
        const nextNodes = reccursiveSibling(selectedNodes[selectedNodes.length-1],20)
        if(spanArg){
          freeLabel.value = spanArg.label
          labelSelected.value = spanArg.type
          applySpan(id)
        }
        return {prev: prevNodes, selection : selectedNodes, next: nextNodes}
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

  const handleSelection = ({spanArg, event} : {spanArg?: any, event?: Event}) => {
    const currentSelection = window.getSelection()
    if (currentSelection && currentSelection.toString() !== '' ) {
      event?.stopPropagation()
      if( options.unlabelled_span || labelSelected.value.length != 0 || spanArg?.tcin ) {
        state.selection = currentSelection
        const id = spanArg?.id != undefined ? spanArg.id : markRaw(spanCount.value)
        const label: Array<string> = spanArg?.property?.map((label: { value: any; }) => label.value) || spanArg?.label || markRaw(labelSelected.value)
        state.range = currentSelection.getRangeAt(0)
        let direction
        let indexStart
        let indexEnd
        let spanTcin = null
        let spanTcout = null
        if (!spanArg?.tcin) {
          if (currentSelection.anchorNode?.parentElement?.parentNode == currentSelection.focusNode?.parentElement?.parentNode) {
            indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.childNodes, currentSelection.anchorNode?.parentElement)
            indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.childNodes, currentSelection.focusNode?.parentElement)
            direction = (indexStart <= indexEnd) ? 'forward' : 'backward'
          }
          else {
            indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.parentNode?.childNodes, currentSelection.anchorNode?.parentElement?.parentElement)
            indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.parentNode?.childNodes, currentSelection.focusNode?.parentElement?.parentElement)
            direction = (indexStart <= indexEnd) ? 'forward' : 'backward'

          }
          if (indexStart == indexEnd) {
            direction = (state.selection.anchorOffset < state.selection.extentOffset) ? 'forward' : 'backward'
          }
          spanTcin = getAttribute(direction, currentSelection, 'tcin')
          spanTcout = getAttribute(direction, currentSelection, 'tcout')
          if (direction == 'forward') {
            state.range.setEndAfter(state.selection.focusNode)
            state.range.setStartBefore(state.selection.anchorNode?.parentNode)
          }
          else {
            const startWord = state.selection.focusNode.parentNode
            state.range.setEndAfter(state.selection.anchorNode)
            state.range.setStartBefore(startWord)
          }
        }
        if (spanTcin == null) spanTcin = spanArg?.tcin
        if (spanTcout == null) spanTcout = spanArg?.tcout
        state.selection.removeAllRanges()
        const nextContainerSibling = state.range.endContainer.nextSibling
        const span = document.createElement('span') // temporary Element to create the span DOM
        const docFragment = state.range.extractContents() // extract all the HTMLElements in the range
        state.selection.empty()
        state.selection = null
        if (!spanClicked.value) {
          const app = createApp({
            render() {
              return h(AtomSpan, {
                label: label,
                tcIn: spanTcin,
                tcOut: spanTcout,
                id: id,
                linkCss: linkCss.value,
                labels: labels,
                ref: el => spanRefArray.value[id] = el,
                onSpanReady: ({ element, index }) => {
                  elementArray.value[index] = element
                },
                onEditSpan: ({ index }) => {
                  spanClicked.value = true
                  spanIndex.value = index
                },
                onFocusSpan: (event) => handleFocusSpan(event)
              })
            }
          })
          app.mount(span) // Render the Span
          const fragment = document.createDocumentFragment()
          Array.from(span.childNodes).forEach(node => { // Add the content of the temporary element inside a document Fragment
            fragment.appendChild(node)
          });
          if (docFragment.firstChild?.firstChild?.nodeType == 1) {
            const blocs = docFragment.childNodes
            const border = docFragment.firstChild.cloneNode(false)
            const blocNb = blocs.length


            blocs.forEach((previousBlock) => {
              const wordArray = previousBlock.childNodes
              wordArray.forEach((word) => {
                if ((word.nodeType == 1) && word.getAttribute('tcin'))
                  docFragment.appendChild(word.cloneNode(true))
              })
            })
            let i = 0
            while (i < blocNb) {
              docFragment.firstChild?.remove()
              i++
            }
            fragment.firstChild?.firstChild?.appendChild(docFragment) // Add all the word inside the final div
            border.appendChild(fragment)
            if (options.timecode_bloc) {
              addTimecodeDiv(border.firstChild.firstElementChild, border)
              if (nextContainerSibling?.getAttribute('tcin')) addTimecodeDiv(nextContainerSibling?.parentNode)
            }
            state.range.insertNode(border) // Add this document fragment to the DOM

          }

          else {
            fragment.firstChild?.appendChild(docFragment) // Add all the word inside the final div
            state.range.insertNode(fragment) // Add this document fragment to the DOM
          }

        }
        else {
          direction == 'forward' ? spanRefArray.value[spanIndex.value].addRight(docFragment) : spanRefArray.value[spanIndex.value].addLeft(docFragment)
          spanClicked.value = false
        }
        spanIndex.value = undefined
        formatSpan(spanRefArray.value[spanRefArray.value.length - 1])
        }
    }
  }

  const saveSpan = (local) => {
    _.remove(local, (el) => !el.data)
    spanRefArray.value.forEach((span) => {
      local.push(formatSpan(span))
    })
    relationArray.value.forEach((relation) => {
      local.push(formatRelation(relation))
    })
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

  const formatSpan: any = (spanRef: any) => {
    const span = {}
    span.id = spanRef.id
    span.tcin = spanRef.tcin
    span.tcout = spanRef.tcout
    const property = []
    spanRef.label.forEach(label => {
      property.push({ key: 'entityType', value: label })
    });
    span.property = property
    return span
  }

  const handleFocusSpan = ({ index }) => {
    if (linkMode.value) {
      relationArray.value.push({ from: currentFocus.value, to: index })
      linkMode.value = false
    }
    else if(index != undefined){
      spanClicked.value = false
      currentFocus.value = index
      labelSelected.value = spanRefArray.value[currentFocus.value].label
    }
  }

  function loadSpanv2 (locals){
    // locals.value.push({id: 0, tcin:33.840087890625 ,tcout: 35.919921875, type: {value: 'physicalPerson', label:'Personne physique'}})
    // locals.value.push({id:1, type:{value: 'citation', label: 'Citation', roles: ['source', 'indice', 'citation']}, spans:[{spanId: 0, role: 'citation'}]})
    locals.value.forEach(segment =>{
      if (((!segment.sublocalisations) && (segment.property?.[0]?.key == "entityType") ) ||  !segment.data) {
        if(!segment.spans) createSpan(segment)
        else {
            spanArray.value[segment.id] = segment
          }
      }
    })
  }

  const loadSpan = (locals) => {
    if (spanRefArray.value.length == 0) {
      locals.value?.forEach((segment) => {
        if (((!segment.sublocalisations) && (segment.property?.[0]?.key == "entityType") ) ||  !segment.data) {
          createSpan(segment)
        }
      });
    }
    else {
      spanRefArray.value?.forEach((segment) => {
        createSpan(segment)
      });
    }
    if (relationArray.value.length == 0)
      locals.value?.forEach(segment => {
        if ((!segment.sublocalisations) && (segment.property?.[0]?.key == 'relationType')) {
          relationArray.value.push({ from: segment.from, to: segment.to })
        }
      });
  }

  const getAttribute = (direction, selection, tc) => {
    if ((direction == 'forward' && tc == 'tcin') || (direction == 'backward' && tc == 'tcout')) return selection.anchorNode?.parentElement?.getAttribute(tc)
    else if ((direction == 'forward' && tc == 'tcout') || (direction == 'backward' && tc == 'tcin')) return selection.focusNode?.parentElement.getAttribute(tc)
  }

  const onDeleteSpan = ({ index }: { index: number }) => {
    const element: Element = elementArray.value[index]
    const text = spanRefArray.value[index].text
    if (element && element.parentNode) {
      const parent = element.parentNode // on recupere la div contenant la phrase
      parent.replaceChild(document.createTextNode(text), element) // on remplace le span par du text
      parent.normalize(); // On fusionne les 3 textes

    }
    _.remove(relationArray.value, (relation) => relation.to == index || relation.from == index)
    spanRefArray.value.splice(index, 1)
    spanRefArray.value.forEach((span, index) => {
      span.index = index
    })
    currentFocus.value = undefined
    spanCount.value--
  }

  return{
    dragData,showDragPin, reccursiveSibling,  handleDeleteSpan, loadSpanv2, spanGroupTypeOptions, computeColorByLabel,  newFocus, handleDrop, recordSpanId, spanGroupTypeOptions, spanForm, op, spanTypeOptions, spanMenuSelected, freeLabel, applySpan, spanMenu, spanArray, handleSelectionV2, handleSelection, spanRefArray, createSpan, onDeleteSpan, spanClicked,linkMode,currentFocus,saveSpan,loadSpan, labelSelected
  }
}

/**
 * @param initialization True for forcing the creation of a new instance
  **/
export default function (initialization?: boolean){
  if(!spanServiceInstance || initialization) spanServiceInstance = createSpanService()
  return spanServiceInstance
}
