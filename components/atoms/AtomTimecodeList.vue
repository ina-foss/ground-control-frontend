<template>
  <div class=" rounded-lg w-[250px] gap-3">
    <Accordion  class="w-full !bg-white rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Derniers Timecodes</AccordionHeader>
        <AccordionContent>
          <ScrollPanel class="max-h-[100px]">
          <div class="flex flex-col gap-[10px] text-title  ">
            <div v-for="(timecode,index) in timecodeHistory" class="flex items-center gap-3 "  >
              <span> {{timestampToUnix(timecode)}}</span>
              <i :class="{'pi pi-arrow-left': true,
              'opacity-0': index != timecodeHistory?.length -1 } " />
            </div>
          </div>
          </ScrollPanel>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>


<script setup lang="ts">


const { $application } = useService()
const { timestampToUnix } = $application
const timecodeHistory : Ref<number[]> | undefined = inject('timecode-history')

</script>

<style scoped lang="postcss">

.show-arrow {
  @apply p-2
}

.show-arrow i{
  @apply opacity-100
}


</style>
