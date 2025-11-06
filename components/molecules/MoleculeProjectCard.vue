<template>
  <div
    class="w-full max-w-screen max-h-[190px] px-3 py-1 rounded-md transition-all"
    :class="{
      'cursor-pointer hover:shadow-xl hover:scale-105 bg-white': isClickable,
      'cursor-not-allowed bg-[#A6A6A640]': !isClickable
     }"
    @click="handleCardClick"
  >
    <div>
      <div class="min-h-[75%] max-h-full">
        <div class="flex justify-between align-middle pl-2">
          <p class="font-bold text-3xl self-center">
            {{ formatTitle(project.title) }}
          </p>
          <p class="h-[66px] w-[24px] flex flex-col items-center gap-2">
            <Button
              style="height: 18px; width: 18px; color: #0c7da2"
              class="mt-3"
              icon="pi pi-ellipsis-h"
              severity="secondary"
              text
              rounded
              :disabled="visibleActions.length === 0"
              @click.stop.prevent="toggleMenu"
            />
            <OverlayPanel
              ref="menu"
              appendTo="body"
              class="p-2 shadow-md rounded-xl"
            >
              <div class="flex flex-col gap-2 text-sm">
                <Button
                  v-for="action in visibleActions"
                  :key="action.label"
                  :label="action.label"
                  text
                  @click.stop.prevent="action.handler(project.id)"
                />
              </div>
            </OverlayPanel>
            <Button
              v-if="roleDeleteProject"
              style="height: 22px; padding: 0 0 0 0; margin: 0; color: #0c7da2"
              severity="error-state"
              text
              rounded
              @click.stop.prevent="deleteDialog = true"
            >
              <img
                style="
                  height: 18px;
                  width: 18px;
                  filter: brightness(0) saturate(100%) invert(48%) sepia(72%)
                    saturate(4640%) hue-rotate(337deg) brightness(98%)
                    contrast(91%);
                "
                src="../../public/icons/icons-svg/icons-svg/trash-icon.svg"
                alt="Trash Icon"
              />
            </Button>
            <Dialog
              v-model:visible="deleteDialog"
              modal
              header="Êtes-vous sûr de vouloir supprimer ce projet ?"
              :style="{ width: '31rem' }"
              class="bg-white pb-0"
              :pt="{
                header: {
                  style: { color: '#212529' },
                  class: 'flex justify-between items-center p-3',
                },
                content: {
                  class: 'p-3',
                },
              }"
            >
              <div class="flex justify-end pb-0">
                <Button
                  label="Non"
                  class="!bg-[#ffffff] !text-primary button button-prev mr-3"
                  size="small"
                  @click="deleteDialog = false"
                />
                <Button
                  class="button"
                  size="small"
                  label="Oui"
                  @click="deleteProject"
                />
              </div>
            </Dialog>
            <MoleculeFormProject
              v-if="visible"
              :dialog-visible="visible"
              :project="$props.project"
              @toggle-dialog="visible = false"
            />
          </p>
        </div>
        <div
          class="flex justify-between justify-items-stretch pl-2 pt-1 items-center text-sm"
        >
          <div
            class="flex justify-between items-center justify-items-stretch gap-3"
          >
            <span class="font-bold">
              <span style="color: #0057ff" class="mr-2"
                >{{ project.steps.length }} </span
              ><i class="pi pi-list-check"
            /></span>
            <Tag class="mb-1 scale-90"
              :class="`tag-${project.status}`"
              :style="{
                color: status_map[project.status]?.colorText || '#000',
                backgroundColor: status_map[project.status]?.colorBg || '#ccc'
              }">{{status_map[project.status]?.label || project.status}}</Tag>
          </div>
        </div>
        <div
          class="text-sm px-2 py-3 text-slate-500"
          style="color: #757575; font-size: 12px"
        >
          {{
            project.description.charAt(0).toUpperCase() +
            project.description.slice(1)
          }}
        </div>
        <div v-if="(!project.tasks_to_annotate || project.tasks_to_annotate.length === 0) && !isAdmin" class="no-task-message pl-2 bg-white">
          <span class="status-circle"></span>
          <div>
            <p class="font-bold">Aucune tâche en attente</p>
            <p>De nouvelles tâches vous seront bientôt attribuées.</p>
          </div>
      </div>
      </div>
      <Divider :pt="{ root:{ style: 'margin-top : 0px; margin-bottom: 0px' } }" />
      <div
        class="bottom-0 w-full flex justify-between pl-2 py-2 text-gray-400"
        style="font-size: 12px"
      >
        <p
          v-if="project.created_at != null"
          class="self-center font-medium"
          style="color: #212529"
        >
          {{ $application.formatDate(project.created_at) }}
        </p>
        <Avatar
          v-tooltip.left="project.created_by"
          :label="project.created_by.charAt(0).toUpperCase()"
          shape="circle"
          style="
            background-color: #0057ff;
            color: white;
            font-weight: 500;
            height: 22px;
            width: 22px;
          "
        />
      </div>
    </div>
    <Dialog
      v-model:visible="finishDialog"
      modal
      :style="{ width: '31rem' }"
      class="bg-white pb-0"
      :pt="{
        header: {
          style: { color: '#212529' },
          class: 'flex justify-between items-center p-3',
        },
        content: {
          class: 'p-3',
        },
      }"
    >
      <template #header>
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold text-[#212529]">
            Êtes-vous sûr de vouloir terminer ce projet ?
          </h3>
        </div>
      </template>
      <div class="m-2 text-sm">
        <Message severity="warn" :icon="false" class="mt-2">
          {{ progressedTasks.length }} tâches<span
            v-if="progressedTasks.length > 1"
            >s</span
          >
          en cours
        </Message>
      </div>
      <div class="flex justify-end items-center pb-0 space-x-4">
        <Button
          label="Non"
          class="!bg-[#ffffff] !text-primary button button-prev mr-3"
          size="small"
          @click="finishDialog = false"
        />
        <Button
          class="button"
          size="small"
          label="Oui"
          @click="finishProject"
        />
      </div>
    </Dialog>
    <Dialog
      v-model:visible="archiveDialog"
      modal
      :style="{ width: '31rem' }"
      class="bg-white pb-0"
      :pt="{
        header: {
          style: { color: '#212529' },
          class: 'flex justify-between items-center p-3',
        },
        content: {
          class: 'p-3',
        },
      }"
    >
      <template #header>
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold text-[#212529]">
            Êtes-vous sûr de vouloir archiver ce projet ?
          </h3>
        </div>
      </template>
      <div class="m-2 text-sm">
        <Message severity="warn" :icon="false" class="mt-2">
          {{ progressedTasks.length }} tâches<span
            v-if="progressedTasks.length > 1"
            >s</span
          >
          en cours
        </Message>
      </div>
      <div class="flex justify-end items-center pb-0 space-x-4">
        <Button
          label="Non"
          class="!bg-[#ffffff] !text-primary button button-prev mr-3"
          size="small"
          @click="archiveDialog = false"
        />
        <Button
          class="button"
          size="small"
          label="Oui"
          @click="archiveProject"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import MoleculeFormProject from "./MoleculeFormProject.vue";
import { useService } from "#imports";
import { ProjectService } from "../api/generate";
import { Permission, ProjectStatus } from "~/api/generate";

const menu = ref();
const visible = ref(false);
const deleteDialog = ref(false);
const finishDialog = ref(false);
const archiveDialog = ref(false);
const { setMode } = useOptions();
const { project } = defineProps({
  project: { type: Object, default: () => {} },
});

const refresh = inject("refreshProject");

const { $application } = useService();

const roleDeleteProject = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PROJECT_DELETE),
);
const rolefinishProject = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PROJECT_FINISH),
);
const roleArchiveProject = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ARCHIVE),
);
const roleUnarchiveProject = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PROJECT_UNARCHIVE),
);
const roleUpdateProject = computed(() =>
  $application.hasRole(Permission.GROUND_CONTROL_PROJECT),
);
const isAdmin = computed(() => $application.hasRole("GC_ADMIN"));
const linkTarget = computed(() => {
  if (isAdmin.value) {
    return { name: 'projects-id', params: { id: project.id } }
  } else if (project.tasks_to_annotate?.length && !isAdmin.value) {
    return { name: 'tasks-id', params: { id: project?.tasks_to_annotate[0].id } }
  }
  return null
})
const isClickable = computed(() => !!linkTarget.value)
const handleCardClick = () => {
  if (!linkTarget.value) return

  if (isAdmin.value) {
    navigateTo({
      name: linkTarget.value.name,
      params: linkTarget.value.params
    })
  } else {
    navigateTo({
      name: linkTarget.value.name,
      params: linkTarget.value.params,
      query: {
        project_id: project.id
      }
    })
    setMode('edit')
  }
}

const { $handleApiError } = useNuxtApp();

const status_map = {
  draft:       { label: "Brouillon", colorText: "#FFF", colorBg:"#757575" },
  pending:     { label: "En attente", colorText: "#000", colorBg:"#FFE4B1"  },
  "in-progress": { label: "En cours", colorText: "#000", colorBg:"#F9D621"  },
  done:        { label: "Terminé", colorText: "#000", colorBg:"#9ADC82"  },
  skipped:     { label: "Abondonné", colorText: "#FFF", colorBg:"#EF4444"  },
  archived:    { label: "Archivé", colorText: "#000", colorBg:"#B3DDF4"  },
};

const formatTitle = (title) => {
  if (title) {
    if (title.includes("-")) {
      title = title.replace("-", " ");
    }
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
};
defineEmits(["refreshData"]);

const deleteProject = async () => {
  try {
    await ProjectService.deleteProjectProjectProjectIdDelete(project.id);
    await refresh();
    deleteDialog.value = false;
  } catch (err) {
    console.error("Error deleting project:", err);
    $handleApiError(err);
  }
};

const finishProject = async () => {
  try {
    await ProjectService.finishProjectProjectIdFinishPost(project.id);
    await refresh();
  } catch (err) {
    console.error("Error finishing project:", err);
    $handleApiError(err);
  } finally {
    finishDialog.value = false;
  }
};

const archiveProject = async () => {
  try {
    await ProjectService.archiveProjectProjectIdArchivePost(project.id);
    await refresh();
  } catch (err) {
    console.error("Error archiving project:", err);
    $handleApiError(err);
  } finally {
    archiveDialog.value = false;
  }
};

const unarchiveProject = async () => {
  try {
    await ProjectService.unarchiveProjectProjectIdUnarchivePost(project.id);
    await refresh();
  } catch (err) {
    console.error("Error archiving project:", err);
    $handleApiError(err);
  }
};

const { data: progressedTasks } = useAsyncData(
  `project_${project.id}_progressed_tasks`,
  async () =>
    await ProjectService.getProgressedTasksForProjectProjectIdProgressedTasksPost(
      Number(project.id),
    ),
);

const toggleMenu = (event) => {
  menu.value.toggle(event);
};

const actions = computed(() => [
  {
    label: "Modifier",
    condition: project.status !== ProjectStatus.DONE && project.status !== ProjectStatus.ARCHIVED && roleUpdateProject.value,
    handler: () => {
      visible.value = true;
      menu.value.hide();
    },
  },
  {
    label: "Archiver",
    condition: project.status !== ProjectStatus.DONE && project.status !== ProjectStatus.ARCHIVED && roleArchiveProject.value  ,
    handler: () => {
      archiveDialog.value = true;
      menu.value.hide();
    },
  },
  {
    label: "Terminer",
    condition: project.status !== ProjectStatus.DONE && project.status !== ProjectStatus.ARCHIVED && rolefinishProject.value,
    handler: () => {
      finishDialog.value = true;
      menu.value.hide();
    },
  },
    {
    label: "Désarchiver",
    condition: project.status == ProjectStatus.ARCHIVED && roleUnarchiveProject.value,
    handler: async() => {
      await unarchiveProject()
      menu.value.hide();
    },
  }
]);
const visibleActions = computed(() => actions.value.filter((a) => a.condition));
</script>
<style>
.custom-icon-color .pi {
  color: #212529;
}

.status-circle {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 100px;
  border: 3px solid rgba(255, 119, 102, 0.5);
  background: rgba(255, 119, 102, 0.3);
  margin-right: 8px;
  vertical-align: middle;
}

.no-task-message {
  color: #333;
  font-size: 12px;
  display: flex;
  align-items: center;
}

</style>
