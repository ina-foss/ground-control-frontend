<template>
  <div :class="actionItem?.class">
    <label for="label" class="mr-2 font-semibold">{{
      actionItem?.label
    }}</label>
    <Select
      :size="actionItem?.size"
      :options="actionItem?.items"
      option-label="label"
      class="w-fit items-center h-[33px]"
      :placeholder="actionItem?.placeholder"
      show-clear
      @change="handleChange"
    />
  </div>
</template>
<script lang="ts" src="./select.component.ts"></script>
