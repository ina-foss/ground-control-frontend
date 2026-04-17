import _ from 'lodash'
import { TypePlugin, DisplayZone, PluginConfigType } from '~/api/generate'

export default defineComponent({
  name: 'MoleculePluginJsonEditor',

  props: {
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 0
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
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
    }, { deep: true, immediate: true })

    // ─── Sync from parent (file upload) ──────────────────────────────────────
    watch(() => props.modelValue, (newVal) => {
      if (!newVal) return
      _suppressEmit = true
      Object.assign(form, _.merge(createDefaultPlugin(), _.cloneDeep(newVal)))
      syncFormToEntries()
      if (isStaticData.value) parseStaticData(form.config_data?.data_source)
      nextTick(() => { _suppressEmit = false })
    }, { deep: true })

    return {
      t,
      MAX_DEPTH,
      form,
      activeTab,
      typePluginOptions,
      displayZoneOptions,
      configTypeOptions,
      responseKeyFields,
      isStaticData,
      isRequestType,
      staticItems,
      editingRows,
      optionalStaticColumns,
      activeOptionalColumns,
      visibleStaticColumns,
      toggleOptionalColumn,
      addStaticRow,
      removeStaticRow,
      onRowEditSave,
      searchQueryText,
      searchQueryError,
      applySearchQuery,
      availablePluginsEntries,
      addAvailablePlugin,
      removeAvailablePlugin,
      addChild,
      removeChild,
      rawJsonText,
      jsonParseError,
      syncFromRawJson
    }
  }
})
