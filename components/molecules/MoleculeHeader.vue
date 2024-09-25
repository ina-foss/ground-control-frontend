<template>
  <div class="h-[70px] z-30 w-full fixed flex items-center gap-2 px-3 border-b-2 border-#EDEDED justify-between bg-surface-color"
       style="background-color: #FFFFFF">
    <div class="flex items-center">
      <AtomLogo size="md" />
      <div style="padding: 25px;font-size: 20px">
        <NuxtLink class="self-center font-bold" to="/">Ground Control</NuxtLink>
      </div>
      <AtomIcon class="self-center" />
    </div>
    <div class="flex justify-end items-center">
      <div class="mr-4">
      <Button
        class="button"
        v-if="$route.name == 'dashboard'"
        label="Create Project"
        size="small"
        @click="dialogVisible = true"
      />
      <MoleculeFormProject :dialog-visible="dialogVisible" @toggle-dialog="dialogVisible = false" />
    </div>
    <div class="mt-1">
      <AtomAvatarHeader />
    </div>
    </div>
  </div>
</template>

<script setup>
import { useService } from '~/composables/useService';
import AtomLogo from '../atoms/AtomLogo.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomAvatarHeader from '../atoms/AtomAvatarHeader.vue';
import MoleculeFormProject from './MoleculeFormProject.vue';
const dialogVisible = ref(false);
const { $application } = useService();
// const roles = $application.getUserRoles();

const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));

</script>
<style>
.button{
  font-size: 14px;
  font-family: Lato,sans-serif;
  font-weight: bold;
  height: 33px;
  padding: 8px 12px;
  border-radius: 4px;
  color: #FFFFFF;
  background-color: #0B7698;
}
</style>
