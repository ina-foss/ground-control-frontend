<template>
  <div class=" xs:h-full w-full h-auto xs:flex xs:justify-center ">
    <div id="myplayer"></div>
  </div>
</template>


<script setup>


const { videoSrc } = defineProps(['videoSrc'])


let dymamicSrc = $ref()

async function fetchVideoStream(url) {
  const response = await fetch(url);
  const videoHls = response.text();

  return videoHls;
}


  const hlsPlayer = () => {
    fetchVideoStream(videoSrc).then((content) => {
      const src = `data:application/vnd.apple.mpegurl;base64,${content}`
      dymamicSrc = src
    })
  }


onMounted(()=>{
console.log('test')
    document.getElementById('myplayer').mediaPlayer({
      autoplay: false,
      src: dymamicSrc
    })

  hlsPlayer()
})


</script>

<script>        
document.getElementById("myplayer").mediaPlayer({
        autoplay : false,
        src : "samples-data/examples/vid/amalia01.mp4",
});
</script>
