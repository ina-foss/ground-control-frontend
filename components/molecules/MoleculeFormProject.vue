<template>
  <Toast />
  <Dialog :visible="dialogVisible" modal :header="headerTitle" :style="{ width: 'fit-content' }" class="bg-white "
    @hide="$emit('refreshData')" @after-hide="deleteDialog = false" @update:visible="emits('toggle-dialog')">
    <Stepper class="transition-all">
      <StepperPanel class="transition-all" header="Infos">
        <template #content="{ nextCallback }" class="transition-all">
          <div class=" grid grid-cols-1 grid-rows-3 gap-3 min-w-[70vh]">
            <span class="text-slate-400 ">Enter project configuration</span>
            <div class="flex grid-cols-2 gap-3 align-items-center ">
              <label class="self-center basis-1/4">Title</label>
              <InputText v-model="title" placeholder="Enter a new project name" autocomplete="off" class="flex-auto" />
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Description</label>
              <InputText v-model="description" placeholder="Enter a new project description" autocomplete="off"
                class="flex-auto" />
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Status</label>
              <Dropdown v-model="status" :options="Object.values(ProjectStatus)" placeholder="Test" />
            </div>
            <div class="flex justify-between items-center">
              <label class="self-center text-sm ">Published ?</label>
              <InputSwitch v-model="isPublished" class="scale-75" />
              <label class="self-center text-sm">Allow empty annotations ?</label>
              <InputSwitch v-model="emptyAnnotations" class="scale-75" />
              <label class="self-center text-sm">Allow skip ?</label>
              <InputSwitch v-model="allowSkip" class="scale-75" />
            </div>
            <!-- <ButtonGroup class="justify-evenly flex items-center pt-6 "> -->
            <!--   <Button label="Update" severity="info" class="justify-self-center" @click="updateProject" /> -->
            <!--   <Button v-if="deleteDialog === false" label="Delete" severity="danger" @click="deleteDialog = true" /> -->
            <!--   <Button v-else label="Sure ?" severity="danger" class="" @click="deleteProject" /> -->
            <!-- </ButtonGroup> -->
          </div>
          <div class="flex justify-end pt-8">
            <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" size="small" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Steps">
        <template #content="{ prevCallback, nextCallback }">
          <div class="w-[70vh] grid-cols-3 flex">
            <div class="">
              <label>Available</label>
              <Listbox v-model="selectedType" :options="availableType" multiple class="basis-1/3" />
            </div>
            <span class=" flex justify-center items-center basis-1/3"><i class="pi pi-arrow-right scale-150" /></span>
            <div class="basis-1/3">
              <label>Selected</label>
              <ol v-if="selectedType.length != 0" class="border-surface-300 border-[1px] py-3 rounded">
                <li v-for="(type, index) in selectedType" :key="index"
                  class="leading-none px-5 py-3 self-center overflow-visible">{{ index + 1 }}. {{ type }}</li>
              </ol>
            </div>
          </div>

          <div class="flex justify-between pt-8">
            <Button label="Previous" icon="pi pi-arrow-left" icon-pos="right" size="small" @click="prevCallback" />
            <Button v-if="!project" label="Create" severity="success" icon="pi pi-check" size="small" @click="createProject" />
            <Button v-else label="Update" severity="success" icon="pi pi-check" size="small" @click="updateProject" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </Dialog>

</template>

<script setup>


import InputSwitch from 'primevue/inputswitch';
import { ProjectStatus, AnnotationType, ProjectService, StepService, StepStatus } from '~/api/generate';
import { useRefreshStore } from '#imports';
import { useAuth } from '#imports';

const { dialogVisible, project, selectedTypes } = defineProps(['dialogVisible', 'project','selectedTypes'])


const emits = defineEmits(['toggle-dialog', 'refreshData'])
const visible = computed(() => dialogVisible)
const deleteDialog = $ref(false)

const title = $ref(project?.title || '')
const description = $ref(project?.description || '')
const status = $ref(project?.status)
const isPublished = $ref(project?.is_published || false)
const allowSkip = $ref(project?.allow_skip || false)
const emptyAnnotations = $ref(project?.empty_annotations || false)
let files = $ref([])
let fileData = $ref([])

const availableType = $ref(Object.values(AnnotationType))
const selectedType = $ref([])
console.log("P:", project)
//console.log("types",selectedTypes)
if(selectedTypes !== null && selectedTypes !== undefined) {
  selectedTypes.forEach((type, index) => {
    //console.log("type",type.annotation_type)
    selectedType.push(type.annotation_type)
    //console.log("typePushed",selectedType)
  })
}
const refreshStore = useRefreshStore()
const { userEmail } = useAuth()
const toast = useToast()

const headerTitle = !project? 'New Project':'Edit ' +project?.title

/*const updateProject = async () => {

  //if (title.value == project.value.title && description.value == project.value.description)
  if(title === "")
  {
    toast.add({ severity: 'danger', detail: 'Project could not be created', summary: 'Something went wrong' })
  }
  else {
    const response = ProjectService.updateProjectProjectProjectIdPut(project?.id, {
      title: title,
      description: description,
      status: status,
      is_published: isPublished,
      empty_annotations: emptyAnnotations,
      allow_skip: allowSkip,
      control_weights: 10,
      pinned_at: null,
      created_by: userEmail //a verifier si c'est la meme ou elle doit etre changé

    })
    response.catch(() => (toast.add({ severity: 'danger', detail: 'Project could not be updated', summary: 'Something went wrong' }))).then((res) => {
      selectedType.forEach((type, index) => {
        const exists = project?.steps?.find(element => element.annotation_type === type);
         console.log(exists)
        if(!exists){
          StepService.createStepStepPost({
            title: `Step #${index +1 }`,
            description: 'Step description',
            annotation_type: type,
            pinned_at: null,
            status: StepStatus.DRAFT,
            project_id: res.id
          }).catch((err) => console.error(err)).then((res) => console.log(res))
        }

        }).catch((err) => console.error(err)).then((res) => console.log(res))
      })

      files = []
      fileData = []
  // doit-on faire un catch
    visible.value = true // ça sert à quoi exactement
  files = []
  fileData = []
  emits('toggle-dialog')

  refreshStore.fetchProject()
  }
}*/

const updateProject = async () => {
  if (title === "") {
    toast.add({ severity: "error", detail: 'Project could not be created', summary: 'Something went wrong' });
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
        const exists = project?.steps?.find(element => element.annotation_type === type);
        if (!exists) {
          StepService.createStepStepPost({
            title: `Step #${index + 1}`,
            description: 'Step description',
            annotation_type: type,
            pinned_at: null,
            status: StepStatus.DRAFT,
            project_id: response.id
          }).catch((err) => console.error(err)).then((res) => console.log(res));
        }
      });
      emits('toggle-dialog');

      refreshStore.fetchProject();
    } catch (error) {
      toast.add({ severity: 'danger', detail: 'Project could not be updated', summary: 'Something went wrong' });
      console.error(error);
    }
  }
};
const createProject = async () => {
  if (title === '') {
    //errorVisible.value = true;
    toast.add({severity:"error", detail:"Project could not be created", summary:"Something went wrong"})
  }
  else {

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

    response.catch(() => (toast.add({ severity: 'danger', detail: 'Project could not be created', summary: 'Something went wrong' }))).then((res) =>{
      selectedType.forEach((type,index) => {
        StepService.createStepStepPost({
          title: `Step #${index +1 }`,
          description: 'Step description',
          annotation_type: type,
          pinned_at: null,
          status: StepStatus.DRAFT,
          project_id: res.id
        }).catch((err) => console.error(err)).then((res) => console.log(res))
      })
      emits('toggle-dialog')

      refreshStore.fetchProject()

    })
  }
}

</script>
