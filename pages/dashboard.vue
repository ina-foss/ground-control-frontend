<template>
  <div class="overflow-y-auto h-full bg-neutral-color" style="background-color: #F7F7F7">
    <div ref="dashboardRef" class="py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  ">
      <ProjectCard
        v-for="(project,index) in sortDataById" :key="index" :project=project
        @refresh-data="handleRefresh"/>
    </div>
    <div class="absolute bottom-16 w-full">
    <Paginator style="background-color: #FFFFFF"
v-model:first="first" class="sticky bg-surface-color" :always-show="false" :rows="rows" :total-records="20"
               template="FirstPageLink PrevPageLink PageLinks NextPageLink  LastPageLink"/>
  </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'
import {bcStore} from "~/stores/breadcrumbs";


const refreshStore = useRefreshStore()
const {fetchProject} = refreshStore
const {getData} = storeToRefs(refreshStore)
const store = bcStore()
const {getItems} = storeToRefs(store)
const first = ref(0)
const rows = $ref(10)
const dashboardRef = ref()


watchEffect(() => {
  fetchProject(first.value, rows)
})


const data = ref(getData)
localStorage.setItem('breadcrumbItems', null);
const savedItems = localStorage.getItem('breadcrumbItems');
const parsedItems = JSON.parse(savedItems);

fetchProject(first.value, rows).then(() => {
  if (parsedItems === null) {
    store.removeLastCrumb()
  }
})

const handleRefresh = async () => {
  await fetchProject(first.value, rows)
}

const sortDataById = computed(() => {
    // Check if data is an array and not just an object
    if (Array.isArray(data.value)) return [...data.value].sort((a, b) => a.id - b.id)
    return []
  }
)

onMounted(() => {
})

while (getItems.value.length > 0) store.removeLastCrumb()

</script>
