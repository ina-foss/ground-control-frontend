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
              <InputText v-model="title" placeholder="Enter a new task name" autocomplete="off" class="flex-auto" />
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Description</label>
              <InputText v-model="description" placeholder="Enter a new task description" autocomplete="off"
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
      <StepperPanel header="Medias">
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex justify-center min-w-[70vh]">
            <p>CHOIX DES MEDIAS WIP</p>
          </div>
          <div class="flex justify-between pt-8">
            <Button label="Previous" icon="pi pi-arrow-left" icon-pos="right" size="small" @click="prevCallback" />
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
            <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" size="small" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Annotations">
        <template #content="{ prevCallback, nextCallback }">
          <div class="w-[70vh]">
            <FileUpload accept="application/json" :show-upload-button=false :show-cancel-button="false"
              invalid-file-type-message="Invalid type" auto name="file[]" :pt="{
                buttonbar: {
                  style: `z-index:20; padding-top: 10px; padding-bottom: 10px; `
                },
                content: {
                  style: ''
                },

              }" @upload="onUpload($event)" @error="onUpload($event)">
              <template #empty="{ chooseCallback }">

                <div class="flex items-center justify-content-center flex-col">
                  <span class="pi pi-file-arrow-up align-center " style="font-size: 2.5rem" />
                  <p class="text-xs pt-3 text-slate-400 ">Upload a JSON file</p>
                </div>
              </template>

              <template #content="{ uploadedFiles, files, removeUploadedFileCallback, removeFileCallback }">
                <div class="flex flex-col gap-2">
                  <div v-for="(file, index) in uploadedFiles" :key="index"
                    class="grid grid-cols-8 gap-2 px-1 items-center">
                    <span class="pi pi-file self-center w-2" />
                    <p v-tooltip.top="file.name" class="text-ellipsis text-nowrap col-span-4 overflow-hidden ">
                      {{ file.name }}
                    </p>
                    <p v-if="file.size < 1024" class="text-slate-400 text-xs text-nowrap col-span-2   ">{{
                      file.size }} B</p>
                    <p v-else class="text-slate-400 text-xs text-nowrap col-span-2  ">{{ Math.round(file.size /
                      1024) }} KB
                    </p>
                    <Button icon="pi pi-times" text rounded size="small" severity="danger"
                      class=" self-center hover:bg-surface-100  hover:cursor-pointer" style="font-size: 15px;" :pt="{
                        root: {
                          style: 'justify-content: center; justify-items: center; place-self: center;'
                        },
                        icon: {
                          style: 'max-width:24px'
                        }
                      }" @click="removeUploadedFileCallback(index)" />
                  </div>
                </div>
                <div v-for="file in files">
                  <ProgressSpinner style="width: 40px;" stroke-width=5 />
                </div>
              </template>

            </FileUpload>

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
import { ProjectStatus, AnnotationType } from '~/api/generate';
import { ProjectService } from '~/api/generate';
import { useRefreshStore } from '#imports';
import { useAuth } from '#imports';

const { dialogVisible, project } = defineProps(['dialogVisible', 'project'])


const emits = defineEmits(['toggle-dialog', 'refreshData'])
const visible = computed(() => dialogVisible)
const deleteDialog = $ref(false)

const title = $ref(project?.title || '')
const description = $ref(project?.descriptio || '')
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
      // fileData.value.forEach((file, index) => {
      //   TaskService.createTaskTaskPost({
      //     name: `Task #${index + 1}`,
      //     instruction: 'Instruction',
      //     data: file,
      //     project_id: res.id
      //   }).catch((err) => console.error(err)).then((res) => console.log(res))
      // })
      // TODO: Implement the step creation by iteratiing throught selectedType
      selectedType.forEach((type) => {
        return true

      })
      files = []
      fileData = []
      emits('toggle-dialog')

      refreshStore.fetch()

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
