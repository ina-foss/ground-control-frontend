<template>
  <div class="h-[60px] z-30 w-full fixed flex items-center gap-3 px-4 bg-white border-b-2  border-gray-400">
    <AtomLogo size="sm" />
    <NuxtLink class="self-center font-bold text-lg " to="/">Ground Control</NuxtLink>
    <AtomIcon class="self-center" />
    <Button icon="pi pi-align-justify" severity="secondary" text outlined @click="menuVisible = true" />
    <div class="flex-grow">
      <AtomBreadcrumbs />
    </div>
    <div class="self-center">
      <Button v-if="$route.name == 'dashboard'" label="Create Project" size="small" @click="dialogVisible = true" />
      <Button v-else label="Settings" severity="secondary" outlined size="small" />
      <MoleculeFormProject :dialogVisible="dialogVisible" @toggle-dialog="dialogVisible=false"/>
    </div>
    <div class="self-center">
      <AtomAvatarHeader />
    </div>
  </div>
  <Sidebar v-model:visible="menuVisible" class="bg-white" />
</template>



<script setup>

import AtomLogo from '../atoms/AtomLogo.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomBreadcrumbs from '../atoms/AtomBreadcrumbs.vue';
import AtomAvatarHeader from '../atoms/AtomAvatarHeader.vue';
import MoleculeFormProject from './MoleculeFormProject.vue';

const menuVisible = ref(false);
const dialogVisible = ref(false)


</script>
