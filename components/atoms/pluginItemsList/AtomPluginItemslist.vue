<template>
  <div class="flex flex-wrap gap-4  ">
    <div
        class=" w-full flex gap-3 " >
      <Button
          v-for="option in visibleOptions"
          :key="option.label"
          class="h-[33px] rounded-[6px] "
          :outlined="!isEqual(pluginValue,option)"
          :label="option.label"
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
