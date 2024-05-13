<template>
    <div v-if="data.data.data == null" >
        <span>data is not in the right format</span>
    </div>
    <div v-else >
        <div class="fixed bottom-10 right-20 ">
            <Button label="Submit" size="large" @click="handleSubmit" />
        </div>
        <div class="fixed right-20 top-40">
            <div v-for="(color,index) in colors" >
                <div v-if="index!=0" class="flex items-center gap-2">
                    <div  class= "w-7 h-7 " :style="`background-color: ${color}`"></div>
                    <h2>Topic #{{ index }}</h2>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-3 " >
            <div></div>
            <ol class="flex flex-col gap-5" >
                <li class="bg-gray-300 p-3 pl-3 rounded-lg " v-for="(phrase,index) in data.data.data.localisation[0].sublocalisations.localisation">
                    <SegmentationMolecules :phrase="phrase" :colors="colors" :topics="topics" v-bind:index="index"  @segmentation="handleSegmentation" />
                </li>
            </ol>
            <div></div>
            
        </div>

    </div>
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';

    const store = bcStore()
    const route = useRoute()    
    
    const colors =  ref(['#BEBEBE'])
    const topics = ref([])

    const lastSegUpdate = ref()
    const lastUsedColor = ref('')
    const lastIndex = ref(1)


    const handleSegmentation = (event,index) => {

        // topics.value = topics.value.slice(0,event).concat(topics.value.slice(event+1))
        !topics.value.includes(event) && colors.value.pop()

        console.log(topics.value,colors.value)
        // if(event.value == topics.value.length){
        //     var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        //     topics.value.push(randomColor)
        // }
        
        
        
    }

    const handleSubmit = () => {
        console.log(topics.value)
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
