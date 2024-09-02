<template>
    <div class=" h-auto aspect-video w-full" ref="myplayer" id="PLAYER" @click="seek"></div>
</template>


<script setup lang="js">

import { useService } from '#imports';

const amaliaService = useService().$amalia

const myplayer = ref()

let dynamicSrc = $ref()
const { locals, data, videoSrc } = defineProps(['locals','data','videoSrc'])
const emits = defineEmits([ 'timecode-update' ]);
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
      myplayer.value.appendChild(amaliaService.createPlayer('PLAYER',dynamicSrc)) // add amalia player once src is ready
    }
  })

const seek = async () =>{
  if (myplayer) {
    const currentTime = amaliaService.callSeek() // retreive the current time of the video
    console.log('callseek=',currentTime)
    let startIndex = 0
    let lastIndex = locals.length
    while(Math.abs(startIndex - lastIndex) > 1 ){ // binary search of the 2 segments sourounding the currentTime
      let mid = Math.floor((lastIndex + startIndex) / 2)
      unixToTimestamp(locals[mid].tcin) >= currentTime ? lastIndex = mid : startIndex = mid
    }
    const bestIndex = startIndex
      emits('timecode-update',{lastIndex: lastIndex, bestIndex: bestIndex}) // emit both times to scroll and adapt css
    lastIndex = bestIndex
}}

onMounted(()=>{

  hlsPlayer()

})
function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
  const millisecond = tc.split('.')[1]
  const timeArray = tc.split('.')[0].split(':')
  const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
  return videoTime
}
</script>

