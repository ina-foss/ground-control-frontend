<template>
  <div class="grid grid-cols-[100px_auto] gap-3 pt-3">
    <span class="text-right">{{t('plugin.status.verificationStatus')}}</span>
    <SelectButton
        v-model="status"
        :options="options"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        class="verification-selector"
    >
      <template #option="{ option }">
        <i :class="option.icon" class="mr-1" />
        {{ option.label }}
      </template>
    </SelectButton>
  </div>
</template>

<script src="./atom-verify-toggle-component.ts">
</script>
<style scoped>

:deep(.p-selectbutton .p-togglebutton:first-child.p-togglebutton-checked) {
  background: #FCDB00;
  color: black;
}

:deep(.p-selectbutton .p-togglebutton:last-child.p-togglebutton-checked) {
  background: #268750;
}
</style>
