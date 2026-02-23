<template>
  <Dialog
    :visible="dialogVisible"
    modal
    :style="{ width: 'fit-content'}"
    class="bg-white"
    @update:visible="emits('toggle-dialog')">

    <template #header>
      <span class="header-title">{{ headerTitle }}</span>
    </template>
    <Stepper value="1" class="transition-all">
      <StepList>
        <Step value="1">{{t('moleculeFormProject.step.information')}}</Step>
        <Step value="2">{{ t('moleculeFormProject.step.settings') }}</Step>
        <Step value="3">{{t('moleculeFormProject.step.steps')}}</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" class="transition-all" value="1">
            <div class="grid grid-cols-1 grid-rows-3 gap-2 w-[50vh]">
              <span class="text-slate-400 ">{{ t('moleculeFormProject.form.intro') }}</span>
              <div class="flex">
                <label class="self-center basis-1/5 pr-4">{{ t('moleculeFormProject.form.title') }}</label>
                <InputText v-model="title" :placeholder="t('moleculeFormProject.form.titlePlaceholder')" autocomplete="off" class=" input-box flex-auto custom-placeholder"/>
                <InlineMessage class="input-box ml-3" v-if="errorVisible === true && !title">{{ t('moleculeFormProject.form.titleRequired') }}</InlineMessage>
              </div>
              <div class="flex ">
                <label class="self-center basis-1/5 pr-4">{{ t('moleculeFormProject.form.description') }}</label>
                <InputText
                  v-model="description" :placeholder="t('moleculeFormProject.form.descriptionPlaceholder')" autocomplete="off"
                  class="flex-auto input-box custom-placeholder"/>
              </div>
            </div>
            <div class="flex justify-end pt-5">
              <Button
                class="button"
                icon="pi pi-arrow-right" icon-pos="left"
                :label="t('actions.next')"
                @click="activateCallback('2')"
              />
            </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" class="transition-all" value="2">
          <div class="grid grid-cols-2 gap-4 items-start w-[50vh]">
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <label class="text-sm text-black w-40">{{ t('moleculeFormProject.settings.redundancy') }}</label>
                <InputText
                  v-model="redundancy"
                  placeholder="1"
                  autocomplete="off"
                  class="input-box text-center"
                  style="width: 60px;"
                />
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-black w-40">{{ t('moleculeFormProject.settings.coverage') }}</label>
                <InputText
                  v-model="completeness_rate"
                  placeholder="100%"
                  autocomplete="off"
                  class="input-box text-center"
                  style="width: 60px;"
                />
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-black w-40">{{ t('moleculeFormProject.settings.maxTasks') }}</label>
                <InputText
                  v-model="max_tasks_per_person"
                  placeholder="1"
                  autocomplete="off"
                  class="input-box text-center"
                  style="width: 60px;"
                />
              </div>
            </div>
            <div class="flex flex-col justify-start gap-4">
              <div class="flex items-center gap-2">
                <label class="text-sm text-black">{{ t('moleculeFormProject.settings.allowEmptyAnnotations') }}</label>
                <ToggleSwitch v-model="emptyAnnotations" class="shrink-0"/>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-black">{{ t('moleculeFormProject.settings.allowSkip') }}</label>
                <ToggleSwitch v-model="allowSkip" class="shrink-0"/>
              </div>
            </div>

          </div>
            <div class="flex justify-end pt-5">
              <Button class="button button-prev mx-3" outlined :label="t('actions.previous')" icon="pi pi-arrow-left" icon-pos="left" size="small" @click="activateCallback('1')"/>
              <Button
                class="button"
                icon="pi pi-arrow-right" icon-pos="left"
                :label="t('actions.next')"
                @click="activateCallback('3')"
              />
            </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="w-[50vh] grid-cols-3 flex justify-center">
              <div>
                <div class="mb-3">{{ t('moleculeFormProject.steps.available') }}</div>
                <Listbox v-model="selectedType" :options="availableType" multiple class="basis-1/3"/>
              </div>
              <span class=" flex justify-center items-center basis-1/3"><i class="pi pi-arrow-right scale-150"/></span>
              <div class="basis-1/3">
                <div class="mb-3">{{ t('moleculeFormProject.steps.selected') }}</div>
                <ol v-if="selectedType.length !== 0" class="border-surface-300 border-[1px] py-3 rounded">
                  <li
                    v-for="(type, index) in selectedType" :key="index"
                    class="leading-none px-5 py-3 self-center overflow-visible">{{ index + 1 }}. {{ type }}
                  </li>
                </ol>
              </div>
            </div>

            <div class="flex justify-end pt-8">
              <Button class="button button-prev mx-3" outlined :label="t('actions.previous')" icon="pi pi-arrow-left" icon-pos="left" size="small" @click="activateCallback('2')"/>
              <Button
                class="button"
                icon="pi pi-check" icon-pos="left"
                v-if="!project" :label="t('actions.create')"
                size="small"
                @click="createProject"
              />
              <Button
                class="button"
                icon="pi pi-check" icon-pos="left"
                v-else :label="t('actions.save')"
                size="small"
                @click="updateProject"
              />
            </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </Dialog>

</template>

<script setup>


import {AnnotationType, ProjectService, Status , StepService } from '~/api/generate';
import {useRefreshStore} from '#imports';
import {useAuth} from '../../stores/auth';
import { useI18n } from '#imports'

const { t } = useI18n()
const errorVisible = ref(true);
const {userEmail} = useAuth()
const {dialogVisible, project} = defineProps(['dialogVisible', 'project'])
const emits = defineEmits(['toggle-dialog'])
const deleteDialog = ref(false)
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}
let title = ref(project?.title || '')
let description = ref(project?.description || '')
let isPublished = ref(project?.is_published || false)
let allowSkip = ref(project?.allow_skip || true)
let emptyAnnotations = ref(project?.empty_annotations || true)
let redundancy = ref(project?.steps[0].redundancy || 1)
let completeness_rate = ref(project?.steps[0].completeness_rate || 100)
let max_tasks_per_person = ref(project?.steps[0].max_tasks_per_person || 1)
const availableType = ref(Object.values(AnnotationType))
const selectedType = ref(project?.steps ? project?.steps.map(type =>type.annotation_type) : [])
const refreshStore = useRefreshStore()
const toast = useToast()
const { $handleApiError } = useNuxtApp()
const headerTitle = computed(() => {
    return !project
      ? t('project.newProject')
      : t('project.editProject', { title: project?.title })
  })
  const updateProject = async () => {
  if (title.value === "") {
    toast.add({severity: "error", detail: 'Le titre est requis', summary: 'Erreur détectée'});
  } else {
    try {
      const response = await ProjectService.updateProjectProjectProjectIdPut(project?.id, {
        title: title.value,
        description: description.value,
        is_published: isPublished.value,
        empty_annotations: emptyAnnotations.value,
        allow_skip: allowSkip.value,
        control_weights: 10,
        pinned_at: null,
        created_by: userEmail
      });

      // Assuming response is a promise
      selectedType.value.forEach((type, index) => {
        if (!project?.steps?.find(element => element.annotation_type === type)) {
          StepService.createStepStepPost({
            title: `Step #${index + 1}`,
            description: 'Step description',
            annotation_type: type,
            pinned_at: null,
            status: Status.DRAFT,
            project_id: response.id,
          }).catch((err) => {
              console.error(err)
              $handleApiError(err)
            });
        }
      });
      emits('toggle-dialog');
      useAsyncData('projects-summary',async ()=> await refreshStore.fetchProjects(),{server:false})
    } catch (error) {
      $handleApiError(error)
    }
  }
};
const createProject = async () => {
  if (title.value === '') {
    toast.add({severity: "error", detail: "Le titre est requis", summary: "Erreur détectée"})
  } else {
    const {userEmail} = useAuth()
    const response = ProjectService.createProjectProjectPost({
      title: title.value,
      description: description.value,
      status: Status.DRAFT,
      is_published: false,
      empty_annotations: emptyAnnotations.value,
      allow_skip: allowSkip.value,
      control_weights: 10,
      pinned_at: null,
      created_by: userEmail,
    })

    response
      .then(async(res) => {
        selectedType.value.forEach(async(type, index) => {
          await StepService.createStepStepPost({
            title: `Step #${index + 1}`,
            description: 'Step description',
            annotation_type: type,
            pinned_at: null,
            status: Status.DRAFT,
            project_id: res.id,
            redundancy: parseInt(redundancy.value, 10),
            completeness_rate: parseFloat(completeness_rate.value),
            allow_empty_annotation: emptyAnnotations.value,
            max_tasks_per_person: parseInt(max_tasks_per_person.value, 10)
          }).catch((err) => {
            console.error(err)
            $handleApiError(err)
          })
        })
      }).catch((error) => {
        $handleApiError(error)
      }) .finally(()=>{
        // reset dialog values of create new project
        title.value = '',
        description.value = '',
        isPublished.value = false,
        allowSkip.value = false,
        emptyAnnotations.value = false,
        selectedType.value = [],
        redundancy.value = 1
        completeness_rate.value  = 100,
        max_tasks_per_person.value = 1

        emits('toggle-dialog')
        useAsyncData('projects-summary',async ()=> await refreshStore.fetchProjects(),{server:false})
    })
  }
}

</script>
<style scoped>
.header-title {
  font-size: 19px;
  font-weight: 700;
}
label{
  text-align: right;
  color: black
}
.input-box{
  height: 33px;
}
.custom-placeholder::placeholder {
  color: #757575;
}
.custom-dropdown {
  height: 33px;
  display: flex;
  align-items: center; 
}

.custom-dropdown .p-dropdown-label
{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
