<template>
  <div class="overflow-y-auto h-0 min-h-full flex flex-col   ">
    <div
      :class="['  w-fit h-[70px] grow ml-auto items-center fixed mr-12 flex top-[0px] z-[1]', roleCreateProject ? 'right-[145px]' : 'right-[5px]']">
      <label class="text-primary font-semibold p-2">{{ t('project.title') }}</label>
      <Select
        :key="$i18n.locale"
        v-model="selectedStatus"
        append-to="body"
        :options="status_map"
        option-label="label"
        class="w-fit items-center h-[33px]"
        :placeholder="t('project.statusPlaceholder')"
        show-clear
      />
    </div>
    <div class="grow">
    <div ref="dashboardRef" class="p-3 grid gap-6 w-full" style="grid-template-columns: repeat(auto-fill,minmax(300px,1fr))">
      <div v-if="status === 'pending' && data?.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-4 md:gap-y-40 mx-auto max-w-8xl px-4 xl:px-28 py-6">
        <Skeleton width="20rem" height="4rem" />
      </div>
      <Message v-if="status === 'error'" severity="error" icon="pi pi-exclamation-triangle">
        {{ projectError.message }}
      </Message>

      <MoleculeProjectCard
        v-for="(project) in filteredProjects " :key="project.id" :project=project
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
import {Permission} from "../api/generate";
import MoleculeProjectCard from "../components/molecules/MoleculeProjectCard.vue";
import { status_map } from "~/helpers/statusMap";

const refreshStore = useRefreshStore()
const {fetchProjects} = refreshStore
const {getProjectNumber} = storeToRefs(refreshStore)
const first = ref(0)
const selectedStatus = ref(null);
const paginatorSize = computed(()=> window.innerWidth > 1600 ? 20 : 16)
const { t,locale } = useI18n()
// On renomme error pour eviter un conflit avec @nuxt/test-utils/runtime
const {data:data,refresh, status, error: projectError} = await useAsyncData('projects-summary',async ()=> await fetchProjects(first.value, paginatorSize.value),{server:false})

const dashboardRef = ref()
localStorage.setItem('breadcrumbItems', null);
const { $application } = useService();

const roleCreateProject = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_CREATE));

const filteredProjects = computed(() => {
  if (!data.value) return []

  if (!selectedStatus.value) return data.value

  return data.value.filter(
    p => p.status === selectedStatus.value.value
  )
})

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
