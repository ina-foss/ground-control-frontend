<template>
  <Dialog
    :visible="visible"
    modal
    :closable="true"
    class="bg-white rounded-md"
    :style="{ width: activeTab === 'manual' ? '65rem' : '45rem' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <!-- Header -->
    <template v-if="title" #header>
      <h3 class="text-lg font-semibold text-gray-800 whitespace-nowrap">
        {{ title }}
      </h3>
    </template>

    <!-- Tabs -->
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="upload">{{ t('plugin.tab.upload') }}</Tab>
        <Tab value="manual">{{ t('plugin.tab.manualConfig') }}</Tab>
      </TabList>
      <TabPanels>

        <!-- ─── Onglet Upload ────────────────────────────────────── -->
        <TabPanel value="upload">
          <div class="grid grid-cols-1 w-full gap-4">
            <span class="text-slate-400 whitespace-nowrap">
              {{ t('task.uploadConfig') }}
            </span>
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
                buttonbar: {
                  style: 'z-index:20; padding:10px 0;'
                },
                chooseButton: {
                  style: `
                    font-size: 14px;
                    font-family: Lato,sans-serif;
                    font-weight: bold;
                    height: 33px;
                    padding: 8px 12px;
                    border-radius: 4px;
                    color: #FFFFFF;
                    background-color: #0B7698;
                    white-space: nowrap;
                    cursor: ${isUploadDisabled ? 'not-allowed' : 'pointer'};
                  `,
                  props: {
                    title: isUploadDisabled
                      ? t('task.uploadLimit')
                      : ''
                  }
                }
              }"
            >
              <!-- Empty state -->
              <template #empty>
                <div class="flex items-center justify-center flex-col">
                  <span class="pi pi-file-arrow-up" style="font-size: 2.5rem" />
                  <p class="text-xs pt-3 text-slate-400 whitespace-nowrap">
                    {{ t('task.uploadConfig') }}
                  </p>
                </div>
              </template>

              <!-- File list -->
              <template #content="{ files, removeFileCallback }">
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="grid grid-cols-8 gap-2 px-1 items-center"
                  >
                    <span class="pi pi-file" />
                    <p
                      v-tooltip.top="file.name"
                      class="truncate col-span-4"
                    >
                      {{ file.name }}
                    </p>
                    <p class="text-slate-400 text-xs whitespace-nowrap col-span-2">
                      {{ formatSize(file.size) }}
                    </p>
                    <Button
                      icon="pi pi-times"
                      text
                      rounded
                      size="small"
                      severity="danger"
                      class="justify-self-center hover:bg-surface-100"
                      @click="removeFile(index, removeFileCallback)"
                    />
                  </div>
                </div>
              </template>
            </FileUpload>

            <!-- Configurer -->
            <div class="flex justify-end pt-4">
              <Button
                :label="t('actions.configure')"
                icon="pi pi-cog"
                severity="primary"
                :disabled="!isUploadDisabled"
                @click="onConfigureFromUpload"
              />
            </div>
          </div>
        </TabPanel>

        <!-- ─── Onglet Configuration manuelle ───────────────────── -->
        <TabPanel value="manual">
          <ScrollPanel style="max-height: 70vh">
            <MoleculePluginJsonEditor
              v-model="editorJson"
            />
          </ScrollPanel>
          <div class="flex justify-end pt-4">
            <Button
              :label="t('actions.configure')"
              icon="pi pi-cog"
              severity="primary"
              @click="onConfigureFromEditor"
            />
          </div>
        </TabPanel>

      </TabPanels>
    </Tabs>
  </Dialog>
</template>

<script src="./molecule-dialog-config-plugin-component.ts"></script>
