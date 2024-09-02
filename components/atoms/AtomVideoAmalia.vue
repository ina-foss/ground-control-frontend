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
      myplayer.value.appendChild(amaliaService.createPlayer('PLAYER',dynamicSrc))
    }
  })

const seek = async () =>{
  if (myplayer) {
    const currentTime = amaliaService.callSeek()
    console.log('callseek=',currentTime)
    let startIndex = 0
    let lastIndex = locals.length
    while(Math.abs(startIndex - lastIndex) > 1 ){
      let mid = Math.floor((lastIndex + startIndex) / 2)
      unixToTimestamp(locals[mid].tcin) >= currentTime ? lastIndex = mid : startIndex = mid
    }
    const bestIndex = startIndex
      emits('timecode-update',{lastIndex: lastIndex, bestIndex: bestIndex})
    lastIndex = bestIndex
}}

onMounted(()=>{

  hlsPlayer()
})


</script>

