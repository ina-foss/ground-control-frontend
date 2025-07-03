<template>
  <div class=" text-title gap-3 grid  " :style="[ thumbnailUrl != '' ? 'grid-template-columns: repeat(auto-fill,minmax(210px, 1fr)' : 'grid-template-columns: repeat(auto-fill,minmax(120px, 1fr)']"  >
    <div v-for="(timecode,index) in getHistory" data-test="timecode-item" class="flex overflow-clip h-[74px] justify-around rounded-md p-sm group hover:text-[#0b7698] hover:bg-secondary cursor-pointer font-bold gap-5 items-center transition-all duration-300  " @click="videoPlayer.consumeTimecode(index)">

        <span class="h-8 w-8 p-2 flex-shrink-0  rounded-full bg-neutral flex justify-center items-center group-hover:bg-primary group-hover:text-white transition-all  "> {{index+1}} </span>

        <div v-if="thumbnailUrl !=''" class="flex items-center h-full  flex-grow-0 ">
          <Skeleton   v-show="!isLastImageLoaded && index == getHistory.length-1" width="88px" height="100%"  />
          <img :src="`${newThumbnailUrl}?width=320&start=${unixToTimestamp(timecode)}`" class=" max-h-full   rounded-md" @load="showImage()" alt="thumbnail image of the corresponding timecode" >
        </div>

        <span class=""> {{ timestampToUnix(unixToTimestamp(timecode)) }}</span>

    </div>
  </div>
</template>


<script setup lang="ts">


import type {Ref} from "vue";
import type AtomVideoAmalia from "~/components/atoms/videoAmalia/AtomVideoAmalia.vue";
const {$application} = useService()
const {timestampToUnix, unixToTimestamp} = $application
const {getHistory} = useTimecodeHistory()
const videoPlayer = inject("videoPlayer") as Ref<InstanceType<typeof AtomVideoAmalia> | null>;
const newThumbnailUrl = ref('');
const props = defineProps({
  thumbnailUrl : {type: String, default: ()=> "" }
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



onMounted(async () => {
  if (thumbnailUrl.value !== '') {
    const media_id = thumbnailUrl.value?.split(':')[2]?.split('?')[0];
    const {data} = await useFetch(thumbnailUrl.value, {key: `thumbnailUrl-${media_id}`});
    newThumbnailUrl.value = data.value;
  }
});

</script>

<style scoped lang="postcss">

.show-arrow {
  @apply p-2
}

.show-arrow i {
  @apply opacity-100
}


</style>
