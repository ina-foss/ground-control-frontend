<template>
  <div v-if="userHasAnnotationReview" class="flex justify-start gap-2">
    <Avatar
      v-for="(annotation, index) in annotationList" :key="index" v-tooltip.top="annotation.user_email"
      class="avatarClass"
      :label="annotation.user_email.charAt(0).toUpperCase()" shape="circle"
       :style="{
        backgroundColor: getColorForAnnotation(
          annotation.annotation_status,
          annotation.user_email,
          annotation.skipped_by
        ),
      }" @click="$emit('avatar-click', annotation.user_email)" />
  </div>
  <div v-else class="flex justify-start items-center gap-2">
    <div v-if="userAnnotationForCurrentTask" class="flex gap-2 items-center">
      <Avatar
        v-tooltip.top="userAnnotationForCurrentTask.user_email"
        :label="userAnnotationForCurrentTask.user_email.charAt(0).toUpperCase()"
        shape="circle"
        class="avatarClass"
        :style="{
        backgroundColor: getColorForAnnotation(
          userAnnotationForCurrentTask.annotation_status,
          userAnnotationForCurrentTask.user_email,
          userAnnotationForCurrentTask.skipped_by)
      }" />
      <span v-if="annotationListWihtoutLoggedUser?.length"> + </span>
    </div>
    <div v-if="annotationListWihtoutLoggedUser?.length" class="gap-2">
      {{ annotationListWihtoutLoggedUser?.length }}
      <span class="pi pi-user" />
    </div>
  </div>
</template>

<script lang="ts" src="./annotator-visualizer-component"></script>

<style lang="css" scoped>
@reference '../../../assets/css/app.css';

.avatarClass{
  @apply bg-accent text-white! font-medium h-7 w-7;
}

</style>
