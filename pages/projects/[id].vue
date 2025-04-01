<template>
  <div v-if="!data.title" class="h-0 h-min-full">
    <LoadingSpinner/>
  </div>

  <div v-else class="grid h-full p-3">
    <div class="p-3 w-fit h-[70px] ml-auto fixed z-40 right-[-5px] mr-12 flex items-center top-[0px]">
      <label class="text-primary font-semibold p-2">Etapes</label>
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        class="w-fit items-center h-[33px]"
        placeholder="Statut"
        show-clear
        :pt="{
      root: { style: { padding: '4px' } },
      label: { style: { padding: '0px', paddingLeft: '4px', paddingRight: '30px', overflow: 'visible' } },
      dropdown: { style: { width: '22px',paddingLeft: '6px', paddingRight: '4px'  } },
      clearIcon: { style: { width: '12px', marginRight: '-15px' } },
    }"
      />
    </div>
    <DataTable
      v-model:expanded-rows="expandedRows" class=" overflow-scroll-full custom-data-table p-3" :context-menu=true
      :pt="{
      row:{
        class:'p-3',
        style: { backgroundColor: 'black', color: 'white' },
      },
      style: 'height:88px'
    }" :row-hover=true :sort-order=0 :value="filteredProjects" breakpoint="300px" column-resize-mode="fit"
      @cell-edit-complete="onCellEditComplete">
      <template #empty>
        <div class="bg-white h-[calc(100vh-300px)] w-full flex flex-col gap-10 items-center justify-center ">
          <i class="pi pi-ellipsis-h opacity-30  scale-[1000%]"/>
          <h1 class="text-xl font-bold">Ce projet ne comporte aucune etapes</h1>
        </div>
      </template>
      <Column field="name" header="Titre" class="txt" style="width : 8rem ; min-width: 70px;"   body-class="p-3 ">
        <template #body="slotProps">
          <p > {{ slotProps.data.title }}</p>
        </template>
      </Column>
      <Column field="id" header="ID" class="txt" style="width: 40px;" body-class=""/>
      <Column field="annotation_type" class="txt" header="Type"  body-class="" style="width : 9rem ; min-width: 70px;"/>
      <Column header="Statut" class="txt"  body-class="" style="width : 9rem ; min-width: 70px;">
        <template #body="slotProps">
          <Tag  :severity="getStatusClass(slotProps.data.status)" class="mb-1 scale-90" style="font-weight:500">{{translatedAnnotationStatus(slotProps.data.status) }}</Tag>
        </template>
      </Column>
      <Column field="description" header="Description" class="txt"  body-class=""/>
      <Column header=" " style="width: 17rem; "  body-class="">
        <template #body="slotProps">
          <div class="flex min-w-[240px] txt">
            <Button
              style="font-size: 14px;font-family: Lato,sans-serif;font-weight: bold;height: 33px;padding: 8px 12px;border-radius: 4px;margin-right:12px"
              label="Créer un task"  outlined  @click="stepCreate(slotProps.data.id)"/>
            <div
              class="flex items-center cursor-pointer txt    " :loading="loadingExport"
              @click="clickButtonMenu($event,slotProps.data) ">
              <SplitButton
                label="Exporter"  outlined  />
            </div>

            <Menu ref="buttonMenu" :model="buttonItems" :popup="true">
              <template #item="{ item, props }" >
                <a
                  v-ripple v-tooltip="{ value: item.tooltip, showDelay: 1000 }" class="txt flex align-items-center"
                  v-bind="props.action">
                  <p  >{{ item.label }}</p>
                </a>
              </template>
            </Menu>
          </div>
        </template>
      </Column>
      <Column :row-editor="true" body-style="text-align:center" style="width: 5%; min-width: 5rem"  body-class="text-sm"/>
      <Column id="test" expander style="width: 5rem;" class="txt"  body-class="text-sm p-3"/>

      <template #expansion="slotProps">
        <div class="border-surface-200 shadow-lg table-border-left" style="box-shadow: 0 4px 6px rgba(237, 237, 237, 1);">
          <DataTable
            v-model:filters = "filters"
            filterDisplay="row"
            :globalFilterFields = "['name']"
            :row-class="()=> 'hover:bg-surface-100 cursor-pointer'"
            class="overflow-scroll"
            :value="slotProps.data.tasks" :sort-order=0 breakpoint="300px" column-resize-mode="fit"
            :pt="{
      row:{
        class:'p-3',
        style: { backgroundColor: 'black', color: 'white' },
      },
       style: {height:'88px',padding: '20px !important'}
    }"
            @row-click="handleRowClick($event)">
            <template #empty>Aucune tâche trouvée.</template>
            <Column  class="txt" body-class="text-sm" field="name" header="Titre" style="width : 8rem ; min-width: 70px;">
              <template #editor="{ index: nestedIndex }">
                <InputText
                  v-model="data.steps[slotProps.index].tasks[nestedIndex].name"
                  style="width : 100% ; min-width: 70px; "/>
              </template>
              <template #body="{ data: nestedData }">
                <p class="cursor-text	"> {{ nestedData.name }}</p>
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Rechercher par titre ..." />
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="annotations.length" sortable style="width: 3rem;">
              <template #header><i v-tooltip="'Nombre total annotations'" class="pi pi-star cursor-help"/></template>
              <template #body="{ data: nestedData }">
                <div class="flex-1 text-center"> {{ nestedData.annotations?.length || 0 }}</div>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="predictions.length" sortable style="width: 3rem">
              <template #header><i
                v-tooltip="'Nombre annotations remplies'"
                class="pi pi-star-fill cursor-help"/></template>
              <template #body="">
                <div class="flex-1 text-center"> {{ }}</div>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="predictions.length" style="width: 12px">
              <template #header><i v-tooltip="'Nombre de prédictions'" class="pi pi-lightbulb cursor-help"/></template>
              <template #body="">
                <div class="flex-1 text-center"> {{ }}</div>
              </template>
            </Column>
            <Column header="Statut" class="txt" style="width: 20px"   >
              <template #body="{ data: nestedData }">
                <Tag  :severity="getStatusClass(nestedData.status)" class="mb-1 scale-90" style="font-weight:500">{{translatedAnnotationStatus(nestedData.status) }}</Tag>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" header="Annoté par" style="width: 12rem">
              <template #body="{data: nestedData}">
                <div class="flex justify-start gap-2 ">
                  <Avatar
                    v-for="(annotation, index) in nestedData.annotations" :key="index"
                    v-tooltip.top="annotation.user_email" :label=annotation.user_email.charAt(0).toUpperCase()
                    shape="circle" style="background-color:#0057FF;color: white;font-weight: 500;height:24px;width:24px"
                    @click="handleRowClick(annotation.user_email)"
                    :style="{ backgroundColor: getColorForAnnotation(annotation.annotation_status) }"/>
                </div>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="instruction" header="Instruction">
              <template #body="{ data: nestedData }">
                <AtomMarkdown :content="getFirstLine(nestedData.instruction) "/>
              </template>
            </Column>            <Column v-if="roleDeleteTask" >
            <template #body="{data: nestedData}">
              <div class="flex justify-end px-4">
                <Button label="Supprimer" severity="danger" outlined @click="showDeleteTaskModal(nestedData)"/>
              </div>
            </template>
          </Column>

          </DataTable>
        </div>
      </template>

    </DataTable>

    <Dialog v-model:visible="deleteModal.visible" :header="`Voulez vous supprimer la tâche ${ deleteModal.data.name?.slice(0,17) != deleteModal.data.name ? deleteModal.data.name?.slice(0,17) +'...' : deleteModal.data.name }  ? `"  modal @hide="hideDeleteTaskModal()">
      <div class="h-fit w-full flex flex-row justify-end gap-2  ">
        <Button label="Annuler" severity="secondary" text @click="hideDeleteTaskModal()"/>
        <Button type="button" label="Supprimer" severity="danger" :loading="deleteModal.loading" icon="pi pi-times" @click="deleteTask(deleteModal.data.id)" />
      </div>
    </Dialog>

    <Dialog v-model:visible="visible" modal @hide="visible = false">
      <DataDialog :data="dialogContent" :visible="spinnerVisible"/>
    </Dialog>
    <MoleculeFormTask
      :dialog-visible="dialogVisible" :step-object="formStepClick"
      @toggle-dialog="dialogVisible=false"/>
  </div>

</template>


<script setup lang="ts">

import _ from 'lodash';
import {ref} from 'vue';
import {AnnotationService, AnnotationStatus, StepStatus, TaskService, Permission} from '../../api/generate';
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';
import {useRefreshStore} from '../stores/refresh';
import AtomMarkdown from "../../components/atoms/AtomMarkdown.vue";
import { FilterMatchMode } from '@primevue/core/api';
import type { DataTableFilterMeta } from 'primevue';

const route = useRoute()
const refreshStore = useRefreshStore()
const toast = useToast()
const { $application } = useService()

const {getProject} = storeToRefs(refreshStore)
const {fetchTasks} = refreshStore

const dialogVisible = ref(false)
const deleteModal = reactive({visible: false, data: {},loading:false})
const visible = ref(false)
const dialogContent = ref('')
const clickedRowData = ref(null)
const spinnerVisible = ref(true)
const formStepClick = ref()
const loadingExport = ref(false)
const buttonMenu = ref()
const selectedRow = ref()

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {value:null, matchMode: FilterMatchMode.CONTAINS}
})

const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));
const roleDeleteTask = computed(() => $application.hasRole(Permission.GROUND_CONTROL_TASK_DELETE));
const getFirstLine = (markdownText) => {
  if (!markdownText) return "";
  return markdownText.split("\n")[0] ;
};
const expandedRows = ref()

const editMode = ref(false)
const data = ref(getProject)

const buttonItems = [
  {
    label: 'Un seul fichier',
    command: () => {
      exportOut(selectedRow.value, 'one')
    },
    tooltip: "Exporter toutes les annotations de l'étape dans un seul fichier"
  },
  {
    label: 'Regrouper par tâche',
    command: () => {
      exportOut(selectedRow.value, 'task')
    },
    tooltip: "Exporter les annotations en les regroupant par tâche"
  },
  {
    label: 'Fichiers séparés',
    command: () => {
      exportOut(selectedRow.value, 'all')
    },
    tooltip: "Exporter chaque annotations dans un fichier dédié"
  }
]
const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}

const showDeleteTaskModal = (rowData)=>{
  deleteModal.loading = false
  deleteModal.visible = true
  deleteModal.data= rowData
}

const hideDeleteTaskModal = () => {
  deleteModal.visible = false
  deleteModal.data= {}
}

const deleteTask = (task_id) => {
  deleteModal.loading = true
  TaskService.deleteTaskTaskTaskIdDelete(task_id).then(()=> fetchTasks(route.params.id)).then(()=> hideDeleteTaskModal())
}

const translatedAnnotationStatus =(annotation_status)=> {
  return translations[annotation_status]
}
const translatedTaskStatus = computed(() => {
  return Object.values(StepStatus).map(status => ({
    label: translations[status],
    value: status,
  }));
})

const selectedStatus = ref(null); // Statut sélectionné depuis la dropdown
const statusOptions = translatedTaskStatus;

// Filtrer les projets en fonction du statut sélectionné
const filteredProjects = computed(() => {
  if (!selectedStatus.value) return data.value.steps; // Si aucun statut n'est sélectionné, retourne toutes les étapes

  return data.value.steps.filter((step) => step.status === selectedStatus.value.value); // Filtre les étapes en fonction du statut
});




// On affiche meme si c'es pas fini
fetchTasks(route.params.id)

function getColorForAnnotation(annotation_status) {
  if (annotation_status === AnnotationStatus.ENDED) {
    return '#ACE1AF';
  }
  else return '#0057FF';
}

const clickButtonMenu = (event, step) => {
  selectedRow.value = step
  buttonMenu.value.toggle(event)
}

const exportOut = async (step, group) => {
  const tasks = step.tasks
  loadingExport.value = true
  const annos = {}
  for (const task of tasks) {
    try {
      // Fetch annotation data
      const annotations = await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(task.id,'','out');
      if(annotations.length > 0){

        if (group == 'task') triggerDownload(annotations, task.name)
        else if (group == 'all') annotations.forEach((annotation) => triggerDownload(annotation, task.name + ' by ' + annotation.user_email.split('@')[0]))
        else if (group == 'one') annos[task.name] = (annotations)
      }
    } catch (error) {
      console.error('Error downloading file for task', task.id, error);
      throw new Error(error.body.raw_message)
    }
  }
  if (group == 'one') triggerDownload(annos, step.title)
  loadingExport.value = false
}

function triggerDownload(data, name) {
  const annotationsBlob = new Blob([JSON.stringify(data)], {type: 'application/json'});

  // Create a download link
  const url = window.URL.createObjectURL(annotationsBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name || 'test'


  // Ensure filename is not null or empty
  if (a.download) {
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.add({
      severity: 'success',
      summary: "Export done",
      detail: ` Your file "${a.download}" has been downloaded`,
      life: 5000
    })
  }

  // Clean up
  window.URL.revokeObjectURL(url);
}

const navigateToTask = (id: number, email?: string) => {
  navigateTo({
    path: `/tasks/${id}`,
    query: {
      email: email
    }
  })
}

const stepCreate = (stepId) => {

  formStepClick.value = _.find(data.value.steps, ['id', stepId], 0)

  dialogVisible.value = true
}

let email_clicked
const handleRowClick = (event) => {

  if(typeof event == 'string' && isAdmin.value) email_clicked = event
  clickedRowData.value = event.data;

  if (editMode.value === false) navigateToTask(clickedRowData.value.id,email_clicked)

}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'draft':
      return 'info';
    case 'ended':
      return 'success';
    default:
      return '';
  }
};
const onCellEditComplete = () => {
  editMode.value = false
}

</script>
<style scoped>
.table-border-left {
  border-left: 8px solid #006180;
}
.overflow-scroll {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.overflow-scroll-full {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}


</style>
