<template>
  <div>
    <Breadcrumb :home="home" :model="items"/>
    <div/>
  </div>
</template>

<script setup>

import {bcStore} from '../../stores/breadcrumbs.ts';

const store = bcStore()

const home = {label: 'Projects', url: '/dashboard'}

const {getItems} = storeToRefs(store)

const items = ref(getItems)


import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

// Watch for changes in the breadcrumb items and update localStorage
watch(items, (newItems) => {
  localStorage.setItem('breadcrumbItems', JSON.stringify(newItems));
}, {deep: true});

// Function to update breadcrumb items
const updateBreadcrumb = (newItems) => {
  items.value = newItems;
};

// Initial breadcrumb setup
onMounted(() => {
  const savedItems = localStorage.getItem('breadcrumbItems');
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }
});

// Example route change handling to update breadcrumb
router.afterEach((to) => {
  // Logic to generate breadcrumb items based on the route
  const breadcrumbItems = [
    home,
    {label: to.name, to: to.fullPath}
  ];
  updateBreadcrumb(breadcrumbItems);
});
</script>
