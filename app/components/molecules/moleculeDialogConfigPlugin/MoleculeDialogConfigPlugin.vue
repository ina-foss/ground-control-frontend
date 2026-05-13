<template>
  <Dialog
    :visible="visible"
    modal
    :closable="true"
    class="config-plugin-dialog rounded-lg"
    :style="{ width: '92vw', maxWidth: '88rem', height: '88vh' }"
    :content-style="{ padding: '0', display: 'flex', flexDirection: 'column', minHeight: 0 }"
    @update:visible="$emit('update:visible', $event)"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0B7698]/10 text-[#0B7698] flex-shrink-0"
        >
          <span :class="['pi text-lg', pluginId ? 'pi-pencil' : 'pi-cog']" />
        </div>
        <div class="flex flex-col min-w-0">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-surface-100 leading-tight truncate">
            {{ title }}
          </h3>
          <span class="text-xs text-gray-500 dark:text-surface-400">
            {{ pluginId ? t('plugin.dialog.subtitleEdit') : t('plugin.dialog.subtitleCreate') }}
          </span>
        </div>
      </div>
    </template>

    <!-- Body -->
    <div class="flex flex-col flex-1 min-h-0 px-6 pb-4">
      <Tabs v-model:value="activeTab" class="flex flex-col flex-1 min-h-0">
        <TabList>
          <Tab value="upload">
            <span class="inline-flex items-center gap-2">
              <span class="pi pi-cloud-upload" />
              {{ t('plugin.tab.upload') }}
            </span>
          </Tab>
          <Tab value="manual">
            <span class="inline-flex items-center gap-2">
              <span class="pi pi-code" />
              {{ t('plugin.tab.manualConfig') }}
            </span>
          </Tab>
        </TabList>

        <TabPanels class="flex-1 min-h-0 !p-0">

          <!-- ─── Onglet Upload ────────────────────────────────────── -->
          <TabPanel value="upload" class="h-full">
            <div class="flex flex-col gap-4 h-full pt-4">
              <div class="flex items-start gap-2 rounded-md border border-blue-100 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm text-blue-900 dark:text-blue-200">
                <span class="pi pi-info-circle mt-0.5 flex-shrink-0" />
                <span>{{ t('plugin.dialog.uploadHint') }}</span>
              </div>

              <FileUpload
                ref="templateRef"
                :choose-label="t('actions.upload')"
                :multiple="false"
                accept="application/json"
                :show-upload-button="false"
                :show-cancel-button="false"
                invalid-file-type-message="Type invalide"
                name="file[]"
                :disabled="isUploadEnabled"
                @select="onSelect"
                @error="onSelect"
                :pt="{
                  root: { class: 'flex-1 min-h-0 flex flex-col border border-dashed border-gray-300 dark:border-surface-700 rounded-md bg-[#fafafa] dark:bg-surface-900' },
                  buttonbar: {
                    class: 'border-b border-gray-200 dark:border-surface-700 bg-gray-50 dark:bg-surface-800',
                    style: 'z-index:20; padding:12px 16px;'
                  },
                  content: { class: 'flex-1 min-h-0 overflow-auto' },
                  chooseButton: {
                    style: `
                      font-size: 14px;
                      font-family: Lato,sans-serif;
                      font-weight: bold;
                      height: 36px;
                      padding: 8px 14px;
                      border-radius: 6px;
                      color: #FFFFFF;
                      background-color: #0B7698;
                      white-space: nowrap;
                      cursor: ${isUploadEnabled ? 'not-allowed' : 'pointer'};
                    `,
                    props: {
                      title: isUploadEnabled ? t('task.uploadLimit') : ''
                    }
                  }
                }"
              >
                <!-- Empty state -->
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div class="flex items-center justify-center w-16 h-16 rounded-full bg-[#0B7698]/10 text-[#0B7698] mb-4">
                      <span class="pi pi-file-arrow-up text-3xl" />
                    </div>
                    <p class="text-sm font-medium text-gray-700 dark:text-surface-200">
                      {{ t('task.uploadConfig') }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-surface-500 mt-1">
                      {{ t('plugin.dialog.acceptedFormat') }}
                    </p>
                  </div>
                </template>

                <!-- File list -->
                <template #content="{ files, removeFileCallback }">
                  <div class="flex flex-col gap-2 p-4">
                    <div
                      v-for="(file, index) in files"
                      :key="index"
                      class="flex items-center gap-3 px-3 py-2.5 rounded-md border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-[#0B7698]/40 transition-colors"
                    >
                      <div class="flex items-center justify-center w-9 h-9 rounded-md bg-[#0B7698]/10 text-[#0B7698] flex-shrink-0">
                        <span class="pi pi-file" />
                      </div>
                      <div class="flex flex-col min-w-0 flex-1">
                        <p
                          v-tooltip.top="file.name"
                          class="text-sm font-medium text-gray-800 dark:text-surface-100 truncate"
                        >
                          {{ file.name }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-surface-500">
                          {{ formatSize(file.size) }}
                        </p>
                      </div>
                      <Button
                        icon="pi pi-times"
                        text
                        rounded
                        size="small"
                        severity="danger"
                        v-tooltip="t('actions.delete')"
                        @click="removeFile(index, removeFileCallback)"
                      />
                    </div>
                  </div>
                </template>
              </FileUpload>

              <!-- Footer -->
              <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-surface-700">
                <Button
                  :label="t('actions.cancel')"
                  text
                  severity="secondary"
                  class="!mt-3"
                  @click="$emit('update:visible', false)"
                />
                <Button
                  :label="t('actions.configure')"
                  icon="pi pi-check"
                  severity="primary"
                  class="!mt-3"
                  :disabled="!isUploadEnabled"
                  @click="onConfigureFromUpload"
                />
              </div>
            </div>
          </TabPanel>

          <!-- ─── Onglet Configuration manuelle ───────────────────── -->
          <TabPanel value="manual" class="h-full">
            <div class="flex flex-col gap-3 h-full pt-4">
              <div class="flex items-start gap-2 rounded-md border border-amber-100 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
                <span class="pi pi-info-circle mt-0.5 flex-shrink-0" />
                <span>{{ t('plugin.dialog.manualHint') }}</span>
              </div>

              <div class="flex-1 min-h-0 border border-gray-200 dark:border-surface-700 rounded-md overflow-hidden bg-white dark:bg-surface-900">
                <ScrollPanel style="height: 100%; width: 100%">
                  <div class="p-3">
                    <MoleculePluginJsonEditor v-model="editorJson" />
                  </div>
                </ScrollPanel>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-surface-700">
                <Button
                  :label="t('actions.cancel')"
                  text
                  severity="secondary"
                  class="!mt-3"
                  @click="$emit('update:visible', false)"
                />
                <Button
                  :label="t('actions.configure')"
                  icon="pi pi-check"
                  severity="primary"
                  class="!mt-3"
                  @click="onConfigureFromEditor"
                />
              </div>
            </div>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </div>
  </Dialog>
</template>

<script src="./molecule-dialog-config-plugin-component.ts"></script>

<style scoped>
.config-plugin-dialog :deep(.p-tabpanels) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 0;
}
.config-plugin-dialog :deep(.p-tabpanel) {
  height: 100%;
  min-height: 0;
}
.config-plugin-dialog :deep(.p-fileupload-content) {
  border-radius: 0 0 6px 6px;
}
</style>
