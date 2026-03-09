<template>
  <Button
    v-tooltip.left="actionItem?.tooltip"
    :label="actionItem?.label"
    :size="actionItem?.size"
    :variant="actionItem?.variant"
    :icon="actionItem?.icon"
    :severity="actionItem?.theme"
    :class="actionItem?.class"
    :active="actionItem?.active"
    @click="actionItem?.action"
  />
</template>
<script lang="ts" src="./button.component.ts"></script>
