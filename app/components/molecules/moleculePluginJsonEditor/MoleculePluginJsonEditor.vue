<template>
  <div class="flex flex-col gap-4">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="form">{{ t('plugin.editor.tabForm') }}</Tab>
        <Tab value="json">{{ t('plugin.editor.tabJson') }}</Tab>
      </TabList>
      <TabPanels>
        <!-- ─── Vue formulaire ─────────────────────────────────────── -->
        <TabPanel value="form">
          <div class="flex flex-col gap-5 pt-2">

            <!-- Informations générales -->
            <section class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('plugin.editor.generalInfo') }}</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.name') }}</label>
                  <InputText v-model="form.name" class="w-full" size="small" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.type') }}</label>
                  <Select v-model="form.type" :options="typePluginOptions" option-label="label" option-value="value" class="w-full" size="small" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.displayZone') }}</label>
                  <Select v-model="form.display_zone" :options="displayZoneOptions" option-label="label" option-value="value" class="w-full" size="small" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.dataProperty') }}</label>
                  <InputText v-model="form.data_property" class="w-full" size="small" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.dataCategories') }}</label>
                  <InputText v-model="form.data_categories" class="w-full" size="small" />
                </div>
                <div class="flex items-center gap-2 pt-4">
                  <Checkbox v-model="form.enable_search" binary input-id="enable_search" />
                  <label for="enable_search" class="text-sm font-medium cursor-pointer">{{ t('plugin.fields.enableSearch') }}</label>
                </div>
              </div>
            </section>

            <Divider class="!my-0" />

            <!-- Configuration des données -->
            <section class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('plugin.editor.configData') }}</h3>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.configType') }}</label>
                  <Select v-model="form.config_data.type" :options="configTypeOptions" option-label="label" option-value="value" class="w-full" size="small" />
                </div>

                <!-- Source de données statiques -->
                <template v-if="isStaticData">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium">{{ t('plugin.fields.staticData') }}</label>
                      <div class="flex gap-2">
                        <Button
                          v-for="col in optionalStaticColumns"
                          :key="col"
                          :label="col"
                          size="small"
                          severity="secondary"
                          text
                          :class="activeOptionalColumns.has(col) ? '!text-primary-600' : '!text-gray-400'"
                          @click="toggleOptionalColumn(col)"
                        />
                        <Button icon="pi pi-plus" :label="t('plugin.editor.addRow')" size="small" severity="secondary" @click="addStaticRow" />
                      </div>
                    </div>
                    <DataTable
                      v-model:editing-rows="editingRows"
                      :value="staticItems"
                      edit-mode="row"
                      data-key="_rowIndex"
                      size="small"
                      class="text-xs"
                      @row-edit-save="onRowEditSave"
                    >
                      <Column v-for="col in visibleStaticColumns" :key="col" :field="col" :header="col" style="min-width: 80px">
                        <template #editor="{ data, field }">
                          <InputText v-model="data[field]" class="w-full text-xs p-1" />
                        </template>
                      </Column>
                      <Column
                        row-editor
                        style="width: 5rem; text-align: center"
                        header-style="width: 5rem; text-align: center"
                      />
                      <Column style="width: 3rem">
                        <template #body="slotProps">
                          <Button icon="pi pi-trash" severity="danger" text size="small" @click="removeStaticRow(slotProps.index)" />
                        </template>
                      </Column>
                    </DataTable>
                  </div>
                </template>

                <!-- URL source (types non-statiques) -->
                <template v-else>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">{{ t('plugin.fields.dataSource') }}</label>
                    <InputText v-model="form.config_data.data_source" class="w-full" size="small" />
                  </div>
                </template>

                <!-- Requête de recherche (types request) -->
                <template v-if="isRequestType">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">{{ t('plugin.fields.searchQuery') }}</label>
                    <Textarea v-model="searchQueryText" rows="5" class="w-full font-mono text-xs" @blur="applySearchQuery" />
                    <small v-if="searchQueryError" class="text-red-500">{{ searchQueryError }}</small>
                  </div>
                </template>

                <!-- Authentification OAuth -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">{{ t('plugin.fields.tokenUrl') }}</label>
                    <InputText v-model="form.config_data.token_url" class="w-full" size="small" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">{{ t('plugin.fields.clientId') }}</label>
                    <InputText v-model="form.config_data.client_id" class="w-full" size="small" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">{{ t('plugin.fields.clientSecret') }}</label>
                    <InputText v-model="form.config_data.client_secret" class="w-full" size="small" />
                  </div>
                </div>

                <!-- Clés de réponse -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-600">{{ t('plugin.editor.responseKeys') }}</label>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="key in responseKeyFields" :key="key.field" class="flex flex-col gap-1">
                      <label class="text-xs text-gray-500">{{ key.label }}</label>
                      <InputText
                        v-model="form.config_data[key.field]"
                        class="w-full"
                        size="small"
                        :placeholder="key.placeholder"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Divider class="!my-0" />

            <!-- Configuration d'affichage -->
            <section class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('plugin.editor.displayConfig') }}</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.label') }}</label>
                  <InputText v-model="form.display_config.label" class="w-full" size="small" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.order') }}</label>
                  <InputNumber v-model="form.display_config.order" class="w-full" size="small" :min="1" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">{{ t('plugin.fields.maxItems') }}</label>
                  <InputNumber v-model="form.display_config.max_items" class="w-full" size="small" :min="1" />
                </div>
                <div class="flex flex-col gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="form.display_config.multiple_values" binary input-id="multiple_values" />
                    <label for="multiple_values" class="text-sm cursor-pointer">{{ t('plugin.fields.multipleValues') }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="form.display_config.main_plugin" binary input-id="main_plugin" />
                    <label for="main_plugin" class="text-sm cursor-pointer">{{ t('plugin.fields.mainPlugin') }}</label>
                  </div>
                </div>
              </div>
            </section>

            <!-- Plugins disponibles (listitems uniquement) -->
            <template v-if="form.type === 'listitems'">
              <Divider class="!my-0" />
              <section class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('plugin.editor.availablePlugins') }}</h3>
                  <Button icon="pi pi-plus" size="small" severity="secondary" text @click="addAvailablePlugin" />
                </div>
                <div
                  v-for="(entry, idx) in availablePluginsEntries"
                  :key="idx"
                  class="flex gap-2 items-center"
                >
                  <InputText v-model="entry.key" :placeholder="t('plugin.editor.availablePluginKey')" class="flex-1 text-sm" size="small" />
                  <span class="text-gray-400 text-sm">→</span>
                  <InputText v-model="entry.value" :placeholder="t('plugin.editor.availablePluginValue')" class="flex-1 text-sm" size="small" />
                  <Button icon="pi pi-trash" severity="danger" text size="small" @click="removeAvailablePlugin(idx)" />
                </div>
                <p v-if="!availablePluginsEntries.length" class="text-xs text-gray-400 italic">{{ t('plugin.editor.noAvailablePlugins') }}</p>
              </section>
            </template>

            <!-- Plugins enfants -->
            <template v-if="depth < MAX_DEPTH">
              <Divider class="!my-0" />
              <section class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {{ t('plugin.editor.children') }} ({{ form.children?.length ?? 0 }})
                  </h3>
                  <Button icon="pi pi-plus" :label="t('plugin.editor.addChild')" size="small" severity="secondary" @click="addChild" />
                </div>
                <Accordion v-if="form.children?.length" multiple>
                  <AccordionPanel v-for="(_, idx) in form.children" :key="idx" :value="String(idx)">
                    <AccordionHeader>
                      <span class="text-sm">{{ form.children[idx].name || `Plugin ${idx + 1}` }}</span>
                      <Tag :value="form.children[idx].type" severity="secondary" class="ml-2 text-xs" />
                    </AccordionHeader>
                    <AccordionContent>
                      <MoleculePluginJsonEditor
                        v-model="form.children[idx]"
                        :depth="depth + 1"
                      />
                      <div class="flex justify-end mt-3">
                        <Button
                          :label="t('actions.delete')"
                          icon="pi pi-trash"
                          severity="danger"
                          size="small"
                          text
                          @click="removeChild(idx)"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionPanel>
                </Accordion>
              </section>
            </template>
          </div>
        </TabPanel>

        <!-- ─── Vue JSON brut ──────────────────────────────────────── -->
        <TabPanel value="json">
          <div class="flex flex-col gap-2">
            <Textarea v-model="rawJsonText" rows="30" class="w-full font-mono text-xs" />
            <small v-if="jsonParseError" class="text-red-500">{{ jsonParseError }}</small>
            <div class="flex justify-end">
              <Button :label="t('plugin.editor.applyJson')" size="small" @click="syncFromRawJson" />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" src="./molecule-plugin-json-editor-component.ts"></script>
