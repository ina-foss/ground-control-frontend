<template>
    <Dialog :visible="dialogVisible" modal header="Your Project" :style="{ width: 'fit-content' }" class="bg-white "
      @hide="$emit('refreshData')" @after-hide="deleteDialog = false" @update:visible="emits('toggle-dialog')">
      <Stepper>
        <StepperPanel header="Infos">
        <template #content="{nextCallback}" >
          <div class=" grid grid-cols-1 grid-rows-3 gap-3 min-w-[70vh]">
            <span class="text-slate-400 ">Enter Task configuration</span>
            <div class="flex grid-cols-2 gap-3 align-items-center ">
              <label class="self-center basis-1/4">Title</label>
              <InputText v-model="name" placeholder="Enter a new task name" autocomplete="off" class="flex-auto" />
            </div>
            <div class="flex gap-3 ">
              <label class="self-center basis-1/4">Instruction</label>
              <InputText v-model="instruction" placeholder="Enter a new task instruction" autocomplete="off"
                class="flex-auto" />
            </div>
            <div class="grid grid-cols-2   ">
              <div class="flex gap-3 ">
                <label class="self-center basis-1/2">Data type</label>
                <Dropdown v-model="dataType"  :options="Object.values(TaskDataType)" placeholder="" />
              </div>
              <div class="flex gap-3 ">
              <label class="self-center basis-1/2 "> Status </label>
              <Dropdown v-model="status"  :options="Object.values(TaskStatus)" placeholder="" />
              </div>
            </div>
          </div>
            <div class="flex justify-end pt-8">
            <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" size="small" @click="nextCallback" />
            </div>
        </template>

        </StepperPanel>
        <StepperPanel header="Data">
        <template #content="{prevCallback}" >
            <div class="grid grid-cols-1 w-[70vh] gap-3">
            <span class="text-slate-400 "> Upload tasks </span>
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
              <Button label="Create" severity="success" icon="pi pi-check" size="small" @click="createTask" />
            </div>
        </template>

        </StepperPanel>
      </Stepper>

    </Dialog>
</template>


<script setup>

  import { TaskStatus, TaskService,TaskDataType, MediaService} from '~/api/generate';
  import { useRefreshStore } from '#imports';

  const refreshStore = useRefreshStore()
  const emits = defineEmits(['toggle-dialog', 'refreshData'])
  const { dialogVisible, stepObject } = defineProps(['dialogVisible','stepObject' ])
  const { fetchTasks } = refreshStore
  const route = useRoute()

  const name = $ref()
  const instruction = $ref()
  const dataType = $ref()
  const status = $ref(TaskStatus.DRAFT)

  let files = $ref([])
  let fileData = $ref([])
  const visible = computed(() => dialogVisible)

  const deleteDialog = $ref(false)

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
    console.log(fileData)
  }

  const onReaderLoad = (event) => {
    const obj = JSON.parse(event.target.result);
    fileData.push(obj)
  }

  const createTask = async () => {
      fileData.forEach((file, index) => {
        MediaService.createMediaMediaPost({
          url: file.asset.url,
          type: file.asset.media_type
      }).then((res)=> {
        TaskService.createTaskTaskPost({
          name: name,
          instruction: instruction,
          data: file,
          data_type: dataType,
          status: status,
          lead_time: null,
          step_id: stepObject.id,
          media_id: res.id
        }).catch((err) => console.error(err)) .then(() => fetchTasks(stepObject.id))
      })
    })
    emits('toggle-dialog')
  }
</script>
