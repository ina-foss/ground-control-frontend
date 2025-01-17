<template>
  <div class=" rounded-lg w-[250px] bg-white">
    <Accordion class="w-full custom-accordion rounded" >
      <AccordionPanel>
        <AccordionHeader class="hover:!bg-white hover:!text-title rounded ">Synchroniation</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-col gap-[10px] text-title">
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Player</span>
              <ToggleSwitch v-model="options.player" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Transcriptions</span>
              <ToggleSwitch v-model="options.transcription" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script lang="ts" src="./atom-video-option-component.ts"></script>
