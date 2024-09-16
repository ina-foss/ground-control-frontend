<template>
  <div id="PLAYER" ref="myplayer" class=" h-auto aspect-video w-full" @click="seek"/>
</template>


<script setup lang="js">

import { useService } from '#imports';

const amaliaService = useService().$amalia

const myplayer = ref()
let lastIndex = 0

let dynamicSrc = $ref()
const { locals, videoSrc } = defineProps(['locals', 'videoSrc'])
const emits = defineEmits(['timecode-update']);
async function fetchVideoStream(url) {
  const response = await fetch(url);
  const videoHls = response.text();
  return videoHls;
}

const hlsPlayer = async () => {
  const content = await fetchVideoStream(videoSrc)
  const src = `data:application/vnd.apple.mpegurl;base64,${content}`
  dynamicSrc = src

}

watchEffect(() => {
  if (dynamicSrc) {
    myplayer.value.appendChild(amaliaService.createPlayer('PLAYER', dynamicSrc)) // add amalia player once src is ready
  }
})

const seek = async () => {
  if (myplayer.value) {
    const currentTime = amaliaService.callSeek() // retreive the current time of the video
    let startIndex = 0
    let endIndex = locals.length
    while(Math.abs(startIndex - endIndex) > 1 ){ // binary search of the 2 segments surruonding the videotime
      const mid = Math.floor(((endIndex + startIndex) / 2))
      unixToTimestamp(locals[mid].tcin) >= currentTime ? endIndex = mid : startIndex = mid
    }
    const bestIndex = endIndex
    emits('timecode-update', { lastIndex: lastIndex, bestIndex: bestIndex }) // emit both times to scroll and adapt css
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

