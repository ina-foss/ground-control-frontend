<template>
  <div class="h-[60px] z-30 w-full fixed flex items-center gap-3 px-4 bg-white border-b-2  border-gray-400">
    <AtomLogo size="sm" />
    <NuxtLink class="self-center font-bold text-lg " to="/">Ground Control</NuxtLink>
    <AtomIcon class="self-center" />
    <Button icon="pi pi-align-justify" severity="secondary" text outlined @click="menuVisible = true" />
    <div class="flex-grow">
      <AtomBreadcrumbs />
    </div>
    <div class="self-center">
      <Button v-if="$route.name == 'dashboard'" label="Create Project" size="small" @click="dialogVisible = true" />
      <Button v-else label="Settings" severity="secondary" outlined size="small" />
    </div>
    <div class="self-center">
      <AtomAvatarHeader />
    </div>
  </div>



  <Dialog
v-model:visible="dialogVisible" modal header="New Project" style="width:20rem;" :pt="{
    header: {
      class: 'bg-surface-0 border-t-0 rounded-tr-lg rounded-tl-lg justify-between items-center shrink-0 flex p-6 pb-2'
    }
  }">
    <InlineMessage v-if="errorVisible == true && !titleValue" class="mb-2">Title is required</InlineMessage>
    <div class=" pt-5 flex flex-col gap-4">
      <FloatLabel class="py-1">
        <InputText id="title" v-model="titleValue" />

        <label for="title">Title</label>
      </FloatLabel>

      <FloatLabel class="py-1">
        <InputText id="description" v-model="descriptionValue" />
        <label for="description">Description</label>
      </FloatLabel>

      <Dropdown
v-model="selectedType" :options="['🏷️Segmentation', '✒️Transcription', 'Identification des visages']"
        placeholder="Select a task type" class="w-3/4" />

    </div>
    <div class="pt-8">
      <Toast />
      <FileUpload
accept="application/json" :show-upload-button=false :show-cancel-button="false"
        :max-file-size=maxFileSize invalid-file-type-message="Invalid type" auto name="file[]" :pt="{
          buttonbar: {
            style: `z-index:20; position: absolute; width: 85%; height: 100px; background-color: transparent;padding: 0px; cursor:pointer; border:none; ${selectFile}`
          },
          content: {
            style: 'padding: 14px'
          },

        }" @select="handleSelect()" @remove-uploaded-file="showRemove($event)" @upload="onUpload($event)"
        @error="onUpload($event)">
        <template #empty="{ chooseCallback }">

          <div class="flex items-center justify-content-center flex-col">
            <span class="pi pi-file-arrow-up align-center cursor-pointer" style="font-size: 2.5rem" />
            <p class="text-xs pt-3 text-slate-400 ">Click to upload a JSON file</p>
          </div>
        </template>

        <template #content="{ uploadedFiles, files, removeUploadedFileCallback, removeFileCallback }">
          <div class="flex flex-col gap-2">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="grid grid-cols-8 gap-2 px-1 items-center">
              <span class="pi pi-file self-center w-2" />
              <p v-tooltip.top="file.name" class="text-ellipsis text-nowrap col-span-4 overflow-hidden ">
                {{ file.name }}
              </p>
              <p v-if="file.size < 1024" class="text-slate-400 text-xs text-nowrap col-span-2   ">{{
                file.size }} B</p>
              <p v-else class="text-slate-400 text-xs text-nowrap col-span-2  ">{{ Math.round(file.size /
                1024) }} KB
              </p>
              <Button
icon="pi pi-times" text rounded size="small" severity="danger"
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
    <template #footer>
      <div class="flex">
        <Button label="Create" @click="createProject" />
      </div>
    </template>
  </Dialog>

  <Sidebar v-model:visible="menuVisible" class="bg-white" />
</template>



<script setup>

import { ProjectService } from '~/api/generate';
import { AnnotationType, ProjectStatus, TaskService } from '../api/generate';
import { useRefreshStore } from '../stores/refresh';
import { useAuth } from '../stores/auth';
import { storeToRefs } from 'pinia';
import AtomLogo from '../atoms/AtomLogo.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomBreadcrumbs from '../atoms/AtomBreadcrumbs.vue';
import AtomAvatarHeader from '../atoms/AtomAvatarHeader.vue';


const refreshStore = useRefreshStore()
const titleValue = ref(null)
const descriptionValue = ref(null)
const errorVisible = ref(false);
const menuVisible = ref(false);
const dialogVisible = ref(false)
const selectedType = ref('')
const selectFile = ref('')
const toast = useToast()
const maxFileSize = 100000000
const files = ref([])
const fileData = ref([])



const authStore = useAuth()
const { userEmail } = storeToRefs(authStore);

const showRemove = (e) => {
  toast.add({ severity: 'info', detail: 'The file "' + e.file.name + '" has been deleted', life: 5000 })
  fileData.value = null
  if (e.files.length == 0) selectFile.value = ''
}


const handleSelect = () => {
  selectFile.value = 'display: none'
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
  files.value = event.files;
  const reader = new FileReader();
  reader.onloadend = onReaderLoad;
  reader.readAsText(event.files[0])
}

const onReaderLoad = (event) => {
  const obj = JSON.parse(event.target.result);
  fileData.value.push(obj)
}


const createProject = async () => {
  if (titleValue.value == null) {
    errorVisible.value = true;
  }
  else {

    const response = ProjectService.createProjectProjectPost({
      title: titleValue.value,
      description: descriptionValue.value,
      status: ProjectStatus.DRAFT,
      annotation_type: AnnotationType.SEGMENTATION,
      is_published: true,
      empty_annotations: true,
      allow_skip: true,
      control_weights: 10,
      pinned_at: null,
      created_by: userEmail.value
    })

    response.catch((err) => (toast.add({ severity: 'danger', detail: 'Project could not be created', summary: 'Something went wrong' }))).then((res) => {
      fileData.value.forEach((file, index) => {
        TaskService.createTaskTaskPost({
          name: `Task #${index + 1}`,
          instruction: 'Instruction',
          data: file,
          project_id: res.id
        }).catch((err) => console.error(err)).then((res) => console.log(res))
      })
      dialogVisible.value = false
      files.value = []


      refreshStore.fetch()


    })
  }
}



</script>
