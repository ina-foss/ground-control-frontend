<template>
  <div class="bg-black">

    <DataTable
      v-if="data.tasks.length > 0" :context-menu=true :pt="{
            column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']
                    })
                },
            style: 'height:88px'
        }" :row-hover=true
      :sort-order=0 :value="data.tasks" breakpoint="300px" column-resize-mode="fit"
      edit-mode="cell" table-style="background-color: white" @row-click="handleRowClick($event)" @cell-edit-complete="onCellEditComplete">
      <Column
        :pt="{
                root:  {
                    test:'test',

                }
            }" field="name" header="Title" style="width : 8rem ; min-width: 70px; ">
        <template #editor=" {index} ">
          <InputText v-model="data.tasks[index].name" style="width : 100% ; min-width: 70px; "/>
        </template>
        <template #body="{index}">
          <p class="cursor-text	" @click="editMode=true"> {{ data.tasks[index].name }}</p>
        </template>
      </Column>
      <Column field="id" header="ID" style="width: 40px;"/>
      <Column field="annotations.length" sortable style="width: 3rem;">
        <template #header><i v-tooltip="'Nbr total annotation'" class="pi pi-star cursor-help"/></template>
        <template #body="slotProps">
          <div class="flex-1 text-center"> {{ slotProps.data.annotations.length }}</div>
        </template>
      </Column>
      <Column field="predictions.length" sortable style="width: 3rem">
        <template #header><i v-tooltip="'Nbr annotations remplies'" class="pi pi-star-fill cursor-help"/></template>
        <template #body="slotProps">
          <div class="flex-1 text-center"> {{ count_validated_task(slotProps.data.annotations) }}</div>
        </template>
      </Column>
      <Column field="predictions.length" style="width: 12px">
        <template #header><i v-tooltip="'Nbr de prédictions'" class="pi pi-lightbulb cursor-help"/></template>
        <template #body="slotProps">
          <div class="flex-1 text-center"> {{ slotProps.data.predictions.length }}</div>
        </template>
      </Column>
      <Column header="Annoted by" style="width: 12rem">
        <template #body="slotProps">
          <div class="flex justify-around sm:w-20 md:w-10%">
            <Avatar
              v-for="(annotation,index) in slotProps.data.annotations" :key="index" v-tooltip.top="annotation.user_email" :label=annotation.user_email.charAt(0).toUpperCase()
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
      <Column :row-editor.value="true" body-style="text-align:center" style="width: 10%; min-width: 8rem"/>

    </DataTable>
    <div v-else class="min-h-[calc(100vh-52px)] bg-white items-center justify-center flex flex-col">
      <span class="pi pi-folder-open" style="font-size: 20rem; opacity: 25% ;"/>
      <p class="text-slate-500">No tasks in this project</p>
    </div>
    <Dialog v-model:visible="visible" modal @hide="visible = false">
      <DataDialog :data="dialogContent" :visible="spinnerVisible"/>
    </Dialog>
  </div>

</template>


<script setup>

import {ref} from 'vue';
import {bcStore} from '~/stores/breadcrumbs';
import {ProjectService} from '../../api/generate';

const store = bcStore()
const route = useRoute()

const visible = ref(false)
const dialogContent = ref('')
const clickedRowData = ref(null)
const spinnerVisible = ref(true)

const editMode = ref(false)

const data = ref(await ProjectService.readProjectProjectProjectIdGet(route.params.id))

onMounted(() => console.log(data.value))

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

const handleRowClick = (event) => {

  clickedRowData.value = event.data;

  if (editMode.value == false) navigateToTask(clickedRowData.value.id)


}

const onCellEditComplete = () => {
  editMode.value = false
}

const openDialog = (data) => {
  // Set dialog content based on the data passed
  dialogContent.value = data;

  // Open the dialog
  visible.value = true;
}

if (store.items.length != 0 && store.items[store.items.length - 1].url != `/projects/${data.value.id}`) { // When coming from Task
  store.removeLastCrumb()
}
if (store.items.length == 0) { // When coming from dashboard
  store.addCrumb({label: data.value.title, url: `/projects/${data.value.id}`})
}

</script>
