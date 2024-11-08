<template>
  <div
    class="w-full bg-surface-color max-w-screen h-150 px-3 py-1 cursor-pointer  rounded-md hover:scale-105 transition-all  hover:shadow-xl"
    style="background-color: #FFFFFF">
    <NuxtLink
      :to="{ name: 'projects-id', params: { id: project.id } }" @click="navigate">
      <div class="min-h-[75%]">
      <div class=" flex justify-between align-middle pl-2">
        <p class="font-bold text-3xl self-center ">
          {{ project.title }} </p>
        <p class=" h-[66px]  flex flex-col items-center gap-2 ">


          <Button style="height:18px;width:18px; color:#212529;" class="mt-3"
                  icon="pi pi-ellipsis-h custom-icon-color" severity="secondary" text rounded
                  @click.stop.prevent="visible=true"/>
          <Button v-if="isAdmin" style="height: 22px; padding:0 0 0 0;margin:0;"
                  severity="warn" text rounded
                  @click.stop.prevent="deleteDialog=true">
            <img
              style="height:18px;width:18px;filter: sepia(1) saturate(0) brightness(0.6);"
              src="../../public/icons/icons-svg/icons-svg/trash-icon.svg"
              alt="Trash Icon"/>
          </Button>
          <!--Confirmation dialog to delete-->
          <Dialog
            v-model:visible="deleteDialog" modal header="Êtes-vous sûr de vouloir supprimer ce projet ?"
            :style="{ width: '30rem'}" class="bg-white pb-0" :pt="{
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
              <ButtonGroup class="justify-evenly flex">
                <Button label="Non" class="button button-prev mr-3" size="small" @click="deleteDialog = false"/>
                <Button v-if="deleteDialog === false" class="button" size="small" label="Supprimer"
                        @click="deleteDialog = true"/>
                <Button v-else class="button" size="small" label="Oui" @click="deleteProject"/>
              </ButtonGroup>
            </div>
          </Dialog>
          <MoleculeFormProject :dialog-visible="visible" :project="project" @toggle-dialog="visible=false"/>
        </p>
      </div>
      <div class="flex justify-between justify-items-stretch pl-2 pt-1 items-center text-sm">
        <div class="flex justify-between items-center  justify-items-stretch gap-3">
          <span class="font-bold"> <span style="color:#0057FF;" class="mr-2">{{ project.steps.length }} </span><i
            class="pi pi-list-check "/></span>
          <Tag class="mb-1 scale-90" :class="statusSeverity">{{ translatedProjectStatus(project.status) }}</Tag>
        </div>
        <div class="flex justify-between justify-items-stretch gap-3">
        </div>
      </div>
      <div class="text-sm px-2 py-3 text-slate-500"
           style="color:#757575;font-size:12px;">
        {{ $props.project.description.charAt(0).toUpperCase() + $props.project.description.slice(1) }}
      </div>
      </div>
      <hr>


    </NuxtLink>
    <div class=" bottom-0 w-full flex justify-between pl-2 py-2 text-gray-400" style="font-size: 12px">
      <p v-if="$props.project.created_at != null" class="self-center font-medium" style="color:#212529">
        {{ formatDate($props.project.created_at) }}
      </p>
      <Avatar
        v-tooltip.left="project.created_by" :label=project.created_by.charAt(0).toUpperCase()
        shape="circle" style="background-color:#0057FF;color: white;font-weight: 500;height:24px;width:24px"/>
    </div>
  </div>

</template>

<script setup>
import {defineEmits} from 'vue';
import {storeToRefs} from 'pinia';
import MoleculeFormProject from './MoleculeFormProject.vue';
import {bcStore, useRefreshStore, useService} from '#imports';
import {ProjectService} from "../api/generate";

const visible = ref(false)
const deleteDialog = ref(false)
const store = bcStore()
const {project} = defineProps(['project'])
const authStore = useAuth()
const {userEmail} = storeToRefs(authStore)

const { $application } = useService();

const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}

const translatedProjectStatus = (project_status) => {
  return translations[project_status]
}
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'});
}
const navigate = () => {
  store.addCrumb({label: project.title, route: `/projects/${project.id}`})
}

const statusSeverity = computed(() => {
  switch (project.status) {
    case 'pending':
      return 'warning'

    case 'draft':
      return 'info'

    case 'ended':
      return 'success'

    default:
      return ''

  }
})


defineEmits(['refreshData']);
const refreshStore = useRefreshStore()

const deleteProject = async () => {
  try {
    await ProjectService.deleteProjectProjectProjectIdDelete(project.id);
    navigateTo(`/dashboard`);

    await refreshStore.fetchProject()
    await refreshStore.totalRecords()
    deleteDialog.value = false
  } catch (err) {
    console.error("Error deleting project:", err);
  }
}

</script>
<style>

.warning {
  background-color: #F9D621;
  color: black;
}

.info {
  background-color: #B3DDF4;
  color: black;
}

.success {
  background-color: #9ADC82;
  color: black;
}
.custom-icon-color .pi {
  color: #212529;
}
</style>
