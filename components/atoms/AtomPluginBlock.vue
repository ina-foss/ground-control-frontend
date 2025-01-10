<template>
  <component v-for="plugin in config" :is="selectComponent(plugin)?.component" v-bind="selectComponent(plugin)?.props" :plugin="plugin" />
</template>

<script src="./atom-plugin-block-component.ts" lang="ts">

</script>
