<template>
    <div class=" col-span-4 flex flex-col overflow-y-auto   ">
      <SelectButton class="self-center sticky top-0" v-model="labelSelected" :unstyled="true" :options="labels" aria-labelledby="basic" />
      <div class="flex flex-col  " v-for="local in locals">
        <AtomTranscriptionSpan @mouseup="handleSelection" :local="local" />

      </div>
    </div>
    <div class=" h-full content-center place-self-center col-span-2">
      <AtomSpanDetail :relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray" @link="linkMode = !linkMode" @delete-span="onDeleteSpan($event)" @unselect="handleUnselect()" />
    </div>
</template>


<script setup lang="ts">

  import BadgeDirective from 'primevue/badgedirective';
  import {createApp} from 'vue'
  import AtomTranscriptionSpan from '../atoms/AtomTranscriptionSpan.vue';
  import AtomSpan from '~/components/atoms/AtomSpan.vue';
  import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';
  import _, { random } from 'lodash';

  const { locals } = defineProps(['locals'])

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
  const labels = ['Person','Citation','Verbe']
  const text = ref('Mercredi soir, le chef d’Etat a évacué l’idée d’adouber Lucie Castets, candidate officielle de la coalition de gauche : "Le sujet n’est pas un nom donné par une formation politique. La question est quelle majorité peut se dégager à l’Assemblée pour que le gouvernement de la France puisse passer des réformes."')
  const state = reactive({
    selection: null,
    range: null
  })

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

// TODO:  Molecule
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

// TODO: Atom
const handleUnselect = () => {
  spanRefArray.value[currentFocus].focus = false
  currentFocus=undefined
}

// TODO: Atom
const handleSelection = () => {
  const currentSelection = document.getSelection()
  if (currentSelection && currentSelection.toString() !== '' && labelSelected.value != '' ) {
    state.selection = currentSelection
    const index = markRaw(spanCount.value)
    const label =markRaw(labelSelected.value)
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
            label: label,
            text: selectionTextString,
            color: color,
            index: index,
            linkCss: linkCss,
            ref: el => spanRefArray.value[index] = el,
            onSpanReady: ({element, index}) => {
              elementArray.value[index] = element
            },
            onEditSpan: ({index}) => {
              spanClicked = true
              spanIndex = index
            },
            onFocusSpan: ({index}) =>{
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

// TODO: Atom
const deleteSelection = () => {
  if (state.selection) {
    const span = document.createElement('sup')
    span.style.backgroundColor = "red"
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
  }

}


</script>
