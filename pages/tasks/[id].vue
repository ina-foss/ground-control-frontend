<template>
    <div v-if="data.data.data == null" >
        <span>data is not in the right format</span>
    </div>
    <div class="grid grid-cols-3" v-else>
        <div></div>
        <ol class="flex flex-col gap-5" >
            <li class="bg-gray-300 p-3 pl-3 rounded-lg "  v-for="(phrase,index) in data.data.data.localisation[0].sublocalisations.localisation">
                <SegmentationMolecules :phrase="phrase" :colors="colors" :topics="topics" v-bind:index="index"  @segmentation="console.log(topics,colors)" />
            </li>
        </ol>
        <div></div>
    </div>
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';

    const store = bcStore()
    const route = useRoute()    
    
    const colors =  ref(['transparent'])
    const topics = ref([])

    const lastSegUpdate = ref()
    const lastUsedColor = ref('')
    const lastIndex = ref(1)


    const handleSegmentation = (event,index) => {

        console.log(topics.value,colors.value)
        // if(event.value == topics.value.length){
        //     var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        //     topics.value.push(randomColor)
        // }
        
        
    }
    

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
        store.addCrumb({label: data.value.project.title , url: `/projects/${data.value.project_id}`})
    }
    if(store.items[store.items.length-1].url != `/tasks/${data.value.id}`){
        store.addCrumb({label: data.value.name, url: `/tasks/${data.value.id}`})

    }
    console.log(store.items)
    console.log(data.value.data)

</script>
