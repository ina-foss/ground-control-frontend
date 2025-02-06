<template>
  <div class="flex flex-col text-title gap-3 grid grid-cols-[1fr_1fr]">
    <div v-for="(timecode,index) in timecodeHistory" class="flex items-center">
      <span> {{ timestampToUnix(timecode) }}</span>
      <i :class="{'pi pi-arrow-left': true,
              'opacity-0': index != timecodeHistory?.length -1 } "/>
    </div>
  </div>
</template>


<script setup lang="ts">


import type {Ref} from "vue";

const {$application} = useService()
const {timestampToUnix} = $application
const timecodeHistory: Ref<number[]> | undefined = inject('timecode-history')

</script>

<style scoped lang="postcss">

.show-arrow {
  @apply p-2
}

.show-arrow i {
  @apply opacity-100
}


</style>
