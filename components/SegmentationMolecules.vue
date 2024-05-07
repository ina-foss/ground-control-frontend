<template>
    <div  class="flex items-center gap-2">
        <Button icon='pi pi-bookmark' @click="handleSegmentation()"
            :pt="{
                root: {
                    style: `max-width: 40px; min-width: 40px; background-color:${$props.colors[topicIndex]}; border:none; `
                }
            }" />
            <div v-tooltip.top="phrase.tcin + '-' + phrase.tcout" class="bg-white p-1 col-auto grow rounded-md cursor-pointer hover:scale-[1.01]  transition-all hover:shadow-lg">
                {{$props.phrase.data.text[0]}}
            </div>
    </div>
</template>

<script setup>

const props = defineProps(['phrase','colors','topics','index'])
const emit = defineEmits(['segmentation'])


// let bgButtonColor = ref('transparent')
let topicIndex = ref(0)

const handleSegmentation = () => {

    
    if (props.topics.length == 0 ){ // Premier topic 
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        props.colors.push(randomColor)
        // emit('segmentation','premier topic')
        props.topics[props.index] = 1
        topicIndex.value = 1
    }
    else if(topicIndex.value == 0 && props.topics[props.index-1] != topicIndex.value){ //On rattrape le topic precedent
        props.topics[props.index] = props.topics[props.index-1]
        // emit('segmentation','meme topic')
        topicIndex.value = props.topics[props.index]
    }
    else if(topicIndex.value != 0 && props.topics[props.index-1] == topicIndex.value){ // On cree un nouveau topic
        console.log('new topic')
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        props.colors.push(randomColor)
        props.topics[props.index] ++
        topicIndex.value = props.topics[props.index]
        emit('segmentation')
    }
    else if( topicIndex.value != 0 ) { // Reset du topic a 0
        props.topics[props.index] == null;
        props.colors.pop()
        topicIndex.value = 0
    }

        console.log(props.topics)
        console.log( 'index : ' + props.index)
        console.log(props.colors)
   

}




</script>