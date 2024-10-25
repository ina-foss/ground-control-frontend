<template>
  <div class="overflow-y-auto h-full bg-neutral-color" style="background-color: #F7F7F7">
    <div class="p-3 w-[200px] ml-auto fixed z-30 right-0 mr-0" style=" top:65px">
      <Dropdown
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        placeholder="Statut"
        class="w-full mb-4  h-[40px] " show-clear
        style=" border-color: #0b7698 !important;
    color: #0b7698 !important;"
      />
    </div>
    <div ref="dashboardRef" class="p-3 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  ">
      <MoleculeProjectCard
        v-for="(project,index) in filteredProjects " :key="index" :project=project
        @refresh-data="handleRefresh"/>
    </div>
    <div class="absolute bottom-[4.4rem] w-full">
      <Paginator
        v-model:first="first"
        :pt="{

        root:{
          style: { padding: '0px', height: '24px',backgroundColor:'transparent' },

        },
        firstPageButton: {
            class: ['paginator-button'],
          },
          previousPageButton: {
            class: ['paginator-button'],
          },
          pageButton: {
            class: ['paginator-button'],
                  },
          nextPageButton: {
            class: ['paginator-button'],
          },
          lastPageButton: {
            class: ['paginator-button'],
          },

      }"
        class="custom-paginator sticky bg-surface-color" :always-show="false" :rows="rows" :total-records="totalRecords"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink  LastPageLink" />
    </div>
  </div>
</template>

<script setup>
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'
import {bcStore} from "~/stores/breadcrumbs";
import {ProjectStatus} from "../api/generate";
import MoleculeProjectCard from "../components/molecules/MoleculeProjectCard.vue";

const refreshStore = useRefreshStore()
const {fetchProject} = refreshStore
const {getData, getProjectNumber} = storeToRefs(refreshStore)
const store = bcStore()
const {getItems} = storeToRefs(store)
const first = ref(0)
const rows = ref(15)
const totalRecords = $ref(getProjectNumber);

const dashboardRef = ref()
const data = ref(getData)
localStorage.setItem('breadcrumbItems', null);

const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}
const translatedProjectStatus = $computed(() => {
  return Object.values(ProjectStatus).map(status => ({
    label: translations[status],
    value: status,
  }));
})
const selectedStatus = ref(null); // Statut sélectionné depuis la dropdown
const statusOptions = translatedProjectStatus;
const getTotalRecords = () => {
  refreshStore.totalRecords()
}

watch(() => first.value, () => {handleRefresh()})

const handleRefresh = async () => {
  try {
    await fetchProject(first.value, rows.value);
    getTotalRecords();
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
};

const sortDataById = computed(() => {
    // Check if data is an array and not just an object
    if (Array.isArray(data.value)) return [...data.value].sort((a, b) => a.id - b.id)
    return []
  }
)

// Filtrer les projets en fonction du statut sélectionné
const filteredProjects = computed(() => {
  if (!selectedStatus.value) return sortDataById.value;
  return sortDataById.value.filter((project) => project.status === selectedStatus.value.value);
});
onMounted(() => {
  handleRefresh();
})

while (getItems.value.length > 0) store.removeLastCrumb()

</script>
<style >

.custom-paginator .paginator-button {
  height: 24px;
  width: 24px;
  font-size: 14px;
  color: #757575;
  padding: 0 12px ;
}

.custom-paginator .paginator-button:hover {
  background-color: #0C7DA2;
  border-radius: 50%;
}
.custom-paginator .paginator-button:focus {
  color: #006180;
}
.custom-paginator .paginator-button:active {
  color: #006180;
}


</style>
