<template>
  <div class="flex flex-wrap gap-4  ">
    <div
        class=" w-full flex gap-3 " >
      <ToggleButton
          v-for="option in visibleOptions"
          :key="option.label"
          :modelValue="pluginValue === option"
          class="h-[33px] rounded-[6px] "
          :class="{ 'selected': isEqual(pluginValue, option) }"
          :outlined="!isEqual(pluginValue,option)"
          :label="option.label"
          :onLabel="option.label"
          :offLabel="option.label"
          @click="() => pluginValue = isEqual(pluginValue, option) ? all_entities_plugin : option"
      />
    </div>
    <Select
        v-if="isForResearch && dropdownOptions.length"
        v-model="pluginValue"
        :options="dropdownOptions"
        :placeholder="`Choisir un autre ${plugin.name} `"
        class="w-[215px]"
        filter
        option-label="label"
        show-clear
    />
  </div>
</template>

<script src="./atom-plugin-itemsList-component.ts">
</script>
<style>
.p-togglebutton.selected:hover {
  background-color: #0C7DA2 !important;
  border-color: #0C7DA2 !important;
  color: white !important;
  transition: background-color 0.2s ease-in-out;
}
</style>
