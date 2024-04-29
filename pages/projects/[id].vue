<template>
    <div class="bg-black">
        <DataTable @row-click="handleRowClick" :value="data.tasks" tableStyle="background-color: white" breakpoint="300px" contextMenu="true" row-hover="true" columnResizeMode="fit" size="large"> 
            <Column field="name" header="Title" style="width : 8rem ; min-width: 50px; "></Column>
            <Column field="id" header="ID" style="width: 40px;"></Column>
            <Column field="annotations.length" style="width: 3rem;" >
                <template #header ><i v-tooltip="'Nbr total annotation'" class="pi pi-star cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ slotProps.data.annotations.length }}</div></template>
            </Column>
            <Column field="predictions.length" style="width: 3rem">
                <template #header><i  v-tooltip="'Nbr annotations remplies'" class="pi pi-star-fill cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ count_validated_task(slotProps.data.annotations) }}</div></template>
            </Column>
            <Column field="predictions.length" style="width: 12px">
                <template #header><i  v-tooltip="'Nbr de prédictions'" class="pi pi-lightbulb cursor-help"></i></template>
                <template #body="slotProps" > <div class="flex-1 text-center"> {{ slotProps.data.predictions.length }}</div></template>
            </Column>
            <Column header="Annoted by" style="width: 12rem">
                <template #body="slotProps">
                    <div class="flex justify-around sm:w-20 md:w-10%"><Avatar  v-for="annotation in slotProps.data.annotations" v-tooltip.top="annotation.user.email" :label=annotation.user.email.charAt(0).toUpperCase()  shape="circle"></Avatar></div>
                    </template>
                </Column>    
            <Column field="instruction" header="Instruction"></Column>
        
           
            <Column header="Data"  >
                <template #body="slotProps">
                    <Button icon="pi pi-code" @click="openDialog(slotProps.data)" />
                    
                </template>
            </Column>
            <Column header="button">
                <template #body="slotProps">
                    <!-- <NuxtLink :to="{name: 'tasks-id', params: {id:slotProps.data.taksid}}">
                    <Button icon="pi pi-caret-right" >
                        
                    </Button>
                </NuxtLink> -->
                <Button @click="navigateToTask(slotProps.data.id)" severity="secondary" label="GO"/>
                </template>
            </Column>

        </DataTable>
        <Dialog v-model:visible="visible" modal @hide="visible = false">
                <DataDialog />
        </Dialog>
    </div>
    
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';

    const store = bcStore()
    const route = useRoute()
   





    const count_validated_task = ((annotations) => {
        let task_count = 0;
        annotations.forEach(annotation => {
            if (annotation.user.status == 'validated'){
                task_count ++
            }
        })
        return task_count
    })




    let baseURL;

    if (process.client){
        baseURL = 'http://localhost:80';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }

    const {data, pending, refresh, error} = await useFetch(`${baseURL}/api/project/${route.params.id}` ,{ 
        headers: {
            Accept: 'application/json',
            
        },
        
    })

    store.items= [{label: data.value.title }]

</script>

<script server>
    export default {
    data() {
        return {
        visible: false,
        dialogContent: '',
        clickedRowData: null
        };
    },
    methods: {
        openDialog(data) {
        // Set dialog content based on the data passed
        this.dialogContent = data;

        // Open the dialog
        this.visible = true;
        },
        navigateToTask(id){
            navigateTo(`/tasks/${id}`)
        },
        handleRowClick(event){
            this.clickedRowData = event.data;
            this.navigateToTask(this.clickedRowData.id)
        }
    }
    };
</script>









