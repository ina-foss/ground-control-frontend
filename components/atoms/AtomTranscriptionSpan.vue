<template>
<div class="w-full p-2 border m-2 ">
    <div :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${ _.find(['.',','],(char)=>  char == word.data.text[0] ) ? 'pl-0' : 'pl-1' } hover:bg-surface-200`" v-for="word in local.sublocalisations?.localisation">
      {{ word.data.text[0] }}
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'

const { $application } = useService()
const { unixToTimestamp } = $application

const { local } = defineProps({
  local: {
    type: Object,
    default : () => {}
  }
})



</script>
