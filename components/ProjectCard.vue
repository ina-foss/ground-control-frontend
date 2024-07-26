<template>
  <div
    class="  w-full bg-white max-w-screen h-150 px-3 py-1 cursor-pointer  rounded-md shadow hover:scale-105 transition-all  hover:shadow-xl">
    <NuxtLink
      @click="navigate" :to="{ name: 'projects-id', params: { id: project.id } }">
      <div class="flex justify-between align-middle pl-2">
          <p class="font-semibold self-center ">
            {{ project.title }} </p>
        <p class="inline-block  text-2xl">
          <!-- <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" label= /> -->
          <Button icon="pi pi-ellipsis-h" severity="secondary" text rounded size="small"
            @click.stop.prevent="visible=true" />
          <MoleculeFormProject :dialogVisible="visible" :project="project" @toggle-dialog="visible=false"
          :selectedTypes="project?.steps"/>
          <Dialog  modal header="Tasks Settings" :style="{ width: '35rem' }" class="bg-white"
            @hide="$emit('refreshData')" @after-hide="deleteDialog = false">
            <div class=" grid grid-cols-1 grid-rows-3 gap-1">
              <span class="text-slate-400 ">Modify task informations </span>
              <div class="flex grid-cols-2 gap-3 align-items-center ">
                <label class="self-center basis-1/4">Task name</label>
                <InputText v-model="title" placeholder="Enter a new task name" autocomplete="off" class="flex-auto"
                  size="small" />
              </div>
              <div class="flex gap-3 ">
                <label class="self-center basis-1/4">Task description</label>
                <InputText v-model="description" placeholder="Enter a new task description" autocomplete="off"
                  class="flex-auto" />
              </div>
              <ButtonGroup class="justify-evenly flex items-center pt-6 ">
                <Button label="Update" severity="info" class="justify-self-center" @click="updateProject" />
                <Button v-if="deleteDialog === false" label="Delete" severity="danger" @click="deleteDialog = true" />
                <Button v-else label="Sure ?" severity="danger" class="" @click="deleteProject" />
              </ButtonGroup>
            </div>
          </Dialog>
        </p>
      </div>
      <div class="flex justify-between justify-items-stretch pl-2 pt-1 items-center text-sm">
        <div class="flex justify-between items-center  justify-items-stretch gap-3">
          <span class="">{{ project.steps.length }} <i class="pi pi-list-check " /></span>
          <Tag :severity="statusSeverity" class="mb-1 scale-90 ">{{ project.status}}</Tag>
        </div>
        <div class="flex justify-between justify-items-stretch gap-3">
          <span>1/{{ }} </span>
          <span>2 <i class="pi pi-flag-fill" style="color:red" /> </span>
          <span>{{ $props.project.total_users_with_annotations }} <i class="pi pi-users" /></span>
        </div>
      </div>
      <hr>
      <div class="text-sm px-2 py-3 text-slate-500"> {{ $props.project.description }} </div>
      <div class="flex justify-between  pl-2 py-2 text-gray-400">
        <p v-if="$props.project.created_at != null" class="self-center">
          {{ $props.project.created_at.split('T')[0] }}</p>
        <Avatar shape="circle" icon="pi pi-user" v-tooltip.left="userEmail" />
      </div>
    </NuxtLink>
  </div>

</template>

<script setup>
import { bcStore } from '~/stores/breadcrumbs';
import { defineEmits } from 'vue';
import { ProjectService } from '~/api/generate';
import { useAuth } from '../stores/auth';
import { storeToRefs } from 'pinia';
import MoleculeFormProject from './molecules/MoleculeFormProject.vue';

const visible = ref(false)
const deleteDialog = ref(false)
const store = bcStore()
const { project } = defineProps(['project'])
const authStore = useAuth()
const { userEmail } = storeToRefs(authStore)

const navigate = () =>{
  store.addCrumb({ label: project.title, url: `/projects/${project.id}` })
}

const statusSeverity = computed(() =>{
  switch (project.status) {
    case 'pending':
      return 'warning'

    case 'draft':
      return 'info'

    case 'ended':
      return 'success'

  }
})

const title = ref(project.title)

const description = ref(project.description)
const emit = defineEmits(['refreshData']);

const deleteProject = async () => {
  await ProjectService.deleteProjectProjectProjectIdDelete(project.value.id)
  visible.value = false
}

</script>

