<template>
    <div class=" ">
        <div class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  ">
            <ProjectCard v-if="data != undefined" v-for="project in sortDataById(data)" :project=project @refreshData="handleRefresh"/>
        </div>
    </div>
</template>

<script setup>
    import { useRefreshStore } from '../stores/refresh';
    import { storeToRefs } from 'pinia'


    const refreshStore = useRefreshStore()

    let baseURL;
    if (process.client){
        baseURL = 'http://localhost:8000';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }


    const fetchHappened = ref(true)

    provide('fetchProject',fetchHappened)


    refreshStore.fetch()

    const { getData }  = storeToRefs(refreshStore)

    
    const data = ref(getData)


    const handleRefresh =  async () => {
        console.log("emit working rtyrty")
        refreshStore.fetch()
    }

    const testStore = () => {
        console.log(refreshStore.getData)
        data = refreshStore.getData
        console.log(data)
    }

    const sortDataById = (array) => {
        return array.sort((a,b)=> a.id - b.id)
    }


</script>