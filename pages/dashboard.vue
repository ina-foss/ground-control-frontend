<template>
    <div >
        <div class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 bg-white-100">
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