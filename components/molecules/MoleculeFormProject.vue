<template>
  <Toast/>
  <Dialog
    :visible="dialogVisible"
    modal
    :style="{ width: 'fit-content'}"
    class="bg-white"
    @hide="$emit('refreshData')"
    @after-hide="deleteDialog = false"
    @update:visible="emits('toggle-dialog')">

    <template #header>
      <span class="header-title">{{ headerTitle }}</span>
    </template>
    <Stepper value="1" class="transition-all">
      <StepList>
        <Step value="1">Informations</Step>
        <Step value="2">Etapes</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" class="transition-all" value="1">
            <div class="grid grid-cols-1 grid-rows-3 gap-2 min-w-[70vh]">
              <span class="text-slate-400 ">Entrez la configuration du projet</span>
              <div class="flex">
                <label class="self-center basis-1/5 pr-4">Titre</label>
                <InputText v-model="title" placeholder="Entrez le titre du projet" autocomplete="off" class=" input-box flex-auto custom-placeholder"/>
                <InlineMessage class="input-box ml-3" v-if="errorVisible === true && !title">Le titre est requis</InlineMessage>
              </div>
              <div class="flex ">
                <label class="self-center basis-1/5 pr-4">Description</label>
                <InputText
                  v-model="description" placeholder="Entrez la description du projet" autocomplete="off"
                  class="flex-auto input-box custom-placeholder"/>
              </div>
              <div class="flex">
                <label class="self-center basis-1/5 pr-4">Statut</label>
                <Dropdown class="custom-dropdown" v-model="status" :options="translatedProjectStatus"  optionLabel="label"/>
              </div>
              <div class="flex justify-between items-center">
                <label style="color: black" class="self-center text-sm ">Publié ?</label>
                <ToggleSwitch v-model="isPublished" class="scale-75"/>
                <label style="color: black" class="self-center text-sm">Autoriser les annotations vides ?</label>
                <ToggleSwitch v-model="emptyAnnotations" class="scale-75"/>
                <label style="color: black" class="self-center text-sm">autoriser le saut ?</label>
                <ToggleSwitch v-model="allowSkip" class="scale-75"/>
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
        <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="w-[70vh] grid-cols-3 flex">
              <div class="">
                <label>Disponibles</label>
                <Listbox v-model="selectedType" :options="availableType" multiple class="basis-1/3"/>
              </div>
              <span class=" flex justify-center items-center basis-1/3"><i class="pi pi-arrow-right scale-150"/></span>
              <div class="basis-1/3">
                <label>sélectionnés</label>
                <ol v-if="selectedType.length !== 0" class="border-surface-300 border-[1px] py-3 rounded">
                  <li
                    v-for="(type, index) in selectedType" :key="index"
                    class="leading-none px-5 py-3 self-center overflow-visible">{{ index + 1 }}. {{ type }}
                  </li>
                </ol>
              </div>
            </div>

            <div class="flex justify-end pt-8">
              <Button class="button button-prev mx-3" label="Précédent" icon="pi pi-arrow-left" icon-pos="left" size="small" @click="activateCallback('1')"/>
              <Button
                class="button"
                icon="pi pi-check" icon-pos="left"
                v-if="!project" label="Créer"
                size="small"
                @click="createProject"
              />
              <Button
                class="button"
                icon="pi pi-check" icon-pos="left"
                v-else label="sauvegarder"
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


import InputSwitch from 'primevue/inputswitch';
import {AnnotationType, ProjectService, ProjectStatus, StepService, StepStatus, TaskStatus} from '~/api/generate';
import {useRefreshStore} from '#imports';
import {useAuth} from '../../stores/auth';

const errorVisible = ref(true);
const {userEmail} = useAuth()
const {dialogVisible, project} = defineProps(['dialogVisible', 'project'])
const emits = defineEmits(['toggle-dialog', 'refreshData'])
const deleteDialog = $ref(false)
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}
const translatedProjectStatus = $computed(() => {
  return Object.values(ProjectStatus).map(status => ({
    label: translations[status],
    value: status,
  }));
})
let title = $ref(project?.title || '')
let description = $ref(project?.description || '')
let status = $ref(translatedProjectStatus.find(x=>x.value ===project?.status)|| translatedProjectStatus[0])
let isPublished = $ref(project?.is_published || false)
let allowSkip = $ref(project?.allow_skip || false)
let emptyAnnotations = $ref(project?.empty_annotations || false)
const availableType = $ref(Object.values(AnnotationType))
let selectedType = $ref([])
const refreshStore = useRefreshStore()
const toast = useToast()
const headerTitle = !project ? 'Nouveau projet' : 'Modifier ' + project?.title
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
        status: status.value,
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
      await refreshStore.fetchProject();
      await refreshStore.totalRecords();
    } catch (error) {
      toast.add({severity: 'error', detail: 'Project could not be updated', summary: 'Something went wrong'});
    }
  }
};
const createProject = async () => {
  if (title === '') {
    toast.add({severity: "error", detail: "Project could not be created", summary: "Something went wrong"})
  } else {
    const {userEmail} = useAuth()
    const response = ProjectService.createProjectProjectPost({
      title: title,
      description: description,
      status: status.value,
      is_published: isPublished,
      empty_annotations: emptyAnnotations,
      allow_skip: allowSkip,
      control_weights: 10,
      pinned_at: null,
      created_by: userEmail,
    })

    response
      .catch(() => (toast.add({
        severity: 'error',
        detail: 'Project could not be created',
        summary: 'Something went wrong'
      })))
      .then((res) => {
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
        // reset dialog values of create new project
        title = '',
          description = '',
          status = translatedProjectStatus[0],
          isPublished = false,
          allowSkip = false,
          emptyAnnotations = false,
          selectedType = []

        emits('toggle-dialog')

        refreshStore.fetchProject() // Pas de parametre = on refetch avec le precedent skip value
        refreshStore.totalRecords();
    })
  }
}

</script>
<style>
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
  height: 33px; /* Définit la hauteur du dropdown */
  display: flex; /* Utilisation de flexbox pour aligner le contenu */
  align-items: center; /* Centre le texte verticalement */
}

.custom-dropdown .p-dropdown-label
{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* .button-prev{ */
/*   background-color: transparent!important; */
/*   color: #0B7698!important; */
/*   border-color: #0B7698!important; */
/* } */
</style>
