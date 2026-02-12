<template>
  <Button
    :label="actionItem?.label"
    :size="actionItem?.size"
    @click="actionItem?.action"
    :variant="actionItem?.variant"
    :icon="actionItem?.icon"
    :severity="actionItem?.theme"
    :class="actionItem?.class"
    v-tooltip.left="actionItem?.tooltip"
    :active="actionItem?.active"
  />
</template>
<script lang="ts" src="./button.component.ts"></script>
