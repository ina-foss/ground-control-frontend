<template>
  <div class=" rounded-lg w-[250px] bg-white">
    <Accordion class="w-full custom-accordion rounded" >
      <AccordionPanel>
        <AccordionHeader class="hover:!bg-white hover:!text-title rounded ">Affichage</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title ">
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Span</span>
              <ToggleSwitch v-model="span" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1">
              <span >TC</span>
              <ToggleSwitch v-model="timecode" :disabled="timecodeDisabled" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1">
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

const span = defineModel<boolean>('span')
const timecode = defineModel<boolean>('timecode')
const bloc = defineModel<boolean>('bloc')


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
<style>
.custom-accordion{
  --p-accordion-header-active-background: white;
  --p-accordion-header-active-color: #212927;
  --p-accordion-header-background: white;
  --p-accordion-header-color: #212927;
}
</style>
