<template>
  <div class="flex items-start rounded-lg text-[#282828] gap-[10px] text-sm/4 flex-col w-[186px] p-3 p bg-white">
    <b >Affichage</b>
    <div class="flex justify-between items-center self-stretch py-1 ">
      <span class="">Span</span>
      <ToggleSwitch v-model="span" />
    </div>
    <div class="flex justify-between items-center self-stretch py-1">
      <span>TC</span>
      <ToggleSwitch v-model="timecode"/>
    </div>
    <div class="flex justify-between items-center self-stretch py-1">
      <span>Bloc</span>
      <ToggleSwitch v-model="bloc"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useToast } from '#imports';

const span = defineModel<boolean>('span')
const timecode = defineModel<boolean>('timecode')
const bloc = defineModel<boolean>('bloc')

const toast = useToast()

let previousTimecode

watch(()=>bloc.value,(value)=>{
  if (!value){
    previousTimecode = markRaw(timecode.value)
    timecode.value = false
  }
  else{
    timecode.value = previousTimecode
  }
},{immediate: true})

watch(()=>timecode.value,(value)=>{
  if(!bloc.value && value == true){
    toast.add({detail: "Impossible de visualiser les timecodes lorsque l'option bloc est desactivée", summary: 'Erreur', severity: 'error', life: 3000})
    timecode.value = false }
})



</script>
