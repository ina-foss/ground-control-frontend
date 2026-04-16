<template>
  <Dialog v-model:visible="isOpen" modal  header="Segment video: proprietes" @after-hide="onClose" >
    <div class="flex flex-col gap-4 w-[600px]">

      <div class="w-full flex justify-between p-lg items-center gap-lg ">
        <span>{{ timestampToUnix(currentSegment?.start,true) }}</span>
        <div class="h-1 w-full bg-accent"></div>
        <span> {{ timestampToUnix(currentSegment?.end,true) }}  </span>
      </div>

      <message-wrapper v-if="showErrorMessage" class="flex justify-center">
        <Message class="w-fit" severity="error" icon="pi pi-exclamation-triangle" >  {{ t('pluginForm.selectValueError') }}</Message>
      </message-wrapper>

      <MoleculePlugins ref="pluginComponent" v-model:error-message="showErrorMessage" :zone="DisplayZone.SPAN_MODAL_LEFT"  />

      <div class="flex justify-end gap-2">
        <Button outlined severity="primary" icon="pi pi-times" :label="t('actions.cancel')" @click="isOpen = false"/>
        <Button icon="pi pi-check" type="primary" :label="t('actions.confirm')" @click="handleConfirmationButton"/>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./atom-segment-form-component.ts"></script>
