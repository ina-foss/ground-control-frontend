<template>
  <div
    class="relative md:h-[--size] w-full flex flex-wrap md:flex-nowrap items-center gap-2 pb-3 md:pb-0 px-3 border-b border-neutral justify-between bg-white dark:bg-surface-800 z-[1]"
    :style="`--size:${headerSize}`"
  >
    <div class="flex items-center">
      <atom-logo-ina :size="sizeConfig" />
      <div class="p-5" :title>
        <NuxtLink
          :class="`self-center text-title font-black ${textSize}`"
          to="/"
        >
          {{ title }}
        </NuxtLink>
      </div>
      <atom-logo-app :size="sizeConfig" class="self-center" />
    </div>
    <div
      :class="`${open ? 'flex flex-col absolute z-10 top-full p-3 left-0 w-full border-t border-neutral' : 'hidden'} bg-white dark:bg-surface-800 shadow-md md:border-none md:shadow-none md:w-auto md:bg-transparent md:flex md:flex-row md:static md:top-O  gap-7 justify-end md:items-center`"
    >
      <div v-for="(item, index) in componentsCenter" :key="'center' + index">
        <component
          :is="item?.component"
          v-bind="{ actionItem: item?.actionItem }"
        />
      </div>
    </div>
    <div class="flex gap-3 justify-end w-full md:w-auto items-center">
      <div class="flex items-center" v-for="(item, index) in componentsRight">
        <component
          :is="item?.component"
          :key="'right' + index"
          v-bind="{ actionItem: item?.actionItem }"
        />
      </div>
      <div @click="open = !open" class="md:hidden">
        <i
          :class="`h-6 w-6 text-4xl ${open ? 'pi pi-times' : 'pi pi-bars'}`"
        ></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./molecule-header.component.ts"></script>
