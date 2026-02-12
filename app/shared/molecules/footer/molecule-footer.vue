<template>
  <div class="bottom-0 text-sm fixed bg-black text-white h-[70px] w-full grid grid-cols-3 gap-4 ">
    <div class="grid items-center">
      <slot name="left"></slot>
      {{ version }}
    </div>
    <div class="grid justify-center">
      <atom-logo-ina size="sm"/>
      <slot name="center"></slot>
    </div>
    <div class="grid justify-items-end text-sm p-5">
      <slot name="right"></slot>
     </div>
  </div>
</template>
<script lang="ts" src="./molecule-footer.component.ts"></script>
