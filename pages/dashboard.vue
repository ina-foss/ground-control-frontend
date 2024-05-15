<template>
    <div class=" ">
        <div class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  ">
            <ProjectCard v-for="project in sortDataById(data)" :project=project @refreshData="handleRefresh"/>
        </div>
    </div>
</template>

<script setup>
    import { useRefreshStore } from '../stores/refresh';
    import { storeToRefs } from 'pinia'


    const refreshStore = useRefreshStore()

    // const { data }= storeToRefs(refreshStore)

   
    

    let baseURL;
    if (process.client){
        baseURL = 'http://localhost:8000';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }


    const { data, pending, error, refresh } = await useFetch(`${baseURL}/projects/`)
    // .then((response) => provide('project', response ))

    const fetchHappened = ref(true)

    provide('fetchProject',fetchHappened)

    if(pending.value==true){
        console.log(pending.value) 
    }
    else{
        console.log(data.value)
        let projectData = data.value
        provide('project',{ projectData, refresh})
    }

    refreshStore.fetch()
    
    console.log(data)


    const handleRefresh = () => {
        console.log("emit working")
        refresh()
        console.log(data)
        
    
    }

    const sortDataById = (array) => {
        return array.sort((a,b)=> a.id - b.id)
    }


</script>