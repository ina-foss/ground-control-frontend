<template>
  <molecule-video-segmentaion-wrapper class="flex h-full w-full bg-secondary">
    <Skeleton v-if="!player" height="100%" />
    <timeline  id="visualization" />
  </molecule-video-segmentaion-wrapper>
</template>


<script src="./molecule-video-segmentation-component.ts"></script>
<style>
.vis-item.vis-range {
  height: 50px;
}
</style>
