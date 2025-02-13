<template>
  <component v-for="(plugin,index) in config" :is="selectComponent(plugin)?.component"
             v-bind="selectComponent(plugin)?.props" :plugin="plugin" :index="index"/>

  <Chip v-for="(chip,index) in chipList" :key="chip.label" :label="chip.label" removable
        v-on:remove="handleRemove(index)"/>
</template>

<script src="./atom-plugin-block-component.ts" lang="ts">

</script>
