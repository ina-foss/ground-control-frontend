<template>
  <Toast/>
  <Dialog
:visible="dialogVisible" modal :header="headerTitle" :style="{ width: 'fit-content' }" class="bg-white "
          @hide="$emit('refreshData')" @after-hide="deleteDialog = false" @update:visible="emits('toggle-dialog')">
    <Stepper class="transition-all">
      <StepperPanel class="transition-all" header="Infos">
        <template #content="{ nextCallback }" class="transition-all">
          <div class=" grid grid-cols-1 grid-rows-3 gap-3 min-w-[70vh]">
            <span class="text-slate-400 ">Enter project configuration</span>
            <div class="flex grid-cols-2 gap-3 align-items-center ">
              <label class="self-center basis-1/4">Title</label>
              <InputText v-model="title" placeholder="Enter a new project name" autocomplete="off" class="flex-auto"/>
              <InlineMessage v-if="errorVisible === true && !title">Title is required</InlineMessage>
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Description</label>
              <InputText
v-model="description" placeholder="Enter a new project description" autocomplete="off"
                         class="flex-auto"/>
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Status</label>
              <Dropdown v-model="status" :options="Object.values(ProjectStatus)" placeholder="Test"/>
            </div>
            <div class="flex justify-between items-center">
              <label class="self-center text-sm ">Published ?</label>
              <InputSwitch v-model="isPublished" class="scale-75"/>
              <label class="self-center text-sm">Allow empty annotations ?</label>
              <InputSwitch v-model="emptyAnnotations" class="scale-75"/>
              <label class="self-center text-sm">Allow skip ?</label>
              <InputSwitch v-model="allowSkip" class="scale-75"/>
            </div>
            <!-- <ButtonGroup class="justify-evenly flex items-center pt-6 "> -->
            <!--   <Button label="Update" severity="info" class="justify-self-center" @click="updateProject" /> -->
            <!--   <Button v-if="deleteDialog === false" label="Delete" severity="danger" @click="deleteDialog = true" /> -->
            <!--   <Button v-else label="Sure ?" severity="danger" class="" @click="deleteProject" /> -->
            <!-- </ButtonGroup> -->
          </div>
          <div class="flex justify-end pt-8">
            <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" size="small" @click="nextCallback"/>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Steps">
        <template #content="{ prevCallback }">
          <div class="w-[70vh] grid-cols-3 flex">
            <div class="">
              <label>Available</label>
              <Listbox v-model="selectedType" :options="availableType" multiple class="basis-1/3"/>
            </div>
            <span class=" flex justify-center items-center basis-1/3"><i class="pi pi-arrow-right scale-150"/></span>
            <div class="basis-1/3">
              <label>Selected</label>
              <ol v-if="selectedType.length !== 0" class="border-surface-300 border-[1px] py-3 rounded">
                <li
v-for="(type, index) in selectedType" :key="index"
                    class="leading-none px-5 py-3 self-center overflow-visible">{{ index + 1 }}. {{ type }}
                </li>
              </ol>
            </div>
          </div>

          <div class="flex justify-between pt-8">
            <Button label="Previous" icon="pi pi-arrow-left" icon-pos="right" size="small" @click="prevCallback"/>
            <Button
v-if="!project" label="Create" severity="success" icon="pi pi-check" size="small"
                    @click="createProject"/>
            <Button v-else label="Update" severity="success" icon="pi pi-check" size="small" @click="updateProject"/>
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </Dialog>

</template>

<script setup>


import InputSwitch from 'primevue/inputswitch';
import {ProjectStatus, AnnotationType, ProjectService, StepService, StepStatus} from '~/api/generate';
import {useRefreshStore,useAuth} from '#imports';

const errorVisible = ref(true);
const {dialogVisible, project} = defineProps(['dialogVisible', 'project'])
const emits = defineEmits(['toggle-dialog', 'refreshData'])
const deleteDialog = $ref(false)
let title = $ref(project?.title || '')
let description = $ref(project?.description || '')
let status = $ref(project?.status || ProjectStatus.DRAFT)
let isPublished = $ref(project?.is_published || false)
let allowSkip = $ref(project?.allow_skip || false)
let emptyAnnotations = $ref(project?.empty_annotations || false)
const availableType = $ref(Object.values(AnnotationType))
let selectedType = $ref([])
const refreshStore = useRefreshStore()
const {userEmail} = useAuth()
const toast = useToast()
const headerTitle = !project ? 'New Project' : 'Edit ' + project?.title
if (project?.steps !== null && project?.steps !== undefined) {
  project?.steps.forEach(type => {
    selectedType.push(type.annotation_type)
  })
}
const updateProject = async () => {
  if (title === "") {
    toast.add({severity: "error", detail: 'Project could not be created', summary: 'Something went wrong'});
  } else {
    try {
      const response = await ProjectService.updateProjectProjectProjectIdPut(project?.id, {
        title: title,
        description: description,
        status: status,
        is_published: isPublished,
        empty_annotations: emptyAnnotations,
        allow_skip: allowSkip,
        control_weights: 10,
        pinned_at: null,
        created_by: userEmail
      });

      // Assuming response is a promise
      selectedType.forEach((type, index) => {
        if (!project?.steps?.find(element => element.annotation_type === type)) {
          StepService.createStepStepPost({
            title: `Step #${index + 1}`,
            description: 'Step description',
            annotation_type: type,
            pinned_at: null,
            status: StepStatus.DRAFT,
            project_id: response.id
          }).catch((err) => console.error(err));
        }
      });
      emits('toggle-dialog');
      refreshStore.fetchProject();
    } catch (error) {
      toast.add({severity: 'error', detail: 'Project could not be updated', summary: 'Something went wrong'});
    }
  }
};
const createProject = async () => {
  if (title === '') {
    toast.add({severity: "error", detail: "Project could not be created", summary: "Something went wrong"})
  } else {

    const response = ProjectService.createProjectProjectPost({
      title: title,
      description: description,
      status: status,
      is_published: isPublished,
      empty_annotations: emptyAnnotations,
      allow_skip: allowSkip,
      control_weights: 10,
      pinned_at: null,
      created_by: userEmail,
    })

    response.catch(() => (toast.add({
      severity: 'error',
      detail: 'Project could not be created',
      summary: 'Something went wrong'
    }))).then((res) => {
      selectedType.forEach((type, index) => {
        StepService.createStepStepPost({
          title: `Step #${index + 1}`,
          description: 'Step description',
          annotation_type: type,
          pinned_at: null,
          status: StepStatus.DRAFT,
          project_id: res.id
        }).catch((err) => console.error(err))
      })
      // reset dialog values of create new
      title = '',
        description = '',
        status = ProjectStatus.DRAFT,
        isPublished = false,
        allowSkip = false,
        emptyAnnotations = false,
        selectedType = []

      emits('toggle-dialog')

      refreshStore.fetchProject()

    })
  }
}

</script>
