<template>
  <Breadcrumb :home="home" class="breadcrumb-container border-0 p-3 " style="font-size: 14px;">
    <template #item="{ props }">
      <template v-for="(breadcrumbItem, index) in fullBreadcrumbs" :key="index" >
        <router-link v-if="breadcrumbItem.route" v-slot="{ navigate }" :to="breadcrumbItem.route" custom >
          <a v-bind="props.action" class="breadcrumb-item" style="color: #757575;cursor: pointer;" @click.prevent="navigate()" >
            <span :class="[breadcrumbItem.icon]" />
            <span :class="[{ 'text-primary font-bold': isSelected(breadcrumbItem.label, index) }, 'font-semibold']">
              {{ breadcrumbItem.label }}
                      <span v-if="index < fullBreadcrumbs.length - 1" class="breadcrumb-separator"> / </span>
            </span>
          </a>
        </router-link>
<!--        <a v-else :href="breadcrumbItem.url" :target="breadcrumbItem.target" v-bind="props.action" class="breadcrumb-item" style="color: #757575">
          <span :class="[{ 'text-primary font-bold': isSelected(breadcrumbItem.label, index) }]">
            {{ breadcrumbItem.label }}
            <span v-if="index < fullBreadcrumbs.length - 1" class="breadcrumb-separator"> / </span>
          </span>
        </a>-->
      </template>
    </template>
  </Breadcrumb>
</template>

<script setup>
import { bcStore } from '../../stores/breadcrumbs.ts';
import { ref, onMounted, watch } from 'vue';
const store = bcStore()
const home = { label: 'Projets', route: '/dashboard' }
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


const fullBreadcrumbs = computed(() => {
  return [home, ...items.value];
});
const isSelected = (label, index) => {
  const savedItems = localStorage.getItem('breadcrumbItems');
  if (!label || !savedItems) {
    return false;
  }

  const breadcrumbItems = JSON.parse(savedItems);
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    return index === breadcrumbItems.length ;
  }
  if(index===0){
    return true;
  }
  return false;
};


</script>
<style>
.text-primary {
  color: #212529;
}
.font-bold {
  font-weight: bold;
}
.breadcrumb-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.breadcrumb-container a {
  white-space: nowrap;
  display: inline-flex;
}

.breadcrumb-separator {
  display: inline;
  margin: 0 5px;
}
</style>
