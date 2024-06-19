<template>
  <div
    class="min-w-fit bg-white max-w-screen h-150 px-3 py-1 cursor-pointer  rounded-md shadow hover:scale-105 transition-transform tansition-shadow hover:shadow-xl">
    <NuxtLink :to="{ name: 'projects-id', params: { id: $props.project.id } }">
      <div class="flex justify-between align-middle pl-2">
        <p class="font-semibold self-center">{{ $props.project.title }}</p>
        <p class="inline-block  text-2xl">
          <!-- <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" label= /> -->
          <Button icon="pi pi-ellipsis-h" severity="secondary" text rounded size="small"
            @click.stop.prevent="visible = true" />
          <Dialog v-model:visible="visible" modal header="Tasks Settings" :style="{ width: '35rem' }" class="bg-white"
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
      <div class="flex justify-between justify-items-stretch pl-2 pt-1 text-sm">
        <p>0/{{ $props.project.total_tasks }} <i class="pi pi-list-check" /></p>
        <div class="flex justify-between justify-items-stretch gap-3">
          <span>1/{{ }} </span>
          <span>2 <i class="pi pi-flag-fill" style="color:red" /> </span>
          <span>{{ $props.project.total_users_with_annotations }} <i class="pi pi-users" /></span>
        </div>
      </div>
      <hr>
      <div class="text-sm px-2 py-3 text-slate-500"> {{ $props.project.description }}</div>
      <div class="flex justify-between  pl-2 py-2 text-gray-400">
        <p v-if="$props.project.created_at != null" class="self-center">
          {{ $props.project.created_at.split('T')[0] }}</p>
      <Avatar shape="circle" icon="pi pi-user" v-tooltip.left="user.profile.email"/>
      </div>
    </NuxtLink>
  </div>

</template>

<script setup>

import { bcStore } from '~/stores/breadcrumbs';
import { defineEmits } from 'vue';
import { ProjectService } from '~/api/generate';
import { useService } from '../composables/useService';

const visible = ref(false)
const deleteDialog = ref(false)
const store = bcStore()
const props = defineProps(['project'])
const project = ref(props.project)
const services = useService();
const user = ref(await (services.$auth.getUser()))

// allow props to be reactive when there are changes from parent component
watchEffect(() => {
  project.value = props.project
})

const title = ref(project.value.title)

const description = ref(project.value.description)

const emit = defineEmits(['refreshData']);


const updateProject = async () => {

  if (title.value == project.value.title && description.value == project.value.description) {
  } else {
    const response = await ProjectService.updateProjectProjectProjectIdPut(project.value.id, {
      title: title.value,
      description: description.value,
      status: project.value.status,
      annotation_type: project.value.annotation_type,
      is_published: project.value.is_published,
      empty_annotations: project.value.empty_annotations,
      allow_skip: project.value.allow_skip,
      control_weights: project.value.control_weights,
      pinned_at: project.value.pinned_at,
      created_by: "john@example.com",

    })
    visible.value = false
  }
}

const deleteProject = async () => {
  await ProjectService.deleteProjectProjectProjectIdDelete(project.value.id)
  visible.value = false
}


const updateBreadcrumd = () => {
  store.addCrumb({ label: project.value.title, url: `/projects/${project.value.id}` })
}

const optionTrigger = () => {
  window.alert("Setting for task " + props.project.id)
}

</script>

<style>
@import url(/assets/css/base.css);
</style>
