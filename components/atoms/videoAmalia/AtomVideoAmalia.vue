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
  <div class="w-full flex justify-between rounded-lg p-1">
    <Button @click="visibleRight = true" icon="pi pi-cog" severity="secondary" rounded :label="t('player.actions.configButton')" />
    <Button @click="focusPlayerModel = !focusPlayerModel" icon="pi pi-arrows-h"  severity="secondary" rounded :label="t('player.actions.resize')"/>
    <Button data-testid="rewind-btn" icon="pi pi-stopwatch" severity="secondary" :disabled="!showRollback"  :label="t('player.actions.lastTimecode')"  @click="handleRewindTimecode()" rounded/>

  </div>
</template>


<script src="./atom-video-amalia-component.ts" >
</script>

