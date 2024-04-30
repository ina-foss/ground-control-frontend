<template>
    <div class="grid grid-cols-3">
        <div></div>
        <ol class="flex flex-col gap-5" >
            <li class="bg-gray-300 p-3 pl-7 rounded-lg flex items-center"  v-for="phrase in data.data.data.localisation[0].sublocalisations.localisation">
                <i class="pi pi-bookmark pr-5"></i>
                <div v-tooltip.top="phrase.tcin + '-' + phrase.tcout" class="bg-white p-1 col-auto grow rounded-md cursor-pointer hover:scale-[1.01]  transition-all hover:shadow-lg">{{phrase.data.text[0]}}</div></li>
        </ol>
        <div></div>
    </div>
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';

    const store = bcStore()
    const route = useRoute()

    
    

    let baseURL;

    if (process.client){
        baseURL = 'http://localhost:8000';
    }
    else if (process.server){
        baseURL = 'http://nginx'
    }

    const {data, pending, refresh, error} = await useFetch(`${baseURL}/task/${route.params.id}` ,{ 
        headers: {
            Accept: 'application/json',
            
        },
        
    })
    if (store.items.length == 0){
        store.addCrumb({label: 'Project name', url: `/projects/${data.value.project_id}`})
    }
    store.addCrumb({label: data.value.name, url: `/tasks/${data.value.id}`})
    console.log(store.items)

</script>
