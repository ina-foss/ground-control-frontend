<template >
    <div class="flex items-stretch  gap-4 px-4 bg-white border-b-2  border-gray-400 ">
        <h2 class="  self-center font-bold text-lg  "> Ground Control</h2>
        <Button icon="pi pi-align-justify" severity="secondary" text outlined @click="menuVisible=true" />
        <div class="flex-grow">  
            <Breadcrumb :home="home" :model="items" >
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a :href="href" v-bind="props.action" @click="navigate">
                            <span :class="[item.icon, 'text-color']" />
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span class="text-color">{{ item.label }}</span>
                    </a>
                </template>
            </Breadcrumb>
        </div>
        <div class="self-center">
            <Button v-if="$route.name == 'dashboard'" label="Create Project" size="small" @click="dialogVisible=true"   />
            <Button v-else label="Settings" severity="secondary" outlined  size="small"/>
        </div>
        <div class="self-center"> 
            <Avatar shape="circle" label="PR" />
        </div>
        
    </div>

    <Dialog modal v-model:visible="dialogVisible" header="New Project" style="width:20rem;" >
        <InlineMessage v-if="errorVisible==true && !titleValue" class="mb-2" >Title is required</InlineMessage>
        <div class=" pt-4 flex flex-col gap-4">
            <FloatLabel class="py-1" >
                <InputText id="title" v-model="titleValue" ></InputText>
                
                <label for="title">Title</label>
            </FloatLabel>
            
            <FloatLabel class="py-1" >
                <InputText id="description" v-model="descriptionValue"></InputText>
                <label for="description">Description</label>
            </FloatLabel>
            
        </div>
        <template #footer>
            <div class="flex gap4">
            <Button label="Create" @click="createProject" />
            </div>
        </template>
    </Dialog>

    <Sidebar v-model:visible="menuVisible" class="bg-white">
        
    </Sidebar>
</template>



<script setup>

import {bcStore} from '~/stores/breadcrumbs';

const items = bcStore().items

const titleValue = ref(null)
const descriptionValue = ref(null)
const errorVisible = ref(false);

let baseURL;

    if (process.client){
        baseURL = 'http://localhost:80';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }



const createProject = async() => {
    if (titleValue.value == null){
        errorVisible.value = true;
    }
    else{
        const response =  await $fetch(`/api/project`, {
                method: 'POST',
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body : JSON.stringify({
                    title: titleValue.value,
                    description: descriptionValue.value,
                    created_by: 1
                })
            })
        
        console.log(response.response)
        
    }
}



</script>

<script >

export default {

    data() {
        return {
            home: {label:'Projects', url: '/dashboard'},
            menuVisible: false,
            dialogVisible: false,
        }
    }
}
</script>