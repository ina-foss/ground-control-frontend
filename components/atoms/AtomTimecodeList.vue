<template>
  <div class="flex flex-col text-title gap-3 grid grid-cols-[1fr_1fr]">
    <div v-for="(timecode,index) in timecodeHistory" class="flex items-center ">
      <div class="hover:text-[#0b7698] cursor-pointer" @click="videoPlayer.consumeTimecode(index)">
      <span> {{ timestampToUnix(timecode) }}</span>
      <i :class="{'pi pi-arrow-left': true,
              'opacity-0': index != timecodeHistory?.length -1 } "/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">


import type {Ref} from "vue";
import AtomVideoAmalia from "~/components/atoms/AtomVideoAmalia.vue";
const {$application} = useService()
const {timestampToUnix, unixToTimestamp} = $application
const timecodeHistory: Ref<number[]> | undefined = inject('timecode-history')
const videoPlayer = inject("videoPlayer") as Ref<InstanceType<typeof AtomVideoAmalia> | null>;

</script>

<style scoped lang="postcss">

.show-arrow {
  @apply p-2
}

.show-arrow i {
  @apply opacity-100
}


</style>
