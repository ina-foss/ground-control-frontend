<template>
  <div class="overflow-y-auto h-full bg-neutral-color" style="background-color: #F7F7F7">
    <div ref="dashboardRef" class="p-3 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  ">
      <ProjectCard
        v-for="(project,index) in sortDataById" :key="index" :project=project
        @refresh-data="handleRefresh"/>
    </div>
    <div class="absolute bottom-16 w-full">
    <Paginator
      v-model:first="first"
      style="background-color: #FFFFFF"
 class="sticky bg-surface-color" :always-show="false" :rows="rows" :total-records="totalRecords"
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
const {getData, getProjectNumber} = storeToRefs(refreshStore)
const store = bcStore()
const {getItems} = storeToRefs(store)
const first = ref(0)
const rows = ref(15)
let totalRecords = $ref(getProjectNumber);

const dashboardRef = ref()
const data = ref(getData)
localStorage.setItem('breadcrumbItems', null);

const getTotalRecords=()=>{
  refreshStore.totalRecords()
}

watch(()=> first.value,()=> handleRefresh(first.value,rows.value) )


const handleRefresh = async () => {
  await fetchProject(first.value, rows.value)
  getTotalRecords()
}

const sortDataById = computed(() => {
    // Check if data is an array and not just an object
    if (Array.isArray(data.value)) return [...data.value].sort((a, b) => a.id - b.id)
    return []
  }
)
onMounted(() => {
  handleRefresh()
})

while (getItems.value.length > 0) store.removeLastCrumb()

</script>
