<template>
  <div class=" rounded-lg w-full gap-3">
    <Accordion  class="w-full !bg-white rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Derniers Timecodes</AccordionHeader>
        <AccordionContent >
          <div class="overflow-y-clip  h-[100px]">
          <ScrollPanel class="h-full" :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'3px'
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
          <div class="flex flex-col gap-[8px] text-title  ">
            <div v-for="(timecode,index) in timecodeHistory" class="flex items-center gap-3 "  >
              <span> {{timestampToUnix(timecode)}}</span>
              <i :class="{'pi pi-arrow-left': true,
              'opacity-0': index != timecodeHistory?.length -1 } " />
            </div>
          </div>
          </ScrollPanel>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>


<script setup lang="ts">


const { $application } = useService()
const { timestampToUnix, unixToTimestamp  } = $application
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
