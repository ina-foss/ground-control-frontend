<template>
  <div class=" rounded-lg w-full">
    <Accordion value="0" class="w-full rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Affichage</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title ">
            <div class="flex justify-between items-center self-stretch py-1 "v-if="span != undefined">
              <span>Span</span>
              <ToggleSwitch v-model="span" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1" v-if="timecode_bloc != undefined">
              <span >TC bloc</span>
              <ToggleSwitch v-model="timecode_bloc" :disabled="timecodeDisabled" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1" v-if="bloc != undefined">
              <span >Bloc</span>
              <ToggleSwitch v-model="bloc" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1" v-if="timecode_segment != undefined">
              <span >TC segment</span>
              <ToggleSwitch v-model="timecode_segment" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>


<script setup lang="ts">

const span = defineModel<boolean | undefined>('span',{default: undefined})
const timecode_bloc = defineModel<boolean | undefined>('timecodeBloc',{default: undefined})
const bloc = defineModel<boolean | undefined>('bloc',{default: undefined})
const timecode_segment = defineModel<boolean | undefined>('timecodeSegment',{default: undefined})


const timecodeDisabled = ref(false)

let previousTimecode

watch(()=>bloc.value,(value)=>{
  if (!value){
    previousTimecode = markRaw(timecode_bloc.value)
    timecode_bloc.value = false
    timecodeDisabled.value = !timecodeDisabled.value
  }
  else{
    timecode_bloc.value = previousTimecode
    timecodeDisabled.value = !timecodeDisabled.value
  }
},{})




</script>
