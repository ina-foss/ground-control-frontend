<template>
  <div class="scroll-m-12 customText max-w-[700px] border-l-inherit  " >
    <div v-for="word in local.sublocalisations?.localisation" @drop="handleDrop" @dragleave="removeSpanPreview" @dragover="addSpanPrewiev" class="mb-4" :data-tc="word.tcin" :key="word.tcin" :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${ _.find(['.',','],(char)=>  char == word.data.text[0] ) ? 'pl-0' : 'pl-1' } hover:bg-surface-200 `">
      {{ word.data.text[0] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useService } from '#imports';

const { handleDrop } = inject('spanService')

const addSpanPrewiev = (event : DragEvent) =>{
  event.preventDefault()
  if(!event.dataTransfer.getData('pin_position')) return
  let spanUnderCursor = event.target
  const spanId = event.dataTransfer?.getData('spanid')
  while(!spanUnderCursor.getAttribute('data-tc') ) spanUnderCursor = spanUnderCursor.parentNode
  if(!spanUnderCursor.querySelector(`bg${spanId}`)){ // Extension du span
      spanUnderCursor.classList.add('dragged_outer')
    if(event.dataTransfer.getData('pin_position') == 'left'){
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
    if(event.dataTransfer.getData('pin_position') == 'left'){ // Pour la pin de gauche
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
  if(!event.dataTransfer.getData('pin_position')) return
  const spanId = event.dataTransfer?.getData('spanid')
  let spanUnderCursor = event.target
  while(!spanUnderCursor.getAttribute('data-tc') ) spanUnderCursor = spanUnderCursor.parentNode
  if(!spanUnderCursor.querySelector(`bg${spanId}`)){ // Extension du span
      spanUnderCursor.classList.remove('dragged_outer')
    if(event.dataTransfer.getData('pin_position') == 'left'){
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
    if(event.dataTransfer.getData('pin_position') == 'left'){ // Pour la pin de gauche
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
