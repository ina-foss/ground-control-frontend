<template>
  <div class="bg-black">

    <DataTable class="overflow-scroll-full"
               v-if="data.steps?.length > 0" v-model:expanded-rows="expandedRows" :context-menu=true :pt="{
      column: {
        bodycell:({ state }) => ({
          style: state['d_editing']
        })
      },
      style: 'height:88px'
    }" :row-hover=true :sort-order=0 :value="data.steps" breakpoint="300px" column-resize-mode="fit" edit-mode="cell"
               table-style="background-color: white" @row-expand="expandMode = true"
               @cell-edit-complete="onCellEditComplete">
      <Column expander style="width: 5rem;"/>
      <Column
        :pt="{
        root: {
          test: 'test',

        }
      }" field="name" header="Name" style="width : 8rem ; min-width: 70px; ">
        <template #editor="{ index }">
          <InputText v-model="data.tasks[index].name" style="width : 100% ; min-width: 70px; "/>
        </template>
        <template #body="slotProps">
          <p class="cursor-text	" @click="editMode = true"> {{ slotProps.data.title }}</p>
        </template>
      </Column>
      <Column field="id" header="ID" style="width: 40px;"/>
      <Column field="annotation_type" header="Type"/>
      <Column header="Status">
        <template #body>
          <Tag :severity="statusSeverity" class="mb-1 scale-90 ">{{ data.status }}</Tag>
        </template>
      </Column>
      <Column field="description" header="Description"/>
      <Column header=" " style="width: 18%; ">
        <template #body="slotProps">
          <div class="flex justify-between min-w-[203px] gap-3">
            <Button label="Create Task" size="small" severity="info" @click="stepCreate(slotProps.data.id)"/>
            <Button icon="pi pi-angle-down" label="Export" size="small" severity="secondary" text
                    :loading="loadingExport" @click="clickButtonMenu($event,slotProps.data) "/>
            <Menu :model="buttonItems" :popup="true" ref="buttonMenu">
              <template #item="{ item, props }">
                <a v-ripple v-tooltip="{ value: item.tooltip, showDelay: 1000 }" class="flex align-items-center"
                   v-bind="props.action">
                  <p @click="item.command(event,selectedRow.value)">{{ item.label }}</p>
                </a>
              </template>
            </Menu>
          </div>
        </template>
      </Column>
      <Column :row-editor.value="true" body-style="text-align:center" style="width: 10%; min-width: 8rem"/>
      <template #expansion="slotProps">
        <div class="p-6 border-surface-200 border-2">
          <DataTable class="overflow-scroll"
                     unstyled :value="slotProps.data.tasks" :sort-order=0 breakpoint="300px" column-resize-mode="fit"
                     @row-click="handleRowClick($event)"
                     edit-mode="cell" table-style="background-color: white" @cell-edit-complete="onCellEditComplete">
            <Column field="name" header="Name" style="width : 8rem ; min-width: 70px; ">
              <template #editor="{ index: nestedIndex, data: nestedData }">
                <InputText
                  v-model="data.steps[slotProps.index].tasks[nestedIndex].name"
                  style="width : 100% ; min-width: 70px; "/>
              </template>
              <template #body="{ data: nestedData }">
                <p class="cursor-text	" @click="editMode = true"> {{ nestedData.name }}</p>
              </template>
            </Column>
            <Column field="id" header="ID" style="width: 40px;"/>
            <Column field="annotations.length" sortable style="width: 3rem;">
              <template #header><i v-tooltip="'Nbr total annotation'" class="pi pi-star cursor-help"/></template>
              <template #body="{ data: nestedData }">
                <div class="flex-1 text-center"> {{ nestedData.annotations?.length || 0 }}</div>
              </template>
            </Column>
            <Column field="predictions.length" sortable style="width: 3rem">
              <template #header><i
                v-tooltip="'Nbr annotations remplies'"
                class="pi pi-star-fill cursor-help"/></template>
              <template #body="slotProps">
                <div class="flex-1 text-center"> {{ }}</div>
              </template>
            </Column>
            <Column field="predictions.length" style="width: 12px">
              <template #header><i v-tooltip="'Nbr de prédictions'" class="pi pi-lightbulb cursor-help"/></template>
              <template #body="slotProps">
                <div class="flex-1 text-center"> {{ }}</div>
              </template>
            </Column>
            <Column header="Annoted by" style="width: 12rem">
              <template #body="{data: nestedData}">
                <div class="flex justify-start gap-2 ">
                  <Avatar
                    v-for="(annotation, index) in nestedData.annotations" :key="index"
                    v-tooltip.top="annotation.user_email" :label=annotation.user_email.charAt(0).toUpperCase()
                    shape="circle"
                    :style="{ backgroundColor: getColorForAnnotation(annotation.annotation_status) }"/>
                </div>
              </template>
            </Column>
            <Column field="instruction" header="Instruction"/>

            <Column header="Data">
              <template #body="slotProps">
                <Button icon="pi pi-code" @click="openDialog(slotProps.data.id)"/>

              </template>
            </Column>
          </DataTable>
        </div>
      </template>

    </DataTable>
    <div v-else class="min-h-[calc(100vh-52px)] bg-white items-center justify-center flex flex-col">
      <LoadingSpinner/>
    </div>
    <Dialog v-model:visible="visible" modal @hide="visible = false">
      <DataDialog :data="dialogContent" :visible="spinnerVisible"/>
    </Dialog>
    <MoleculeFormTask :dialogVisible="dialogVisible" :stepObject="formStepClick" @toggle-dialog="dialogVisible=false"/>
  </div>

</template>


<script setup>

import _ from 'lodash';
import {ref} from 'vue';
import {bcStore} from '~/stores/breadcrumbs';
import {AnnotationService} from '../../api/generate';
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';
import {useRefreshStore} from '../stores/refresh';
import {AnnotationStatus} from '../../api/generate';

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
const expandMode = $ref(false)
const data = ref(getProject)
const buttonItems = [
  {
    label: 'One file',
    command: () => {
      exportOut(selectedRow.value, 'one')
    },
    tooltip: "Export all the step's annotations in one file"
  },
  {
    label: 'Grp. by Task',
    command: () => {
      exportOut(selectedRow.value, 'task')
    },
    tooltip: "Export annotations by grouping them by task"
  },
  {
    label: 'Seperate',
    command: () => {
      exportOut(selectedRow.value, 'all')
    },
    tooltip: "Export all annotations in a dedicated file"
  }
]


// On affiche meme si c'es pas fini
fetchTasks(route.params.id).then((res) => {
  if (getItems.value.length == 2) {
    store.removeLastCrumb()
  }
})


const savedItems = localStorage.getItem('breadcrumbItems');

// On affiche meme si c'es pas fini
fetchTasks(route.params.id).then((res) => {
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

const count_validated_task = ((annotations) => {
  let task_count = 0;
  annotations.forEach(annotation => {
    if (annotation.status == 'validated') {
      task_count++
    }
  })
  return task_count
})

const clickButtonMenu = (event, step) => {
  selectedRow.value = step
  buttonMenu.value.toggle(event)
}

const exportOut = async (step, group) => {
  const tasks = step.tasks
  loadingExport = true
  let annos = {}
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
  console.log(id)
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
  store.addCrumb({label: clickedRowData.value.name, route: `/tasks/${clickedRowData.value.id}`})

  if (editMode.value == false) navigateToTask(clickedRowData.value.id)


}

const statusSeverity = computed(() => {
  switch (data.value.status) {
    case 'pending':
      return 'warning'

    case 'draft':
      return 'info'

    case 'ended':
      return 'success'

  }
})


const onCellEditComplete = () => {
  editMode.value = false
}

const openDialog = (data) => {
  // Set dialog content based on the data passed
  dialogContent.value = data;

  // Open the dialog
  visible.value = true;
}


</script>
<style>
.overflow-scroll {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.overflow-scroll-full {
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
