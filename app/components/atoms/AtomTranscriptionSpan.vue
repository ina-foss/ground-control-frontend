<template>
  <transcription-container class="flex flex-col gap-2 ">
    <Tag
      v-if="options.timecode_bloc"
      severity="secondary"
      :value="timestampToUnix(local.tcin)"
      class="w-fit bg-surface-200 cursor-pointer"
      @click="$emit('handleWordClick',{tcin: local.tcin, tcout:local.tcout, event: $event})"
    />
    <span-transcription-wrapper class=" bg-white rounded-md scroll-m-12 inline-flex flex-wrap gap-y-6 w-[75ch] border-l-inherit py-6 px-2 " >
      <div
v-for="word in local.sublocalisations?.localisation.sort((wordA,wordB)=>unixToTimestamp(wordA?.tcin)-unixToTimestamp(wordB?.tcin))"
        :key="word.tcin" :data-tc="word.tcin" :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)"
        :class="{'inline-block px-[2px] hover:bg-surface-200 relative  ': true, 'text-active  ': playerTime > unixToTimestamp(word.tcin),}" @drop="handleDrop" @dragleave="removeSpanPreview" @dragover="addSpanPrewiev"
        @click="$emit('handleWordClick',{tcin: word.tcin, event: $event, tcout:word.tcout})">
        {{ word.data.text[0] }}
      </div>
    </span-transcription-wrapper>
  </transcription-container>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useService } from '#imports';

const { local, playerTime } = defineProps({
  local: {
    type: Object,
    default : () => {}
  },
  playerTime :{
    type: Number,
    default : () => 0
  }
})

const { handleDrop, dragData } = useSpanService()

const {options} = useOptions()

const { $application } = useService()
const { timestampToUnix, unixToTimestamp } = $application
const { spanArray } = useSpanService()

defineEmits(['handleWordClick'])

let currentSelection : Node[]

/**
  * Reccurssive function to find all the nodes between the new wished position of a span border `startNode` and the old position of the same border
  * @param starNode Node or Array of Node that are between the two position
  * @param pin Tells which side of the span is being modified. Either `start` or `end`
  * @param direction Whether the span is being expended or shrinked. Either `expend` or `shrink`
  * @param spanId ID of the span being modified
  **/
function reccWordDiff(startNode: Node | Node[], pin: 'start' | 'end', direction: 'shrink'|'extend',spanId: number) : Node[] {
  let nextNode

  const currentNode = Array.isArray(startNode) ? startNode[startNode.length-1] : startNode

  // find the next node based on parameters
  if( (direction == 'extend' && pin == 'end') || (direction == 'shrink' && pin == 'start' )
  ){
    nextNode = currentNode.previousSibling as Element
  }
  else nextNode = currentNode.nextSibling as Element


  // handle being at the end of a segment
  if (nextNode.nodeType == Node.TEXT_NODE ) {
      nextNode = currentNode.parentElement?.parentElement
  }

  // when changing segment, chose either to start with the first word or the last one
  if(currentNode.nodeName == "TRANSCRIPTION-CONTAINER"){
    nextNode = nextNode?.lastChild
    nextNode = ((pin == 'end' && direction == 'extend') || (pin == 'start' && direction == 'shrink') ) ? nextNode?.lastElementChild : nextNode?.firstElementChild
  }

  if (
    (direction == 'extend' && pin =='end' && nextNode.querySelector(`bg${spanId}`) ) ||
    (direction == 'extend' && pin =='start' && nextNode.querySelector(`bg${spanId}`) ) ||
    (direction == 'shrink' && pin =='end' && !nextNode.querySelector(`bg${spanId}`) ) ||
    (direction == 'shrink' && pin =='start' && !nextNode.querySelector(`bg${spanId}`) )
 ){
    return Array.isArray(startNode) ? startNode : [startNode]
  }

  // Reccursive call by adding the nextNode in the final array
  return  reccWordDiff(Array.isArray(startNode) ? startNode.concat([nextNode as Node]) : [startNode].concat([nextNode as Node]) ,pin,direction,spanId)
}

const addSpanPrewiev = (event : DragEvent) =>{
  event.preventDefault()
  if(!dragData.pin_position) return
  let spanUnderCursor = event.target as Element
  const spanId : number = dragData.spanid
  const span = spanArray.value[spanId] as Span
  // make sure to manipulate div which contains the whole word
  while(!spanUnderCursor.getAttribute('data-tc') ) spanUnderCursor = spanUnderCursor.parentNode as Element
  // determine the direction of the border slide
  const direction = spanUnderCursor.querySelector(`bg${spanId}`) ? 'shrink' : 'extend'
  if( // don't show preview if the border are move incorrectly
    ((spanUnderCursor as Node).compareDocumentPosition(span.nodes[span.nodes.length-1]) == Node.DOCUMENT_POSITION_PRECEDING && dragData.pin_position == 'left') ||
    ((spanUnderCursor as Node).compareDocumentPosition(span.nodes[0]) == Node.DOCUMENT_POSITION_FOLLOWING && dragData.pin_position == 'right')
  ) return
  // apply style on all the word between new position and old position
    currentSelection = reccWordDiff(spanUnderCursor,dragData.pin_position == "right" ? "end" : "start", direction,spanId)
    currentSelection
    .filter((element:Node)=>(element as Element).getAttribute('data-tc'))
    .forEach((element:Node)=>(element as Element).classList.add(direction == 'extend' ? 'dragged_outer' : 'dragged_inner'))
}

const removeSpanPreview = () => {
  currentSelection
    .filter((element:Node)=>(element as Element).getAttribute('data-tc'))
    .forEach((element:Node)=>(element as Element).classList.remove('dragged_outer','dragged_inner'))

}

</script>
<style scoped>
  @reference "../../assets/css/app.css";

  .selected-segment > span-transcription-wrapper {
    @apply border-active border-2
  }

  .dragged_outer{
    background-color: highlight;
    color: white;
  }
  .dragged_inner{
    color: red;
  }

</style>
