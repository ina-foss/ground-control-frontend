<template>
  <div v-if="status == 'pending' && !data" class="items-center h-full">
    <LoadingSpinner style="height: 100%" />
  </div>
  <div v-else class="grid h-full p-3">
    <div
      class="p-3 w-fit h-[70px] ml-auto fixed z-40 right-[-5px] mr-12 flex items-center top-[0px]"
    >
      <label class="text-primary font-semibold p-2">Etapes</label>
      <Select
        v-model="selectedStatus"
        :options="status_map"
        option-label="label"
        class="w-fit items-center h-[33px]"
        placeholder="Statut"
        show-clear
        :pt="{
          root: { style: { padding: '4px' } },
          label: {
            style: {
              padding: '0px',
              paddingLeft: '4px',
              paddingRight: '30px',
              overflow: 'visible',
            },
          },
          dropdown: {
            style: { width: '22px', paddingLeft: '6px', paddingRight: '4px' },
          },
          clearIcon: { style: { width: '12px', marginRight: '-15px' } },
        }"
      />
    </div>
    <div
      class="p-3 ml-auto fixed z-40 right-[-20px] mr-12 top-[70px] flex justify-end"
    >
      <Card
        class="rounded-xl shadow-md bg-white overflow-hidden justify-center h-[33px] cursor-pointer"
        @click="toggleStrategy"
      >
        <template #title class="flex justify-items-center">
          <div
            class="items-center grid transition-all duration-300"
            :style="{
              'grid-template-columns': showStrategy ? 'auto 1fr' : 'auto 0fr',
            }"
          >
            <div class="flex items-center">
              <h2 class="text-xs font-semibold whitespace-nowrap">
                {{ showStrategy ? "Stratégie >" : "< Stratégie" }}
              </h2>
            </div>
            <transition name="fade" style="min-width: 0px; min-height: 0px" class="overflow-hidden ">
              <div
                class="flex items-center gap-x-6 text-[10px] text-grey-600  "
              >
                <div v-if="statusParameters === 'pending'" class="text-grey-400">
                  Chargement...
                </div>

                <div
                  v-else-if="projectParameters"
                  class="flex items-center gap-x-6 line-clamp-1"
                >
                  <div class="flex gap-1 items-center truncate">
                    <span class="font-medium">Redondance</span>
                    <span class="px-1 border border-grey-900 rounded-sm">
                      {{ projectParameters.redundancy }}
                    </span>
                  </div>
                  <div class="flex gap-1 items-center truncate">
                    <span class="font-medium">Coverage des tâches</span>
                    <span class="px-1 border border-gray-900 rounded-sm">
                      {{ projectParameters.completeness_rate }}%
                    </span>
                  </div>
                  <div class="flex gap-1 items-center truncate">
                    <span class="font-medium">Annotation vide</span>
                    <span class="px-1 border border-gray-900 rounded-sm">
                      {{
                        projectParameters.allow_empty_annotation ? "Oui" : "Non"
                      }}
                    </span>
                  </div>
                  <div class="flex gap-1 items-center truncate">
                    <span class="font-medium">Max tâche / personne</span>
                    <span class="px-1 border border-gray-900 rounded-sm">
                      {{ projectParameters.max_tasks_per_person }}
                    </span>
                  </div>
                  <div class="flex gap-1 items-center truncate">
                    <span class="font-medium"
                      >Possibilité d’abandonner une tâche</span
                    >
                    <span class="px-1 border border-gray-900 rounded-sm">
                      {{ projectParameters.allow_skip ? "Oui" : "Non" }}
                    </span>
                  </div>
                </div>

                <div v-else class="text-red-500 text-nowrap">
                  Impossible de charger les paramètres
                </div>
              </div>
            </transition>
          </div>
        </template>
      </Card>
    </div>
    <DataTable
      v-model:expanded-rows="expandedRows"
      class="overflow-scroll-full custom-data-table p-3"
      :context-menu="true"
      :pt="{
        row: {
          class: 'p-3',
          style: { backgroundColor: 'black', color: 'white' },
        },
        style: 'height:88px',
      }"
      :row-hover="true"
      :sort-order="0"
      :value="filteredProjects"
      breakpoint="300px"
      column-resize-mode="fit"
      @cell-edit-complete="onCellEditComplete"
    >
      <template #empty>
        <div
          class="bg-white h-[calc(100vh-300px)] w-full flex flex-col gap-10 items-center justify-center"
        >
          <i class="pi pi-ellipsis-h opacity-30 scale-[1000%]" />
          <h1 class="text-xl font-bold">Ce projet ne comporte aucune etapes</h1>
        </div>
      </template>
      <Column
        field="name"
        header="Titre"
        class="txt"
        style="width: 8rem; min-width: 70px"
        body-class="p-3 "
      >
        <template #body="slotProps">
          <p>{{ slotProps.data.title }}</p>
        </template>
      </Column>
      <Column
        field="id"
        header="ID"
        class="txt"
        style="width: 40px"
        body-class=""
      />
      <Column
        field="annotation_type"
        class="txt"
        header="Type"
        body-class=""
        style="width: 9rem; min-width: 70px"
      />
      <Column
        header="Statut"
        class="txt"
        body-class=""
        style="width: 9rem; min-width: 70px"
      >
        <template #body="slotProps">
          <Tag
            class="mb-1 scale-90"
            style="font-weight: 500"
            :style="{
              color:
                status_map.find((s) => s.value === slotProps.data.status)
                  ?.colorText || '#000',
              backgroundColor:
                status_map.find((s) => s.value === slotProps.data.status)
                  ?.colorBg || '#ccc',
            }"
          >
            {{
              status_map.find((s) => s.value === slotProps.data.status)
                ?.label || slotProps.data.status
            }}
          </Tag>
        </template>
      </Column>
      <Column
        field="description"
        header="Description"
        class="txt"
        body-class=""
      />
      <Column header=" " style="width: 17rem" body-class="">
        <template #body="slotProps">
          <div class="flex min-w-[240px] txt">
            <Button
              style="
                font-size: 14px;
                font-family: Lato, sans-serif;
                font-weight: bold;
                height: 33px;
                padding: 8px 8px;
                border-radius: 4px;
                margin-right: 12px;
              "
              :disabled="slotProps.data.status == StepStatus.ARCHIVED"
              label="Créer une tâche"
              outlined
              @click="stepCreate(slotProps.data.id)"
            />
            <div
              class="flex items-center cursor-pointer txt"
              :loading="loadingExport"
            >
              <Button label="Exporter" iconPos="right" icon="pi pi-chevron-down" outlined @click.capture.stop="clickButtonMenu($event, slotProps.data)" />
              <TieredMenu ref="buttonMenu" :model="buttonItems" :popup="true"  breakpoint="200px" />
            </div>

          </div>
        </template>
      </Column>
      <Column
        :row-editor="true"
        body-style="text-align:center"
        style="width: 5%; min-width: 5rem"
        body-class="text-sm"
      />
      <Column
        id="test"
        expander
        style="width: 5rem"
        class="txt"
        body-class="text-sm p-3"
      />
      <template #expansion="slotProps">
        <div
          class="border-surface-200 shadow-lg table-border-left"
          style="box-shadow: 0 4px 6px rgba(237, 237, 237, 1)"
        >
          <DataTable
            v-model:filters="filters"
            filterDisplay="row"
            :globalFilterFields="['name']"
            :row-class="
              (rowData) =>
                rowData.status === 'draft'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-surface-100 cursor-pointer'
            "
            class="overflow-scroll"
            :value="slotProps.data.tasks"
            :sort-order="0"
            breakpoint="300px"
            column-resize-mode="fit"
            :pt="{
              row: {
                class: 'p-3',
                style: { backgroundColor: 'black', color: 'white' },
              },
              style: { height: '88px', padding: '20px !important' },
            }"
            @row-click="handleRowClick($event)"
          >
            <template #empty>Aucune tâche trouvée.</template>
            <Column
              class="txt"
              body-class="text-sm"
              field="name"
              header="Titre"
              style="width: 8rem; min-width: 70px"
            >
              <template #editor="{ index: nestedIndex }">
                <InputText
                  v-model="data.steps[slotProps.index].tasks[nestedIndex].name"
                  style="width: 100%; min-width: 70px"
                />
              </template>
              <template #body="{ data: nestedData }">
                  <p
                    class="cursor-text"
                    v-tooltip="nestedData.status === 'draft'
                      ? `Soit sûr d'avoir la permission et activer la tâche pour la commencer`
                      : null
                  "
                >
                  {{ nestedData.name }}
                </p>
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  v-model="filterModel.value"
                  type="text"
                  @input="filterCallback()"
                  placeholder="Rechercher par titre ..."
                />
              </template>
            </Column>
            <Column
              field="name"
              header="ID"
              class="txt"
              style="width: 4rem; min-width: fit-content"
              body-class="p-3"
            >
              <template #body="slotProps">
                <p>{{ slotProps.data.id }}</p>
              </template>
            </Column>
            <Column
              class="txt"
              body-class="text-sm"
              field="annotations.length"
              sortable
              style="width: 3rem"
            >
              <template #header
                ><i
                  v-tooltip="'Nombre total annotations'"
                  class="pi pi-star cursor-help"
              /></template>
              <template #body="{ data: nestedData }">
                <div class="flex-1 text-center">
                  {{ nestedData.annotations?.length || 0 }}
                </div>
              </template>
            </Column>
            <Column
              class="txt"
              body-class="text-sm"
              field="predictions.length"
              sortable
              style="width: 3rem"
            >
              <template #header
                ><i
                  v-tooltip="'Nombre annotations remplies'"
                  class="pi pi-star-fill cursor-help"
              /></template>
              <template #body="">
                <div class="flex-1 text-center">{{}}</div>
              </template>
            </Column>
            <Column
              class="txt"
              body-class="text-sm"
              field="predictions.length"
              style="width: 12px"
            >
              <template #header
                ><i
                  v-tooltip="'Nombre de prédictions'"
                  class="pi pi-lightbulb cursor-help"
              /></template>
              <template #body="">
                <div class="flex-1 text-center">{{}}</div>
              </template>
            </Column>
            <Column
              header="Statut"
              class="txt"
              style="width: 100px"
              field="status"
              filterField="status"
              :showFilterMenu="false"
            >
              <template #body="{ data: nestedData }">
                <Tag
                  class="mb-1 scale-90"
                  style="font-weight: 500"
                  :style="{
                    color:
                      status_map.find((s) => s.value === nestedData.status)?.colorText || '#000',
                    backgroundColor:
                      status_map.find((s) => s.value === nestedData.status)?.colorBg || '#ccc',
                  }"
                >
                  {{
                    status_map.find((s) => s.value === nestedData.status)?.label ||
                    nestedData.status
                  }}
                </Tag>
              </template>
              <template #filter="{ filterModel, filterCallback, data }">
                <Dropdown
                  v-model="filterModel.value"
                  :options="statusOptions"
                  :emptyMessage="'Aucune option disponible'"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Toutes"
                  showClear
                  class="w-full"
                  @change="filterCallback()"
                />
              </template>
            </Column>
            <Column
              class="txt"
              body-class="text-sm"
              header="Annotateurs"
              style="width: 12rem"
            >
              <template #body="{ data: nestedData }">
                <div class="flex justify-start gap-2">
                  <Avatar
                    v-for="(annotation, index) in nestedData.annotations.filter(
                      (annotation) =>
                        annotation.annotation_status !=
                        AnnotationStatus.SKIPPED,
                    )"
                    :key="index"
                    v-tooltip.top="annotation.user_email"
                    :label="annotation.user_email.charAt(0).toUpperCase()"
                    shape="circle"
                    style="
                      background-color: #0057ff;
                      color: white;
                      font-weight: 500;
                      height: 24px;
                      width: 24px;
                    "
                    @click="handleRowClick(annotation.user_email)"
                    :style="{
                      backgroundColor: getColorForAnnotation(
                        annotation.annotation_status,
                      ),
                    }"
                  />
                </div>
              </template>
            </Column>
            <Column
              field="name"
              class="txt"
              style="width: 8rem; min-width: 70px"
              body-class="p-3"
            >
              <template #header>
                <span
                  class="flex justify-center items-center gap-1 text-sm font-bold"
                >
                  Création
                  <i
                    class="pi pi-info-circle text-gray-500 cursor-help pt-1"
                    v-tooltip="'Date de création'"
                  ></i>
                </span>
              </template>
              <template #body="slotProps">
                <p>
                  {{
                    slotProps.data.created_at
                      ? new Date(slotProps.data.created_at).toLocaleDateString()
                      : "__"
                  }}
                </p>
              </template>
            </Column>
            <Column
              field="name"
              class="txt"
              style="width: 8rem; min-width: 70px"
              body-class="p-3"
            >
              <template #header>
                <span
                  class="flex justify-center items-center gap-1 text-sm font-bold"
                >
                  Début
                  <i
                    class="pi pi-info-circle text-gray-500 cursor-help pt-1"
                    v-tooltip="'Date début de traitement'"
                  ></i>
                </span>
              </template>
              <template #body="slotProps">
                <p>
                  {{
                    slotProps.data.annotations[0]?.created_at
                      ? new Date(
                          slotProps.data.annotations[0]?.created_at,
                        ).toLocaleDateString()
                      : "__"
                  }}
                </p>
              </template>
            </Column>
            <Column
              field="expiration_date"
              dataType="date"
              style="width: 10rem"
              :showFilterMenu="false"
            >
              <template #header>
                <span
                  class="flex justify-center items-center gap-1 text-sm font-bold"
                >
                  Fin
                  <i
                    class="pi pi-info-circle text-gray-500 cursor-help pt-1"
                    v-tooltip="'Date de fin de traitement'"
                  ></i>
                </span>
              </template>
              <template #body="{ data }">
                <Calendar
                  :modelValue="data.expiration_date && new Date(data.expiration_date)"
                  dateFormat="dd/mm/yy"
                  showIcon
                  :disabled="!roleUpdateExpirationDate || data.status == TaskStatus.ARCHIVED"
                  class="w-full"
                  :invalid="data.expiration_date && new Date(data.expiration_date) < new Date()"
                  @update:modelValue="(value) => onExpirationDateChange(value, data)"
                  :minDate="new Date()"
                />
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                  v-model="filterModel.value"
                  :options="[
                    { label: 'Expirée', value: 'expired' },
                    { label: 'Non expirée', value: 'active' },
                  ]"
                  placeholder="Toutes"
                  optionLabel="label"
                  optionValue="value"
                  showClear
                  @change="filterCallback()"
                  class="w-full"
                />
              </template>
            </Column>

            <Column
              class="txt"
              body-class="text-sm"
              field="instruction"
              header="Instruction"
            >
              <template #body="{ data: nestedData }">
                <AtomMarkdown :content="getFirstLine(nestedData.instruction)" />
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="actions" header="Actions">
              <template #body="{ data: nestedData }">
                <div class="flex items-center gap-2">
                  <div>
                    <Button
                      severity="primary"
                      outlined
                      style="
                        height: 32px;
                        padding: 2;
                        margin: auto;
                        color: #1e90ff;
                      "
                      text
                      rounded
                      title="Consulter la tâche"
                      @click="consultTask(nestedData.id)"
                    >
                      <img
                        src="/icons/icons-svg/icons-svg/view-icon.svg"
                        alt="View Icon"
                        style="
                          height: 30px;
                          width: 20px;
                          filter: brightness(0) saturate(100%) invert(35%)
                            sepia(98%) saturate(2500%) hue-rotate(203deg)
                            brightness(95%) contrast(90%);
                        "
                      />
                    </Button>
                  </div>
                  <div>
                  <Button
                    v-if="roleActivateTask && nestedData.status === 'draft' || nestedData.status === 'skipped'"
                    label="Activer"
                    severity="primary"
                    outlined
                    :disabled="nestedData.status == TaskStatus.ARCHIVED"
                    @click="activateTask(nestedData.id)"
                  />
                  </div>
                  <div>
                    <Button
                      v-if="roleDeleteTask"
                      severity="danger"
                      outlined
                      :disabled="nestedData.status == TaskStatus.ARCHIVED"
                      @click="showDeleteTaskModal(nestedData)"
                      style="
                        height: 22px;
                        padding: 0;
                        margin: auto;
                        color: #0c7da2;
                      "
                      text
                      rounded
                      title="Supprimer la tâche"
                    >
                      <img
                        src="/icons/icons-svg/icons-svg/trash-icon.svg"
                        alt="Trash Icon"
                        style="
                          height: 18px;
                          width: 18px;
                          filter: brightness(0) saturate(100%) invert(48%)
                            sepia(72%) saturate(4640%) hue-rotate(337deg)
                            brightness(98%) contrast(91%);
                        "
                      />
                    </Button>
                  </div>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Dialog
      v-model:visible="deleteModal.visible"
      :header="`Voulez vous supprimer la tâche ${deleteModal.data.name?.slice(0, 17) != deleteModal.data.name ? deleteModal.data.name?.slice(0, 17) + '...' : deleteModal.data.name}  ? `"
      modal
      @hide="hideDeleteTaskModal()"
    >
      <div class="h-fit w-full flex flex-row justify-end gap-2">
        <Button
          label="Annuler"
          severity="secondary"
          text
          @click="hideDeleteTaskModal()"
        />
        <Button
          type="button"
          label="Supprimer"
          severity="danger"
          :loading="deleteModal.loading"
          icon="pi pi-times"
          @click="deleteTask(deleteModal.data.id)"
        />
      </div>
    </Dialog>

    <MoleculeFormTask
      v-if="dialogVisible"
      @refresh-data="refresh()"
      :dialog-visible="dialogVisible"
      :step-object="formStepClick"
      @toggle-dialog="dialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { ref } from "vue";
import {
  AnnotationService,
  AnnotationStatus,
  StepStatus,
  TaskService,
  Permission,
  TaskStatus,
  ProjectService,
  type TaskListDto,
  type TaskWithIdDto,
} from "../../api/generate";
import type {StepDetailDto, AnnotationDto} from '~/api/generate'
import MoleculeFormTask from "~/components/molecules/MoleculeFormTask.vue";
import { FilterMatchMode, FilterService } from "@primevue/core/api";
import AtomMarkdown from "~/components/atoms/AtomMarkdown.vue";
import { status_map, type StatusOption } from "~/helpers/statusMap";

FilterService.register('expirationFilter', (value, filter) => {
  if (!filter) return true;

  const today = new Date();
  if (filter === "active") {
    return !value || new Date(value) >= today;
  }

  if (filter === "expired") {
    return value && new Date(value) < today;
  }

  return true;
});

const route = useRoute();
const refreshStore = useRefreshStore();
const toast = useToast();
const { $application } = useService();
const { fetchTasks } = refreshStore;
const { getTasks } = storeToRefs(refreshStore)
const dialogVisible = ref(false)
const deleteModal = reactive({visible: false, data: {},loading:false})
const clickedRowData = ref(null)
const formStepClick = ref()
const loadingExport = ref(false)
const buttonMenu = ref()
const selectedRow = ref()
const selectedStatus = ref(null);
const showStrategy = ref(false)
const { $handleApiError } = useNuxtApp()
const statusOptions = ref<StatusOption[]>([])
const toggleStrategy = () => {
  showStrategy.value = !showStrategy.value;
};

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  expiration_date: { value: null, matchMode: "expirationFilter" },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));
const roleDeleteTask = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_DELETE),
);
const roleActivateTask = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_ACTIVATE),
);
const roleUpdateExpirationDate = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_UPDATE_EXPIRATION_DATTE),
);
const getFirstLine = (markdownText) => {
  if (!markdownText) return "";
  return markdownText.split("\n")[0];
};
const expandedRows = ref();

const editMode = ref(false);
const { data, refresh, status } = useAsyncData(
  `task_${route.params.id}`,
  async () => await fetchTasks(route.params.id),
);

const { data: projectParameters, status: statusParameters } = useAsyncData(
  `project_${route.params.id}_parameters`,
  async () =>
    await ProjectService.readProjectParametersProjectIdParametersGet(
      Number(route.params.id),
    ),
);
watch(projectParameters, (newVal) => {
  if (newVal && !isEqual(newVal, refreshStore.strategy_parameters)) {
    refreshStore.setParameters(newVal);
  }
});

watch(getTasks, (newTasks) => {
  if (!newTasks) return
  const taskStatuses = newTasks.map(t => t.status)
  const uniqueStatuses = status_map.filter(status =>
    taskStatuses.some(taskStatus => taskStatus == status.value)
  )
  statusOptions.value = uniqueStatuses
}, { immediate: true })

const buttonItems = [
  {
    label: "Exporter au format d'import",
    items: [
      {
        label: "Un seul fichier",
        command: () => {
          exportOut(selectedRow.value, "one");
        },
      },
      {
        label: "Regrouper par tâche",
        command: () => {
          exportOut(selectedRow.value, "task");
        },
      },
      {
        label: "Fichiers séparés",
        command: () => {
          exportOut(selectedRow.value, "all");
        },
      },
    ]
  },
  {
    label: "Export total",
    items: [
      {
        label: "Un seul fichier",
        command: () => {
          exportOut(selectedRow.value, "one","dump");
        },
      },
      {
        label: "Regrouper par tâche",
        command: () => {
          exportOut(selectedRow.value, "task","dump");
        },
      },
      {
        label: "Fichiers séparés",
        command: () => {
          exportOut(selectedRow.value, "all","dump");
        },
      },
    ]
  },
];

const showDeleteTaskModal = (rowData) => {
  deleteModal.loading = false;
  deleteModal.visible = true;
  deleteModal.data = rowData;
};

const activateTask = (task_id) => {
  TaskService.updateTaskStatusTaskTaskIdStatusPost(
    task_id,
    TaskStatus.PENDING,
  ).then(() => refresh());
};

const hideDeleteTaskModal = () => {
  deleteModal.visible = false;
  deleteModal.data = {};
};

const deleteTask = (task_id) => {
  deleteModal.loading = true;
  TaskService.deleteTaskTaskTaskIdDelete(task_id)
    .then(() => refresh())
    .then(() => hideDeleteTaskModal());
};

// Filtrer les projets en fonction du statut sélectionné
const filteredProjects = computed(() => {
  if (!selectedStatus.value) return data.value.steps; // Si aucun statut n'est sélectionné, retourne toutes les étapes
  return data.value.steps.filter(
    (step) => step.status === selectedStatus.value.value,
  ); // Filtre les étapes en fonction du statut
});

// On affiche meme si c'es pas fini
function getColorForAnnotation(annotation_status) {
  if (annotation_status === AnnotationStatus.DONE) {
    return "#ACE1AF";
  } else return "#0057FF";
}

const clickButtonMenu = (event, step) => {
  selectedRow.value = step;
  buttonMenu.value.toggle(event);
};

const exportOut = async (step: StepDetailDto , group : 'task' | 'all' | 'one', mode? : 'dump' | "importLike" = "importLike" )   => {
  const tasks = step.tasks;
  loadingExport.value = true;
  const annos = {};
  for (const task of tasks) {
    try {
      // Fetch annotation data
      const annotations =
        await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(
          task.id,
          "",
          "out",
        );
      if (annotations.length > 0) {
        if (group == "task") triggerDownload(annotations, task.name,mode);
        else if (group == "all")
          annotations.forEach((annotation) =>
            triggerDownload(
              annotation,
              task.name + " by " + annotation.user_email.split("@")[0],
              mode
            ),
          );
        else if (group == "one") annos[task.name] = annotations;
      }
    } catch (error) {
      console.error("Error downloading file for task", task.id, error);
      throw new Error(error.body.raw_message);
    }
  }
  if (group == "one") triggerDownload(annos, step.title,mode);
  loadingExport.value = false;
};

function triggerDownload(data: AnnotationDto, name: string, mode: 'dump'|'importLike') {
  let output : AnnotationDto | Record<string,any> = data
  if(mode == 'importLike' && data.result ){
      output = data.result
  }
  const annotationsBlob = new Blob([JSON.stringify(output)], {
    type: "application/json",
  });

  // Create a download link
  const url = window.URL.createObjectURL(annotationsBlob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download =  name.concat('.json');

  // Ensure filename is not null or empty
  if (link.download) {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.add({
      severity: "success",
      summary: "Export done",
      detail: ` Your file "${link.download}" has been downloaded`,
      life: 5000,
    });
  }

  // Clean up
  window.URL.revokeObjectURL(url);
}

const navigateToTask = (id: number, email?: string, mode: 'edit' | 'read' = 'edit') => {

  navigateTo({
    path: `/tasks/${id}`,
    query: {
      email: email,
      project_id: route.params.id,
      mode:mode
    },
  });
};


const stepCreate = (stepId) => {
  formStepClick.value = _.find(data.value.steps, ["id", stepId], 0);

  dialogVisible.value = true;
};

let email_clicked: string | undefined;
const handleRowClick = (event : string | {originalEvent: MouseEvent , data: TaskWithIdDto } ) => {
  // callback when the event is triggered by Avatar in the task List
  if (typeof event == "string" && isAdmin.value){
    email_clicked = event;
    return
  }
  // callback when the event is triggered by the Task
  if (event.data?.status === "draft") return;
  clickedRowData.value = event.data;
  if (editMode.value === false)
    navigateToTask(clickedRowData.value.id, email_clicked,
    (clickedRowData.value.status === TaskStatus.DONE ||
    clickedRowData.value.status === TaskStatus.SKIPPED ||
    clickedRowData.value.status === TaskStatus.ARCHIVED)
    ? 'read' : 'edit');
    email_clicked = undefined
};

const onCellEditComplete = () => {
  editMode.value = false;
};

const onExpirationDateChange = async (value: Date, row: any) => {
  const oldValue = row.expiration_date;
  row.expiration_date = value.toISOString().split("T")[0];
  try {
    await TaskService.updateDataTaskTaskTaskIdPatch(row.id, {
      expiration_date: row.expiration_date,
    });
  } catch (err: any) {
    console.error("❌ Error updating expiration date:", err)
    $handleApiError(err)
    row.expiration_date = oldValue
  }
}

const consultTask = (annotation_id: number) => {
  navigateToTask(annotation_id, email_clicked, 'read');
};

</script>
<style scoped>
.table-border-left {
  border-left: 8px solid #006180;
}
.overflow-scroll {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.overflow-scroll-full {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

:deep(.p-card-body) {
  gap: 0 !important;
}
</style>
