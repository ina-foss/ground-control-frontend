import _ from 'lodash'
import {TypePlugin} from '~/api/generate'
import {useOptions} from '~/stores/annotation-options'
import {usePluginStore} from "~/stores/plugins";
import { useI18n } from '#imports'
const nuxtApp = useNuxtApp()


let spanServiceInstance : ReturnType<typeof createSpanService> | null = null

function createSpanService (){

  const { t } = useI18n()
  const {options} = useOptions()

  const { $application } = useService()
  const { hexToRgba,computeColorByLabel,computeColor,extractTextFromSpan} = $application
  const spanMenu = ref()
  const spanControlPanelMenu = ref()
  const op = ref()
  // ----- Plugin Store ------
  const pluginStore = usePluginStore()
  const { pluginList } = storeToRefs(pluginStore)
  const pluginOptionsList = computed(()=>pluginStore.pluginOptionsList)
  const createdPluginOptionsList = ref([])

  const spanClicked = ref(false)
  const spanArray = ref<Array<AnySpan | null>>([{id:0,label:"", plugins: []}])
  //const spanArray = ref<Array<Span | SpanGroup | VirtualSpan | null>>([{id:0,label:"", plugins: []}])
  const linkMode = ref(false)
  const spanCount = computed<number>(()=>spanArray.value.length)
  const newFocus = ref<number | undefined>()
  const spanMenuSelected = ref<number | undefined>(undefined)
  const spanRole = ref<number | undefined>(undefined)
  const mainGroupPluginIndexVirtual = ref<number | undefined>(undefined)
  const selectedGroupVirtual = ref<any | undefined>(undefined)
  const labelSelected = ref([])
  const defaultLabel = ref()
  const deletedNum=ref<number>()
  const spanForm = ref()
  const dragData = reactive<{pin_position: string | undefined, spanid: number | undefined}>({
    pin_position : undefined,
    spanid : undefined,
  })
  const contextMenuOptions = ref([{label:  t('contextMenu.editProperties'), command: ()=>spanForm.value?.open({span:spanArray.value[spanMenuSelected.value]})},{id:1, label:t('contextMenu.editBounds'), command:(event)=>showDragPin(event)},{id:2, label: t('contextMenu.delete'), command: ()=>spanForm.value?.open({span:spanArray.value[spanMenuSelected.value],suppression: true}) }])
  const contextControlPanelMenuOptions = ref([{label: t('contextMenu.editProperties'), command: ()=>spanForm.value?.open({span:spanArray.value[spanMenuSelected.value],role:spanRole,selectedGroup:selectedGroupVirtual.value,mainGroupPluginIndex:mainGroupPluginIndexVirtual.value})},{id:2, label: t('contextMenu.delete'), command: ()=>spanForm.value?.open({span:spanArray.value[spanMenuSelected.value],role:spanRole,selectedGroup:selectedGroupVirtual.value,mainGroupPluginIndex:mainGroupPluginIndexVirtual.value,suppression: true}) }])

  type pluginValues= Record<string,PluginAutocompleteValueDTO[]>
  const pluginValues = reactive<pluginValues>({})

  const mainPluginId = computed(()=>{
      return pluginList?.value?.find(plugin=>plugin.display_config?.main_plugin == true)?.id  || undefined
  })

  function focusGroup({groupId}: {groupId: number}) {
    newFocus.value = groupId
  }

  watch( ()=>mainPluginId.value,
    (value)=> {
      // store value for this task in localStorage
      // keep other task stored value
      const savedList : Array<any> = JSON.parse(localStorage.getItem('mainPluginId')) ?? []
      const existingValue = savedList.find(e=>e.taskId == useRoute().params.id)
      if(existingValue) existingValue.value = value
      else savedList.push({taskId: useRoute().params.id, value})
      localStorage.setItem('mainPluginId',JSON.stringify(savedList) )

      spanArray.value.forEach(span=>{
        if(span){
          affectPluginValues(span.plugins)
          if (span.tcin) applySpan(span.id)
        }
      })
    },
    {immediate: false}
  )

  function initPluginValues (iterator? :Array<PluginWithIdDto>){
    if (!Array.isArray(iterator)) return

    iterator.forEach(plugin=>{
      if(plugin.data_property) pluginValues[plugin.data_property] = [] // Creation des variables utilisee en tant qu'input
      else pluginValues[`plugin-${plugin.id}`] = [] // Creation des variables utilisee en tant qu'input
    })
  }

  function readPluginValues(plugin:PluginWithIdDto){
    return plugin.data_property ? plugin.data_property : `plugin-${plugin.id}`
  }

  const mainPluginIndex = computed(()=>{
    if(mainPluginId.value) {
      const mainPlugin = pluginList.value.find(plugin=>plugin.id == mainPluginId.value)
      return readPluginValues(mainPlugin)
    }
    return undefined
  })

  function affectPluginValues(values : pluginValues){
   if(values){
      Object.assign(pluginValues,values)
    }
  }

  const isForResearch = computed(()=>{
    return !!(pluginList?.value?.find(plugin => plugin.display_zone === "group_modal")?.id)
  })

   function countByPlugin(data:any){
     const groupedByPlugin = {}
     data.value.forEach(item => {
       if(item != undefined && item.plugins?.length != 0){
       const plugins = item.plugins
         if (!plugins) return

         Object.keys(plugins).forEach(pluginKey => {
           if (!groupedByPlugin[pluginKey]) {
             groupedByPlugin[pluginKey] = []
           }

           const pluginArray = plugins[pluginKey]
           if (!Array.isArray(pluginArray) || pluginArray.length === 0) return

           pluginArray.forEach(pluginItem => {
             // Cherche si ce plugin existe déjà
             const existing = groupedByPlugin[pluginKey].find(
                 entry => entry[0]?.id === pluginItem.id
             )

             if (existing) {
               // Incrémente le compteur existant
               existing[1].count++
             } else {
               // Crée une nouvelle entrée
               groupedByPlugin[pluginKey].push([pluginItem, { count: 1 }])
             }
           })
         })
     }
     })
     return groupedByPlugin
   }

  function removeSpanFromDOM(span: Span){
    if (span.plugins !== undefined) {
      const countedData = countByPlugin(spanArray)
      const currentPluginArray = span?.plugins[mainPluginIndex.value]
      const currentPlugin = currentPluginArray?.[0]

      if (currentPlugin) {
        // Trouver la clé du plugin dans countedData qui contient ce plugin
        const pluginKey = Object.keys(countedData).find(key =>
            countedData[key].some(entry => entry[0].id === currentPlugin.id)
        )

        if (pluginKey) {
          // Récupèrer l'entrée correspondante dans countedData
          const entryInCountedData = countedData[pluginKey].find(
              entry => entry[0].id === currentPlugin.id
          )

          // Trouver l'index dans pluginOptionsListTest
          const existingIndex = createdPluginOptionsList.value.findIndex(
              p => p.id === currentPlugin.id
          )

          if (existingIndex !== -1) {
            if (entryInCountedData[1].count === 1) {
              createdPluginOptionsList.value.splice(existingIndex, 1)
            }
            entryInCountedData[1].count--
          }
        }
      }
    }

    const tag = document.querySelector(`tag[spanid="${span.id}"]`)
    if( tag ) tag.remove()
    if(span.nodes){
      span.nodes.forEach((node: HTMLDivElement)=>{
        node.querySelectorAll('border').forEach(border=>border.remove())
        node.querySelectorAll(`bg${span.id}`).forEach(border=>border.remove())
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

  /**
   * Callback invoked after user stop dragging a span border
   *
   **/
  const dropPin = () => {
    const nodesToAdd = [...document.querySelectorAll('div .dragged_outer ')]
    const nodesToRemove = [...document.querySelectorAll('div .dragged_inner ')]
    nodesToAdd.forEach(node=>node.classList.remove('dragged_outer'))
    nodesToRemove.forEach(node=>node.classList.remove('dragged_inner'))
    const spanId = event.dataTransfer.getData('spanid')
    const span : Span = spanArray.value[spanId] as Span

    // Case where user try to delete the entire span
    if(_.isEqual(nodesToRemove,span.nodes)) {
      nuxtApp.$handleApiError({message:t('span.editBorders.errors.removeAllNodesError'),title:t('span.editBorders.errors.errorTitle')})
      hideDragPin(span)
      return
    }

    if( nodesToRemove.length == 0 && nodesToAdd.length == 0 ){
      nuxtApp.$handleApiError({message:t('span.editBorders.errors.wrongDirectionError'),title:t('span.editBorders.errors.errorTitle')})
      hideDragPin(span)
      return
    }

    if(!span?.deletedItems){
      removeSpanFromDOM(span)
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
      applySpan(span)
      newFocus.value = null
    }

  }


  const handleDrop = (event : DragEvent)  => {
    event.preventDefault()
    if(event.dataTransfer.getData('pin_position')) dropPin()
  }

  function deleteSpan(span: AnySpan) {
    if (isSpan(span)) removeSpanFromDOM(span)
    spanArray.value.filter(el=>el &&  isSpanGroup(el) ).forEach(spanArrayElement => {
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
    const targetSpans = spanArray.value.filter(span => !spanIdList.includes(span?.id) && span?.tcin )


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
    let targetSpans
    if(group){
      // List des id de spans qui appartiennent au group selectionne
      const spanIdList : Array<any> = group.spans.map(a=>a.spanId)
      // Spans auxquels on remet leur couleur
       targetSpans = spanArray.value.filter(span => !spanIdList.includes(span?.id) && span?.tcin )
    }
    else targetSpans = spanArray.value.filter(span=> span?.nodes)
    targetSpans.forEach(span=>{
      affectPluginValues(span.plugins)
      applySpan(span.id)
    })
  }

  function createSpanColorPalette(pluginId: number | undefined, pluginValue: any, opacity? : number = 0.25){
    const index = pluginList.value.findIndex(plugin=>plugin.id == pluginId)
    const [plugin, options]= [pluginList.value[index], pluginOptionsList.value[index]]
    if(pluginList && plugin && pluginValue && pluginValue.length){
      if(plugin.type == TypePlugin.LISTITEMS  || ( plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'get plugin' ) ) {
        return hexToRgba(computeColorByLabel(options?.data.map(option=>option.label),pluginValue.map(value=>value.label)).hex,opacity)
      }
      else if(plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'post plugin'){
        const seed = pluginValue?.map(value=>value.label.split('').reduce((acc,value)=>acc+=value.charCodeAt(0),0)).reduce((acc,value)=>acc+=value,0)
        return hexToRgba(computeColor(seed).hex,opacity)
      }
      else return `rgba(213,32,123)`
    }
    else return `rgba(170,170,170,${opacity})`
  }

  function applySpan(spanOrId : number | Span){

    let span : Span
    let spanId : number

    if(typeof spanOrId  == "number" ){
      spanId = spanOrId
      span = spanArray.value[spanId]
    }
    else {
      span = spanOrId
      spanId = span.id
    }

    if (!span) return
    span.plugins = _.cloneDeep(pluginValues)
    removeSpanFromDOM(span)
    span.deletedItems = deletedNum.value ? markRaw(deletedNum.value) : span.deletedItems
    span.label = (()=>{
      if (!defaultLabel.value) return span.label
      else if (span.label && defaultLabel.value) return markRaw(defaultLabel.value)
      else if (!span.label) return markRaw(defaultLabel.value)
    })()
    deletedNum.value = null
    const color = createSpanColorPalette(mainPluginId.value,span?.plugins[mainPluginIndex.value])

    if (span?.plugins[mainPluginIndex.value] && (span?.plugins[mainPluginIndex.value]?.[0]) !== undefined && !createdPluginOptionsList.value.some(p=>p.id === ((span?.plugins[mainPluginIndex.value]?.[0]).id))) {
      createdPluginOptionsList.value.push((span?.plugins[mainPluginIndex.value])?.[0])
    }

    const borderColor = createSpanColorPalette(mainPluginId.value,span?.plugins[mainPluginIndex.value],1)
    span.nodes.forEach((element: HTMLDivElement,elementIndex:number)=>{
      const bgElement = document.createElement(`bg${spanId}`)
      bgElement.classList.add('absolute', 'min-w-full', 'h-[16px]','left-0','top-[-2px]','mix-blend-multiply','py-2','pointer-events-none')
      // add context menu listener to the word element
      element.removeEventListener('contextmenu', (event)=>{
        spanMenuSelected.value = spanId
        spanMenu.value.show(event)
        })
      element.addEventListener('contextmenu', (event)=>{
        spanMenuSelected.value = spanId
        spanMenu.value.show(event)
        })
      element.style.backgroundColor="none"
      bgElement.style.backgroundColor = color
      bgElement.classList.add('border-y-2',)
      bgElement.style.borderColor = borderColor
      element.style.lineHeight = '14px'
      element.style.userSelect = 'text'
      element.classList.add('relative')
      if(elementIndex == span.nodes.length-1) {
        bgElement.classList.add('border-r-2','pr-4')
        bgElement.style.borderRadius = "0px 4px 4px 0px"
      }
      if(elementIndex == 0) {
        bgElement.classList.add('border-l-2')
        bgElement.style.borderRadius = "4px 0px 0px 4px"
        const tag = document.createElement('tag')
        tag.innerText = span.plugins[mainPluginIndex.value]?.map(spanPlugin=>spanPlugin.label).join(', ') ?? ''
        tag.classList.add('absolute',  'px-2', 'py-1' , 'font-bold', 'top-[-20px]', 'text-[0.75rem]', 'cursor-pointer', 'leading-[0.8]', 'truncate' , 'w-max','max-w-[80px]','border-2', 'rounded', 'text-text')
        tag.style.left= '0px'
        tag.draggable = true
        tag.style.backgroundColor = color
        tag.style.borderColor = borderColor
        tag.setAttribute('spanId',spanId)
        tag.style.zIndex= '50'
        element.appendChild(tag)
        tag.addEventListener('dragstart',event=> {
          event.dataTransfer.setData('span',spanId)
        })
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
      // Apply radius on every corner for 1 word span
      if(span.nodes.length == 1) bgElement.style.borderRadius = "4px"
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
    })
    initPluginValues(pluginList.value)
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
        const elementCoord = otherTag.getBoundingClientRect()
        movingTag.classList.remove('left-0')
        const tagParent = movingTag.parentElement?.getBoundingClientRect()
        const otherTagRight = elementCoord.right
        movingTag.style.left = `${ (otherTagRight - tagParent.left ) }px`

        const {x,y} = movingTag.getBoundingClientRect()
        avoidingTags = document.elementsFromPoint(x,y).filter(element => element.tagName == "TAG" && element != movingTag )
        debugCounter++

      if(debugCounter == 10 ) console.error('trop de call')
    }
  }

  function showDragPin({originalEvent, item}:{originalEvent : Event, item:any}){
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

    originalEvent.stopPropagation()

    // clicking anywhere once the pin are visible hide them
    window.addEventListener('click',(clickEvent: Event)=>{
      if ((clickEvent.target as Node).nodeName != "PINWRAPPER") hideDragPin()
    },{once: true})

  }


  function hideDragPin(span? : Span){
    const nodes = span?.nodes ?? spanArray.value[spanMenuSelected.value].nodes
    nodes.forEach((node: HTMLDivElement)=>{
      node.querySelector('pin')?.remove()
      node.querySelector('pinWrapper')?.remove()
    })
   }

  function extractTextFromSpanNodes(nodesArray: Array<Node> | null): string | null {
    if (!nodesArray) return null;
    return nodesArray.map(node => extractTextFromSpan(node)).join(' ');
  }

  watch(()=>newFocus.value,(newValue, oldValue)=>{
    if(oldValue != undefined){
      const oldElementArray = spanArray.value[oldValue]?.nodes
      if(!oldElementArray){ // on deselectionne un groupe
        recolorSpan(spanArray.value[oldValue])
      }
    }
    if(newValue != undefined){
      const elementArray = spanArray.value[newValue]?.nodes
      if(!elementArray) { // On a selectionne un groupe
          decolorSpan(spanArray.value[newValue])
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

  /**
   * Callback invoked after text has been highlighted in dedicated area
   * Allow the creation of span
   */
  const handleSelectionV2 = ( event: Event ) : {span: Span} =>{
    const currentSelection = window.getSelection()
    if (currentSelection && currentSelection.toString() !== '' ) {
      event?.stopPropagation()
      if( options.unlabelled_span || labelSelected.value.length != 0 ) {
        const nodes = ExtractNodesFromCurrentSelection() as Element[]
        if(nodes.length == 0) console.error("the span you atempt to create is empty")

        const tcin = nodes[0].getAttribute('tcin')
        const tcout = nodes[nodes.length-1].getAttribute('tcout')
        const id = unref(spanCount.value)

        return {span: {id, nodes,tcin,tcout, label: "", deletedItems:0, plugins: [] } }
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
    local = [...local.filter(el=>el?.sublocalisations),...spanArray.value.map(span=> span ? formatSpan(span) : undefined)]
    return local
  }

  /**
   * Create a `Selection` and a `Range` based on span timecodes
   * Used to display imported or already saved spans
   * @params span The span whose nodes needs to be selected
   */
  const selectSpanNodes = (span) => {
    const startNode = document.querySelector(`[tcin="${span.tcin}"]`) as Node
    const endNode = document.querySelector(`[tcout="${span.tcout}"]`) as Node
    const range: Range = new Range()
    range.setStartBefore(startNode)
    range.setEndAfter(endNode)
    const selection: Selection | null = window.getSelection()
    selection?.empty()
    selection?.addRange(range)
  }

  /**
   * Extract text `Element` from the DOM based on the current selection
   *
   * @return {Node[]} The array of `Node` that represent one span
   */
  function ExtractNodesFromCurrentSelection() : Node[] {
        state.selection = window.getSelection()
        state.range = state.selection.getRangeAt(0)
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

    return selectedNodes
  }

  const formatSpan = (span : typeof spanArray.value[0]) => {
    if((span as Span)?.nodes){
      const spanJson = _.cloneDeep(span) as Span
      spanJson.text = extractTextFromSpanNodes(spanJson.nodes)
      return _.omit(spanJson,'nodes')
    }
    return span
  }




  /**
   * Parse `spanArray` and append each span into the transcription
   *
   * @description Uses type predicate {isSpan} to determine which span to append
   */
  function appendAllSpansToDOM(){
    spanArray.value.forEach((span) =>{
      if( isSpan(span) ){
        selectSpanNodes(span)
        affectPluginValues(span.plugins)
        applySpan(addNodesToSpan(span))
      }
    })
  }


  /**
   * Retrieve an array of `Node` from DOM and add them to `span`
   *
   * @param span The targetted span
   *
   * @return {Span} The span with new `nodes` Property
   */
  function addNodesToSpan(span: Span ): Span{
    selectSpanNodes(span)
    span.nodes = ExtractNodesFromCurrentSelection()
    return span
  }

  /**
   * Parse the `locals` array and extract spans related objects (spans & groups) to store theme separately
   *
   * @return {Promise} that resolve when the parsing is done. Used as an async dependencies for parent component
   */
  async function loadSpan(locals: any) {

    await nextTick()

    const result : Array<Span | SpanGroup | VirtualSpan | null> = []
    locals.value.forEach(segment => {
      if (((!segment?.sublocalisations) && (segment?.property?.[0]?.key == "entityType")) || !segment?.data) {
        result[segment?.id] = segment
      }
    })

    // keep default spanArray value on first loading
    if(!_.isEqual(result, [])){
      spanArray.value = result
    }

  }

  const onDeleteSpan = ({ index }: { index: number }) => {
    removeSpanFromDOM(index)
    spanArray.value[index] = null

  }

  return{
    focusGroup, recolorSpan,decolorSpan, saveSpan, extractTextFromSpanNodes, dragData,showDragPin, reccursiveSibling, deleteSpan, loadSpan, computeColorByLabel,  newFocus, handleDrop, recordSpanId, spanForm, op, spanMenuSelected, defaultLabel, applySpan, spanMenu, spanArray, handleSelectionV2, selectSpanNodes, onDeleteSpan, spanClicked,linkMode, labelSelected,isForResearch,deletedNum,
    affectPluginValues, initPluginValues, pluginValues,contextMenuOptions, mainPluginId, createSpanColorPalette,readPluginValues,mainPluginIndex,createdPluginOptionsList,contextControlPanelMenuOptions,spanControlPanelMenu,appendAllSpansToDOM, isSpan, isSpanGroup, isVirtualSpan,spanRole,selectedGroupVirtual,mainGroupPluginIndexVirtual,hideDragPin
  }
}


/**
 * @param initialization True for forcing the creation of a new instance
  **/
export default function (initialization?: boolean){
  if(!spanServiceInstance || initialization) spanServiceInstance = createSpanService()
  return spanServiceInstance
}
