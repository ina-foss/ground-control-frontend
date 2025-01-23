<template>
  <div class=" rounded-lg w-[250px]">
    <Accordion class="w-full !bg-white rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded ">Topics</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title">
            <AtomTopicList :colors="colors" :topics="topics" />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
<script setup>
import AtomTopicList from "~/components/atoms/AtomTopicList.vue";
</script>
