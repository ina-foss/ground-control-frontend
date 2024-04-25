<template>
    <div  class="min-w-fit bg-white max-w-screen h-150 px-3 py-1 cursor-pointer rounded-md shadow hover:scale-105 transition-transform tansition-shadow hover:shadow-xl">
        <NuxtLink :to="{ name: 'projects-id', params: { id: project.projectid.value } } " @click="updateBreadcrumd">
            <div class="flex justify-between align-middle pl-2">
                <p class="font-semibold self-center">{{ project.title.value }}</p>
                <p class="inline-block  text-2xl" >
                    <!-- <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" label= /> -->
                    <Button icon="pi pi-ellipsis-h" severity="secondary" text size="small" @click.stop.prevent="visible=true" />
                    <Dialog v-model:visible="visible" modal header="Tasks Settings" :style="{ width: '35rem'}" class="bg-white">

                    
                        
                        <div class=" grid grid-cols-1 grid-rows-3 gap-1">
                            <span class="text-slate-400 " >Modify task informations </span>
                            <div class="flex grid-cols-2 gap-3 align-items-center "> 
                                <label class="self-center basis-1/4">Task name</label>
                                <InputText placeholder="Enter a new task name" autocomplete="off" class="flex-auto" size="small" v-model="title"/>
                            </div>
                            <div class="flex gap-3 "> 
                                <label class="self-center basis-1/4">Task description</label>
                                <InputText placeholder="Enter a new task description" autocomplete="off" class="flex-auto" v-model="description"/>
                            </div>
                            <Button label="update" severity="info" class="justify-self-center" @click="updateProject" />
                        </div>
                    </Dialog>
                </p>
            </div>
            <div class="flex justify-between justify-items-stretch pl-2 pt-1 text-sm">
                <p >0/{{ project.total_tasks.value }} <i class="pi pi-list-check"></i></p>
                <div class="flex justify-between justify-items-stretch gap-3" > 
                    <span>1/{{  }} </span>
                    <span>2 <i class="pi pi-flag-fill" style="color:red" ></i> </span>
                    <span>5 <i class="pi pi-users"></i></span>
                </div>
            </div>
            <hr>
            <div class="flex justify-between  pl-2 pt-10 pb-2 text-gray-400">
                <p class="self-center" v-if="project.created_at.value != null">{{project.created_at.value.split('T')[0]}}</p>
                <Avatar shape="circle" label="PR" />
            </div>
        </NuxtLink>
    </div>
   
</template>

<style>
    @import url(/assets/css/base.css);
</style>

<script setup lang="ts">

    import {bcStore} from '~/stores/breadcrumbs';   
    import { reactive, toRefs } from 'vue';



    const store = bcStore()

    const props = defineProps(['project'])
    const project = toRefs(props.project)

    const title = project.title.value

    const description = project.description.value

    const updateProject = async () => {
        if (title == project.title.value && description == project.description.value){

        }
        else {
            const response = $fetch(`/api/project/${project.projectid.value}` , {
                method: 'PUT',
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    created_by: 1
                })
            })
        }
    }


    const updateBreadcrumd = ()=> {
        console.log(props.project.projectId)
        store.addCrumb({label: project.title.value, url:`/projects/${project.projectid.value}`})
    }

    const optionTrigger = () => {
    window.alert("Setting for task " + props.project.projectid)
    }

</script>

<script lang="ts">

export default {
    data () {
        return {
            visible: false
        }
        
    }
}

</script>

