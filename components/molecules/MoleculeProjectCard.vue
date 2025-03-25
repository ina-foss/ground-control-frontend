<template>
  <div
    class="w-full bg-surface-color max-w-screen  max-h-[190px]  px-3 py-1 cursor-pointer  rounded-md hover:scale-105 transition-all  hover:shadow-xl"
    style="background-color: #FFFFFF">
    <NuxtLink
      :to="{ name: 'projects-id', params: { id: project.id } }" >
      <div class="min-h-[75%] max-h-full">
        <div class=" flex justify-between align-middle pl-2">
          <p class="font-bold text-3xl self-center ">
            {{formatTitle(project.title)}} </p>
          <p class=" h-[66px] w-[24px] flex flex-col items-center gap-2 ">


            <Button
              style="height:18px;width:18px; color:#0C7DA2;" class="mt-3"
              icon="pi pi-ellipsis-h" severity="secondary" text rounded
              @click.stop.prevent="visible=true"/>
            <Button
              v-if="roleDeleteProject" style="height: 22px; padding:0 0 0 0;margin:0;color:#0C7DA2;"
              severity="error-state" text rounded
              @click.stop.prevent="deleteDialog=true">
              <img
                style="height:18px;width:18px;filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                src="../../public/icons/icons-svg/icons-svg/trash-icon.svg"
                alt="Trash Icon">
            </Button>
            <Dialog
              v-model:visible="deleteDialog" modal header="Êtes-vous sûr de vouloir supprimer ce projet ?"
              :style="{ width: '31rem'}" class="bg-white pb-0" :pt="{
      header:{
        style:{color:'#212529'},
        class: 'flex justify-between items-center p-3',
      },
      content:{
        class: 'p-3',
      }
    }"
              @after-hide="deleteDialog = false">
              <div class="flex justify-end pb-0">
                  <Button label="Non" class="!bg-[#ffffff] !text-primary button button-prev mr-3" size="small" @click="deleteDialog = false"/>
                  <Button
                    v-if="deleteDialog === false" class="button" size="small" label="Supprimer"
                    @click="deleteDialog = true"/>
                  <Button v-else class="button" size="small" label="Oui" @click="deleteProject"/>
              </div>
            </Dialog>
            <MoleculeFormProject :dialog-visible="visible" :project="project" @toggle-dialog="visible=false"/>
          </p>
        </div>
        <div class="flex justify-between justify-items-stretch pl-2 pt-1 items-center text-sm">
          <div class="flex justify-between items-center  justify-items-stretch gap-3">
          <span class="font-bold"> <span style="color:#0057FF;" class="mr-2">{{ project.steps.length }} </span><i
            class="pi pi-list-check "/></span>
            <Tag class="mb-1 scale-90" :severity="statusSeverity" >{{ translatedProjectStatus(project.status) }}</Tag>
          </div>
        </div>
        <div
          class="text-sm px-2 py-3 text-slate-500"
          style="color:#757575;font-size:12px;">
          {{ $props.project.description.charAt(0).toUpperCase() + $props.project.description.slice(1) }}
        </div>
      </div>
      <hr>


    <div class=" bottom-0 w-full flex justify-between pl-2 py-2 text-gray-400" style="font-size: 12px">
      <p v-if="$props.project.created_at != null" class="self-center font-medium" style="color:#212529">
        {{ $application.formatDate($props.project.created_at) }}
      </p>
      <Avatar
        v-tooltip.left="project.created_by" :label=project.created_by.charAt(0).toUpperCase()
        shape="circle" style="background-color:#0057FF;color: white;font-weight: 500;height:24px;width:24px"/>
    </div>
    </NuxtLink>
  </div>

</template>

<script setup>
import {defineEmits} from 'vue';
import MoleculeFormProject from './MoleculeFormProject.vue';
import { useRefreshStore, useService} from '#imports';
import {ProjectService} from "../api/generate";
import { Permission } from '~/api/generate';

const visible = ref(false)
const deleteDialog = ref(false)
const {project} = defineProps({project: {type: Object, default: () => []}})

const {$application} = useService();

const roleDeleteProject = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_DELETE));
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}
const { $handleApiError } = useNuxtApp()

const translatedProjectStatus = (project_status) => {
  return translations[project_status]
}


const statusSeverity = computed(() => {
  switch (project.status) {
    case 'pending':
      return 'warn'

    case 'draft':
      return 'info'

    case 'ended':
      return 'success'

    default:
      return ''

  }
})

const formatTitle=(title)=>{
  if(title){
    if(title.includes('-')) {
      title=title.replace("-", ' ')
    }
    return title.charAt(0).toUpperCase() +title.slice(1)
  }
}
defineEmits(['refreshData']);
const refreshStore = useRefreshStore()

const {error,status,execute:deleteProject} =    await useAsyncData(
  'deleteProject',
  async () => {
    try {
      await ProjectService.deleteProjectProjectProjectIdDelete(project.id);
      navigateTo(`/dashboard`);
      await refreshStore.fetchProject()
      deleteDialog.value = false
    } catch (err) {
      console.error("Error deleting project:", err);
      $handleApiError(err)
    }
  },
  { immediate:false }
)
</script>
<style>

.custom-icon-color .pi {
  color: #212529;
}
</style>
