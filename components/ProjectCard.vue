<template>
  <div
    class="w-full bg-surface-color max-w-screen h-150 px-3 py-1 cursor-pointer  rounded-md shadow hover:scale-105 transition-all  hover:shadow-xl"
    style="background-color: #FFFFFF">
    <NuxtLink
      :to="{ name: 'projects-id', params: { id: project.id } }" @click="navigate">
      <div class="inline-block flex justify-between align-middle pl-2">
          <p class="font-bold self-center exeeded_text">
            {{ project.title }} </p>
          <p class="inline-block  text-2xl">
            <Button
 severity="primary" text rounded size="small"
                     @click.stop.prevent="deleteDialog=true" >
              <img src="public/icons/icons-svg/icons-svg/trash-icon.svg" class="w-4 h-4 mb-2 mr-0"/>
            </Button>
<!--Confirmation dialog to delete-->
            <Dialog
v-model:visible="deleteDialog" modal header="Êtes-vous sûr de vouloir supprimer ce projet ?" :style="{ width: '30rem' }" class="bg-white"
                     @after-hide="deleteDialog = false">
              <div class=" grid grid-cols-1 gap-1">
                <ButtonGroup class="justify-evenly flex items-center pt-6 ">
                  <Button label="Non" class="button button-prev mr-4" size="small" @click="deleteDialog = false" />
                  <Button v-if="deleteDialog === false" class="button" size="small" label="Supprimer" @click="deleteDialog = true" />
                  <Button v-else class="button" size="small" label="Oui" @click="deleteProject" />
                </ButtonGroup>
              </div>
            </Dialog>

            <Button
icon="pi pi-ellipsis-h" severity="secondary" text rounded size="small"
            @click.stop.prevent="visible=true" />

          <MoleculeFormProject :dialog-visible="visible" :project="project" @toggle-dialog="visible=false"/>
        </p>
      </div>
      <div class="flex justify-between justify-items-stretch pl-2 pt-1 items-center text-sm">
        <div class="flex justify-between items-center  justify-items-stretch gap-3">
          <span class="">{{ project.steps.length }} <i class="pi pi-list-check " /></span>
          <Tag class="mb-1 scale-90" :class="statusSeverity">{{ translatedProjectStatus(project.status)}}</Tag>
        </div>
        <div class="flex justify-between justify-items-stretch gap-3">
        </div>
      </div>
      <hr>
      <div class="text-sm px-2 py-3 text-slate-500"> {{ $props.project.description }} </div>
      <div class=" bottom-0 w-full flex justify-between pl-2 py-2 text-gray-400" style="font-size: 14px">
        <p v-if="$props.project.created_at != null" class="self-center">
          {{ $props.project.created_at.split('T')[0] }}</p>
        <Avatar
          v-tooltip.left="userEmail" :label=userEmail.charAt(0).toUpperCase()
          shape="circle" style="color: black;font-weight: bold"/>
      </div>
    </NuxtLink>
  </div>

</template>

<script setup>
import { bcStore } from '~/stores/breadcrumbs';
import { defineEmits } from 'vue';
import {ProjectService, TaskStatus} from '~/api/generate';
import { useAuth } from '../stores/auth';
import { storeToRefs } from 'pinia';
import MoleculeFormProject from './molecules/MoleculeFormProject.vue';
import {useRefreshStore} from '#imports';

const visible = ref(false)
const deleteDialog = ref(false)
const store = bcStore()
const { project } = defineProps(['project'])
const authStore = useAuth()
const { userEmail } = storeToRefs(authStore)
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}

const translatedProjectStatus =(project_status)=> {
  return translations[project_status]
}

const navigate = () =>{
  store.addCrumb({ label: project.title, route: `/projects/${project.id}` })
}

const statusSeverity = computed(() =>{
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

const title = ref(project.title)

const description = ref(project.description)
defineEmits(['refreshData']);
const refreshStore = useRefreshStore()

const deleteProject = async () => {
  try {
    await ProjectService.deleteProjectProjectProjectIdDelete(project.id);
    navigateTo(`/dashboard`);
    await refreshStore.fetchProject();
    deleteDialog.value= false
  } catch (err) {
    console.error("Error deleting project:", err);
  }
}

</script>
<style>
.exeeded_text{
font-size: 19px;
  font-family: Lato;
}
.warning{
  background-color: #F9D621;
  color:black;
}
.info{
  background-color: #B3DDF4;
  color:black;
}
.success{
  background-color: #9ADC82;
  color:black;
}
</style>
