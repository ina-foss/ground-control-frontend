<template>
  <div v-if="!data.title">
    <LoadingSpinner/>
  </div>
  <div v-else>

    <DataTable
      v-model:expanded-rows="expandedRows" class=" overflow-scroll-full custom-data-table" :context-menu=true
      :pt="{
      column: {
        bodycell:({ state }) => ({
          style: {padding: '12px',...state['d_editing']}
        }),
        headercell:({ state }) => ({
          style: {padding: '12px',backgroundColor:'#EDEDED',...state['d_editing']}
        })
      },
      row:{
        class:'p-3',
        style: { backgroundColor: 'black', color: 'white' },
      },
      style: 'height:88px'
    }" :row-hover=true :sort-order=0 :value="data.steps" breakpoint="300px" column-resize-mode="fit"
      @cell-edit-complete="onCellEditComplete">
      <template #empty>
        <div class="bg-white h-[calc(100vh-300px)] w-full flex flex-col gap-10 items-center justify-center ">
          <i class="pi pi-ellipsis-h opacity-30  scale-[1000%]"/>
          <h1 class="text-xl font-bold">Ce projet ne comporte aucune etapes</h1>
        </div>
      </template>
      <Column id="test" expander style="width: 5rem;color:blue" class="txt"  body-class="text-sm p-3"/>
      <Column field="name" header="Titre" class="txt" style="width : 8rem ; min-width: 70px;"   body-class="p-3 text-sm">
        <template #body="slotProps">
          <p > {{ slotProps.data.title }}</p>
        </template>
      </Column>
      <Column field="id" header="ID" class="txt" style="width: 40px;" body-class="text-sm"/>
      <Column field="annotation_type" class="txt" header="Type"  body-class="text-sm"/>
      <Column header="Statut" class="txt"  body-class="text-sm">
        <template #body>
          <Tag  :class="statusSeverity" class="mb-1 scale-90 font-medium" >{{translatedAnnotationStatus(data.status) }}</Tag>
        </template>
      </Column>
      <Column field="description" header="Description" class="txt"  body-class="text-sm"/>
      <Column header=" " style="width: 18%; "  body-class="text-sm">
        <template #body="slotProps">
          <div class="flex justify-between min-w-[203px] gap-3 txt">
            <Button
              class="txt"
              style="font-size: 14px;font-family: Lato,sans-serif;font-weight: bold;height: 33px;padding: 8px 12px;border-radius: 4px;"
              outlined label="Créer un task" size="small" severity="secondary" @click="stepCreate(slotProps.data.id)"/>
            <div
class="flex items-center space-x-2 cursor-pointer txt" :loading="loadingExport"
                  @click="clickButtonMenu($event,slotProps.data) ">
            <Button
              class="txt"
                    style="font-size:14px"
              label="Exporter" size="small" severity="secondary" text/>
              <img
                style="height:15px;width:15px;filter: brightness(0) saturate(100%) invert(11%) sepia(5%) saturate(250%) hue-rotate(180deg) brightness(90%) contrast(90%);"
                   src="public/icons/icons-svg/icons-svg/arrow-down-icon.svg">
          </div>

            <Menu ref="buttonMenu" :model="buttonItems" :popup="true">
              <template #item="{ item, props }" >
                <a
                  v-ripple v-tooltip="{ value: item.tooltip, showDelay: 1000 }" class="txt flex align-items-center"
                  v-bind="props.action">
                  <p @click="item.command(event,selectedRow.value)">{{ item.label }}</p>
                </a>
              </template>
            </Menu>
          </div>
        </template>
      </Column>
      <Column :row-editor="true" body-style="text-align:center" style="width: 10%; min-width: 8rem"  body-class="text-sm"/>
      <template #expansion="slotProps">
        <div class="p-6 border-surface-200 border-4">
          <DataTable
            :row-class="()=> 'hover:bg-surface-100 cursor-pointer'"
            class="overflow-scroll p-5"
             :value="slotProps.data.tasks" :sort-order=0 breakpoint="300px" column-resize-mode="fit"
            :pt="{
      column: {
        bodycell:({ state }) => ({
          style: {padding: '12px',...state['d_editing']}
        }),
        headercell:({ state }) => ({
          style: {padding: '12px',backgroundColor:'#EDEDED',...state['d_editing']}
        })
      },
      row:{
        class:'p-3',
        style: { backgroundColor: 'black', color: 'white' },
      }
    }"
            @row-click="handleRowClick($event)">
            <Column class="txt" body-class="text-sm" field="name" header="Titre" style="width : 8rem ; min-width: 70px; ">
              <template #editor="{ index: nestedIndex }">
                <InputText
                  v-model="data.steps[slotProps.index].tasks[nestedIndex].name"
                  style="width : 100% ; min-width: 70px; "/>
              </template>
              <template #body="{ data: nestedData }">
                <p class="cursor-text	"> {{ nestedData.name }}</p>
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
            <Column class="txt" body-class="text-sm" header="Annoté par" style="width: 12rem">
              <template #body="{data: nestedData}">
                <div class="flex justify-start gap-2 ">
                  <Avatar
                    v-for="(annotation, index) in nestedData.annotations" :key="index"
                    v-tooltip.top="annotation.user_email" :label=annotation.user_email.charAt(0).toUpperCase()
                    shape="circle" style="color: black;font-weight: bold"
                    :style="{ backgroundColor: getColorForAnnotation(annotation.annotation_status) }"/>
                </div>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="instruction" header="Instruction"/>

<!--             <Column header="Données"> -->
<!--               <template #body=""> -->
<!---->
<!--                 <Button -->
<!-- size="small" severity="secondary" -->
<!--                         style="font-size: 14px;font-family: Lato,sans-serif;font-weight: bold;height: 33px;padding: 8px 12px;border-radius: 4px;" -->
<!--                         outlined icon="pi pi-code" @click="openDialog(slotProps.data.id)"/> -->
<!---->
<!--               </template> -->
<!--             </Column> -->
          </DataTable>
        </div>
      </template>

    </DataTable>
    <Dialog v-model:visible="visible" modal @hide="visible = false">
      <DataDialog :data="dialogContent" :visible="spinnerVisible"/>
    </Dialog>
    <MoleculeFormTask
:dialog-visible="dialogVisible" :step-object="formStepClick"
                      @toggle-dialog="dialogVisible=false"/>
  </div>

</template>


<script setup>

import _ from 'lodash';
import {ref} from 'vue';
import {bcStore} from '~/stores/breadcrumbs';
import {AnnotationService, AnnotationStatus} from '../../api/generate';
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';
import {useRefreshStore} from '../stores/refresh';

const store = bcStore()
const route = useRoute()
const refreshStore = useRefreshStore()
const toast = useToast()

const {getProject} = storeToRefs(refreshStore)
const {fetchTasks} = refreshStore
const {getItems} = storeToRefs(store)

const dialogVisible = ref(false)
const visible = ref(false)
const dialogContent = ref('')
const clickedRowData = ref(null)
const spinnerVisible = ref(true)
let formStepClick = $ref()
let loadingExport = $ref(false)
const buttonMenu = ref()
const selectedRow = ref()


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

const translatedAnnotationStatus =(annotation_status)=> {
  return translations[annotation_status]
}

// On affiche meme si c'es pas fini
fetchTasks(route.params.id).then(() => {
  if (getItems.value.length == 2) {
    store.removeLastCrumb()
  }
})


localStorage.getItem('breadcrumbItems');

// On affiche meme si c'es pas fini
fetchTasks(route.params.id).then(() => {
  if (store.items.length === 0) { // When coming from dashboard
    store.addCrumb({label: data.value.title, route: data.value.id})
  } else while (getItems.value.length > 2) { // When coming from task view
    store.removeLastCrumb()
  }
})

function getColorForAnnotation(annotation_status) {
  if (annotation_status === AnnotationStatus.ENDED) {
    return '#ACE1AF';
  }
}

const clickButtonMenu = (event, step) => {
  selectedRow.value = step
  buttonMenu.value.toggle(event)
}

const exportOut = async (step, group) => {
  const tasks = step.tasks
  loadingExport = true
  const annos = {}
  for (const task of tasks) {
    try {
      // Fetch annotation data
      const annotations = await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(task.id, 'out');

      if (group == 'task') triggerDownload(annotations, task.name)
      else if (group == 'all') annotations.forEach((annotation) => triggerDownload(annotation, task.name + ' by ' + annotation.user_email.split('@')[0]))
      else if (group == 'one') annos[task.name] = (annotations)
    } catch (error) {
      console.error('Error downloading file for task', task.id, error);
    }
  }
  if (group == 'one') triggerDownload(annos, step.title)
  loadingExport = false
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
    // alert('Your file ' + a.download + ' has downloaded!');
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

const navigateToTask = (id) => {
  navigateTo({
    path: `/tasks/${id}`
  })
}

const stepCreate = (stepId) => {

  formStepClick = _.find(data.value.steps, ['id', stepId], 0)

  dialogVisible.value = true
}

const handleRowClick = (event) => {
  clickedRowData.value = event.data;
  if (localStorage.getItem('breadcrumbItems')) {

      const breadcrumbItems = JSON.parse(localStorage.getItem('breadcrumbItems'));
    if( !breadcrumbItems.some(item => item.label === clickedRowData.value.name)){
      store.addCrumb({label: clickedRowData.value.name, route: `/tasks/${clickedRowData.value.id}`})

    }
    }

  if (editMode.value === false) navigateToTask(clickedRowData.value.id)


}

const statusSeverity = computed(() => {
  switch (data.value.status) {
    case 'pending':
      return 'warning'

    case 'draft':
      return 'info'

    case 'ended':
      return 'success'
    default:
      return ''
  }
})


const onCellEditComplete = () => {
  editMode.value = false
}

</script>
<style scoped>
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

.warning {
  background-color: #F9D621;
  color: black;
}

.info {
  background-color: #B3DDF4;
  color: black;
}

.success {
  background-color: #9ADC82;
  color: black;
}
.txt{
  color:#212529;
}
</style>
