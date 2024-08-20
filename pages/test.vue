<template>
  <div class="flex flex-row justify-evenly h-screen items-center w-full">
    <div class="flex flex-col p-6  gap-3 justify-center items-center h-screen">
      <Toast />
      <SelectButton :unstyled="true" v-model="labelSelected" :options="labels" aria-labelledby="basic" />
      <div @mouseup="handleSelection" id="text">{{text}}</div>
      <!-- <InputText v-model="state.range" class="border-black border-3"/> -->
      <Button label="Clear all" @click="deleteSelection" />


    </div>
  <div>
    <AtomSpanDetail @deleteSpan="onDeleteSpan($event)"  :focusSpan="lastFocus" :spanRefArray="spanRefArray" />
  </div>
  </div>
</template>

<script setup lang="ts">
import { clamp, random } from 'lodash';
import BadgeDirective from 'primevue/badgedirective';
import { useToast } from 'primevue/usetoast';
import {createApp, createTextVNode} from 'vue'
import AtomSpan from '~/components/atoms/AtomSpan.vue';
import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';

const app = createApp()
app.directive('badge', BadgeDirective)
const toast = useToast()
let spanClicked = $ref(false)
let currentFunction = $ref()
const spanRefArray = ref([])
const elementArray = ref([])
const spanCount = ref(spanRefArray.value.length)
let spanIndex = $ref()
let lastFocus = $ref(undefined)
const labelSelected = ref('Person')
const labels = ['Person','Citation','Verbe']
const text = ref('Mercredi soir, le chef d’Etat a évacué l’idée d’adouber Lucie Castets, candidate officielle de la coalition de gauche : "Le sujet n’est pas un nom donné par une formation politique. La question est quelle majorité peut se dégager à l’Assemblée pour que le gouvernement de la France puisse passer des réformes."')
const state = reactive({
  selection: null as Selection | null,
  range: null as Range | null
})


const selectionText = computed(() => {
  if (state.range != null) {
    return state.range.toString()
  }
  return ''
})

const handleDelete = (event) => {
  console.log(event)
}

function generatePastelColor(tagNumber) {
  // Use tag number to create a seed (this is a basic example, there are better ways to do this)
  const seed = tagNumber * 123456789;
  const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

  const r = random(3);
  const g = random(5);
  const b = random(7);

  return `rgb(${r}, ${g}, ${b}, `;
}

const onDeleteSpan = ({index}) => {
  let element = elementArray.value[index]
  let text = spanRefArray.value[index].text
  console.log(element)
    if (element && element.parentNode){
      let parent = element.parentNode // on recupere la div contenant la phrase
      parent.replaceChild(document.createTextNode(text),element) // on remplave le span par du text
      parent.normalize(); // On fusionne les 3 textes

    }
  spanRefArray.value.splice(index,1)
  lastFocus = undefined
  console.log(spanRefArray.value)
}

const handleSelection = () => {
  const currentSelection = document.getSelection()
  if (currentSelection && currentSelection.toString() !== '') {
    state.selection = currentSelection
    let index = markRaw(spanCount.value)
    let label = markRaw(labelSelected.value)
    let direction = (currentSelection.anchorOffset < currentSelection.extentOffset) ? 'forward' : 'backward'
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
    let selectionTextString = selectionText.value
    state.selection.removeAllRanges()
    let span = document.createElement('span')
    state.range.deleteContents()
    state.selection.empty()
    state.selection = null

    if (!spanClicked){
    const app = createApp({
      render () {
        return h(AtomSpan , {
           label: label,
           text: selectionTextString,
            color: generatePastelColor(random(0,15,true)),
            index: index,
            ref: el => spanRefArray.value.push(el),
            onSpanReady: ({element, index}) => {
              elementArray.value[index] = element
            },
            onEditSpan: ({index}) => {
              spanClicked = true
              spanIndex = index
            },
            onFocusSpan: ({index}) =>{
              spanClicked = false
              console.log(lastFocus)
              if( typeof lastFocus == 'number') spanRefArray.value[lastFocus].focus = false
              console.log(lastFocus ? spanRefArray.value[lastFocus].focus : lastFocus)
              lastFocus = index
              spanRefArray.value[lastFocus].focus = true
              console.log(spanRefArray.value[index].focus)
            }


        })
      }
    })
      spanCount.value++
    const instance = app.mount(span)
    const fragment = document.createDocumentFragment()
    Array.from(span.childNodes).forEach(node => {
      fragment.appendChild(node)
    });
    state.range.insertNode(fragment)
    }
    else{
      console.log(spanIndex)
      direction == 'forward' ? spanRefArray.value[spanIndex].addRight(selectionTextString) : spanRefArray.value[spanIndex].addLeft(selectionTextString)
      spanClicked = false
    }

  }
}

const deleteSelection = () => {
  if (state.selection) {
    let span = document.createElement('sup')
    span.style.backgroundColor = "red"
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
  }

}


</script>

