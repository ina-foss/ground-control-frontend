import { Status, type AnnotationDto } from '~/api/generate';

export default defineComponent({
  name: 'AnnotatorVisualizer',
  emits: ['avatar-click'],
  props: {
    userHasAnnotationReview: { type: Boolean, default: () => false },
    annotationList: Array<AnnotationDto>,
  },

  setup(props,{emit}) {
    const { userEmail } = storeToRefs(useAuth());
    const { userHasAnnotationReview, annotationList } = toRefs(props);

    function getColorForAnnotation(
      annotation_status: Status,
      annotated_by: string | null = null,
      skipped_by: string| null = null,
    ) {
      if (skipped_by && annotated_by && annotated_by === skipped_by) {
        return '#E53935';
      }
      if (annotation_status === Status.DONE) {
        return '#ACE1AF';
      }
      return '#0057FF';
    }


    const annotationListWihtoutLoggedUser = computed(() => {
      return annotationList.value?.filter(
        (annotation) => annotation.user_email != userEmail.value,
      );
    });

    const userAnnotationForCurrentTask = computed(() => {
      return annotationList.value?.find(
        (annotation) => annotation.user_email == userEmail.value,
      );
    });

    return {
      emit,
      getColorForAnnotation,
      userHasAnnotationReview,
      userAnnotationForCurrentTask,
      annotationList,
      annotationListWihtoutLoggedUser,
    };
  },
});
