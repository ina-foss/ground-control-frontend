<template>
  <nav
    class="flex border border-gray-100 rounded-sm py-3 px-2 text-sm text-gray-600 dark:text-white"
  >
    <ol class="inline-flex items-center">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="inline-flex items-center"
      >
        <NuxtLink
          v-if="breadcrumbs && index !== breadcrumbs?.length - 1"
          :to="item?.link"
          class="flex items-center gap-1"
        >
          <i
            v-if="item.icon || index === 0"
            :class="item.icon ?? 'pi pi-home'"
          />
          <template v-if="index !== 0">
            {{ item.label }}
          </template>
        </NuxtLink>
        <div v-else class="flex items-center gap-1">
          <i
            v-if="item.icon || index === 0"
            :class="item.icon ?? 'pi pi-home'"
          />
          <span class="font-semibold">{{ item.label }}</span>
        </div>

        <span
          v-if="breadcrumbs && index < breadcrumbs?.length - 1"
          class="mx-2"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>
<script lang="ts" src="./breadcrumb.component.ts"></script>
