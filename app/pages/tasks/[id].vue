<template>
  <div class="h-full">
    <OrganismAnnotation
      :data="data"
      :all-fetched="allFetched"
      :annotations-in="annotations_in"
      :annotations-out="annotations_out"
      @skip-annotation="handleSubmit($event, 'skip')"
      @submit-annotation="handleSubmit($event, 'submit')"
      @finish-annotation="handleSubmit($event, 'end')"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  AnnotationService,
  Status as AnnotationStatus,
  Permission,
  ProjectService,
  Status as TaskStatus,
} from "~/api/generate";
import { useAuth } from "~/stores/auth";
import { storeToRefs } from "pinia";
import OrganismAnnotation from "~/components/organisms/annotation/OrganismAnnotation.vue";

const refresh = useRefreshStore();
const route = useRoute();
const toast = useToast();
const authStore = useAuth();
const { mode } = useOptions();
const { $application } = useService();
const { $handleApiError } = useNuxtApp();
const { getData,  } = storeToRefs(refresh);
const { userEmail } = storeToRefs(authStore);
const { fetchAnnotations } = refresh;
let timeAnnotationStart;
const data = ref(getData);
const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));

watchEffect(() => {
  useHead({
    title: `${getData.value.name} - Ground Control | INA`,
  });
});

onBeforeRouteLeave((to, from, next) => {
  if (window.onbeforeunload != null) {
    const answer = window.confirm(
      "Vous n'avez pas sauvegarder votre travail. Voulez-vous quitter cette page ?",
    );
    if (answer) {
      window.onbeforeunload = null;
      next();
    }
  } else next();
});

const { data: project } = await useAsyncData(
  `project_${route.params.id}`,
  async () => await fetchAnnotations(route.params.id),
);

const { data: dataProject, execute: loadProject } = useLazyAsyncData(
  `project_${route.query.project_id}`,
  async () => {
    const project = await ProjectService.readProjectProjectProjectIdGet(
      route.query.project_id,
    );
    return project;
  },
  {
    server: false,
  },
);

const annotation_bool = reactive({
  in: false,
  out: false,
});

const { data: annotations_in, status: status_in } = useLazyAsyncData(
  `annotations_in_${project.value.id}`,
  async () =>
    await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(
      data.value.id,
      "",
      "in",
    ),
  {
    server: false,
  },
);

const {
  data: annotations_out,
  status: pending_out,
  refresh: refresh_out,
} = useAsyncData(
  'annotation_out',
  async () =>
    await AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(
      data.value.id,
      route.query.email
        ? route.query.email
        : userEmail.value,
      "out",
    ),
  {
    server: false,
  },
);

const pluginStore = usePluginStore();

// Holds the status of the plugin fetch
const pluginFetched = ref(false);

if (!pluginFetched.value) {
  (async () => {
    try {
      if (data.value.step.annotation_type !== "transcription") {
        await pluginStore.updatePluginList(
          data.value.step_id,
          data.value.step.annotation_type,
        );
      }
      await pluginStore.initialFetch();
      pluginFetched.value = true;
    } catch (error) {
      console.error(error);
      pluginFetched.value = false;
    }
  })();
}

const allFetched = computed(() => {
  return (
    status_in.value != "pending" &&
    (pending_out.value != "pending" || annotations_out.value) &&
    pluginFetched.value
  );
});

const annotationInfo = computed(() => {
  let info = null;
  if (annotations_out.value) {
    annotations_out.value.forEach((annotation, index) => {
      if (
        annotation.user_email == userEmail.value ||
        annotation.user_email == route.query.email
      ) {
        info = {
          index: index,
          id: annotation.id,
          status: annotation.annotation_status,
          email: annotation.user_email,
        };
      }
    });
  }

  return info;
});

const submitExistantAnnotation = (locals, action, timeSpent, options) => {
  const result = annotations_out.value[0].result;
  result.data.localisation[0].sublocalisations.localisation = locals;
  result.data.timeSpent = result.data.timeSpent
    ? result.data.timeSpent + timeSpent
    : timeSpent;
  // L'utilisateur a déjà une annotation associée à cette tâche
  let promise;
  if (action === "submit") {
    refresh_out()
    promise =
      AnnotationService.updateAnnotationResultAnnotationAnnotationIdPatch(
        annotationInfo.value.id,
        annotations_out.value[annotationInfo.value.index].result,
      );
  } else {
    promise =
      AnnotationService.finishAnnotationAnnotationFinishAnnotationIdPatch(
        annotationInfo.value.id,
        annotations_out.value[annotationInfo.value.index].result,
      );
  }
  promise
    .then(async () => {
      if (options.showToast) {
        toast.add({
          severity: "info",
          summary:
            action === "submit"
              ? options?.message ?? "Cette annotation a été mise à jour"
              : "Cette annotation est terminée",
          life: 4000,
        });
        if (annotations_out.value[annotationInfo.value.index].annotation_status === AnnotationStatus.SKIPPED) {
          toast.add({
            severity: "warn",
            summary:"Cette tâche a été abandonnée par un autre utilisateur. Vous pouvez toujours continuer à annoter si vous le souhaitez.",
            life: 6000,
          });
        }
        await loadProject();
      }
      if (action === "end") {
        if (!isAdmin.value && !dataProject.value?.tasks_to_annotate) {
          toast.add({
            severity: "info",
            summary: "Merci pour votre travail !",
            detail:
              "Aucune tâche en attente. \nDe nouvelles tâches vous seront bientôt attribuées.",
            life: 5000,
          });
        }
        isAdmin.value ? setTimeout(() => {
          window.location.reload();
        }, 1000): navigateTo({
          path: "/dashboard",
        }) ;
      }
    })
    .then(() => {
      window.onbeforeunload = null;
    })
    .then(() => {
      AnnotationService.getAnnotationByTaskIdAnnotationsTaskIdGet(
        data.value.id,
        userEmail.value,
        "out",
      )
        .then((res) => (annotations_out.value = res))
        .then(() => (annotation_bool.out = true));
    })
    .then(() => {
      window.onbeforeunload = null;
    })
    .then(() => {
      refresh_out();

    });
};

const submitNewAnnotation = (locals, action, timeSpent, options) => {
  const result = JSON.parse(JSON.stringify(annotations_in.value[0].result));
  result.data.localisation[0].sublocalisations.localisation = locals;
  result.data.timeSpent = timeSpent;
  AnnotationService.createAnnotationAnnotationPost({
    annotation: {
      user_email: userEmail.value,
      task_id: data.value.id,
      result: result,
      annotation_status:
        action === "submit"
          ? AnnotationStatus.IN_PROGRESS
          : AnnotationStatus.DONE,
      version: 1,
    },
    association: {
      annotation_id: 0,
      task_id: data.value.id,
      direction: "out",
    },
  })
    .then(() => {
      refresh_out();
    })
    .then(() => {
      window.onbeforeunload = null;
    })
    .then(async () => {
      if (options.showToast) {
        toast.add({
          severity: "info",
          summary:
            action === "submit"
              ? "Annotation créée"
              : "Annotation créée et terminée",
          life: 5000,
        });
        await loadProject();
      }
      if (action === "end") {
        if (!isAdmin.value && !dataProject.value?.tasks_to_annotate) {
          toast.add({
            severity: "info",
            summary: "Merci pour votre travail !",
            detail:
              "Aucune tâche en attente. \nDe nouvelles tâches vous seront bientôt attribuées.",
            life: 5000,
          });
        }
        isAdmin.value ? setTimeout(() => {
          window.location.reload();
        }, 1000): navigateTo({
          path: "/dashboard",
        }) ;
      }
    });
};

onMounted(() => {
  timeAnnotationStart = new Date().getTime();
});

const handleSubmit = async (event, action) => {
  const locals = JSON.parse(JSON.stringify(event.locals));

  const timeAnnotationEnd = new Date().getTime();

  const timeSpentOnScreen = (timeAnnotationEnd - timeAnnotationStart) / 1000;

  timeAnnotationStart = timeAnnotationEnd;
  if (action === "skip") {
    try {
      const annotationId = annotationInfo.value?.id;
      await AnnotationService.skipAnnotationAnnotationSkipAnnotationIdPatch(
        annotationId,
      );
      if (event.options?.showToast) {
        toast.add({
          severity: "info",
          summary: "Cette annotation a été abandonnée",
          life: 4000,
        });
      }
      isAdmin.value ? navigateTo({
        path: `/projects/${route.query.project_id}`,
      }) : navigateTo({
        path: "/dashboard",
      })
    } catch (error) {
      console.error("Failed to skip annotation:", error);
      $handleApiError(error);
    }
    return;
  }

  if (
    mode != "read" &&
    data.value.status != TaskStatus.ARCHIVED &&
    data.value.status != TaskStatus.SKIPPED
  ) {
    if (annotationInfo.value != null) {
      submitExistantAnnotation(
        locals,
        action,
        timeSpentOnScreen,
        event.options,
      );
    } else {
      submitNewAnnotation(locals, action, timeSpentOnScreen, event.options);
    }
  }
};
</script>
<style scoped>
.p-toast-detail {
  white-space: pre-line;
}
</style>
