<template>
  <!-- Action Buttons -->
  <div
    v-if="isAnnotationEditable"
    class="right-12 mr-4 absolute flex items-center top-[0px] h-[70px] z-[5]"
  >
    <Button
      v-if="allow_skip"
      class="mr-4 text-xs"
      :label="t('actions.abandon')"
      variant="text"
      icon="pi pi-ban"
      @click.stop="abondanDialog = true"
    />
    <Button
      class="mr-4"
      outlined
      :label="t('actions.save')"
      @click="handleSubmit({})"
    />
    <Button
      class="button-overwrite"
      :label="t('actions.finish')"
      @click.stop="finishDialog = true"
    />
  </div>
  <div v-if="!allFetched" class="grid grid-cols-10 min-h-full">
    <div :class="['h-full pl-5 gap-3', panelSize]">
      <Skeleton
        class="aspect-video !rounded-t-lg !rounded-b-none"
        :pt="{ root: { style: 'height: auto' } }"
      />
      <Skeleton class="m-3" height="3rem" width="70%" />
      <Skeleton height="500px" />
    </div>
    <div class="col-span-5 flex justify-center gap-5 p-4">
      <Skeleton height="100%" width="28px" />
      <div class="flex min-h-full flex-col gap-5 overflow-auto">
        <Skeleton
          v-for="(h, i) in [90, 100, 70, 150, 75, 90, 100, 70, 75]"
          :key="i"
          :height="`${h}px`"
          width="700px"
        />
      </div>
    </div>
    <div class="col-span-3 h-full w-full">
      <div class="w-[300px] flex flex-col gap-3">
        <Skeleton v-for="n in 3" :key="n" height="50px" />
        <Skeleton height="110px" />
      </div>
    </div>
  </div>
  <div v-else class="h-full">
    <AtomSearch
      class="right-10 absolute flex items-center top-[80px] z-[5]"
      :list="listRefs"
      @find-element="handleFocusElement"
      @unselect="handleSelection"
    />

    <div class="xs:grid xs:grid-cols-10 flex h-full flex-col gap-5">
      <MoleculeAnnotationLeftPanel
        ref="moleculeAnnotationLeftPanelRef"
        :class="layout.left"
        :panel-size="panelSize"
        :video-src="videoSrc"
        :media_params="data.media?.player_parameters"
        :locals="
          sortBy(
            annotationsIn[0]?.result.data.localisation[0].sublocalisations
              .localisation,
            (el) => unixToTimestamp(el?.tcin),
          )
        "
        @scroll-to-segment="handleVideoTimelineClick"
      />
      <div :class="[layout.center, 'h-full min-h-0 flex']">
        <Suspense>
          <component
            :is="annotationComponent.component"
            ref="moleculeAnnotationRef"
            v-bind="annotationComponent.props"
            :state="annotationsOut[annotationInfo?.index]?.annotation_status"
            v-on="annotationComponent.events"
          />

          <template #fallback>
            <SpanSkeleton />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
  <MoleculeDialogConfirm
    v-model:visible="abondanDialog"
    :title="t('annotation.dialogs.abandon.title')"
    :withExclamation="true"
    :message="t('annotation.dialogs.abandon.message')"
    :cancelButton="{
      label: t('actions.cancel'),
      icon: 'pi pi-times',
      severity: 'primary',
      outlined: true,
    }"
    :confirmButton="{
      label: t('actions.confirm'),
      icon: 'pi pi-check',
      severity: 'primary',
    }"
    @confirm="handleSkip({})"
  >
    <template #description>
      {{ $t("annotation.dialogs.abandon.description_part1") }}
      <strong>
        {{ $t("annotation.dialogs.abandon.description_status") }}
      </strong>
      {{ $t("annotation.dialogs.abandon.description_part2") }}
      <u>
        {{ $t("annotation.dialogs.abandon.description_role") }}
      </u>
    </template>
  </MoleculeDialogConfirm>
  <MoleculeDialogConfirm
    v-model:visible="finishDialog"
    :title="t('annotation.dialogs.finish.title')"
    :withExclamation="true"
    :message="t('annotation.dialogs.finish.message')"
    :cancelButton="{
      label: t('actions.cancel'),
      icon: 'pi pi-times',
      severity: 'primary',
      outlined: true,
    }"
    :confirmButton="{
      label: t('actions.confirm'),
      icon: 'pi pi-check',
      severity: 'primary',
    }"
    @confirm="handleFinish"
  >
    <template #description>
      {{ $t("annotation.dialogs.finish.description_part1") }}
      <strong>
        {{ $t("annotation.dialogs.finish.description_status") }}
      </strong>
      {{ $t("annotation.dialogs.finish.description_part2") }}
    </template>
  </MoleculeDialogConfirm>
</template>

<script src="./organism-annotation-component.ts"></script>

<style>
.button-overwrite:hover {
  background-color: #0c7da2 !important;
  border-color: #0c7da2 !important;
}

.p-tooltip,
.p-tooltip .p-tooltip-text {
  padding: 6px 8px !important;
}

.p-tooltip-right .p-tooltip-arrow,
.p-tooltip-left .p-tooltip-arrow {
  padding: 0 2.5px !important;
}

.p-tooltip-top .p-tooltip-arrow {
  padding: 1.5px 0 !important;
}
</style>
