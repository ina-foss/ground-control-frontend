<template>
  <div class="w-[250px] bg-white rounded-lg">
  <Panel class="w-full" header="Synchroniation" toggleable>
    <div class="flex flex-col gap-[10px] ">
      <div class="flex justify-between items-center self-stretch py-1 ">
        <span class="">Player</span>
        <ToggleSwitch v-model="options.player" />
      </div>
      <div class="flex justify-between items-center self-stretch py-1 ">
        <span class="">Transcriptions</span>
        <ToggleSwitch v-model="options.transcription" />
      </div>
    </div>
  </Panel>
</div>
</template>

<script lang="ts" src="./atom-video-option-component.ts"></script>
