<template>
  <div class=" rounded-lg w-[250px]">
    <Accordion value="0" class="w-full rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Affichage</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title ">
            <div v-if="showSpan" class="flex justify-between items-center self-stretch py-1 ">
              <span>Span</span>
              <ToggleSwitch v-model="span" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1">
              <span >TC</span>
              <ToggleSwitch v-model="timecode" :disabled="timecodeDisabled" />
            </div>
            <div v-if="showBloc" class="flex justify-between items-center self-stretch py-1">
              <span >Bloc</span>
              <ToggleSwitch v-model="bloc" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>


<script setup lang="ts">

import {FAIterators} from "refa";

const span = defineModel<boolean>('span')
const timecode = defineModel<boolean>('timecode')
const bloc = defineModel<boolean>('bloc')
defineProps({
  showBloc: {
    type: Boolean,
    default: true,
  },
  showSpan: {
    type: Boolean,
    default: true,
  },
});
const timecodeDisabled = ref(false)

let previousTimecode

watch(()=>bloc.value,(value)=>{
  if (!value){
    previousTimecode = markRaw(timecode.value)
    timecode.value = false
    timecodeDisabled.value = !timecodeDisabled.value
  }
  else{
    timecode.value = previousTimecode
    timecodeDisabled.value = !timecodeDisabled.value
  }
},{})




</script>
