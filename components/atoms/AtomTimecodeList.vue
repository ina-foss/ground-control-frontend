<template>
  <div class="  text-title gap-3 grid grid-cols-[1fr_1fr]">
    <div v-for="(timecode,index) in getHistory" class="flex  h-[74px] rounded-md p-sm group hover:text-[#0b7698] hover:bg-secondary cursor-pointer font-bold gap-5 items-center transition-all duration-300  " @click="videoPlayer.consumeTimecode(index)">

        <span class="h-8 w-8 p-2 rounded-full bg-neutral flex  justify-center items-center  group-hover:bg-primary group-hover:text-white transition-all  "> {{index+1}} </span>

        <Skeleton v-show="!isLastImageLoaded && index == getHistory.length-1" width="88px" height="100%"  />
        <img :src="`${newThumbnailUrl}?width=320&start=${timecode}`" class="h-full rounded-md" @load="showImage()" alt="thumbnail image of the corresponding timecode" >

        <span> {{ timestampToUnix(timecode) }}</span>
    </div>
  </div>
</template>


<script setup lang="ts">


import type {Ref} from "vue";
import type AtomVideoAmalia from "~/components/atoms/AtomVideoAmalia.vue";
const {$application} = useService()
const {timestampToUnix, unixToTimestamp} = $application
const {getHistory} = useTimecodeHistory()
const videoPlayer = inject("videoPlayer") as Ref<InstanceType<typeof AtomVideoAmalia> | null>;

const props = defineProps({
  thumbnailUrl : {type: String, default: ()=> '' }
})

const { thumbnailUrl } = toRefs(props)

const isLastImageLoaded= ref(false)

watch(()=>getHistory.value.length,(length,oldLength)=>{
  if(length >= oldLength || !oldLength){
    isLastImageLoaded.value = false
  }
},{immediate:true,deep:true})


function showImage( ){
  isLastImageLoaded.value = true
}


const media_id = thumbnailUrl.value.split(':')[2].split('?')[0]
const {data: newThumbnailUrl} = await useFetch(thumbnailUrl.value,{key:`thumbnailUrl-${media_id}`})




</script>

<style scoped lang="postcss">

.show-arrow {
  @apply p-2
}

.show-arrow i {
  @apply opacity-100
}


</style>
