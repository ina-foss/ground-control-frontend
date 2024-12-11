<template>
  <div id="PLAYER" ref="myplayer" class=" h-auto aspect-video w-full" @click="seek"/>
</template>


<script setup lang="js">

import { useService } from '#imports';

const {$amalia, $application }= useService()

const myplayer = ref()
let lastIndex = 0

let dynamicSrc = ref()
const { locals, videoSrc } = defineProps(['locals', 'video-src'])
const emits = defineEmits(['timecode-update']);
async function fetchVideoStream(url) {
  const response = await fetch(url);
  const videoHls = response.text();
  return videoHls;
}

const hlsPlayer = async () => {
  const content = await fetchVideoStream(videoSrc)
  const src = `data:application/vnd.apple.mpegurl;base64,${content}`
  dynamicSrc.value = src

}

watchEffect(() => {
  if (dynamicSrc.value) {
    myplayer.value.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value)) // add amalia player once src is ready
  }
})

const seek = async () => {
  if (myplayer.value) {
    const currentTime = $amalia.callSeek() // retreive the current time of the video
    let startIndex = 0
    let endIndex = locals.length-1
    while(Math.abs(startIndex - endIndex) > 1 ){ // binary search of the 2 segments surruonding the videotime
      const mid = Math.floor(((endIndex + startIndex) / 2))
      $application.unixToTimestamp(locals[mid].tcin) >= currentTime ? endIndex = mid : startIndex = mid
    }
    const bestIndex = currentTime < $application.unixToTimestamp(locals[endIndex]?.tcin) ? startIndex : endIndex

    emits('timecode-update', { lastIndex: lastIndex, bestIndex: bestIndex }) // emit both times to scroll and adapt css
    lastIndex = bestIndex
}}

onMounted(()=>{

  hlsPlayer()

})
</script>

