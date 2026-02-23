<template>
  <div>
    <Button
      type="button"
      v-tooltip="label"
      @click="toggle($event)"
      aria-controls="overlay_menu"
      rounded
      class="border border-black bg-transparent"
      variant="text"
    >
      <template #icon>
        <img
          class="w-6 h-6 dark:invert"
          src="public/icons/account-icon.svg"
          alt="Account Icon"
        >
      </template>
    </Button>

    <Menu
      id="overlay_menu"
      ref="menu"
      :model="list"
      :popup="true"
    />
  </div>
</template>

<script lang="ts" src="./avatar.component.ts"></script>
