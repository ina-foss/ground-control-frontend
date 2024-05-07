<template>
    <div class="bg-black">
        
        <DataTable v-if="data.tasks.length > 0" @row-click="handleRowClick($event)"  editMode="cell" :value="data.tasks" :sortOrder=0 tableStyle="background-color: white" breakpoint="300px" :contextMenu=true :row-hover=true columnResizeMode="fit"  :pt="{
            column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']
                    })
                },
            style: 'height:88px'
        }" > 
            <Column field="name" header="Title" style="width : 8rem ; min-width: 50px; " :pt="{
                root:  {
                    test:'test',
                    
                }
            }">
                <template #editor=" {data, field} ">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="id" header="ID" style="width: 40px;"></Column>
            <Column field="annotations.length" sortable style="width: 3rem;" >
                <template #header ><i v-tooltip="'Nbr total annotation'" class="pi pi-star cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ slotProps.data.annotations.length }}</div></template>
            </Column>
            <Column field="predictions.length" sortable style="width: 3rem">
                <template #header><i  v-tooltip="'Nbr annotations remplies'" class="pi pi-star-fill cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ count_validated_task(slotProps.data.annotations) }}</div></template>
            </Column>
            <Column field="predictions.length" style="width: 12px">
                <template #header><i  v-tooltip="'Nbr de prédictions'" class="pi pi-lightbulb cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ slotProps.data.predictions.length }}</div></template>
            </Column>
            <Column header="Annoted by" style="width: 12rem">
                <template #body="slotProps">
                    <div class="flex justify-around sm:w-20 md:w-10%"><Avatar v-for="annotation in slotProps.data.annotations" v-tooltip.top="annotation.user.email" :label=annotation.user.email.charAt(0).toUpperCase()  shape="circle"></Avatar></div>
                    </template>
                </Column>    
            <Column field="instruction" header="Instruction"></Column>
        
            <Column header="Data"  >
                <template #body="slotProps">
                    <Button icon="pi pi-code" @click="openDialog(slotProps.data.id)" />
                    
                </template>
            </Column>
            <Column :rowEditor.value="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>

        </DataTable>
        <div v-else class="min-h-[calc(100vh-52px)] bg-white items-center justify-center flex flex-col">
            <span class="pi pi-folder-open" style="font-size: 20rem; opacity: 25% ;"></span>
            <p class="text-slate-500">No tasks in this project</p>
        </div>
        <Dialog v-model:visible="visible" modal @hide="visible = false">
                <DataDialog :data="dialogContent" :visible="spinnerVisible"/>
        </Dialog>
    </div>
    
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';

    const store = bcStore()
    const route = useRoute()

    const visible = ref(false)
    const dialogContent = ref('')
    const clickedRowData = ref(null)
    const spinnerVisible = ref(true)
    const editingRows= ref([])

    const count_validated_task = ((annotations) => {
        let task_count = 0;
        annotations.forEach(annotation => {
            if (annotation.user.status == 'validated'){
                task_count ++
            }
        })
        return task_count
    })

    const navigateToTask = (id) => {
        navigateTo(`/tasks/${id}`)
    }

    const handleRowClick = (event) => {
        clickedRowData.value = event.data;
        console.log(event.originalEvent)
        navigateToTask(clickedRowData.value.id)
    }
    
    const openDialog = (data) => {
        // Set dialog content based on the data passed
        dialogContent.value = data;

        // Open the dialog
        visible.value = true;
    }

    let baseURL;

    if (process.client){
        baseURL = 'http://localhost:8000';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }

    const {data, pending, refresh, error} = await useFetch(`${baseURL}/project/${route.params.id}` ,{ 
        headers: {
            Accept: 'application/json',     
        },
        
    })
    console.log(store.items)
    if(store.items.length != 0 && store.items[store.items.length-1].url != `/projects/${data.value.id}`){ // When coming from Task
        store.removeLastCrumb()
    }
    if(store.items.length == 0){ // When coming from dashboard
        store.addCrumb({label: data.value.title, url:`/projects/${data.value.id}`})
    }

    

</script>