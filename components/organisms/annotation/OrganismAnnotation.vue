<template>
  <div
    v-if="isAnnotationEditable"
       class=" right-12 mr-4 absolute flex items-center top-[0px] h-[70px] z-[5]" >
    <Button  v-if="allow_skip" class="mr-4 text-xs" :label="t('actions.skip')"
      variant="text"
      icon="pi pi-ban"
      @click="handleSkip({})"
      />
    <Button  class="mr-4" outlined :label="t('actions.save')"
    @click="handleSubmit({})"/>
    <Button class="button-overwrite"
            :label="t('actions.finish')"
      @click="handleFinish()"
    />
  </div>
    <div v-if=" !allFetched " class="grid grid-cols-10 h-0 min-h-full  " >
      <div :class="[' h-full pl-5 gap-3', panelSize ]">
        <Skeleton
        :pt="{
          root: {
             style: 'height: auto'
          }
        }"  class="aspect-video !rounded-t-lg !rounded-b-none"/>
        <Skeleton class="m-3" height="3rem" width="70%" />
        <Skeleton height="500px" />
      </div>
      <div class=" p-4 flex flex-row w-full gap-5 justify-center col-span-5  ">
        <Skeleton  height="100%" width="28px" />
      <div class=" flex flex-col w-fit gap-5 !justify-center overflow-auto h-0 min-h-full">
          <Skeleton height="90px" width="700px" />
          <Skeleton height="100px" width="700px"/>
          <Skeleton height="70px"  width="700px"/>
          <Skeleton height="150px" width="700px"/>
          <Skeleton height="75px" width="700px"/>
          <Skeleton height="90px" width="700px" />
          <Skeleton height="100px" width="700px"/>
          <Skeleton height="70px"  width="700px"/>
          <Skeleton height="75px" width="700px"/>
        </div>
      </div>
    <div class="col-span-3 h-full w-full ">
      <div class="w-[300px] flex flex-col gap-3">
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="110px" />
      </div>
    </div>
    </div>
  <div v-else class="h-full">
    <AtomSearch class=" right-10 absolute flex items-center top-[80px] z-[5]" :list="listRefs"  @find-element="handleFocusElement" @unselect="handleSelection" />
    <div class="xs:grid xs:grid-cols-10 flex flex-col h-full gap-5 relative">
      <MoleculeAnnotationLeftPanel :class="layout.left" ref="moleculeAnnotationLeftPanelRef" :panel-size="panelSize" :video-src="videoSrc" :media_params="data.media?.player_parameters" :locals="sortBy(annotationsIn[0]?.result.data.localisation[0].sublocalisations.localisation,(el)=>unixToTimestamp(el.tcin))" @scroll-to-segment="handleVideoTimelineClick">
      </MoleculeAnnotationLeftPanel>
      <div :class="[layout.center, 'h-full min-h-0 flex']">
        <Suspense>
        <component :is="annotationComponent.component" v-bind="annotationComponent.props" ref="moleculeAnnotationRef"  :state="annotationsOut[annotationInfo?.index]?.annotation_status" v-on="annotationComponent.events" />
        <template #fallback>
          <SpanSkeleton/>
        </template>
      </Suspense>
      </div>
    </div>
  </div>
</template>

<script src="./organism-annotation-component.ts"></script>

<style>
.button-overwrite:hover {
  background-color: #0C7DA2 !important;
  border-color: #0C7DA2 !important;
}

.p-tooltip,.p-tooltip .p-tooltip-text {
  padding: 6px 8px !important;
}

.p-tooltip-right .p-tooltip-arrow,.p-tooltip-left .p-tooltip-arrow {
  padding: 0px 2.5px !important;
}
.p-tooltip-top .p-tooltip-arrow {
  padding: 1.5px 0px !important;
}

</style>
