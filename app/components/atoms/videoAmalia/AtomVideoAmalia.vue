<template>
  <Drawer v-model:visible="visibleRight"  :header="t('player.config.title')" position="left"
           class="shadow-xl rounded-lg border border-gray-300 "  :style="{ height: '35vh', width:'fit-content', marginLeft: '18px',marginTop:'310px' }">
    <div class="card flex justify-center">
      <div class="flex flex-col gap-4">
        <div v-for="category of categories" :key="category.key" class="flex items-center gap-2">
          <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.key" />
          <label :for="category.key">{{ category.name }}</label>
        </div>
      </div>
    </div>
  </Drawer>
  <div  id="PLAYER" ref="myplayer" class="rounded-t-lg h-auto aspect-video w-full overflow-hidden" @click="seek()"/>
  <div  ref="actionsRef" class="w-full flex justify-between bg-grey-150">
    <Button
      data-testid="rewind-btn"
      text
      :disabled="!showRollback"
      :label="t('player.actions.lastTimecode')"
      @click="handleRewindTimecode()"
      style="color: #212529 !important;"
    >
      <template #icon>
        <img
          src="/icons/icons-svg/icons-svg/timeIcon.svg"
          alt="Time Icon"
          class="btn-svg-icon icon-color"
        />
      </template>
    </Button>
    <Button v-if="annotation_type ==='span'"  class="player-btn " @click="focusPlayerModel = !focusPlayerModel" :icon="resizeIcon" text  :label="isCompact ? '' : resizeLabel"
             v-tooltip="isCompact ? resizeLabel : null" style="color: #212529 !important;"/>
    <Button
      @click="visibleRight = true"
      class="player-btn"
      text
      :label="isCompact ? '' : t('player.actions.configButton')"
      v-tooltip="isCompact ? t('player.actions.configButton') : null"
      style="color: #212529 !important;"
    >
      <template #icon>
        <img
          src="/icons/icons-svg/icons-svg/vector.svg"
          alt="Vector Icon"
          class="btn-svg-icon icon-color"
        />
      </template>
    </Button>
  </div>
</template>


<script src="./atom-video-amalia-component.ts" >
</script>
<style>
.btn-svg-icon {
  width: 24px;
  height: 24px;
}
.icon-color {
  filter: brightness(0);

}
.player-btn {
  justify-content: center;
  min-width: 40px;
}
</style>
