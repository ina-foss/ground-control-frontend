<template>
  <Dialog
    :visible="dialogVisible" modal header="Nouvelle tâche" :style="{ width: 'fit-content' }" class="bg-white "
    @hide="$emit('refreshData')" @after-hide="deleteDialog = false" @update:visible="emits('toggle-dialog')">
    <Stepper value="1">
      <StepList >
        <Step value="1">Informations</Step>
        <Step value="2">Données</Step>
      </StepList>
      <StepPanels>

        <StepPanel value="1" v-slot="{ activateCallback }" >
          <div class=" grid grid-cols-1 grid-rows-3 gap-2 min-w-[70vh]">
            <span class="text-slate-400 ">Entrez la configuration de la tâche</span>
            <div class="flex">
              <label class="self-center basis-1/5 pr-4">Titre</label>
              <InputText v-model="name" placeholder="Entrez le titre de la tâche" autocomplete="off"
                         class="input-box flex-auto custom-placeholder"/>
            </div>
            <div class="flex">
              <label class="self-center basis-1/5 pr-4">Instruction</label>
              <InputText
                v-model="instruction" placeholder="Entrez l'instruction de tâche" autocomplete="off"
                class="flex-auto input-box custom-placeholder"/>
            </div>
            <div class="grid grid-cols-2 flex justify-between">
              <div class="flex">
                <label class="self-center basis-1/2,5 pr-4 -mr-1">Type de données</label>
                <Select class="custom-dropdown" v-model="dataType" :options="Object.values(TaskDataType)"
                        placeholder=""/>
              </div>
              <div class="flex">
                <label class="self-center basis-1/2,5 pr-4 -mr-1"> Statut </label>
                <Select class="custom-dropdown" v-model="status" :options="translatedTaskStatus" optionLabel="label"
                        placeholder=""/>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-5">
            <Button
              class="button"
              icon="pi pi-arrow-right" icon-pos="left"
              label="Suivant"
              size="small"
              @click="activateCallback('2')"
            />
          </div>

        </StepPanel>
        <StepPanel value="2" v-slot="{ activateCallback }" >
          <div class="grid grid-cols-1 w-[70vh] gap-3">
            <span class="text-slate-400 "> Télécharger des tâches </span>
            <FileUpload chooseLabel="Télécharger"
                        :multiple="true"
                        ref="templateRef" accept="application/json" :show-upload-button=false :show-cancel-button="false"
                        invalid-file-type-message="Type invalide"  name="file[]" :pt="{
                  buttonbar: {
                    style: `z-index:20; padding-top: 10px; padding-bottom: 10px;`
                  },
                  content: {
                    style: ''
                  },
                    chooseButton: {
                    style: `font-size: 14px;
  font-family: Lato,sans-serif;
  font-weight: bold;
  height: 33px;
  padding: 8px 12px;
  border-radius: 4px;
  color: #FFFFFF;
  background-color: #0B7698;`,
                  }
                }" @select="onSelect($event)" @error="onSelect($event)">
              <template #empty="">

                <div class="flex items-center justify-content-center flex-col">
                  <span class="pi pi-file-arrow-up align-center " style="font-size: 2.5rem"/>
                  <p class="text-xs pt-3 text-slate-400 ">Téléchargez un fichier JSON</p>
                </div>
              </template>

              <template #content="{files, uploadedFiles,removeFileCallback, removeUploadedFileCallback }">
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(file, index) in files"
                    class="grid grid-cols-8 gap-2 px-1 items-center">
                    <span class="pi pi-file self-center w-2"/>
                    <p v-tooltip.top="file.name" class="text-ellipsis text-nowrap col-span-4 overflow-hidden ">
                      {{ file.name }}
                    </p>
                    <p v-if="file.size < 1024" class="text-slate-400 text-xs text-nowrap col-span-2   ">{{
                        file.size
                      }} B</p>
                    <p v-else class="text-slate-400 text-xs text-nowrap col-span-2  ">{{
                        Math.round(file.size /
                          1024)
                      }} KB
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
                        }" @click="()=>{
                        removeFileCallback(index)
                        _.remove(fileData,(file,indexFile) => indexFile != index )
                        }
                        "/>
                  </div>
                </div>

              </template>

            </FileUpload>

          </div>

          <div class="flex justify-between pt-8">
            <Button class="button button-prev mr-4" label="Précédent" icon="pi pi-arrow-left" icon-pos="left"
                    size="small" @click="activateCallback('1')"/>
            <Button
              class="button"
              icon="pi pi-check" icon-pos="left"
              label="Créer"
              size="small"
              @click="createTask"
            />
          </div>

        </StepPanel>
      </StepPanels>
    </Stepper>
  </Dialog>
</template>


<script setup>

import {TaskStatus, TaskService, TaskDataType, MediaService, AnnotationService, AnnotationStatus} from '~/api/generate';
import {useRefreshStore, useAuth} from '#imports';
import _ from 'lodash';

const refreshStore = useRefreshStore()
const authStore = useAuth()
const emits = defineEmits(['toggle-dialog', 'refreshData'])
const {dialogVisible, stepObject} = defineProps(['dialogVisible', 'stepObject'])
const {fetchTasks} = refreshStore
const {userEmail} = storeToRefs(authStore)
const { $handleApiError } = useNuxtApp()
const toast = useToast()

const templateRef = ref()
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  'in-progress': 'En cours',
  done: 'Terminé',
  skipped: 'Passé'
}
const translatedTaskStatus = computed(() => {
  return Object.values(TaskStatus).map(status => ({
    label: translations[status],
    value: status,
  }));
})

let name = ref()
let instruction = ref()
let dataType = ref(TaskDataType.LDD)
let status = ref(translatedTaskStatus.value[0])
const fileData = ref([])
const deleteDialog = ref(false)

const onSelect = async (event) => {
  const reader = new FileReader();
  reader.onloadend = onReaderLoad;
  reader.readAsText(event.files[event.files.length-1])
  if ( event.files.length == fileData.length){
    fileData.pop()
    toast.add({
      life: 5000,
      severity: 'error',
      detail: "Impossible d'importer deux fois le même fichier",
      summary: "Erreur d'import"
    });
  }
}

watchEffect(() => {
  if (fileData.value.length > 1) {
    for (let i = 1; i < fileData.value.length; i++) {
      if (fileData[i].asset?.url !== fileData.value[i - 1].asset.url) {
        toast.add({
          life: 5000,
          severity: 'error',
          detail: "Toutes les transcriptions d'une tâches doivent concerner le même media",
          summary: "Erreur d'import"
        });
        templateRef.value.remove(i)
        fileData.value.pop()
      }
    }
  }
});

const onReaderLoad = (event) => {
  const obj = JSON.parse(event.target.result);
  fileData.value.push(obj)
}

const createTask = async () => {

  MediaService.createMediaMediaPost({
    url: fileData.value[0].asset.url,
    type: fileData.value[0].asset.media_type,
    player_parameters: fileData.value[0].asset.player_parameters
  }).then((res) => {
    TaskService.createTaskTaskPost({
      name: name.value,
      instruction: instruction.value,
      data_type: dataType.value,
      status: status.value.value,
      lead_time: null,
      step_id: stepObject.id,
      media_id: res.id
    }
    ).catch((err) => {
      console.error(err)
      $handleApiError(err)
    }).then((res) => {
      fileData.value.forEach(file => {
        AnnotationService.createAnnotationAnnotationPost({
          annotation: {
            user_email: userEmail.value,
            annotation_status: AnnotationStatus.DRAFT,
            version: 0,
            result: file,
            task_id: res.id
          },
          association: {
            annotation_id: 0,
            task_id: res.id,
            direction: 'in'
          }
        })
      })
    }).then(() => fetchTasks(stepObject.project_id))
      .then(  // reset dialog values of create new task
        name= '',
        instruction= '',
        dataType = TaskDataType.LDD,
        status = translatedTaskStatus.value[0])
  })


  emits('toggle-dialog')
}


</script>
