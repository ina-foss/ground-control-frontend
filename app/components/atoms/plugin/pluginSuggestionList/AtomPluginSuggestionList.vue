<template>
<div class="flex flex-col gap-4 pl-31 pt-2">
  <div v-for="option in options" :key="option.id" class="flex items-center">
    <RadioButton v-model="selectedCategory" :inputId="option.id" name="dynamic" :value="option.label" />
    <label class="pl-3">{{ option.label }}</label>
  </div>
  </div>
</template>

<script src="./atom-plugin-suggestionList-component.ts">
</script>
<style scoped>
:deep(.p-radiobutton-checked > .p-radiobutton-box) {
  background-color: var(--p-primary-500) !important;
  border-color: var(--p-primary-500) !important;
}

:deep(.p-radiobutton-checked > .p-radiobutton-box > .p-radiobutton-icon) {
  background-color: #fff !important;
  width: 7px;
  height: 7px;
}
</style>
