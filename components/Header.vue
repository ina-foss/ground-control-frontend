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

    <Dialog modal v-model:visible="dialogVisible" header="New Project" style="width:20rem;" :pt="{
        header:{
            class:'bg-surface-0 border-t-0 rounded-tr-lg rounded-tl-lg justify-between items-center shrink-0 flex p-6 pb-2'
        }
    }" >
        <InlineMessage v-if="errorVisible==true && !titleValue" class="mb-2" >Title is required</InlineMessage>
        <div class=" pt-5 flex flex-col gap-4">
            <FloatLabel class="py-1" >
                <InputText id="title" v-model="titleValue" ></InputText>
                
                <label for="title">Title</label>
            </FloatLabel>
            
            <FloatLabel class="py-1" >
                <InputText id="description" v-model="descriptionValue"></InputText>
                <label for="description">Description</label>
            </FloatLabel>
            
        </div>
        <div class="pt-8">
        <FileUpload accept="application/json" :showUploadButton=false :showCancelButton="false" invalidFileTypeMessage="Invalid type" auto @remove="handleRemove" name="file[]"
        :pt="{
            buttonbar: {
                // style: 'display:none'
            }
        }">
            <template #empty>
                <div class="flex items-center justify-content-center flex-col"> 
                    <span class="pi pi-file-arrow-up align-center " style="font-size: 2.5rem"></span>
                    <p class="text-xs pt-3 text-slate-400">Drag and frop JSON file to upload</p>
                </div>
            </template>

            <template #content="{uploadedFiles, files}" >
                <div class="flex flex-col gap-2">
                    <div v-for="file in uploadedFiles" class="flex flex-row justify-between px-4 items-center">
                        <span class="pi pi-file self-center"></span>
                        <p>{{ file.name }}</p>
                        <p class="text-slate-400">{{ file.size }}   B</p>
                        <Button icon="pi pi-times" text rounded size="small" severity="danger"   class=" self-center hover:bg-surface-100  hover:cursor-pointer" style="font-size: 15px;" :pt="{
                            root:{
                                // style: 'padding-left:0px; padding-right: 0px; padding-top:6px; padding-bottom:6px; width=30px'
                            },
                            // style: 'padding-left:0px; padding-right: 0px; padding-top:6px; padding-bottom:6px; width=30px'
                        }" />
                    </div>
                </div>
                <div v-for="file in files">
                    <ProgressSpinner style="width: 40px;" strokeWidth=5 />
                </div>
            </template>

        </FileUpload>
        </div>
        <template #footer>
            <div class="flex">
            <Button label="Create" @click="createProject" />
            </div>
        </template>
    </Dialog>

    <Sidebar v-model:visible="menuVisible" class="bg-white">
        
    </Sidebar>
</template>



<script setup>

import {bcStore} from '~/stores/breadcrumbs';

import { ProjectService } from '~/api/generate';

const items = bcStore().items

const titleValue = ref(null)
const descriptionValue = ref(null)
const errorVisible = ref(false);
const menuVisible = ref(false);
const dialogVisible = ref(false)

const home = {label:'Projects', url: '/dashboard'}

let baseURL;

    if (process.client){
        baseURL = 'http://localhost:80';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }

const handleRemove = (file) => {
    console.log("file that needs to be removed : " + file.name)
}


const createProject = async() => {
    if (titleValue.value == null){
        errorVisible.value = true;
    }
    else{

        const response = await ProjectService.createProjectProjectPost({title: titleValue.value, description: descriptionValue.value, created_by: 1})
        
    }
}



</script>