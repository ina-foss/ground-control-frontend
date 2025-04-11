<template>
  <div id="PLAYER" ref="myplayer" class="rounded-t-lg h-auto aspect-video w-full overflow-hidden" @click="seek()"/>
  <div class="w-full flex justify-center rounded-lg ">
    <Button icon="pi pi-history" severity="secondary" :disabled="!showRollback"  rounded  @click="handleRewindTimecode()"/>
  </div>
</template>


<script src="./atom-video-amalia-component.ts" >
</script>

