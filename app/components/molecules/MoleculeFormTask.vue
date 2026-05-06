<template>
  <Dialog
    :visible="dialogVisible" modal :header="t('taskForm.dialog.title')" :style="{ width: 'fit-content' }" class="bg-white"
    @hide="$emit('refreshData')" @after-hide="deleteDialog = false" @update:visible="emits('toggle-dialog')">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="upload">{{ t('taskForm.tabs.upload') }}</Tab>
        <Tab value="manual">{{ t('taskForm.tabs.manual') }}</Tab>
      </TabList>
      <TabPanels>
        <!-- ─── TAB : Télécharger ─────────────────────────────────── -->
        <TabPanel value="upload">
          <div class="grid grid-cols-1 w-[70vh] gap-3 pt-4">
            <span class="text-slate-400">{{ t('taskForm.upload.import') }}</span>
            <FileUpload
              ref="templateRef"
              :choose-label="t('actions.upload')"
              :multiple="false"
              accept="application/json"
              :show-upload-button="false"
              :show-cancel-button="false"
              :disabled="isUploadEnabled"
              invalid-file-type-message="Type invalide"
              name="file[]"
              :pt="{
                buttonbar: { style: 'z-index:20; padding-top: 10px; padding-bottom: 10px;' },
                content: { style: '' },
                chooseButton: {
                  style: `font-size: 14px; font-family: Lato,sans-serif; font-weight: bold;
                          height: 33px; padding: 8px 12px; border-radius: 4px;
                          color: #FFFFFF; background-color: #0B7698;`
                }
              }"
              @select="onSelect($event)"
              @error="onSelect($event)"
            >
              <template #empty>
                <div class="flex items-center justify-content-center flex-col">
                  <span class="pi pi-file-arrow-up align-center" style="font-size: 2.5rem" />
                  <p class="text-xs pt-3 text-slate-400">{{ t('taskForm.upload.jsonHint') }}</p>
                </div>
              </template>
              <template #content="{ files, removeFileCallback }">
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="grid grid-cols-8 gap-2 px-1 items-center"
                  >
                    <span class="pi pi-file self-center w-2" />
                    <p v-tooltip.top="file.name" class="text-ellipsis text-nowrap col-span-4 overflow-hidden">
                      {{ file.name }}
                    </p>
                    <p v-if="file.size < 1024" class="text-slate-400 text-xs text-nowrap col-span-2">
                      {{ file.size }} B
                    </p>
                    <p v-else class="text-slate-400 text-xs text-nowrap col-span-2">
                      {{ Math.round(file.size / 1024) }} KB
                    </p>
                    <Button
                      icon="pi pi-times" text rounded size="small" severity="danger"
                      class="self-center hover:bg-surface-100 hover:cursor-pointer"
                      style="font-size: 15px;"
                      :pt="{
                        root: { style: 'justify-content: center; justify-items: center; place-self: center;' },
                        icon: { style: 'max-width:24px' }
                      }"
                      @click="() => {
                        removeFileCallback(index)
                        _.remove(fileData, (f, i) => i !== index)
                      }"
                    />
                  </div>
                </div>
              </template>
            </FileUpload>
          </div>

          <div class="flex justify-end pt-6">
            <Button
              class="button"
              icon="pi pi-check"
              icon-pos="left"
              label="Créer"
              size="small"
              @click="createTaskFromUpload"
            />
          </div>
        </TabPanel>
        <!-- ─── TAB : Créer manuellement (Stepper Step 1 + Step 2) ── -->
        <TabPanel value="manual">
          <Stepper value="1">
            <StepList >
              <Step value="1">{{ t('taskForm.steps.info') }}</Step>
              <Step value="2">{{ t('taskForm.steps.data') }}</Step>
            </StepList>
            <StepPanels>
              <StepPanel v-slot="{ activateCallback }" value="1">
                  <div class="flex flex-col gap-4 justify-center min-w-[70vh] pr-24 pl-24">
                    <div class="flex">
                      <label class="self-center w-24 pr-6">Titre</label>
                      <InputText
                        v-model="name"
                        placeholder="Entrez le titre de la tâche"
                        autocomplete="off"
                        class="input-box flex-auto custom-placeholder"
                      />
                    </div>
                    <div class="flex">
                      <label class="self-center w-24 pr-6">{{ t('taskForm.fields.instruction') }}</label>
                      <TextArea
                        v-model="instruction"
                        :placeholder="t('taskForm.placeholders.instruction')"
                        autocomplete="off"
                        class="input-box flex-auto custom-placeholder"
                      />
                    </div>
                    <div class="flex">
                      <label class="self-center w-24 pr-4">{{ t('taskForm.fields.endDate') }}</label>
                      <Calendar
                        v-model="endDate"
                        date-format="dd/mm/yy"
                        show-icon
                        class="input-box flex-auto"
                        :min-date="new Date()"
                      />
                    </div>
                  </div>
                <div class="flex justify-end pt-5">
                  <Button
                    class="button"
                    icon="pi pi-arrow-right"
                    icon-pos="left"
                    label="Suivant"
                    size="small"
                    @click="activateCallback('2')"
                  />
                </div>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="2" >
                <div class="grid grid-cols-1 w-[70vh] gap-3">
                  <span class="text-slate-400 ">{{ t('taskForm.upload.import') }}</span>
                  <FileUpload
                              ref="templateRef"
                              choose-label="Télécharger"
                              :disabled="isUploadEnabled"
                              :multiple="false" accept="application/json" :show-upload-button=false :show-cancel-button="false"
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
                        <p class="text-xs pt-3 text-slate-400 ">{{ t('taskForm.upload.jsonHint') }}</p>
                      </div>
                    </template>

                    <template #content="{files, removeFileCallback }">
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

      g           </FileUpload>

                </div>
                <div class="flex justify-between pt-8">
                  <Button
      class="button button-prev mr-4" label="Précédent" icon="pi pi-arrow-left" icon-pos="left"
                          size="small" @click="activateCallback('1')"/>
                  <Button
                    class="button"
                    icon="pi pi-check" icon-pos="left"
                    label="Créer"
                    size="small"
                    @click="createTaskFromUpload"
                  />
                </div>

              </StepPanel>
            </StepPanels>
          </Stepper>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>

<script setup>

import {useAuth} from '#imports';
import _ from 'lodash';
const { t } = useI18n()
const authStore = useAuth()
const emits = defineEmits(['toggle-dialog', 'refresh-data'])
const {dialogVisible, stepObject} = defineProps(['dialogVisible', 'stepObject'])
const {userEmail} = storeToRefs(authStore)
const { $handleApiError } = useNuxtApp()
const name = ref('')
const instruction = ref('')
const endDate = ref(null)
const fileData = ref([])
const deleteDialog = ref(false)
const activeTab = ref('upload')
const isUploadEnabled = computed(() => fileData.value.length > 0)

const onSelect = async (event) => {
  const reader = new FileReader();
  reader.onloadend = onReaderLoad;
  reader.readAsText(event.files[event.files.length - 1]);
};

const onReaderLoad = (event) => {
  try {
    const parsed = JSON.parse(event.target.result)
    const normalized = Array.isArray(parsed) ? parsed : [parsed]
    fileData.value.push(...normalized)  
  } catch (error) {
    console.error('Error parsing JSON:', error)
    $handleApiError(error)
  }
}

const createTaskFromUpload = async () => {
  const results = await Promise.all(
    fileData.value.map(async (entry) => {
      try {
        const media = await Media.createMediaMediaPost({
          body: {
            url: entry.asset.url,
            type: entry.asset.media_type,
            player_parameters: entry.asset.player_parameters
          }
        })

        const task = await Task.createTaskTaskPost({
          body: {
            name:
              name.value ||
              entry.data?.[0]?.localisation?.[0]?.sublocalisations?.localisation?.[0]?.label,
            instruction: instruction.value,
            data_type: TaskDataType.AMALIA,
            status: Status.DRAFT,
            expiration_date: endDate.value,
            lead_time: null,
            step_id: stepObject.id,
            media_id: media.id
          }
        })

        await Annotation.createAnnotationAnnotationPost({
          body: {
            annotation: {
              user_email: userEmail.value,
              annotation_status: Status.DRAFT,
              version: 0,
              result: entry,
              task_id: task.id
            },
            association: {
              annotation_id: 0,
              task_id: task.id,
              direction: 'in'
            }
          }
        })

        return { success: true, entry }

      } catch (error) {
        console.error('Error for entry:', entry, error)
        $handleApiError(error)
      }
    })
  )

  emits('toggle-dialog')
  emits('refresh-data')
}

</script>
