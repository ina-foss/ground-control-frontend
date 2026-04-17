<template>
  <div v-if="status == 'pending' && !data" class="items-center h-full">
    <LoadingSpinner style="height: 100%" />
  </div>
  <div v-else class="grid h-full p-3">
    <div
      class="p-3 w-fit h-[70px] ml-auto fixed z-40 right-[-5px] mr-12 flex items-center top-[0px]"
    >
      <label class="text-primary font-semibold p-2">{{t('steps.title')}}</label>
      <Select
        v-model="selectedStatus"
        :options="status_map"
        option-label="label"
        class="w-fit items-center h-[33px]"
        :placeholder="t('steps.statusPlaceholder')"
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
                {{ showStrategy ? t('strategy.show') : t('strategy.hide') }}
              </h2>
            </div>
            <transition
              name="fade"
              style="min-width: 0px; min-height: 0px"
              class="overflow-hidden"
            >
              <div class="flex items-center gap-x-6 text-[10px] text-grey-600">
                <div
                  v-if="statusParameters === 'pending'"
                  class="text-grey-400"
                >
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
      data-key="id"
      @cell-edit-complete="onCellEditComplete"
      @row-click="onRowClick"
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
          <div class="flex txt">
            <Button
              v-if="slotProps.data.plugins?.length > 0 && roleReadPlugins"
              icon="pi pi-list"
              outlined
              v-tooltip="t('task.seeConfigurations')"
              class="mr-1"
              style="color: #0B7698; border-color: #0B7698;"
              @click.stop="togglePluginsPopover($event, slotProps.data)"
            />
            <Button
              v-if="roleCreatePlugin"
              class="text-sm font-bold mr-1"
              :label="t('task.addconfig')"
              outlined
              style="color: #0B7698 !important;
              border-color: #0B7698 !important;
              white-space: nowrap;"
              @click="createConfig(slotProps.data.id)"
            />
            <Button
              class="text-sm font-bold mr-1"
              :disabled="slotProps.data.status == Status.ARCHIVED"
              :label="t('task.createTask')"
              outlined
              style="color: #0B7698 !important;
              border-color: #0B7698 !important;
              white-space: nowrap;"
              @click="stepCreate(slotProps.data.id)"
            />
            <div
              class="flex items-center cursor-pointer txt"
              :loading="loadingExport"
            >
              <Button
style="color: #0B7698 !important;
  border-color: #0B7698 !important;" :label="t('task.export')" icon-pos="right" icon="pi pi-chevron-down" outlined @click.capture.stop="clickButtonMenu($event, slotProps.data)" />
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
            filter-display="row"
            :global-filter-fields="['name']"
            :row-class="
              (rowData) =>
                rowData.status === Status.DRAFT
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
                  v-tooltip="
                    nestedData.status === Status.DRAFT
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
                  placeholder="Rechercher par titre ..."
                  @input="filterCallback()"
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
              filter-field="status"
              :show-filter-menu="false"
            >
              <template #body="{ data: nestedData }">
                <Tag
                  class="mb-1 scale-90"
                  style="font-weight: 500"
                  :style="{
                    color:
                      status_map.find((s) => s.value === nestedData.status)
                        ?.colorText || '#000',
                    backgroundColor:
                      status_map.find((s) => s.value === nestedData.status)
                        ?.colorBg || '#ccc',
                  }"
                >
                  {{
                    status_map.find((s) => s.value === nestedData.status)
                      ?.label || nestedData.status
                  }}
                </Tag>
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                  v-model="filterModel.value"
                  :options="statusOptions"
                  :empty-message="'Aucune option disponible'"
                  option-label="label"
                  option-value="value"
                  placeholder="Toutes"
                  show-clear
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
                <AnnotatorVisualizer :userHasAnnotationReview="isTaskReviewer" :annotationList="nestedData.annotations" @avatar-click="event=> email_clicked = event "   />
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
                    v-tooltip="'Date de création'"
                    class="pi pi-info-circle text-gray-500 cursor-help"
                  />
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
                    v-tooltip="'Date début de traitement'"
                    class="pi pi-info-circle text-gray-500 cursor-help"
                  />
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
              data-type="date"
              style="width: 10rem"
              :show-filter-menu="false"
            >
              <template #header>
                <span
                  class="flex justify-center items-center gap-1 text-sm font-bold"
                >
                  Fin
                  <i
                    v-tooltip="'Date de fin de traitement'"
                    class="pi pi-info-circle text-gray-500 cursor-help"
                  />
                </span>
              </template>
              <template #body="{ data }">
                <Calendar
                  :modelValue="
                    data.expiration_date && new Date(data.expiration_date)
                  "
                  dateFormat="dd/mm/yy"
                  showIcon
                  :disabled="
                    !roleUpdateExpirationDate ||
                    data.status == Status.ARCHIVED
                  "
                  class="w-full"
                  :invalid="data.expiration_date && new Date(data.expiration_date) < new Date()"
                  :min-date="new Date()"
                  @update:model-value="(value) => onExpirationDateChange(value, data)"
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
                  option-label="label"
                  option-value="value"
                  show-clear
                  class="w-full"
                  @change="filterCallback()"
                />
              </template>
            </Column>
            <Column
              class="txt"
              body-class="text-sm"
              field="instruction"
              header="Instructions"
            >
              <template #body="{ data: nestedData }">
                <div
                    v-if="nestedData.instruction"
                    v-tooltip="t('steps.tasks.seeInstructions')"
                    class="hover:bg-hover/25 rounded-full w-8.5 h-8.5 flex justify-center"
                    @click.stop="toggleInstructionPopover($event,nestedData)"
                >
                  <img
                    src="/icons/icons-svg/icons-svg/list-icon-atom.svg"
                    alt="instruction icon"
                    style="
                      height: 30px;
                      width: 20px;"
                  />
                </div>
              </template>
            </Column>
            <Column class="txt" body-class="text-sm" field="voir" header="Voir">
              <template #body="{ data: nestedData }">
                <Button
                  severity="primary"
                  outlined
                  style="height: 32px; padding: 0; margin: auto; color: #1e90ff"
                  text
                  rounded
                  title="Consulter la tâche"
                  @click="consultTask(nestedData.id)"
                >
                  <img
                    src="/icons/icons-svg/icons-svg/view-icon.svg"
                    alt="View Icon"
                    style="height: 30px;
                    width: 20px;"
                    />
                </Button>
              </template>
            </Column>
            <Column
              field="activation"
              class="txt"
              body-class="text-sm !p-0"
              v-if="roleActivateTask"
              :showFilterMenu="false"
            >
              <template #header>
                <div
                  class="flex justify-center items-center gap-1 text-sm font-bold w-full"
                >
                  Activation
                  <i
                    class="pi pi-info-circle text-gray-500 cursor-help"
                    v-tooltip="t('task.tooltip.eligibilityInfo')"
                  />
                </div>
              </template>
              <template #filter>
                <div class="flex justify-center items-center gap-2 w-full">
                  <span
                    v-tooltip="
                      !filteredTasks.some(
                        (task) =>
                          task.status === Status.DRAFT ||
                          task.status === Status.SKIPPED,
                      )
                        ? t('task.tooltip.noEligibleActivate')
                        : null
                    "
                  >
                    <Button
                      :label="t('task.activateAll')"
                      icon="pi pi-check"
                      size="small"
                      outlined
                      class="whitespace-nowrap"
                      :severity="
                        !filteredTasks.some(
                          (task) =>
                            task.status === Status.DRAFT ||
                            task.status === Status.SKIPPED,
                        )
                          ? 'secondary'
                          : 'primary'
                      "
                      :style="
                        !filteredTasks.some(
                          (task) =>
                            task.status === Status.DRAFT ||
                            task.status === Status.SKIPPED,
                        )
                          ? {}
                          : {color: '#0B7698', borderColor: '#0B7698'}
                      "
                      @click="activateTasks(true)"
                    />
                  </span>
                  <span
                    v-tooltip="
                      !filteredTasks?.some(
                        (task) => task.status === Status.PENDING,
                      )
                        ? t('task.tooltip.noEligibleDeactivate')
                        : null
                    "
                  >
                    <Button
                      :label="t('task.desactivateAll')"
                      icon="pi pi-times"
                      size="small"
                      class="whitespace-nowrap"
                      outlined
                      :severity="
                        !filteredTasks?.some(
                          (task) => task.status === Status.PENDING,
                        )
                          ? 'secondary'
                          : 'primary'
                      "
                      :style="
                        !filteredTasks?.some(
                          (task) => task.status === Status.PENDING,
                        )
                          ? {}
                          : { color: '#0B7698', borderColor: '#0B7698' }
                      "
                      @click="activateTasks(false)"
                    />
                  </span>
                </div>
              </template>
              <template #body="{ data }">
                <div
                  v-if="data.status !== Status.DONE && data.status !== Status.ARCHIVED && data.status !== Status.IN_PROGRESS"
                  class="flex justify-center w-full"
                >
                  <InputSwitch
                    :model-value="
                      data.status !== Status.DRAFT &&
                      data.status !== Status.SKIPPED
                    "
                    @click="activateTask(data)"
                  />
                </div>
              </template>
            </Column>
            <Column v-if="roleDeleteTask" bodyClass="!p-0" class="txt">
              <template #body="{ data: nestedData }">
                <Button
                  severity="danger"
                  outlined
                  :disabled="nestedData.status == Status.ARCHIVED"
                  @click="showDeleteTaskModal(nestedData)"
                  style="height: 22px; padding: 0; margin: auto; color: #0c7da2"
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
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <MoleculeDialogConfirm
      v-model:visible="deleteModal.visible"
      :title="`Voulez vous supprimer la tâche ${deleteModal.data.name?.slice(0, 17) != deleteModal.data.name ? deleteModal.data.name?.slice(0, 17) + '...' : deleteModal.data.name}  ? `"
      :cancel-button="{
        label: t('actions.cancel'),
        severity: 'secondary',
        variant: 'text'
      }"
      :confirm-button="{
        label: t('actions.delete'),
        icon: 'pi pi-times',
        severity: 'danger',
      }"
      @confirm="deleteTask(deleteModal.data.id)"
    />

    <Popover ref="instructionPopover">
        <ScrollPanel class=" min-h-fit h-100 w-100" >
          <AtomMarkdown :content="instructionData" />
        </ScrollPanel>
    </Popover>


    <MoleculeFormTask
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :step-object="formStepClick"
      @refresh-data="refresh()"
      @toggle-dialog="dialogVisible = false"
    />
    <MoleculeDialogConfigPlugin
      v-if="selectedStepId && showDialogConfig"
      v-model:visible="showDialogConfig"
      :step-id="selectedStepId"
      :plugin-id="editingPluginId"
      :initial-json="editingPluginInitialJson"
      :title="editingPluginId ? t('plugin.edit.title') : t('task.addconfig')"
      @select="onFilesSelected"
      @plugin-created="refresh"
    />
    <MoleculeDialogConfirm
      v-model:visible="showDeletePluginConfirm"
      :title="t('plugin.delete.title')"
      :message="t('plugin.delete.confirm', { name: pluginToDelete?.display_config?.label || pluginToDelete?.name || '' })"
      :cancel-button="{ label: t('actions.cancel'), severity: 'secondary', variant: 'text' }"
      :confirm-button="{ label: t('actions.delete'), icon: 'pi pi-trash', severity: 'danger' }"
      @confirm="deletePlugin"
    />
    <Popover ref="pluginsPopover">
      <div class="min-w-64 max-w-xs">
        <ul class="flex flex-col divide-y divide-gray-100">
          <li
            v-for="plugin in currentPopoverStep?.plugins"
            :key="plugin.id"
            class="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="pi pi-tag text-gray-400 text-xs flex-shrink-0" />
              <span class="text-sm font-medium truncate">
                {{ plugin.display_config?.label || plugin.name }}
              </span>
              <Tag :value="plugin.type" severity="secondary" class="!text-[10px] flex-shrink-0" />
            </div>
            <div class="flex gap-0.5 flex-shrink-0">
              <Button
                v-if="roleCreatePlugin"
                icon="pi pi-pencil"
                text
                size="small"
                severity="secondary"
                v-tooltip="t('actions.edit')"
                @click="editPlugin(plugin)"
              />
              <Button
                v-if="roleCreatePlugin"
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                v-tooltip="t('actions.delete')"
                @click="confirmDeletePlugin(plugin)"
              />
            </div>
          </li>
        </ul>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { ref } from "vue";
import MoleculeFormTask from "~/components/molecules/MoleculeFormTask.vue";
import MoleculeDialogConfigPlugin from "~/components/molecules/moleculeDialogConfigPlugin/MoleculeDialogConfigPlugin.vue";
import { FilterMatchMode, FilterService } from "@primevue/core/api";
import AtomMarkdown from "~/components/atoms/AtomMarkdown.vue";
import { useI18n } from '#imports';
import { Project, Permission } from "~/api/generate";
import {Status, Task, type TaskWithIdDto, Plugin } from "~/api/generate/index.js";
import {useStatusMap} from "~/helpers/statusMap"

const { t } = useI18n()
const localePath = useLocalePath()

FilterService.register("expirationFilter", (value, filter) => {
  if (!filter) return true

  const today = new Date()
  if (filter === "active") {
    return !value || new Date(value) >= today
  }

  if (filter === "expired") {
    return value && new Date(value) < today
  }

  return true;
});

const status_map = useStatusMap();
const route = useRoute();
const refreshStore = useRefreshStore();
const toast = useToast();
const instructionPopover = ref();
let instructionData = "";
const { $application } = useService();
const { fetchTasks } = refreshStore;
const { getTasks } = storeToRefs(refreshStore)
const dialogVisible = ref(false)
const showDialogConfig = ref(false)
const deleteModal = reactive({ visible: false, data: {}, loading: false })
const clickedRowData = ref(null)
const formStepClick = ref()
const loadingExport = ref(false)
const buttonMenu = ref()
const selectedRow = ref()
const selectedStatus = ref(null)
const showStrategy = ref(false)
const { $handleApiError } = useNuxtApp()
const statusOptions = ref<StatusOption[]>([])
const selectedStepId = ref<number | null>(null)
const pluginsPopover = ref()
const currentPopoverStep = ref<any>(null)
const editingPluginId = ref<number | null>(null)
const editingPluginInitialJson = ref<Record<string, any> | null>(null)
const showDeletePluginConfirm = ref(false)
const pluginToDelete = ref<any>(null)
const toggleStrategy = () => {
  showStrategy.value = !showStrategy.value
}

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  expiration_date: { value: null, matchMode: "expirationFilter" },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));
const isTaskReviewer = computed(()=> $application.hasRole(Permission.GROUND_CONTROL_ANNOTATION_REVIEW))

const roleDeleteTask = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_DELETE),
)
const roleActivateTask = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_ACTIVATE),
)
const roleUpdateExpirationDate = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_TASK_UPDATE_EXPIRATION_DATTE),
)
const roleCreatePlugin = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PLUGIN_CREATE),
)
const roleReadPlugins = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PLUGIN_READ_ALL),
)
const getFirstLine = (markdownText) => {
  if (!markdownText) return "";
  return markdownText.split("\n")[0];
};
const expandedRows = ref<any[]>([])

function  toggleInstructionPopover(event, data){
  instructionPopover.value.toggle(event)
  instructionData = data.instruction
}
const onRowClick = ({ data }) => {
  if(expandedRows.value.length===0)
  {
    const id = data.id
    expandedRows.value = {
      ...expandedRows.value,
      [id]: !expandedRows.value?.[id]
    }
  }
  else {
    expandedRows.value= []
  }
}

const editMode = ref(false)
const { data, refresh, status } = useAsyncData(
  `task_${route.params.id}`,
  async () => await fetchTasks(route.params.id),
)

const { data: projectParameters, status: statusParameters } = useAsyncData(
  `project_${route.params.id}_parameters`,
  async () =>
    await Project.readProjectParametersProjectIdParametersGet({
      path:{
        project_id: Number(route.params.id)
      }
    }),
);
watch(projectParameters, (newVal) => {
  if (newVal && !_.isEqual(newVal, refreshStore.strategy_parameters)) {
    refreshStore.setParameters(newVal)
  }
})

watch(
  getTasks,
  (newTasks) => {
    if (!newTasks) return
    const taskStatuses = newTasks.map((t) => t.status)
    const uniqueStatuses = status_map.filter((status) =>
      taskStatuses.some((taskStatus) => taskStatus == status.value),
    )
    statusOptions.value = uniqueStatuses
  },
  { immediate: true },
)

const filteredTasks = computed(() => {
  if (!getTasks.value) return []

  const statusFilter = filters.value.status?.value
  const tasks = statusFilter
    ? getTasks.value.filter((task) => task.status === statusFilter)
    : getTasks.value
  return tasks
})

const buttonItems = [
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
  {
    label: "Export au format d'import",
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
  }
]

const showDeleteTaskModal = (rowData) => {
  deleteModal.loading = false
  deleteModal.visible = true
  deleteModal.data = rowData
}

const activateTask = (task: TaskWithIdDto) => {
Task.updateTaskStatusTaskTaskIdStatusPost({
    path: {
      task_id: task.id
    },
    query:{
      status: Status.IN_PROGRESS
    }

  })
    .then(() => refresh());
};

const activateTasks = (activate = true) => {
  const selectedTaskStatus = filters.value?.status?.value ?? null
  const tasksToUpdate = selectedTaskStatus
    ? getTasks.value?.filter(
        (task) => !selectedTaskStatus || task.status === selectedTaskStatus,
      )
    : activate
      ? getTasks.value?.filter(
          (task) =>
            task.status === Status.DRAFT ||
            task.status === Status.SKIPPED,
        )
      : getTasks.value?.filter((task) => task.status === Status.PENDING)

  const tasks_id = tasksToUpdate.map((task) => task.id)
  const new_status = activate ? Status.PENDING : Status.DRAFT

  Task.updateTaskStatusTaskTaskIdStatusPost({
    path: { task_id, new_status }
  })
    .then(() => {
      const count  = tasks_id.length
      refresh()
      const actionLabel = activate
        ? t("task.activation")
        : t("task.deactivation")
      const tasksLabel = t(`task.${activate ? "activated" : "deactivated"}`, { count })
      const summaryLabel = t("task.eligible", count, { count })

      toast.add({
        severity: "info",
        summary: t("task.actionDoneFor", {
          action: actionLabel,
          summary: summaryLabel
        }),
        detail: `${tasksLabel} : ${tasks_id.join(" - ")}`,
        life: 4000,
        })
      })
    .catch((err) => {
      console.error("❌ Error updating expiration date:", err)
      $handleApiError(err)
    })
}

const hideDeleteTaskModal = () => {
  deleteModal.visible = false
  deleteModal.data = {}
}

const deleteTask = (task_id: number) => {
  deleteModal.loading = true;
  Task.deleteTaskTaskTaskIdDelete({
    path: { task_id }
  })
    .then(() => refresh())
    .then(() => hideDeleteTaskModal())
}

// Filtrer les projets en fonction du statut sélectionné
const filteredProjects = computed(() => {
  if (!selectedStatus.value) return data.value.steps // Si aucun statut n'est sélectionné, retourne toutes les étapes
  return data.value.steps.filter(
    (step) => step.status === selectedStatus.value.value,
  ) // Filtre les étapes en fonction du statut
})

// On affiche meme si c'es pas fini
function getColorForAnnotation(annotation_status,annotated_by = null,skipped_by = null) {
  if (skipped_by && annotated_by && annotated_by === skipped_by) {
    return "#E53935";
  }
  if (annotation_status === Status.DONE) {
    return "#ACE1AF";
  }
  return "#0057FF";
}

const clickButtonMenu = (event, step) => {
  selectedRow.value = step
  buttonMenu.value.toggle(event)
}

const exportOut = async (step: StepDetailDto , group : 'task' | 'all' | 'one', mode? : 'dump' | "importLike" = "importLike" )   => {
  const tasks = step.tasks;
  loadingExport.value = true;
  const annos = {};
  for (const task of tasks) {
    try {
      // Fetch annotation data
      const annotations =
        await Annotation.getAnnotationByTaskIdAnnotationsTaskIdGet({
          path: { task_id: task.id },
          query: {
            user_email: "",
            direction: "out"
          }
        });
      if (annotations.length > 0) {
        if (group == "task") triggerDownload(annotations, task.name,mode);
        else if (group == "all")
          annotations.forEach((annotation) =>
            triggerDownload(
              annotation,
              task.name + " by " + annotation.user_email.split("@")[0],
              mode
            ),
          )
        else if (group == "one") annos[task.name] = annotations
      }
    } catch (error) {
      console.error("Error downloading file for task", task.id, error)
      throw new Error(error.body.raw_message)
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
  })

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
      summary: t('toast.exportDone.summary'),
      detail: t('toast.exportDone.detail', { file: a.download }),
      life: 5000,
    })
  }

  // Clean up
  window.URL.revokeObjectURL(url)
}

const navigateToTask = (
  id: number,
  mode: "edit" | "read" = "edit",
  email?: string | null
) => {
  navigateTo({
    path: localePath(`/tasks/${id}`),
    query: {
      email: email,
      project_id: route.params.id,
      mode: mode,
    },
  })
}

const stepCreate = (stepId) => {
  formStepClick.value = _.find(data.value.steps, ["id", stepId], 0)

  dialogVisible.value = true
}

const createConfig = (stepId) => {
  editingPluginId.value = null
  editingPluginInitialJson.value = null
  selectedStepId.value = stepId
  showDialogConfig.value = true
}

function togglePluginsPopover(event: any, stepData: any) {
  currentPopoverStep.value = stepData
  pluginsPopover.value.toggle(event)
}

function editPlugin(plugin: any) {
  pluginsPopover.value.hide()
  editingPluginId.value = plugin.id
  editingPluginInitialJson.value = _.cloneDeep(plugin)
  selectedStepId.value = currentPopoverStep.value?.id
  showDialogConfig.value = true
}

function confirmDeletePlugin(plugin: any) {
  pluginToDelete.value = plugin
  showDeletePluginConfirm.value = true
}

async function deletePlugin() {
  if (!pluginToDelete.value) return
  try {
    await Plugin.deletePluginPluginPluginIdDelete({ path: { plugin_id: pluginToDelete.value.id } })
    pluginsPopover.value.hide()
    refresh()
  }
  catch (error: any) {
    $handleApiError(error)
  }
  finally {
    pluginToDelete.value = null
  }
}

const onFilesSelected = (files: File[]) => {
  if (!selectedStepId.value) return
}

let email_clicked: string | undefined;
const handleRowClick = (event : string | {originalEvent: MouseEvent , data: TaskWithIdDto } ) => {
  // callback when the event is triggered by the Task
  if (event.data?.status === "draft") return;
  clickedRowData.value = event.data;
  if (editMode.value === false)
    navigateToTask(clickedRowData.value.id,
    (clickedRowData.value.status === Status.DONE ||
    clickedRowData.value.status === Status.SKIPPED ||
    clickedRowData.value.status === Status.ARCHIVED)
    ? 'read' : 'edit',
      email_clicked,);
    email_clicked = undefined
};

const onCellEditComplete = () => {
  editMode.value = false
}

const onExpirationDateChange = async (value: Date, row: any) => {
  const oldValue = row.expiration_date
  row.expiration_date = value.toISOString().split("T")[0]
  try {
    await Task.updateDataTaskTaskTaskIdPatch({
      path: {
        task_id: row.id
      },
      body: {
        expiration_date: row.expiration_date
      }
    });
  } catch (err: any) {
    console.error("❌ Error updating expiration date:", err)
    $handleApiError(err)
    row.expiration_date = oldValue
  }
}

const consultTask = (annotation_id: number) => {
  navigateToTask(annotation_id, email_clicked, "read")
}
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
:deep(.p-datatable-tbody > tr){
  cursor:pointer;
}

</style>
