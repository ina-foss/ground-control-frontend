<template>
  <div class="bg-black">

    <DataTable
      v-if="data.steps?.length > 0" v-model:expanded-rows="expandedRows" :context-menu=true :pt="{
      column: {
        bodycell:({ state }) => ({
          style: state['d_editing']
        })
      },
      style: 'height:88px'
    }" :row-hover=true :sort-order=0 :value="data.steps" breakpoint="300px" column-resize-mode="fit" edit-mode="cell"
      table-style="background-color: white" @row-expand="expandMode = true" @cell-edit-complete="onCellEditComplete">
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
      <Column header=" " style="width: 200px;">
        <template #body="slotProps">
          <Button label="Create Task" size="small" severity="info" @click="stepCreate(slotProps.data.id)"/>
        </template>
      </Column>
      <Column :row-editor.value="true" body-style="text-align:center" style="width: 10%; min-width: 8rem"/>
      <template #expansion="slotProps">
        <div class="p-6 border-surface-200 border-2">
          <DataTable
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
                <div class="flex justify-around sm:w-20 md:w-10%">
                  <Avatar
                    v-for="(annotation, index) in nestedData.annotations" :key="index"
                    v-tooltip.top="annotation.user_email" :label=annotation.user_email.charAt(0).toUpperCase()
                    shape="circle"/>
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
      <!-- <span class="pi pi-folder-open" style="font-size: 20rem; opacity: 25% ;" /> -->
      <!-- <p class="text-slate-500">No tasks in this project</p> -->
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
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';
import {useRefreshStore} from '../stores/refresh';

const store = bcStore()
const route = useRoute()
const refreshStore = useRefreshStore()

const {getData} = storeToRefs(refreshStore)
const {fetchTasks} = refreshStore
const {getItems} = storeToRefs(store)

const dialogVisible = ref(false)
const visible = ref(false)
const dialogContent = ref('')
const clickedRowData = ref(null)
const spinnerVisible = ref(true)
let formStepClick = $ref()

const expandedRows = ref()

const editMode = ref(false)
const expandMode = $ref(false)
const data = ref(getData)

const savedItems = localStorage.getItem('breadcrumbItems');

// On affiche meme si c'es pas fini
fetchTasks(route.params.id).then((res) => {
  if (store.items.length === 0) { //reloading the page

    const parsedItems = JSON.parse(savedItems);
    store.addCrumb({label: parsedItems[0].label, url: parsedItems[0].url})

  } else if (getItems.value.length === 2) {
    store.removeLastCrumb()
  }
})


const count_validated_task = ((annotations) => {
  let task_count = 0;
  annotations.forEach(annotation => {
    if (annotation.status == 'validated') {
      task_count++
    }
  })
  return task_count
})

const navigateToTask = (id) => {
  navigateTo(`/tasks/${id}`)
}

const stepCreate = (stepId) => {

  formStepClick = _.find(data.value.steps, ['id', stepId], 0)

  dialogVisible.value = true
}

const handleRowClick = (event) => {

  clickedRowData.value = event.data;
  store.addCrumb({label: clickedRowData.value.name, url: `/tasks/${clickedRowData.value.id}`})
  console.log(event.data)
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
