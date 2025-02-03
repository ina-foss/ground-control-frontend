<template>
  <div id="PLAYER" ref="myplayer" class=" h-auto aspect-video w-full" @click="seek()"/>
  <div class="w-full flex justify-center  ">
    <Button icon="pi pi-history" severity="secondary" :disabled="!showRollback"  rounded  @click="consumeTimecode()"/>
  </div>
</template>


<script setup lang="ts">

import { useService } from '#imports';

const {$amalia, $application }= useService()

const myplayer = ref()
let lastIndex = 0

let dynamicSrc = ref()
const { locals, videoSrc,media_params } = defineProps(['locals', 'video-src','media_params'])
const emits = defineEmits(['timecode-update']);
async function fetchVideoStream(url) {
  const response = await fetch(url);
  const videoHls = response.text();
  return videoHls;
}

const timecodeHistory : Ref<[]> | undefined = inject('timecode-history')

const showRollback =  computed(()=>{
  return timecodeHistory.value.length > 0
})

function consumeTimecode() {
  if(timecodeHistory){
    timecodeHistory.value.pop() // remove last timecode
    const tc = timecodeHistory.value[timecodeHistory.value.length-1] // use the new last timecode to update the player
    $amalia.updateCurrentTc(tc)
    seek(true)
  }
}

const hlsPlayer = async () => {
  const content = await fetchVideoStream(videoSrc)
  const src = `data:application/vnd.apple.mpegurl;base64,${content}`
  dynamicSrc.value = src

}

watchEffect(() => {
  if (dynamicSrc.value) {
    myplayer.value.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value,media_params)) // add amalia player once src is ready
  }
})

function computeGap (a:number ,b: number){
  return Math.abs(a-b)
}

const seek = async (fromHistory?: boolean) => {
  if (myplayer.value) {
    const currentTime = $amalia.callSeek() // retreive the current time of the video
    let startIndex = 0
    let endIndex = locals.length-1
    while(Math.abs(startIndex - endIndex) > 1 ){ // binary search of the 2 segments surruonding the videotime
      const mid = Math.floor(((endIndex + startIndex) / 2))
      $application.unixToTimestamp(locals[mid].tcin) >= currentTime ? endIndex = mid : startIndex = mid
    }
    const startGap = computeGap(currentTime,$application.unixToTimestamp(locals[startIndex]?.tcin)) // Gap between currentTime and the in timecode of the startIndex
    const endGap = computeGap(currentTime,$application.unixToTimestamp(locals[endIndex]?.tcin))// Gap between currentTime and the in timecode of the endIndex
    let bestIndex = startGap < endGap  ? startIndex : endIndex

    emits('timecode-update', {tcin: currentTime, lastIndex: lastIndex, bestIndex: bestIndex, fromHistory: fromHistory   }) // emit both times to scroll and adapt css
    lastIndex = bestIndex
}}

onMounted(()=>{

  hlsPlayer()

})
</script>

