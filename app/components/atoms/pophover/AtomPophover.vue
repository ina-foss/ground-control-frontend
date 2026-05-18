<template>
  <div class="flex flex-col gap-3 p-1 min-w-[220px]">

    <div class="flex items-center justify-between gap-2">
      <span class="truncate text-[#484848] text-[17.5px] font-bold">{{ pluginName }}</span>
      <div class="flex gap-2 items-center">
        <a
          v-if="selectedValue?.link"
          :href="selectedValue?.link"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center p-2 rounded-[4px] gap-2 outline outline-1 outline-[#003A4C] no-underline"
          @click.stop
        >
          <img
            alt="wikidata icon"
            src="/icons/icons-svg/icons-svg/link.svg"
          >
          <span class="text-[#003A4C] text-xs font-bold">{{t('plugin.fields.wikidata')}}</span>
        </a>

        <button
          class="text-black text-sm font-bold underline bg-transparent border-none p-0 cursor-pointer"
          @click="onEdit"
        >
          {{ t('actions.edit') }}
        </button>
      </div>
    </div>

    <!--plugin sélectionnée -->
    <div v-if="selectedValue?.link"
      class="w-full inline-flex items-start justify-start gap-3 bg-surface-100 rounded-lg px-4 py-4 py-1.5"
    >
      <img
        v-if="selectedValue?.image"
        :src="selectedValue?.image"
        :alt="selectedValue?.label"
        class="w-15 h-15 object-cover shrink-0 "
      />

      <div class="flex flex-col justify-start items-start gap-1 flex-1 min-w-0">
        <span class="w-full truncate text-[#212529]">{{ selectedValue?.label }}</span>
        <span
          v-if="selectedValue?.description"
          class="text-xs text-surface-500 w-full break-words"
        >{{ selectedValue?.description }}</span>
      </div>
      <i class="pi pi-times-circle text-surface-400 cursor-pointer text-sm shrink-0"
         @click="onRemove" />
    </div>

    <!-- Statut -->
    <div class="flex justify-end">
    <AtomVerifyToggle
      v-model:plugin-value="status"
      :pendingVerifiedStatus="pluginValue"
    />
    </div>


  </div>
</template>

<script src="./atom-pophover-component.ts"></script>

<style scoped>
:deep(.p-selectbutton .p-togglebutton:first-child.p-togglebutton-checked) {
  background: #FCDB00;
  color: black;
}
:deep(.p-selectbutton .p-togglebutton:last-child.p-togglebutton-checked) {
  background: #268750;
}
</style>
