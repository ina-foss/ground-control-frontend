<template>
  <div class=" p-2 border m-2 " >
    <div v-for="word in local.sublocalisations?.localisation" :key="word.tcin" :tcin="unixToTimestamp(word.tcin)" :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${ _.find(['.',','],(char)=>  char == word.data.text[0] ) ? 'pl-0' : 'pl-1' } hover:bg-surface-200`">
      {{ word.data.text[0] }}
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useService } from '#imports';
import { Tag } from 'primevue';

const { $application } = useService()
const { unixToTimestamp ,timestampToUnix } = $application

const { local, tcToggle } = defineProps({
  local: {
    type: Object,
    default : () => {}
  },
  tcToggle:{
    type: Boolean,
    default : () => true
  }
})



</script>
