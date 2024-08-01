<template>
  <div>
    <div class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      <ProjectCard
        v-for="(project,index) in sortDataById" :key="index" :project=project
        @refresh-data="handleRefresh"/>
    </div>
  </div>
</template>

<script setup>
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'
import {bcStore} from "~/stores/breadcrumbs";


const refreshStore = useRefreshStore()
const {fetchProject} = refreshStore
const {getData} = storeToRefs(refreshStore)
const store = bcStore()
const { getItems } = storeToRefs(store)

const data = ref(getData)
localStorage.setItem('breadcrumbItems', null);
const savedItems = localStorage.getItem('breadcrumbItems');
const parsedItems = JSON.parse(savedItems);

fetchProject().then((res) => {
  if (parsedItems === null) {
    store.removeLastCrumb()
  }
})

const handleRefresh = async () => {
  await fetchProject()
}

const sortDataById = computed(() => {
    // Check if data is an array and not just an object
    if (Array.isArray(data.value)) return data?.value?.sort((a, b) => a.id - b.id)
    return []
  }
)

while(getItems.value.length > 0) store.removeLastCrumb()

</script>
