<template>
  <NuxtLink :to="actionItem?.value" class="flex gap-2 items-center font-semibold"
    ><i :class="actionItem?.icon"/>{{ actionItem?.label }}</NuxtLink
  >
</template>
<script lang="ts" src="./link.component.ts"></script>
