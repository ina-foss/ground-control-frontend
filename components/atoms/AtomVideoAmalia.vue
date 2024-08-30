<template>
    <div class=" h-auto aspect-video w-full" ref="myplayer" id="PLAYER" @click="seek"></div>
</template>


<script setup lang="js">

import { useService } from '#imports';

const amaliaService = useService().$amalia

const myplayer = ref()

let dynamicSrc = $ref()
let lastTimecode = 0
let lastIndex = 0
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
      myplayer.value.appendChild(amaliaService.createPlayer('PLAYER',dynamicSrc))
    }
  })

const seek = async () =>{
  if (myplayer) {
    //console.log("Nouvel élément ajouté :", myplayer);
    const currentTime = amaliaService.callSeek()
    console.log('callseek=',currentTime)

    if (Math.abs(currentTime - lastTimecode) > 1) {
      let bestIndex = null
      let bestDiff = 100000
      locals.forEach((phrase, index) => {
        if ((Math.abs(currentTime - unixToTimestamp(phrase.tcin)) < bestDiff)) {
          bestDiff = currentTime - unixToTimestamp(phrase.tcin)
          bestIndex = index
        }
      });
      emits('timecode-update',{lastIndex: lastIndex, bestIndex: bestIndex})
      lastIndex = bestIndex
    }
    lastTimecode = currentTime
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

