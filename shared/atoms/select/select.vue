<template>
  <div :class="actionItem?.class">
    <label for="label" class="mr-2 font-semibold">{{
      actionItem?.label
    }}</label>
    <Select
      @change="handleChange"
      :size="actionItem?.size"
      :options="actionItem?.items"
      option-label="label"
      class="w-fit items-center h-[33px]"
      :placeholder="actionItem?.placeholder"
      show-clear
    />
  </div>
</template>
<script lang="ts" src="./select.component.ts"></script>
