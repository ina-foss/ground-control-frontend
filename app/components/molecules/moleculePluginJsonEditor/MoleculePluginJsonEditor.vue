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

<script setup lang="ts">
import _ from 'lodash'
import { TypePlugin, DisplayZone, PluginConfigType } from '~/api/generate'

defineOptions({ name: 'MoleculePluginJsonEditor' })

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  depth: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const MAX_DEPTH = 2

// ─── Default structure ──────────────────────────────────────────────────
function createDefaultPlugin(): Record<string, any> {
  return {
    name: '',
    type: TypePlugin.LISTITEMS,
    data_categories: '',
    data_property: '',
    display_zone: DisplayZone.SPAN_MODAL_LEFT,
    enable_search: false,
    available_plugins: null,
    config_data: {
      type: PluginConfigType.PLUGIN_STATIC_DATA,
      data_source: '[]',
      data_type: 'json',
      token_url: null,
      client_id: null,
      client_secret: null,
      search_query: '',
      response_id_key: '',
      response_ext_id_key: '',
      response_label_key: '',
      response_editable_key: '',
      response_copyable_key: '',
      response_tooltip_key: '',
      response_tag_label_key: '',
      response_group_key: '',
      response_description_key: '',
      response_image_key: '',
      response_categories_key: ''
    },
    display_config: {
      label: '',
      order: 1,
      multiple_values: false,
      max_items: 4,
      main_plugin: false
    },
    children: []
  }
}

// ─── Form reactive state ─────────────────────────────────────────────────
const form = reactive<Record<string, any>>(
  _.merge(createDefaultPlugin(), _.cloneDeep(props.modelValue ?? {}))
)

// ─── Options ─────────────────────────────────────────────────────────────
const typePluginOptions = [
  { label: 'List Items', value: TypePlugin.LISTITEMS },
  { label: 'Autocomplete', value: TypePlugin.AUTOCOMPLETE },
  { label: 'Label', value: TypePlugin.LABEL },
  { label: 'Input Label', value: TypePlugin.INPUTLABEL },
  { label: 'Suggestion List', value: TypePlugin.SUGGESTIONLIST }
]

const displayZoneOptions = [
  { label: 'Modal span gauche', value: DisplayZone.SPAN_MODAL_LEFT },
  { label: 'Modal span droite', value: DisplayZone.SPAN_MODAL_RIGHT },
  { label: 'Modal groupe', value: DisplayZone.GROUP_MODAL },
  { label: 'Bloc', value: DisplayZone.BLOC }
]

const configTypeOptions = [
  { label: 'Données statiques', value: PluginConfigType.PLUGIN_STATIC_DATA },
  { label: 'Requête POST', value: PluginConfigType.PLUGIN_REQUEST_POST },
  { label: 'Requête GET', value: PluginConfigType.PLUGIN_REQUEST_GET },
  { label: 'Wikidata', value: PluginConfigType.PLUGIN_WIKIDATA }
]

const responseKeyFields = [
  { field: 'response_id_key', label: 'ID', placeholder: '$[*].id' },
  { field: 'response_ext_id_key', label: 'Ext ID', placeholder: '$[*].extId' },
  { field: 'response_label_key', label: 'Libellé', placeholder: '$[*].label' },
  { field: 'response_description_key', label: 'Description', placeholder: '' },
  { field: 'response_image_key', label: 'Image', placeholder: '' },
  { field: 'response_editable_key', label: 'Éditable', placeholder: '' },
  { field: 'response_copyable_key', label: 'Copiable', placeholder: '' },
  { field: 'response_tooltip_key', label: 'Tooltip', placeholder: '' },
  { field: 'response_tag_label_key', label: 'Tag label', placeholder: '' },
  { field: 'response_group_key', label: 'Groupe', placeholder: '' },
  { field: 'response_categories_key', label: 'Catégories', placeholder: '' }
]

// ─── Computed flags ───────────────────────────────────────────────────────
const isStaticData = computed(() => form.config_data?.type === PluginConfigType.PLUGIN_STATIC_DATA)
const isRequestType = computed(() => [
  PluginConfigType.PLUGIN_REQUEST_POST,
  PluginConfigType.PLUGIN_REQUEST_GET
].includes(form.config_data?.type))

// ─── Static data table ───────────────────────────────────────────────────
const BASE_STATIC_COLUMNS = ['id', 'extId', 'label']
const OPTIONAL_STATIC_COLUMNS = ['editable', 'copyable', 'tooltip', 'tag_label', 'group', 'categories']
const optionalStaticColumns = OPTIONAL_STATIC_COLUMNS
const activeOptionalColumns = ref<Set<string>>(new Set())

const staticItems = ref<Record<string, any>[]>([])
const editingRows = ref<any[]>([])

function parseStaticData(dataSource: any) {
  try {
    const parsed = typeof dataSource === 'string' ? JSON.parse(dataSource || '[]') : (dataSource ?? [])
    const arr = Array.isArray(parsed) ? parsed : []
    // Detect optional columns present in the data
    arr.forEach(item => {
      OPTIONAL_STATIC_COLUMNS.forEach(col => {
        if (col in item) activeOptionalColumns.value.add(col)
      })
    })
    staticItems.value = arr.map((item, i) => ({ _rowIndex: i, ...item }))
  }
  catch {
    staticItems.value = []
  }
}

function serializeStaticData(): string {
  return JSON.stringify(staticItems.value.map(({ _rowIndex, ...rest }) => rest))
}

watch(() => form.config_data?.type, (type) => {
  if (type === PluginConfigType.PLUGIN_STATIC_DATA) {
    parseStaticData(form.config_data?.data_source)
  }
}, { immediate: true })

watch(staticItems, () => {
  if (isStaticData.value) {
    form.config_data.data_source = serializeStaticData()
  }
}, { deep: true })

const visibleStaticColumns = computed(() => [
  ...BASE_STATIC_COLUMNS,
  ...OPTIONAL_STATIC_COLUMNS.filter(c => activeOptionalColumns.value.has(c))
])

function toggleOptionalColumn(col: string) {
  if (activeOptionalColumns.value.has(col)) {
    activeOptionalColumns.value.delete(col)
  }
  else {
    activeOptionalColumns.value.add(col)
    staticItems.value.forEach(item => {
      if (!(col in item)) item[col] = ''
    })
  }
}

function addStaticRow() {
  const newRow: Record<string, any> = {
    _rowIndex: staticItems.value.length,
    id: String(staticItems.value.length + 1),
    extId: String(staticItems.value.length + 1),
    label: ''
  }
  visibleStaticColumns.value.forEach(col => {
    if (!(col in newRow)) newRow[col] = ''
  })
  staticItems.value.push(newRow)
}

function removeStaticRow(index: number) {
  staticItems.value.splice(index, 1)
}

function onRowEditSave({ newData, index }: { newData: any; index: number }) {
  staticItems.value[index] = newData
}

// ─── Search query ────────────────────────────────────────────────────────
const searchQueryText = ref('')
const searchQueryError = ref('')

watch(() => form.config_data?.search_query, (val) => {
  if (!val) {
    searchQueryText.value = ''
  }
  else if (typeof val === 'object') {
    searchQueryText.value = JSON.stringify(val, null, 2)
  }
  else {
    searchQueryText.value = String(val)
  }
}, { immediate: true })

function applySearchQuery() {
  searchQueryError.value = ''
  const text = searchQueryText.value.trim()
  if (!text) {
    form.config_data.search_query = ''
    return
  }
  try {
    form.config_data.search_query = JSON.parse(text)
  }
  catch {
    form.config_data.search_query = text
  }
}

// ─── Available plugins (key-value list) ─────────────────────────────────
const availablePluginsEntries = ref<{ key: string; value: string }[]>([])

function syncEntriesToForm() {
  form.available_plugins = availablePluginsEntries.value.length
    ? Object.fromEntries(availablePluginsEntries.value.map(e => [e.key, e.value]))
    : null
}

function syncFormToEntries() {
  const ap = form.available_plugins
  availablePluginsEntries.value = (ap && typeof ap === 'object')
    ? Object.entries(ap).map(([key, value]) => ({ key, value: String(value) }))
    : []
}

syncFormToEntries()

watch(availablePluginsEntries, syncEntriesToForm, { deep: true })

function addAvailablePlugin() {
  availablePluginsEntries.value.push({ key: '', value: '' })
}

function removeAvailablePlugin(idx: number) {
  availablePluginsEntries.value.splice(idx, 1)
}

// ─── Children ─────────────────────────────────────────────────────────────
function addChild() {
  if (!form.children) form.children = []
  form.children.push(createDefaultPlugin())
}

function removeChild(idx: number) {
  form.children.splice(idx, 1)
}

// ─── Raw JSON tab ────────────────────────────────────────────────────────
const activeTab = ref('form')
const rawJsonText = ref('')
const jsonParseError = ref('')

watch(activeTab, (tab) => {
  if (tab === 'json') {
    rawJsonText.value = JSON.stringify(buildPayload(), null, 2)
  }
})

function syncFromRawJson() {
  jsonParseError.value = ''
  try {
    const parsed = JSON.parse(rawJsonText.value)
    _suppressEmit = true
    Object.assign(form, _.merge(createDefaultPlugin(), parsed))
    syncFormToEntries()
    if (isStaticData.value) parseStaticData(form.config_data?.data_source)
    nextTick(() => {
      _suppressEmit = false
      emit('update:modelValue', buildPayload())
    })
  }
  catch (e: any) {
    jsonParseError.value = `JSON invalide : ${e.message}`
  }
}

// ─── Build payload ────────────────────────────────────────────────────────
function buildPayload(): Record<string, any> {
  const payload = _.cloneDeep(toRaw(form))
  // Remove empty optional response keys
  if (payload.config_data) {
    for (const key of Object.keys(payload.config_data)) {
      if (key.startsWith('response_') && !payload.config_data[key]) {
        delete payload.config_data[key]
      }
    }
  }
  return payload
}

// ─── Emit on form change ──────────────────────────────────────────────────
let _suppressEmit = false

watch(form, () => {
  if (_suppressEmit) return
  emit('update:modelValue', buildPayload())
}, { deep: true })

// ─── Sync from parent (file upload) ──────────────────────────────────────
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return
  _suppressEmit = true
  Object.assign(form, _.merge(createDefaultPlugin(), _.cloneDeep(newVal)))
  syncFormToEntries()
  if (isStaticData.value) parseStaticData(form.config_data?.data_source)
  nextTick(() => { _suppressEmit = false })
}, { deep: true })
</script>
