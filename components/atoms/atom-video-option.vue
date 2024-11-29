<template>
  <div class="flex items-start rounded-lg text-[#282828] gap-[10px] text-sm/4 flex-col w-[186px] p-3 p bg-white">
    <b>Synchronisation</b>
    <div class="flex justify-between items-center self-stretch py-1 ">
      <span class="">Player</span>
      <ToggleSwitch v-model="options.player" />
    </div>
    <div class="flex justify-between items-center self-stretch py-1 ">
      <span class="">Transcriptions</span>
      <ToggleSwitch v-model="options.transcription" />
    </div>
  </div>
</template>

<script lang="ts" src="./atom-video-option-component.ts"></script>
<!-- <script setup lang="ts"> -->
<!---->
<!--     const player = defineModel<boolean>('player') -->
<!--     const transcription = defineModel<boolean>('transcription') -->
<!---->
<!-- </script> -->
