<template>
    <div class=" col-span-4 flex flex-col overflow-y-auto    ">
      <div class=" flex justify-center gap-10 sticky top-0">
        <SelectButton class="self-center " v-model="labelSelected" :unstyled="true" :options="labels" aria-labelledby="basic" />
        <div class="flex items-center">
          <InputText v-model="newLabel" size="small" />
          <Button icon="pi pi-plus" size='small' @click="addLabel()" />
        </div>
      </div>
      <div class="flex flex-col  " ref="spans" v-for="local in locals">
        <AtomTranscriptionSpan @mouseup="handleSelection" :local="local" />
      </div>
    </div>
    <div  class=" h-full flex flex-col items-center place-content-center  gap-10 col-span-2">
      <AtomSpanOption  v-model:span="options.span" v-model:timecode="options.timecode" v-model:bloc="options.bloc" />
      <AtomSpanDetail ref="detailRef" :relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray"
      @link="linkMode = !linkMode" @delete-span="onDeleteSpan" @unselect="handleUnselect()" @focus-span="handleFocusSpan" />
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


  const options = reactive({
    span: true,
    timecode: false,
    bloc: true
  })


  const { locals } = defineProps(['locals'])

  let newLabel = ref('')

  const app = createApp()
  app.directive('badge', BadgeDirective)
  let spanClicked = $ref(false)
  const spanRefArray = ref([])
  const elementArray = ref([])
  let linkMode = $ref(false)
  const linkCss = $computed(()=> linkMode ? ' hover:border-2 ' : '')
  const linkCursor = $computed(()=> linkMode ? ' cursor-crosshair ' : '')
  const spanCount = ref(spanRefArray.value.length)
  let spanIndex = $ref()
  const relationArray = ref([])
  let lastFocus = $ref(undefined)
  let currentFocus = $ref(undefined)
  const labelSelected = ref('')
  const labels = $ref(['Person','Citation','Verbe'])
  const text = ref('Mercredi soir, le chef d’Etat a évacué l’idée d’adouber Lucie Castets, candidate officielle de la coalition de gauche : "Le sujet n’est pas un nom donné par une formation politique. La question est quelle majorité peut se dégager à l’Assemblée pour que le gouvernement de la France puisse passer des réformes."')
  const state = reactive({
    selection: null,
    range: null
  })


  const divRef = useTemplateRef('spans')


const selectionText = computed(() => {
  if (state.range != null) {
    return state.range.toString()
  }
  return ''
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
      spanRefArray.value[currentFocus].label[0] = newLabel
  }
},{immediate: true})

const handleUnselect = () => {
  spanRefArray.value[currentFocus].focus = false
  currentFocus=undefined
}

  const recordSpan = (range,index,label) => {
    console.log('salut')
    const list =  range.startContainer.parentNode.parentNode.parentNode
    const element = range.startContainer.parentNode
    const segmentPart = (_.indexOf(element.childNodes,range.startContainer))
    let offset = 0

    if(element.hasChildNodes()){
      let children = element.childNodes

      children.forEach(function (currentValue,index) {
        if (index < segmentPart){
          offset += currentValue.firstChild?.firstChild.length || currentValue.length
        }
      });
    }
    const indexSegment = _.indexOf(list.childNodes, element.parentNode)

    if(!locals[indexSegment-2].data.span) locals[indexSegment-2].data.span = []
    if(!spanClicked) locals[indexSegment-2].data.span.push({id:index, label: label, start: offset+range.startOffset, end: offset+range.endOffset })
    else{
        let span = _.find(locals[indexSegment-2].data.span, (span)=> span.id == spanIndex)
        if (span.start == offset + range.endOffset) span.start = range.startOffset+offset
        else span.end += range.endOffset
    }

}

const handleSelection = (spanArg: any) => {
  const currentSelection = document.getSelection()
  if (currentSelection && currentSelection.toString() !== '' && (labelSelected.value != '' || spanArg?.label )) {
    state.selection = currentSelection
    const index = spanArg?.index || markRaw(spanCount.value)
    const label = spanArg?.label || markRaw(labelSelected.value)
    const direction = (currentSelection.anchorOffset < currentSelection.extentOffset) ? 'forward' : 'backward'
    if( state.selection.extentNode.data[state.selection.extentOffset-1] != ' '){
      state.selection.modify('extend',direction,'word') // Extend the selection to the whole word
    }
    if(direction == 'forward'){
       if( state.selection.extentNode.data[state.selection.extentOffset-1] == ' '){ // Delete the last characted if it's a space
        state.selection.modify('extend','backward','character')
        }
    }
    else {
        if( state.selection.extentNode.data[state.selection.extentOffset] === ' '){ // Delete the last characted if it's a space
          state.selection.modify('extend','forward','character')
        }
    }
    state.range = currentSelection.getRangeAt(0)
    if ( spanArg.label == undefined ) recordSpan(state.range,index,label)
    const selectionTextString = selectionText.value
    state.selection.removeAllRanges()
    const span = document.createElement('span')
    state.range.deleteContents()
    state.selection.empty()
    state.selection = null
    const color =  spanRefArray.value[index] ? spanRefArray.value[index].color : generatePastelColor(random(0,15,true))
    if (!spanClicked){
    const app = createApp({
      render () {
        return h(AtomSpan , {
            label: [label],
            text: selectionTextString,
            color: color,
            index: index,
            linkCss: linkCss,
            options: options as Object,
            ref: el => spanRefArray.value[index] = el,
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
     app.mount(span)
    const fragment = document.createDocumentFragment()
    Array.from(span.childNodes).forEach(node => {
      fragment.appendChild(node)
    });
    state.range.insertNode(fragment)
    }
    else{
      direction == 'forward' ? spanRefArray.value[spanIndex].addRight(selectionTextString) : spanRefArray.value[spanIndex].addLeft(selectionTextString)
      spanClicked = false
    }

  }
}

  const detailRef = ref(null)

  const loadSpan = ()=>{
    console.log(locals)
    locals?.forEach((segment,index) => {
      if(segment.data.span){
        const sortedSpan = _.orderBy(segment.data.span,['start'],['desc'])
        sortedSpan.forEach((span)=>{
          const range = new Range()
          range.setStart(divRef.value[index].firstChild.firstChild, span.start)
          range.setEnd(divRef.value[index].firstChild.firstChild, span.end)
          let selection = window.getSelection()
          selection.empty()
          selection.addRange(range)


          handleSelection(span)
        })
      }
    });
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
const deleteSelection = () => {
  if (state.selection) {
    const span = document.createElement('sup')
    span.style.backgroundColor = "red"
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
  }

}

  onMounted(async()=>{
    await nextTick()
    loadSpan()
    console.log(locals)
  })
  defineExpose({ loadSpan})

</script>
