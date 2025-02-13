<template>
  <div class="overflow-y-auto h-0 min-h-full flex flex-col   ">
    <div
      :class="['  w-fit h-[70px] grow ml-auto items-center fixed mr-12 flex top-[0px] z-[1]', isAdmin ? 'right-[145px]' : 'right-[5px]']">
      <label class="text-primary font-semibold p-2">Projets</label>
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        class="w-fit items-center h-[33px]"
        placeholder="Statut"
        show-clear
      />
    </div>
    <div ref="dashboardRef" class="p-3 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grow   ">
      <MoleculeProjectCard
        v-for="(project,index) in filteredProjects " :key="index" :project=project
        @refresh-data="handleRefresh"/>
    </div>
    <div class="w-full h-fit">
      <Paginator
        v-model:first="first"
        :pt="{

        root:{
          style: { padding: '0px', height: 'fit-content',backgroundColor:'transparent' },

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
    <MoleculeFooter />
  </div>
</template>

<script setup>
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue';
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'
import {ProjectStatus} from "../api/generate";
import MoleculeProjectCard from "../components/molecules/MoleculeProjectCard.vue";

const refreshStore = useRefreshStore()
const {fetchProject} = refreshStore
const {getData, getProjectNumber} = storeToRefs(refreshStore)
const first = ref(0)
const rows = ref(15)
const totalRecords = ref(getProjectNumber);

const dashboardRef = ref()
const data = ref(getData)
localStorage.setItem('breadcrumbItems', null);
const { $application } = useService();

const isAdmin = computed(() => $application.hasRole('GC_ADMIN'));


const translations = {
  draft: 'Brouillon',
  pending: 'En attente',
  ended: 'Terminé'
}
const translatedProjectStatus = computed(() => {
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
.custom-dropdown .p-dropdown-label  {
  color: red;
  border:red;
  font-size: 14px; /* Taille de texte personnalisée */
}

</style>
