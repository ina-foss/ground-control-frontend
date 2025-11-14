<template>
  <span-transcription-wrapper class=" bg-white rounded-md scroll-m-12 inline-flex flex-wrap gap-y-6 customText w-[75ch] border-l-inherit py-6 px-2 " >
    <div v-for="word in local.sublocalisations?.localisation.sort((wordA,wordB)=>unixToTimestamp(wordA?.tcin)-unixToTimestamp(wordB?.tcin))" @drop="handleDrop" @dragleave="removeSpanPreview" @dragover="addSpanPrewiev" @click="$emit('handleWordClick',{tcin: word.tcin, event: $event})"  :data-tc="word.tcin" :key="word.tcin" :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  px-[2px] hover:bg-surface-200 `">
      {{ word.data.text[0] }}
    </div>
  </span-transcription-wrapper>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useService } from '#imports';

const { handleDrop, dragData } = useSpanService()

defineEmits(['handleWordClick'])

const addSpanPrewiev = (event : DragEvent) =>{
  event.preventDefault()
  if(!dragData.pin_position) return
  let spanUnderCursor = event.target
  const spanId = dragData.spanid
  while(!spanUnderCursor.getAttribute('data-tc') ) spanUnderCursor = spanUnderCursor.parentNode
  if(!spanUnderCursor.querySelector(`bg${spanId}`)){ // Extension du span
      spanUnderCursor.classList.add('dragged_outer')
    if(dragData.pin_position == 'left'){
    // Pour le cas start pin
      let nextSpan = spanUnderCursor.nextSibling
      while(!nextSpan.querySelector(`bg${spanId}`)){
        nextSpan.classList.add('dragged_outer')
        nextSpan = nextSpan.nextSibling
      }
    }
    else {
      let previousSpan = spanUnderCursor.previousSibling
      while(!previousSpan.querySelector(`bg${spanId}`)){
        previousSpan.classList.add('dragged_outer')
        previousSpan = previousSpan.previousSibling
      }
    }
  }
  else{ // Raccourcissement du span
    spanUnderCursor.classList.add('dragged_inner')
    if(dragData.pin_position == 'left'){ // Pour la pin de gauche
      let previousSpan = spanUnderCursor.previousSibling
      while(previousSpan.querySelector(`bg${spanId}`)){
        previousSpan.classList.add('dragged_inner')
        previousSpan = previousSpan.previousSibling
      }
    }
    else {
      let nextSpan = spanUnderCursor.nextSibling
      while(nextSpan.querySelector(`bg${spanId}`)){
        nextSpan.classList.add('dragged_inner')
        nextSpan = nextSpan.nextSibling
      }
    }
  }
}

const removeSpanPreview = (event) => {
  event.preventDefault()
  if(!dragData.pin_position) return
  const spanId = dragData.spanid
  let spanUnderCursor = event.target
  while(!spanUnderCursor.getAttribute('data-tc') ) spanUnderCursor = spanUnderCursor.parentNode
  if(!spanUnderCursor.querySelector(`bg${spanId}`)){ // Extension du span
      spanUnderCursor.classList.remove('dragged_outer')
    if(dragData.pin_position == 'left'){
    // Pour le cas start pin
      let nextSpan = spanUnderCursor.nextSibling
      while(!nextSpan.querySelector(`bg${spanId}`)){
        nextSpan.classList.remove('dragged_outer')
        nextSpan = nextSpan.nextSibling
      }
    }
    else {
      let previousSpan = spanUnderCursor.previousSibling
      while(!previousSpan.querySelector(`bg${spanId}`)){
        previousSpan.classList.remove('dragged_outer')
        previousSpan = previousSpan.previousSibling
      }
    }
  }
  else{ // Raccourcissement du span
    spanUnderCursor.classList.remove('dragged_inner')
    if(dragData.pin_position == 'left'){ // Pour la pin de gauche
      let previousSpan = spanUnderCursor.previousSibling
      while(previousSpan.querySelector(`bg${spanId}`)){
        previousSpan.classList.remove('dragged_inner')
        previousSpan = previousSpan.previousSibling
      }
    }
    else {
      let nextSpan = spanUnderCursor.nextSibling
      while(nextSpan.querySelector(`bg${spanId}`)){
        nextSpan.classList.remove('dragged_inner')
        nextSpan = nextSpan.nextSibling
      }
    }
  }

}



const { $application } = useService()
const { unixToTimestamp } = $application

const { local, } = defineProps({
  local: {
    type: Object,
    default : () => {}
  },
})



</script>
<style scoped>
.dragged_outer{
  background-color: highlight;
  color: white;
}
.dragged_inner{
  color: red;
}
</style>
