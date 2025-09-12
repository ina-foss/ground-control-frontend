<template>
  <div class="flex flex-wrap gap-2  ">
    <div
        class="grid gap-1 w-full " style="grid-auto-rows: 50px ;grid-template-columns: repeat(auto-fit,minmax(100px,1fr))">
      <Button
          v-for="option in visibleOptions"
          :key="option.label"
          class="!text-xs"
          size="small"
          :outlined="pluginValue !== option"
          :label="option.label"
          @click="()=>pluginValue=option"
      />
    </div>
    <Select v-if="isForResearch" fluid
            v-model="pluginValue"
            :options="dropdownOptions"
            filter
            option-label="label"
    />
  </div>
</template>

<script src="./atom-plugin-itemsList-component.ts">
</script>
