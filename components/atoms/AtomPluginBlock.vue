<template>
          <div v-if="editTitle" class="w-[130px]">
            <InputText v-model="editedTitle" @focusout="editTitle = false" class="w-full" />
          </div>
          <div v-else-if="topicIndex > 0 && isTopicFirstSegment" class="flex items-center justify-center h-full  ">
            <div
              :class="`h-8 text-lg w-fit px-3 flex items-center self-center  `">
              <b class="max-w-[100px] truncate ">{{ title }}</b>
            </div>
            <Button icon="pi pi-pencil" severity="contrast" text @click="editTitle = true" />
            <Button severity="contrast" icon="pi pi-ban" text @click="emit('deactivateTopic', { index: index })" />
          <AutoComplete :suggestions="items" multiple fluid @complete="search" />
          </div>
</template>

<script src="./atom-plugin-block.ts" lang="ts">

</script>
