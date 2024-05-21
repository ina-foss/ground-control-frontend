<template>
    <div  class="flex items-center gap-2">
 
        <Button v-bind:icon="iconBool" v-bind:label="topicText" @click="handleSegmentation() "
            :pt="{
                root: {
                    style: `max-width: 40px; min-width: 40px; background-color:${$props.colors[topicIndex]}; border:none `
                }
            }" />
            <div v-tooltip.top="phrase.tcin + '-' + phrase.tcout" class="bg-white p-3 leading-tight text-sm col-auto grow rounded-md cursor-pointer hover:scale-[1.01] transition-all hover:shadow-lg " @click="$emit('onSegmentClick',{tcin : phrase.tcin, tcout: phrase.tcout})">
                {{$props.phrase.data.text[0]}}
            </div>
    </div>
</template>

<script setup>

const props = defineProps(['phrase','colors','topics','index'])
const emit = defineEmits(['segmentation'])



const toast = useToast()


// let bgButtonColor = ref('transparent')
let topicIndex = ref(0)
if (props.phrase.data.topic != undefined) topicIndex.value = props.phrase.data.topic 
var iconBool = ref('pi pi-tag')

var topicText = ref(null)

iconBool.value = topicIndex.value == 0 ? 'pi pi-bookmark' : ''
topicText.value = topicIndex.value == 0 ? null : "#"+topicIndex.value

const handleSegmentation = () => {

    
    if (props.index == 0){ // Cas particulier de la premiere phrase
        if( topicIndex.value == 0) {
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        props.colors.push(randomColor)
        // emit('segmentation','premier topic')
        props.topics[props.index] = 1
        topicIndex.value = 1
        }
        else {
            !props.topics.includes(props.index) && props.colors.pop()
            props.topics[props.index] = 0;
            topicIndex.value = 0
        }
    }
    else if( topicIndex.value < props.topics[props.index-1]  ){ //On rattrape le topic precedent
        if (props.topics[props.index-1] != undefined){
           props.topics[props.index] = props.topics[props.index-1]
           topicIndex.value = props.topics[props.index]
        }
        else{
            toast.add({severity:"info",detail:"Can't modify this sentence"})
        }
        // emit('segmentation','meme topic')
       
    }
    else if( topicIndex.value == props.colors.length-1  && (props.topics[props.index-1] == topicIndex.value)  ) { // On cree un nouveau topic
        console.log('new topic')
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        props.colors.push(randomColor)
        props.topics[props.index] ++
        topicIndex.value = props.topics[props.index]
      
    }
    else if( topicIndex.value < props.topics[props.index+1] ){ // On itere parmi les topics existants
        props.topics[props.index] ++
        topicIndex.value ++
    }
    
    else if( topicIndex.value != 0 ) { // Reset du topic a 0
 
        // let topicArray = props.topics
        // emit('segmentation', props.index)
        props.topics[props.index] = 0;
        !props.topics.includes(topicIndex.value) && props.colors.pop()
        topicIndex.value = 0
    }

    console.log('TOPCIS :')
    console.log(props.topics)
    console.log( 'index : ' + props.index)
    console.log('COLORS :')
    console.log(props.colors)

    emit('segmentation')

    iconBool.value = topicIndex.value == 0 ? 'pi pi-bookmark' : ''
    topicText.value = topicIndex.value == 0 ? null : "#"+topicIndex.value
}







</script>