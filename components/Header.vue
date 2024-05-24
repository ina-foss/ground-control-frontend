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

            <Dropdown v-model="selectedType" :options="['🏷️Segmentation','✒️Transcription','Identification des visages']" placeholder="Select a task type" class="w-3/4"/>
            
        </div>
        <div class="pt-8">
        <Toast />
        <FileUpload accept="application/json" :showUploadButton=false :showCancelButton="false" :maxFileSize=maxFileSize invalidFileTypeMessage="Invalid type" @select="handleSelect()"  @removeUploadedFile="showRemove($event)" @upload="onUpload($event)" @error="onUpload($event)" auto name="file[]"
        :pt="{
            buttonbar: {
                style: `z-index:20; position: absolute; width: 85%; height: 100px; background-color: transparent;padding: 0px; cursor:pointer; border:none; ${selectFile}`
            },
            content: {
                style: 'padding: 14px'
            },

        }">
            <template #empty ="{chooseCallback}">
                
                <div class="flex items-center justify-content-center flex-col"> 
                    <span class="pi pi-file-arrow-up align-center cursor-pointer" style="font-size: 2.5rem"></span>
                    <p class="text-xs pt-3 text-slate-400 "  >Click to upload a JSON file</p>
                </div>
            </template>

            <template #header={chooseCallback}>
            <div class="w-full" @click="chooseCallback()"></div></template>

            <template #content="{uploadedFiles, files, removeUploadedFileCallback, removeFileCallback }" >
                <div class="flex flex-col gap-2">
                    <div v-for="(file,index) in uploadedFiles" class="grid grid-cols-8 gap-2 px-1 items-center">
                        <span class="pi pi-file self-center w-2"></span>
                        <p v-tooltip.top="file.name" class="text-ellipsis text-nowrap col-span-4 overflow-hidden " >{{ file.name }}</p>
                        <p v-if="file.size < 1024 " class="text-slate-400 text-xs text-nowrap col-span-2   ">{{ file.size }} B</p>
                        <p v-else class="text-slate-400 text-xs text-nowrap col-span-2  ">{{ Math.round(file.size/1024) }} KB</p>
                        <Button icon="pi pi-times" text rounded size="small" severity="danger"  @click="removeUploadedFileCallback(index)"  class=" self-center hover:bg-surface-100  hover:cursor-pointer" style="font-size: 15px;" :pt="{
                            root:{
                                // style: 'padding-left:0px; padding-right: 0px; padding-top:6px; padding-bottom:6px; width=30px'
                                style: 'justify-content: center; justify-items: center; place-self: center;'
                            },
                            icon:{
                                style: 'max-width:24px'
                            }
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
import { TaskService } from '../api/generate';
import {  useRefreshStore } from '../stores/refresh';

const items = bcStore().items

const refreshStore = useRefreshStore()

const titleValue = ref(null)
const descriptionValue = ref(null)
const errorVisible = ref(false);
const menuVisible = ref(false);
const dialogVisible = ref(false)
const selectedType = ref('')

const selectFile = ref('')

const toast = useToast()

const maxFileSize= 100000000

const files = ref([])

const fileData = ref([])


const fetchProject = inject('fetchProject',ref(false))




const home = {label:'Projects', url: '/dashboard'}

let baseURL;

    if (process.client){
        baseURL = 'http://localhost:80';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }

const showRemove = (e) => {
    console.log('toast triggered')
    toast.add({severity: 'info', detail: 'The file "'+ e.file.name +'" has been deleted', life: 5000})
    fileData.value=null
    if (e.files.length == 0 ) selectFile.value=''
    console.log(fileData.value)
}

const debug = (event) => {
    console.log(event.xhr)
    console.log(event.formData)
}

const onUploadError = (event) => {
    console.log("ERROR")
    console.log(event.xhr)
    console.log(event.files[0])
}

const handleSelect = () => {
    selectFile.value = 'display: none'
}

const onUpload = async (event)=> {
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    let file = event.files[0]
  

    formData.append("file", file)
    xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            var _this$uploadedFiles;
          }
        };
        xhr.open('POST', '/', true);
        // xhr.send(formData);
    // fetch('/null', {method: "POST", body: formData}).then((r)=> r.blob());
    // console.log(blob)
    files.value = event.files;
    // console.log(fetch(files.value[0]).then((res)=> res.json()).then((data)=> console.log(data)).catch((err)=> console.error(err)))
    let reader = new FileReader();
    reader.onloadend= onReaderLoad;
    reader.readAsText(event.files[0])
}

const onReaderLoad = (event) => {
    var obj = JSON.parse(event.target.result);
    fileData.value.push(obj)
    
    console.log(fileData.value)
   
}

// const { projectData ,refresh} = inject('project' )


const createProject = async() => {
    if (titleValue.value == null){
        errorVisible.value = true;
    }
    else{

        const response = ProjectService.createProjectProjectPost({title: titleValue.value, description: descriptionValue.value, created_by: 1})
        
        response.catch((err) => (toast.add({severity:'danger', detail:'Project could not be created', summary:'Something went wrong'}))).then((res)=> {
            fileData.value.forEach((file,index)=> {
                console.log(res)
                TaskService.createTaskTaskPost({name:`Task #${index+1}`, instruction:'Instruction', data: file, project_id:res.id}).catch((err)=> console.error(err)).then( (res) =>console.log(res) )
                
            })
            dialogVisible.value = false
            files.value = []
            console.log(fetchProject.value)
      
            
            refreshStore.fetch()

           
            refreshStore
            navigateTo(`/dashboard`, {
                replace:true
            })
        })
    }
}



</script>