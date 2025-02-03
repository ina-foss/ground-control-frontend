<template>
  <div class=" p-2 border m-2 scroll-m-12 " >
    <div v-for="word in local.sublocalisations?.localisation" :data-tc="word.tcin" :key="word.tcin" :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${ _.find(['.',','],(char)=>  char == word.data.text[0] ) ? 'pl-0' : 'pl-1' } hover:bg-surface-200`">
      {{ word.data.text[0] }}
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useService } from '#imports';

const { $application } = useService()
const { unixToTimestamp } = $application

const { local, } = defineProps({
  local: {
    type: Object,
    default : () => {}
  }
})



</script>
