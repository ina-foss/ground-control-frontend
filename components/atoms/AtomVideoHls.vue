<template>
  <div>
    <video ref="videoRef" class="w-full" controls @seeked="handleSeeking()" />
  </div>
</template>


<script setup lang="js">

  import { Hls } from 'hls.js'

  const { locals, data } = defineProps(['locals','data'])

  const emits = defineEmits([ 'timecode-update' ]);

  const videoRef = ref()
  const video = $(videoRef)
  let lastTimecode = 0
  let lastIndex = 0
  const videoId = data.data.data.id
  const videoSrc = `https://front.wsmedia.p.sas.ina/wsmedia/${videoId}?type=stream&protocol=hls&typemedia=video`

  const handleSeeking = () => {

    const currentTime = video.currentTime

    if (Math.abs(video.currentTime - lastTimecode) > 1) {
      let bestIndex = null
      let bestDiff = 100000
      locals.forEach((phrase, index) => {
        if ((Math.abs(video.currentTime - unixToTimestamp(phrase.tcin)) < bestDiff)) {
          bestDiff = video.currentTime - unixToTimestamp(phrase.tcin)
          bestIndex = index

        }
      });
      emits('timecode-update',{lastIndex: lastIndex, bestIndex: bestIndex})
      lastIndex = bestIndex
    }
    lastTimecode = currentTime

  }

  function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
    return videoTime
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
          hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
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
