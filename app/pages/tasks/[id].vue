<template>
  <div class="h-full">
    <OrganismAnnotation
      :data="data"
      :all-fetched="allFetched"
      :annotations-in="annotationsNormalized.in"
      :annotations-out="annotationsNormalized.out"
      @skip-annotation="handleSubmit($event, 'skip')"
      @submit-annotation="handleSubmit($event, 'submit')"
      @finish-annotation="handleSubmit($event, 'end')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import _ from 'lodash'
import { useAuth } from "~/stores/auth";
import { storeToRefs } from "pinia";
import OrganismAnnotation from "~/components/organisms/annotation/OrganismAnnotation.vue";
import { Annotation } from "~/api/generate/"
import {getHandler, patchDataBeforeSaving} from "~/composables/useAnnotationTypeRegistry"

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


function normalizeAnnotation(result: any){
  return {...result, data : Array.isArray(result.data)? result.data : [result.data] }
}

const annotationsNormalized = computed(()=>{
  return {
    "in": annotations_in.value?.map(ano =>({...ano, result: normalizeAnnotation(ano.result) })),
    "out": annotations_out.value?.map(ano=>({...ano, result: normalizeAnnotation(ano.result) }))
  }
})

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
    const project = await Project.readProjectProjectProjectIdGet({
      path:{
        project_id : route.query.project_id,
      }
    });
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
    await Annotation.getAnnotationByTaskIdAnnotationsTaskIdGet({
      path: {
        task_id: data.value.id
      },
      query: {
        direction: "in"
      }
    }),
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
    await Annotation.getAnnotationByTaskIdAnnotationsTaskIdGet({
      path: {
        task_id: data.value.id
      },
      query: {
        user_email: route.query.email || userEmail.value,
        direction: "out"
      }
    }),
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
      pluginFetched.value = true;
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
  const annotation = annotations_out.value?.find(
    (a) => a.user_email == userEmail.value || a.user_email == route.query.email
  );

  if (!annotation) return null;

  const index = annotations_out.value!.indexOf(annotation);
  return {
    index,
    id: annotation.id,
    status: annotation.annotation_status,
    email: annotation.user_email,
  };
});


const submitExistantAnnotation = (action, timeSpent, options) => {
  const result = _.cloneDeep(annotationsNormalized.value.in[0].result)
  const patchedResult = {...result, data: patchDataBeforeSaving(result.data,data.value.step.annotation_type,timeSpent)}

  // L'utilisateur a déjà une annotation associée à cette tâche
  let promise;
  if (action === "submit") {
    refresh_out()
    promise =
      Annotation.updateAnnotationResultAnnotationAnnotationIdPatch({
        path: {
          annotation_id: annotationInfo.value?.id
        },
        body: patchedResult,
      }
      );
  } else {
    promise =
      Annotation.finishAnnotationAnnotationFinishAnnotationIdPatch({
        path: {
          annotation_id: annotationInfo.value?.id
        },
        body: patchedResult,
      }
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
        if (annotations_out.value[annotationInfo.value.index].annotation_status === Status.SKIPPED) {
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
      Annotation.getAnnotationByTaskIdAnnotationsTaskIdGet({
        path: {
          task_id: data.value.id
        },
        query: {
          user_email: userEmail.value,
          direction: "out"
        }
      })
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

const submitNewAnnotation = (action, timeSpent, options) => {
  const result = _.cloneDeep(annotationsNormalized.value.in[0].result)

  const patchedResult = {...result, data: patchDataBeforeSaving(result.data,data.value.step.annotation_type,timeSpent)}

  Annotation.createAnnotationAnnotationPost({
    body:{
      annotation: {
        user_email: userEmail.value,
        task_id: data.value.id,
        result: patchedResult,
        annotation_status:
          action === "submit"
            ? Status.IN_PROGRESS
            : Status.DONE,
        version: 1,
      },
      association: {
        annotation_id: 0,
        task_id: data.value.id,
        direction: "out",
      }
    }
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
  const timeAnnotationEnd = new Date().getTime();

  const timeSpentOnScreen = (timeAnnotationEnd - timeAnnotationStart) / 1000;

  timeAnnotationStart = timeAnnotationEnd;
  if (action === "skip") {
    try {
      const annotationId = annotationInfo.value?.id;
      await Annotation.skipAnnotationAnnotationSkipAnnotationIdPatch(
        {
          path:{
            annotation_id : annotationId
          }
        }
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
    data.value.status != Status.ARCHIVED &&
    data.value.status != Status.SKIPPED
  ) {
    if (annotationInfo.value != null) {
      submitExistantAnnotation(
        action,
        timeSpentOnScreen,
        event.options,
      );
    } else {
      submitNewAnnotation(action, timeSpentOnScreen, event.options);
    }
  }
};
</script>
<style scoped>
.p-toast-detail {
  white-space: pre-line;
}
</style>
