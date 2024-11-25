<template>
  <div class="flex items-start rounded-lg text-[#282828] gap-[10px] text-sm/4 flex-col w-[186px] p-3 p bg-white">
    <b >Affichage</b>
    <div class="flex justify-between items-center self-stretch py-1 ">
      <span class="">Span</span>
      <ToggleSwitch v-model="span" />
    </div>
    <div class="flex justify-between items-center self-stretch py-1">
      <span>TC</span>
      <ToggleSwitch v-model="timecode" :disabled="timecodeDisabled"/>
    </div>
    <div class="flex justify-between items-center self-stretch py-1">
      <span>Bloc</span>
      <ToggleSwitch v-model="bloc"/>
    </div>
  </div>
</template>


<script setup lang="ts">

const span = defineModel<boolean>('span')
const timecode = defineModel<boolean>('timecode')
const bloc = defineModel<boolean>('bloc')


let timecodeDisabled = $ref(false)

let previousTimecode

watch(()=>bloc.value,(value)=>{
  if (!value){
    previousTimecode = markRaw(timecode.value)
    timecode.value = false
    timecodeDisabled = !timecodeDisabled
  }
  else{
    timecode.value = previousTimecode
    timecodeDisabled = !timecodeDisabled
  }
},{})




</script>
