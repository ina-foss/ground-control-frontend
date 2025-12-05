<template>
  <div v-if="!groupButtonLayout" class=" grid grid-cols-[100px_auto] gap-3 gap-y-5 " >
    <slot />
    <div class="flex flex-wrap gap-4">
      <div class=" w-full flex gap-3 " >
        <ToggleButton
            v-for="option in visibleOptions"
            :key="option.label"
            :modelValue="isEqual(pluginValue, option)"
            class="h-[33px] rounded-[6px] "
            :class="{ 'selected': isEqual(pluginValue, option) }"
            :outlined="!isEqual(pluginValue,option)"
            :label="option.label"
            :onLabel="option.label"
            :offLabel="option.label"
            @click="() => pluginValue = isEqual(pluginValue, option) ? null : option"
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
  </div>
  <div v-else  class="flex flex-col gap-4 " >
    <div>
      <b>Sélectionner un type de span parmi ces groupes</b>
    </div>
    <div class="flex flex-row gap-4 ">
      <group-wrapper v-for="(group,name) in groupByOptions" :key="group" class="flex flex-col gap-5 p-lg bg-grey-50 rounded-lg last:grow ">
        <group-name class="flex justify-between items-center">
          <p>{{name ?? plugin.display_config.label }}</p>
          <span class="bg-disabled rounded-full p-3 text-sm/2">{{group.length}}</span>
        </group-name>
        <group-options-wrapper class="flex flex-col gap-3">
          <ToggleButton
              v-for="option in group"
              :key="option.label"
              :modelValue="isEqual(pluginValue, option)"
              class="h-[33px] w-fit rounded-[6px] "
              :class="{ 'selected': isEqual(pluginValue, option) }"
              :outlined="!isEqual(pluginValue,option)"
              :label="customizedLabel(option)"
              :onLabel="customizedLabel(option)"
              :offLabel="customizedLabel(option)"
              @click="() => pluginValue = isEqual(pluginValue, option) ? null : option"
          />
        </group-options-wrapper>
      </group-wrapper>
    </div>
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
