<template>
  <div class="overflow-y-auto h-0 min-h-full flex flex-col   ">
    <div
      :class="['  w-fit h-[70px] grow ml-auto items-center fixed mr-12 flex top-[0px] z-[1]', roleCreateProject ? 'right-[145px]' : 'right-[5px]']">
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
    <div class="grow">
    <div ref="dashboardRef" class="p-3 grid gap-6 w-full" style="grid-template-columns: repeat(auto-fill,minmax(300px,1fr))">
      <div v-if="status === 'pending' && data?.length == 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-4 md:gap-y-40 mx-auto max-w-8xl px-4 xl:px-28 py-6">
        <Skeleton width="20rem" height="4rem" />
      </div>
      <Message v-if="status === 'error'" severity="error" icon="pi pi-exclamation-triangle">
        {{ projectError.message }}
      </Message>
      <MoleculeProjectCard
        v-for="(project,index) in filteredProjects " :key="index" :project=project
        />
    </div>
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
        class="custom-paginator sticky bg-surface-color" :always-show="false" :rows="paginatorSize" :total-records="getProjectNumber"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink  LastPageLink"
        @update:first="refresh"
      />
    </div>
    <MoleculeFooter />
  </div>
</template>

<script setup>
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue';
import {useRefreshStore} from '../stores/refresh';
import {storeToRefs} from 'pinia'
import {ProjectStatus,Permission} from "../api/generate";
import MoleculeProjectCard from "../components/molecules/MoleculeProjectCard.vue";


const refreshStore = useRefreshStore()
const {fetchProject} = refreshStore
const {getProjectNumber} = storeToRefs(refreshStore)
const first = ref(0)
const paginatorSize = computed(()=> window.innerWidth > 1600 ? 20 : 16)

// On renomme error pour eviter un conflit avec @nuxt/test-utils/runtime
const {data:data,refresh, status, error: projectError} = await useAsyncData('projects',async ()=> await fetchProject(first.value, paginatorSize.value),{server:false})

const dashboardRef = ref()
localStorage.setItem('breadcrumbItems', null);
const { $application } = useService();

const roleCreateProject = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_CREATE));




const selectedStatus = ref(null); // Statut sélectionné depuis la dropdown
const statusOptions = [
  { value: "draft", label: "Brouillon", colorText: "#FFF", colorBg:"#757575"},
  { value: "pending", label: "En attente", colorText: "#000", colorBg:"#FFC107" },
  { value: "in-progress", label: "En cours", colorText: "#000", colorBg:"#F9D621" },
  { value: "done", label: "Terminé", colorText: "#000", colorBg:"#9ADC82" },
  { value: "skipped", label: "Abandonné", colorText: "#FFF", colorBg:"#EF4444" },
  { value: "archived", label: "Archivé", colorText: "#000", colorBg:"#B3DDF4" },
];

const sortDataById = computed(() => {
    return [...data.value].sort((a, b) => a.id - b.id)
  }
)

const filteredProjects = computed(() => {
  if (!selectedStatus.value) return sortDataById.value;
  return sortDataById.value.filter((project) => project.status === selectedStatus.value.value);
});

provide('refreshProject', refresh)

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
