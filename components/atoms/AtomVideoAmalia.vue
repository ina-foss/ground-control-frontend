<template>
    <div class=" h-auto aspect-video w-full" ref="myplayer"></div>
</template>


<script setup>

import { useService } from '#imports';

const amaliaService = useService().$amalia
const { videoSrc } = defineProps(['videoSrc'])

const myplayer = ref()

let dynamicSrc = $ref()

async function fetchVideoStream(url) {
  const response = await fetch(url);
  const videoHls = response.text();

  return videoHls;
}


  const hlsPlayer = async () => {
    let content = await fetchVideoStream(videoSrc)
    const src = `data:application/vnd.apple.mpegurl;base64,${content}`
    dynamicSrc = src

  }

watchEffect(()=>{
    if (dynamicSrc) {
      myplayer.value.appendChild(amaliaService.createPlayer('id',dynamicSrc))
    }
  })

onMounted(()=>{

  hlsPlayer()
})


</script>

