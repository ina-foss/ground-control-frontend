<template>
        <Breadcrumb :home="home" :model="items" class="border-0" style="background-color: #F7F7F7">

            <template   #item="{ item, props }">

                <router-link v-if="item.route " v-slot="{ href, navigate }" :to="item.route" custom>
                  <a :href="href" v-bind="props.action" @click.prevent="navigate()">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary text-ellipsis text-nowrap font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-color">{{ item.label }}</span>
                </a>
            </template>
          <template #separator>
            <span>/</span>
          </template>
        </Breadcrumb>

</template>

<script setup>

import { bcStore } from '../../stores/breadcrumbs.ts';

import { ref, onMounted, watch } from 'vue';
const store = bcStore()


const home = { label: 'Projects', route: '/dashboard' }

const {getItems} = storeToRefs(store)

const items = ref(getItems)


// Watch for changes in the breadcrumb items and update localStorage
watch(items, (newItems) => {
  localStorage.setItem('breadcrumbItems', JSON.stringify(newItems));
}, { deep: true });

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



</script>
