<template>
  <div class=" rounded-lg w-full ">
    <Accordion  value="0" class="w-full !bg-white rounded" >
      <AccordionPanel>
        <AccordionHeader class="!bg-white hover:!bg-white rounded !border-t-transparent !border-l-transparent !border-r-transparent ">Synchronisation</AccordionHeader>
        <AccordionContent class="!border-transparent ">
          <div class="flex flex-col gap-[10px] text-title">
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Player</span>
              <ToggleSwitch v-model="options.player" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Transcriptions</span>
              <ToggleSwitch v-model="options.transcription" />
            </div>
            <div class="flex justify-between items-center self-stretch py-1 ">
              <span>Loop segment</span>
              <ToggleSwitch v-model="options.loop_bloc" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script lang="ts" src="./atom-video-option-component.ts"></script>
