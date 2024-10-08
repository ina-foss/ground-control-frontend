<template>
        <Breadcrumb  :home="home" :model="items" class="border-0 p-3" style="background-color: #F7F7F7;font-size:14px">

            <template #item="{ item, props }">

                <router-link v-if="item.route " v-slot="{ href, navigate }" :to="item.route" custom>
                  <a :href="href" v-bind="props.action" @click.prevent="navigate()" style="color: #757575">
                        <span :class="[item.icon]" />
                        <span  :class="[{ 'text-primary font-bold': isSelected(item.label) }, 'font-semibold']">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action" style="color: #757575">
                    <span :class="[{ 'text-primary font-bold': isSelected(item.label) }]">{{ item.label }}</span>
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

const home = { label: 'Projets', route: '/dashboard' }

const {getItems} = storeToRefs(store)

const items = ref(getItems)
debugger
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
const isSelected=(label)=> {
  debugger
  const savedItems = localStorage.getItem('breadcrumbItems');
  /*if(label === home.label){
    return true;
  }else {*/
    if (!label) {
      return false;
    } else {
      const a = JSON.parse(savedItems);
      const b = a.slice(-1)[0]
      return b.label === label;

    /*}*/
  }

  //return this.$route.path === item.route; // ou tout autre critère de sélection

}

</script>
<style>
.text-primary {
  color: #212529; /* ou toute autre couleur souhaitée */
}
.font-bold {
  font-weight: bold;
}
</style>
