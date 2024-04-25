<template>
    <div >
        <div class="py-8 px-4 grid gap-5 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 bg-white-100">
            
            <ProjectCard v-for="project in data" :project=project />
        
        </div>
        
    </div>

</template>

<script setup lang="ts">

    let baseURL;

    if (process.client){
        baseURL = 'http://localhost:80';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }


    const { data, pending, error, refresh } = await useFetch(`${baseURL}/api/projects/`)



</script>