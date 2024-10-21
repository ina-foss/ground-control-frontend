<template>
  <div class=" xs:h-full w-full h-auto xs:flex xs:justify-center ">
    <video ref="videoRef" class=" xs:h-full xs:w-auto w-full aspect-video" controls @seeked="handleSeeking()" />
  </div>
</template>


<script setup lang="js">

  import { Hls } from 'hls.js'
  import { useService } from '#imports';

  const { locals, videoSrc } = defineProps(['locals','video-src'])

  const emits = defineEmits([ 'timecode-update' ]);

  const videoRef = ref()
  const video = $(videoRef)
  let lastTimecode = 0
  let lastIndex = 0

  const handleSeeking = () => {

    const currentTime = video.currentTime // Retrieve videotime
    if (Math.abs(video.currentTime - lastTimecode) > 1) { // check if the user moved in the timeline
      let startIndex = 0
      let endIndex = locals.length
      while(Math.abs(startIndex - endIndex) > 1 ){ // binary search of the 2 segments surruonding the videotime
        const mid = Math.floor(((endIndex + startIndex) / 2))
        $application.unixToTimestamp(locals[mid].tcin) >= currentTime ? endIndex = mid : startIndex = mid
      }
      const bestIndex = endIndex
      emits('timecode-update',{lastIndex: lastIndex, bestIndex: bestIndex}) // emit time to scroll and modify css
      lastIndex = bestIndex
    }
    lastTimecode = currentTime
  }


  async function fetchVideoStream(url) {
    const response = await fetch(url);
    const videoHls = response.text();

    return videoHls;
  }

  const hlsPlayer = () => {
    fetchVideoStream(videoSrc).then((content) => {
      const src = `data:application/vnd.apple.mpegurl;base64,${content}`
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(src);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
          });
        });


      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
      }
    })
  }

  onMounted(async () => { // Une fois la page chargee, on stream la video
    hlsPlayer()
  })

  defineExpose({ videoRef })

</script>
