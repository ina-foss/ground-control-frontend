<template>
  <div class="h-[70px] z-30 w-full fixed flex items-center gap-2 px-3 bg-white border-b-2 border-#EDEDED justify-between">
    <div class="flex items-center">
      <AtomLogo size="md" />
      <div style="padding: 25px;font-size: 20px">
        <NuxtLink class="self-center font-bold" to="/">Ground Control</NuxtLink>
      </div>
      <AtomIcon class="self-center" />
    </div>
    <div class="flex justify-end items-center">
      <div>
      <Button
        v-if="isAdmin && $route.name == 'dashboard'"
        class="mr-5"
        label="Create Project"
        size="small"
        outlined
        severity="secondary"
        style="font-size: 14px;font-family: Lato,sans-serif;font-weight: bold;height: 33px;padding: 8px 12px;border-radius: 4px;"
        @click="dialogVisible = true"
      />
      <MoleculeFormProject :dialog-visible="dialogVisible" @toggle-dialog="dialogVisible = false" />
    </div>
    <div>
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
const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));

</script>
