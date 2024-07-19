<template>
  <Dialog :visible="dialogVisible" modal header="Your Project" :style="{ width: 'fit-content' }" class="bg-white "
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
            <Button label="Create" severity="success" icon="pi pi-check" size="small" @click="createProject" />
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

const { dialogVisible, project } = defineProps(['dialogVisible', 'project'])


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

const refreshStore = useRefreshStore()
const { userEmail, user } = useAuth()
const toast = useToast()


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

const createProject = async () => {
  if (title == null) {
    errorVisible.value = true;
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
      created_by: userEmail
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
      files = []
      fileData = []
      emits('toggle-dialog')

      refreshStore.fetchProject()

    })
  }
}

const deleteProject = async () => {
  await ProjectService.deleteProjectProjectProjectIdDelete(project.value.id)
  visible.value = false
}

const onUpload = async (event) => {
  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  const file = event.files[0]


  formData.append("file", file)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let _this$uploadedFiles;
    }
  };
  xhr.open('POST', '/', true);
  files.push(event.files);
  const reader = new FileReader();
  reader.onloadend = onReaderLoad;
  reader.readAsText(event.files[0])
}

const onReaderLoad = (event) => {
  const obj = JSON.parse(event.target.result);
  fileData.push(obj)
}


</script>

<style scoped>
.p-steplist {
  transition: "all 1s ease-in-out"
}
</style>
