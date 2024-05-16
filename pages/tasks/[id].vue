<template>
    <div v-if="data.data.data == null || locals == undefined" >
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
        <div class="grid grid-cols-9 " >
            <div class="col-span-3  bg-surface-700 px-5 py-5">
                <video ref="video" controls class="w-full" @seeked="handleSeeking($event)"></video>
                
            </div>
            <ol class="flex flex-col gap-5 overflow-y-auto h-[calc(100vh-51px)] col-span-4 pl-4 py-4" >
                <ScrollTop class="absolute" target="parent" :threshold=100 :unstyled="true" 
                :pt="{
                    root: {
                        style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black'
                    }
                }"
                />
                <li class="bg-gray-300 p-3 pl-3 rounded-lg " v-for="(phrase,index) in data.data.data.localisation[0].sublocalisations.localisation" :ref="el => segmentationRefs.push(el) ">
                    <SegmentationMolecules :phrase="phrase" v-bind:colors="colors" v-bind:topics="topics" v-bind:index="index" @segmentation="handleSegmentation" @onSegmentClick="handleSegmentClick" />
                </li>
            </ol>
            <div></div>
            
        </div>

    </div>
</template>


<script setup>

    import { ref, watchEffect } from 'vue';
    import {bcStore} from '~/stores/breadcrumbs';
    import {Hls} from 'hls.js'
    import { TaskService } from '../../api/generate';

    const store = bcStore()
    const route = useRoute()
    
    const segmentationRefs = ref([])


    const colors =  ref(['#BEBEBE'])
    const topics = ref([])

    const lastSegUpdate = ref()
    const lastUsedColor = ref('')
    const video = ref(null)
    var lastTimecode = 0
    var lastIndex = 0

    const topicsLoaded = ref(false)

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

    const handleSegmentation = (event,index) => {

        // topics.value = topics.value.slice(0,event).concat(topics.value.slice(event+1))
        !topics.value.includes(event) && colors.value.pop()

        console.log(topics.value,colors.value)
        // if(event.value == topics.value.length){
        //     var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        //     topics.value.push(randomColor)
        // }
        
        
        
    }

    var locals =  data.value.data.data.localisation[0].sublocalisations.localisation

    const handleSeeking = (seekingEvent) => {
        
        let currentTime = video.value.currentTime

        if (Math.abs(video.value.currentTime - lastTimecode) > 1){
            let bestIndex = null
            let bestDiff =  100000
            locals.forEach((phrase,index) => {
                if( ( Math.abs(video.value.currentTime - unixToTimestamp(phrase.tcin)) < bestDiff ) ) {
                    // console.log(Math.abs(video.value.currentTime - unixToTimestamp(phrase.tcin)))
                    // console.log( Math.abs(video.value.currentTime  - unixToTimestamp(locals[index+1].tcin) ))
                    bestDiff = video.value.currentTime - unixToTimestamp(phrase.tcin)
                    bestIndex = index
                    // console.log('focus on index : ' + index)
                    // console.log(phrase.tcin + '<' +timecode+ '<' +  phrase.tcout)
                    
                }
            });

            segmentationRefs.value[lastIndex].style.border = "none"
            segmentationRefs.value[bestIndex].scrollIntoView({ behavior: "smooth" });
            segmentationRefs.value[bestIndex].style.border = "solid black"
            lastIndex = bestIndex
        }
        lastTimecode = currentTime
        
    }

    async function fetchVideoStream(url) {
      const response = await fetch(url);
      const videoHls = response.text();

      return videoHls;
    };

    function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
        let millisecond = tc.split('.')[1]
        let timeArray = tc.split('.')[0].split(':')
        let videoTime = parseInt(timeArray[0])*3600 + parseInt(timeArray[1])*60 + parseInt(timeArray[2]) +  (parseInt(millisecond) / 1000 )
        return videoTime
    }

    const handleSegmentClick = (event) => {
        console.log(event)
        console.log(unixToTimestamp(event.tcin) )
        video.value.currentTime = unixToTimestamp(event.tcin) 
    }

    const handleSubmit = () => {
        console.log(topics.value)

        locals.forEach( (phrase, index) => { 
            if ( ![0,undefined].includes(topics.value[index]) ){
                phrase.topic = topics.value[index]
            }
        })

        console.log(locals[0])
        data.value.data.data.localisation[0].sublocalisations.localisation = locals
        TaskService.updateDataTaskTaskIdPut(data.value.id,{data: data.value.data.data}).then( (response) => console.log(response) )

    }
    
    var videoId = data.value.data.data.id
    var videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`

    const hlsPlayer = () => {
        fetchVideoStream(videoSrc).then((content) => {
            let src = `data:application/vnd.apple.mpegurl;base64,${content}`
            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.attachMedia(video.value);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    console.log("video and hls.js are now bound together !");
                    hls.loadSource(src);
                    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    console.log("manifest loaded, found " + data.levels.length + " quality level");
                    });
                });
            
                
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
            }
        })
    }

    const loadTopics = () => {
        locals.forEach( (phrase,index) => {
            if ( ![0,undefined].includes(phrase.topic) ){
                topics.value[index] = phrase.topic
                console.log('loaded topic number '+phrase.topic + " from index " + index)
                // console.log(topics.value)
                if( index == 0 || topics.value[index] != topics.value[index-1] ){
                    var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    colors.value.push(randomColor)
                    console.log(index)
                }
            }
        } )

        topicsLoaded.value = true
    }


    onMounted(()=> { // Une fois la page chargee, on stream la video
        loadTopics()
        
        hlsPlayer()

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
