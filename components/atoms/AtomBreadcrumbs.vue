<template>
    <div>
        <Breadcrumb :home="home" :model="items">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click.prevent="navigate()">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary text-ellipsis text-nowrap font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-color">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>
    </div>
</template>

<script setup>

import { bcStore } from '../../stores/breadcrumbs.ts';
const store = bcStore()

import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const pages =  ['dashboard', 'projects-id', 'task-id']

const home = { label: 'Projects', route: '/dashboard' }

const {getItems} = storeToRefs(store)

const items = ref(getItems)

const router = useRouter();

// Watch for changes in the breadcrumb items and update localStorage
watch(items, (newItems) => {
  localStorage.setItem('breadcrumbItems', JSON.stringify(newItems));
}, { deep: true });

// Function to update breadcrumb items
const updateBreadcrumb = (newItems) => {
  items.value = newItems;
};

// Initial breadcrumb setup as it was last pages
// This means no loss when F5
onMounted(() => {
  const savedItems = localStorage.getItem('breadcrumbItems');
  if (savedItems) {
    JSON.parse(savedItems)?.forEach(item => {
      store.addCrumb(item)
    });
  }
});

// Example route change handling to update breadcrumb
router.afterEach((to) => {
  // Logic to generate breadcrumb items based on the route
  const breadcrumbItems = [
    home,
    { label: to.name, to: to.fullPath }
  ];
});

</script>
