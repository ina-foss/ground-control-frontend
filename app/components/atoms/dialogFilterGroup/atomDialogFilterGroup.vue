<template>
  <Dialog
      :visible="visible"
      :header="t('spanForm.virtualSpan.dialog.header')"
      :closable="true"
      :dismissable-mask="false"
      @update:visible="(value) => emit('update:visible', value)"
  >
    <div class="flex items-start gap-2 text-gray-800">
              <span
                  class="pi pi-exclamation-triangle text-red-500 text-2xl mt-1"
              />
      <div>
        <b>{{ t('spanForm.virtualSpan.dialog.allowedTypesLabel') }}</b>
        <ul class="mt-2 ml-6 list-disc">
          <li v-for="type in authorizedTypeList" :key="type">
            {{ type }}
          </li>
        </ul>
      </div>
    </div>
  </Dialog>
</template>
<script src="./atom-dialog-filter-group-component.ts">
</script>
