<template>
  <div :class="` col-span-4 flex flex-col overflow-y-auto     `">
    <div class=" h-[33px] mt-2 flex justify-center gap-10 sticky top-0">
      <SelectButton v-model="labelSelected" multiple class="  " :options="labels" aria-labelledby="basic" />
      <div class="flex overflow-visible gap-1 items-center">
        <InputText v-model="newLabel" class="h-full  " />
        <Button icon="pi pi-plus" @click="addLabel()" />
      </div>
    </div>
    <div v-if="options.bloc" ref="blockArray">
      <AtomTranscriptionSpan v-for="(local, index) in filteredLocal" :key="index" :local="local"  @mouseup="handleSelection"  />
    </div>
    <div v-else>
      <div
        v-for="word in aggregatedLocals" :key="word.tcin" :tcin="unixToTimestamp(word.tcin)"
        :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${_.find(['.', ','], (char) => char == word.data.text[0]) ? 'pl-0' : 'pl-1'} hover:bg-surface-200`"
        @mouseup="handleSelection">
          {{ word.data.text[0] }}
      </div>
    </div>
  </div>
  <div class=" h-[80%] top-[20%] flex flex-col items-center place-content-center  gap-10 col-span-2">
    <AtomSpanOption v-model:span="options.span" v-model:timecode="options.timecode" v-model:bloc="options.bloc" />
    <AtomSpanDetail
:relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray"
      @link="linkMode = !linkMode" @delete-span="onDeleteSpan" @unselect="handleUnselect()"
      @focus-span="handleFocusSpan" />
  </div>
</template>


<script setup lang="ts">

  import BadgeDirective from 'primevue/badgedirective';
  import {createApp,  createVNode, render } from 'vue'
  import AtomTranscriptionSpan from '../atoms/AtomTranscriptionSpan.vue';
  import AtomSpan from '~/components/atoms/AtomSpan.vue';
  import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';
  import AtomSpanOption from '~/components/atoms/AtomSpanOption.vue';
  import _ from 'lodash';
    import { Tag } from 'primevue';



  const { $application } = useService()
  const { timestampToUnix, unixToTimestamp } = $application



  const options = reactive({
    span: true,
    timecode: false,
    bloc: true
  })


  const locals = defineModel<Array>('locals')
  const blockArray = ref(null)

  const aggregatedLocals =  computed(()=>{
    const result = []
    locals.value.forEach((local)=>{
      local.sublocalisations?.localisation.forEach((word)=>{
        result.push(word)})

    })
    return result
  })

watch(() => options.timecode,async (timecode) => {
  await nextTick()
  blockArray.value?.childNodes.forEach((blocEl) => {
    removeTimecodeDiv(blocEl)
    if (timecode) {
      addTimecodeDiv(blocEl)
    }
  })
  },)

const removeTimecodeDiv = (blocEl) => {
  if (blocEl.nodeType == 1) {
    if (blocEl.firstElementChild.classList.contains('timecode')) blocEl.removeChild(blocEl.firstElementChild)
  }
}
const addTimecodeDiv = (blocEl,target) => {
    if (blocEl.nodeType == 1) {
      const divTag = document.createElement('div')
      divTag.classList.add("timecode")
      const tag = h(createVNode(Tag, { value: timestampToUnix(blocEl.firstElementChild?.getAttribute('tcin')), severity: 'secondary' }))
      render(tag, divTag)
      if (target) target.insertBefore(divTag, target.firstElementChild )
      else blocEl.insertBefore(divTag, blocEl.firstElementChild)

    }
}

  watch(()=>options.bloc,async ()=> {
    await nextTick()
    spanCount.value = 0
    loadSpan()

  })

  const newLabel = ref('')

  const app = createApp()
  app.directive('badge', BadgeDirective)
  let spanClicked = $ref(false)
  const spanRefArray = ref([])
  const elementArray = ref([])
  let linkMode = $ref(false)
  const linkCss = $computed(()=> linkMode ? ' hover:border-2 ' : '')
  const spanCount = ref(spanRefArray.value.length)
  let spanIndex = $ref()
  const relationArray = ref([])
  let lastFocus = $ref(undefined)
  let currentFocus = $ref(undefined)
  const labelSelected = ref([])
  const labels = $ref(['Person','Citation','Verbe'])

  const filteredLocal = computed(()=>{
    return _.filter(locals.value, (local)=> local.sublocalisations)
  })

  interface State {
    selection: Selection | null,
    range: Range | null
  }

  const state: State = reactive({
    selection: null ,
    range: null
  })


watch(()=>currentFocus,(newFocus:any, oldFocus:any)=>{
  lastFocus = oldFocus
  if( typeof lastFocus == 'number' && spanRefArray.value[oldFocus]) spanRefArray.value[oldFocus].focus = false
  if( typeof currentFocus == 'number') spanRefArray.value[newFocus].focus = true

},{immediate:true})


  const addLabel = () => {
    labels.push(newLabel.value)
    newLabel.value = ''
  }

const onDeleteSpan = ({ index } : { index : number }) => {
  const element : Element = elementArray.value[index]
  const text = spanRefArray.value[index].text
    if (element && element.parentNode){
      const parent = element.parentNode // on recupere la div contenant la phrase
      parent.replaceChild(document.createTextNode(text),element) // on remplace le span par du text
      parent.normalize(); // On fusionne les 3 textes

    }
  _.remove(relationArray.value,(relation) => relation.to == index || relation.from == index)
  spanRefArray.value.splice(index,1)
  spanRefArray.value.forEach((span,index)=>{
    span.index = index
  })
  currentFocus = undefined
  spanCount.value--
}

watch(()=>labelSelected.value,(newLabel:any)=>{
  if(typeof currentFocus != 'undefined'){
      spanRefArray.value[currentFocus].label = newLabel
  }
},{immediate: true})

const handleUnselect = () => {
  spanRefArray.value[currentFocus].focus = false
  currentFocus=undefined
  labelSelected.value = []
}


  const formatSpan : any = (spanRef: any) => {
    const span = {}
    span.id = spanRef.id
    span.tcin = spanRef.tcin
    span.tcout = spanRef.tcout
    const property =  []
    spanRef.label.forEach(label => {
      property.push({key: 'entityType', value: label})
    });
    span.property = property
    return span

}



const handleSelection = (spanArg: any) => {
  const currentSelection = window.getSelection()
  if (currentSelection && currentSelection.toString() !== '' && (labelSelected.value.length != 0  || spanArg?.tcin)) {
    state.selection = currentSelection
    const id = spanArg.id != undefined ? spanArg.id : markRaw(spanCount.value)
    const label : Array<string> = spanArg?.property?.map((label: { value: any; })=>label.value) || spanArg?.label  || markRaw(labelSelected.value)
    state.range = currentSelection.getRangeAt(0)
    let direction
    let indexStart
    let indexEnd
    let spanTcin = null
    let spanTcout = null
    if(!spanArg.tcin){
      if(currentSelection.anchorNode?.parentElement?.parentNode == currentSelection.focusNode?.parentElement?.parentNode){
         indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.childNodes,currentSelection.anchorNode?.parentElement)
         indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.childNodes,currentSelection.focusNode?.parentElement)
        direction = ( indexStart <= indexEnd ) ? 'forward' : 'backward'
      }
      else{
         indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.parentNode.childNodes,currentSelection.anchorNode?.parentElement?.parentElement)
         indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.parentNode.childNodes,currentSelection.focusNode?.parentElement?.parentNode)
        direction = ( indexStart <= indexEnd ) ? 'forward' : 'backward'

        }
        if ( indexStart == indexEnd ){
          direction = (state.selection.anchorOffset < state.selection.extentOffset) ? 'forward' : 'backward'
        }
          spanTcin = getAttribute(direction,currentSelection,'tcin')
          spanTcout = getAttribute(direction,currentSelection,'tcout')
        if( direction == 'forward'){
          state.range.setStartBefore(state.selection.anchorNode?.parentNode)
          state.range.setEndAfter(state.selection.focusNode)
        }
        else{
          const startWord = state.selection.focusNode.parentNode
          state.range.setEndAfter(state.selection.anchorNode)
          state.range.setStartBefore(startWord)
        }
    }
    if( spanTcin ==null) spanTcin = spanArg?.tcin
    if( spanTcout == null) spanTcout = spanArg?.tcout
    state.selection.removeAllRanges()
    const nextContainerSibling = state.range.endContainer.nextSibling
    const span = document.createElement('span') // temporary Element to create the span DOM
    const docFragment = state.range.extractContents() // extract all the HTMLElements in the range
    state.selection.empty()
    state.selection = null
    if (!spanClicked){
      const app = createApp({
        render () {
          return h(AtomSpan , {
              label: label,
              tcIn: spanTcin,
              tcOut: spanTcout,
              id: id,
              linkCss: linkCss,
              options: options,
              ref: el => spanRefArray.value[id] = el,
              onSpanReady: ({element, index}) => {
                elementArray.value[index] = element
              },
              onEditSpan: ({index}) => {
                spanClicked = true
                spanIndex = index
              },
              onFocusSpan:(event)=> handleFocusSpan(event)
          })
        }
      })
        spanCount.value++
      app.mount(span) // Render the Span
      const fragment = document.createDocumentFragment()
      Array.from(span.childNodes).forEach(node => { // Add the content of the temporary element inside a document Fragment
        fragment.appendChild(node)
      });
        if (docFragment.firstChild?.firstChild?.nodeType == 1){
          const blocs =  docFragment.childNodes
          const border = docFragment.firstChild.cloneNode(false)
          const blocNb = blocs.length


          blocs.forEach((previousBlock)=>{
            const wordArray = previousBlock.childNodes
            wordArray.forEach((word)=>{
            if( (word.nodeType == 1) && word.getAttribute('tcin') )
            docFragment.appendChild(word.cloneNode(true))
            })
          })
          let i  = 0
          while ( i< blocNb ){
              docFragment.firstChild?.remove()
              i++
          }
          fragment.firstChild?.firstChild?.appendChild(docFragment) // Add all the word inside the final div
          border.appendChild(fragment)
          if(options.timecode ) {
            addTimecodeDiv(border.firstChild.firstElementChild,border)
            if(nextContainerSibling?.getAttribute('tcin')) addTimecodeDiv(nextContainerSibling?.parentNode)
          }
          state.range.insertNode(border) // Add this document fragment to the DOM

        }

        else{
          fragment.firstChild?.firstChild?.appendChild(docFragment) // Add all the word inside the final div
          state.range.insertNode(fragment) // Add this document fragment to the DOM
        }

    }
    else{
      direction == 'forward' ? spanRefArray.value[spanIndex].addRight(docFragment) : spanRefArray.value[spanIndex].addLeft(docFragment)
      spanClicked = false
    }
    spanIndex = undefined
    formatSpan(spanRefArray.value[spanRefArray.value.length-1])
  }
}

  const getAttribute = (direction, selection,tc)=> {
    if( ( direction == 'forward' && tc == 'tcin') || ( direction == 'backward' && tc == 'tcout') ) return selection.anchorNode?.parentElement?.getAttribute(tc)
    else if ( ( direction=='forward' && tc == 'tcout') || ( direction == 'backward' && tc == 'tcin' )) return selection.focusNode?.parentElement.getAttribute(tc)
  }

  const loadSpan = ()=>{
    if(spanRefArray.value.length == 0){
      locals.value?.forEach((segment) => {
        if((!segment.sublocalisations) && ( segment.property?.[0].key=="entityType")){
          createSpan(segment)
        }
      });
    }
    else{
      spanRefArray.value?.forEach((segment) => {
        createSpan(segment)
      });
    }
    if(relationArray.value.length==0)
    locals.value?.forEach(segment => {
        if((!segment.sublocalisations) && ( segment.property?.[0].key == 'relationType')){
          relationArray.value.push({from: segment.from, to: segment.to})
      }
    });
  }

  const createSpan = (span) =>{
        const startNode = document.querySelector(`[tcin="${span.tcin}"]`)
        const endNode = document.querySelector(`[tcout="${span.tcout}"]`)
        const range : Range = new Range()
        range.setStartBefore(startNode)
        range.setEndAfter(endNode)
        const selection : Selection | null = window.getSelection()
        selection?.empty()
        selection?.addRange(range)

        handleSelection(span)
  }

  const handleFocusSpan = ({index}) =>{
    if( linkMode ){
    relationArray.value.push({from: currentFocus, to: index})
    linkMode=false
    }
    else{
    spanClicked = false
    currentFocus = index
    labelSelected.value = spanRefArray.value[currentFocus].label
    }
  }

  function formatRelation(relationArg: never): any {
    const relation = {}
    relation.property = []
    const property = {}
    property.key = 'relationType'
    property.value = 'Indiciates'
    relation.property.push(property)
    relation.from = relationArg.from
    relation.to = relationArg.to
    return relation
  }

  onMounted(async()=>{
    await nextTick()
    loadSpan()
  })

  const saveSpan = (local) => {
    _.remove(local,(el)=>!el.sublocalisations)
    spanRefArray.value.forEach((span)=>{
      local.push(formatSpan(span))
    })
    relationArray.value.forEach((relation)=>{
      local.push(formatRelation(relation))
    })
    return local
  }

  defineExpose({ annotationFunction: saveSpan})


</script>

