<template>
  <Dialog
    :visible="visible"
    modal
    :closable="true"
    class="bg-white rounded-md"
    :style="{ width: '35rem' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <template v-if="title" #header>
      <h3 class="text-lg font-semibold text-gray-800">
        {{ title }}
      </h3>
    </template>
    <div
      v-if="message || description || $slots.description || $slots.message"
      class="flex gap-4 pt-4 pb-[20px] px-0 text-sm text-gray-700">
      <i
        v-if="withExclamation"
        class="pi pi-exclamation-triangle text-red-500 mt-1"
        style="font-size: 28px"
      />
      <div class="space-y-2 flex-1">
        <div v-if="$slots.message || message" class="font-bold">
          <slot name="message">
            {{ message }}
          </slot>
        </div>
        <div
          v-if="$slots.description || description"
          class="text-gray-600 whitespace-pre-line pt-2"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-4 px-4 pb-4">
      <Button v-bind="cancelButton" size="small" @click="handleCancel" />
      <Button v-bind="confirmButton" size="small" @click="handleConfirm" />
    </div>
  </Dialog>
</template>

<script src="./molecule-dialog-confirm-component.ts"></script>
