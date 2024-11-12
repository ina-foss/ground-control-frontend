<template>
  <div :class="` col-span-4 flex flex-col overflow-y-auto     `">
    <div class=" h-[33px] mt-2 flex justify-center gap-10 sticky top-0">
      <SelectButton v-model="labelSelected" class="  " :options="labels" aria-labelledby="basic" />
      <div class="flex overflow-visible gap-1 items-center">
        <InputText v-model="newLabel" class="h-full  " />
        <Button icon="pi pi-plus" @click="addLabel()" />
      </div>
    </div>
    <div v-if="options.bloc">
      <div v-for="(local, index) in locals" :key="index" ref="spans" :class="`inline`">
        <AtomTranscriptionSpan :local="local" @mouseup="handleSelection" />
      </div>
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
  import {createApp} from 'vue'
  import AtomTranscriptionSpan from '../atoms/AtomTranscriptionSpan.vue';
  import AtomSpan from '~/components/atoms/AtomSpan.vue';
  import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';
  import AtomSpanOption from '~/components/atoms/AtomSpanOption.vue';
  import _, { random } from 'lodash';



  const { $application } = useService()
  const { unixToTimestamp } = $application



  const options = reactive({
    span: true,
    timecode: false,
    bloc: true
  })

  const emits = defineEmits([ 'on-segment-click' ]);

  const locals = defineModel<Array>('locals')

  const aggregatedLocals =  computed(()=>{
    const result = []
    locals.value.forEach((local)=>{
      local.sublocalisations?.localisation.forEach((word)=> result.push(word))
    })
    return result
  })

  watch(()=>options.bloc,async ()=> {
    await nextTick()
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
  const labelSelected = ref('')
  const labels = $ref(['Person','Citation','Verbe'])

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

function generatePastelColor(tagNumber : number) {
  // Use tag number to create a seed (this is a basic example, there are better ways to do this)
  const seed = tagNumber * 123456789;
  const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

  const r = random(3);
  const g = random(5);
  const b = random(7);

  return `rgb(${r}, ${g}, ${b}, `;
}

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
      const span = spanRefArray.value[currentFocus]
      spanRefArray.value[currentFocus].label[0] = newLabel
      updateSpan(span.tcin,span.tcout,newLabel,span.index)
  }
},{immediate: true})

const handleUnselect = () => {
  spanRefArray.value[currentFocus].focus = false
  currentFocus=undefined
}


  const formatSpan : any = (spanRef) => {
    const span = {}
    span.id = spanRef.id
    span.tcin = spanRef.tcin
    span.tcout = spanRef.tcout
    const property = {}
    property.key = "entityType"
    property.value = spanRef.label
    span.property = property
    return span

}



const handleSelection = (spanArg: any) => {
  const currentSelection = window.getSelection()
  if (currentSelection && currentSelection.toString() !== '' && (labelSelected.value != '' || spanArg)) {
    state.selection = currentSelection
    const id = spanArg.id != undefined ? spanArg.id : markRaw(spanCount.value)
    const label = spanArg?.property?.value[0] || spanArg.label[0] || markRaw(labelSelected.value)
    const spanTcin = spanArg?.tcin || currentSelection.anchorNode?.parentElement?.getAttribute('tcin')
    const spanTcout = spanArg?.tcout || currentSelection.focusNode?.parentElement?.getAttribute('tcout')
    state.range = currentSelection.getRangeAt(0)
    let direction
    if(!spanArg.tcin){
      const indexStart = _.indexOf(currentSelection.anchorNode?.parentElement?.parentNode?.childNodes,currentSelection.anchorNode?.parentElement)
      const indexEnd = _.indexOf(currentSelection.focusNode?.parentElement?.parentNode?.childNodes,currentSelection.focusNode?.parentElement)
      direction = ( indexStart <= indexEnd ) ? 'forward' : 'backward'
      if ( indexStart == indexEnd ){
        direction = (state.selection.anchorOffset < state.selection.extentOffset) ? 'forward' : 'backward'
      }
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
    state.selection.removeAllRanges()
    const span = document.createElement('span')
    const docFragment = state.range.extractContents()
    state.selection.empty()
    state.selection = null
    const color =  spanRefArray.value[id] ? spanRefArray.value[id].color : generatePastelColor(random(0,15,true))
    if (!spanClicked){
      const app = createApp({
        render () {
          return h(AtomSpan , {
              label: [label],
              // text: selectionTextString,
              tcIn: spanTcin,
              tcOut: spanTcout,
              color: color,
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
      Array.from(span.childNodes).forEach(node => { // Add the content of the Span indise a document Fragment
        fragment.appendChild(node)
      });
      fragment.firstChild?.firstChild?.appendChild(docFragment)
      state.range.insertNode(fragment) // Add this document fragment to the DOM
    }
    else{
      direction == 'forward' ? spanRefArray.value[spanIndex].addRight(docFragment) : spanRefArray.value[spanIndex].addLeft(docFragment)
      spanClicked = false
    }
    spanIndex = undefined
    formatSpan(spanRefArray.value[spanRefArray.value.length-1])
  }
}

  const loadSpan = ()=>{
    if(spanRefArray.value.length == 0){
      locals.value?.forEach((segment) => {
        if(!segment.tclevel  || segment.tclevel == 2 ){
          createSpan(segment)
        }
      });
    }
    else{
      spanRefArray.value?.forEach((segment) => {
        createSpan(segment)
      });
    }
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
    labelSelected.value = spanRefArray.value[currentFocus].label[0]
    }
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
    return local
  }

  defineExpose({ annotationFunction: saveSpan})

</script>

