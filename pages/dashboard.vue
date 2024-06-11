<template>
  <div>
    <div v-if="data !== undefined" class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      <ProjectCard
                   v-for="(project,index) in sortDataById(data)" :key="index" :project=project
                   @refresh-data="handleRefresh"/>
    </div>
  </div>
</template>

<script setup>
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'


const refreshStore = useRefreshStore()
const fetchHappened = ref(true)

provide('fetchProject', fetchHappened)


refreshStore.fetch()

const {getData} = storeToRefs(refreshStore)


const data = ref(getData)


const handleRefresh = async () => {
  refreshStore.fetch()
}

const sortDataById = (array) => {
  return array.sort((a, b) => a.id - b.id)
}


</script>
