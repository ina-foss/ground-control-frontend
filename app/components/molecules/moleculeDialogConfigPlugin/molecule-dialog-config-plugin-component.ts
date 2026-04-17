import { defineComponent, ref, computed } from 'vue'
import { useI18n } from '#imports';
import _ from 'lodash'
import {Plugin} from "~/api/generate"

export default defineComponent({
  name: 'MoleculeDialogConfigPlugin',

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    stepId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    /** ID du plugin existant à remplacer (mode édition) */
    pluginId: {
      type: Number,
      default: null
    },
    /** JSON initial pour pré-remplir l'éditeur (mode édition) */
    initialJson: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  },

  emits: ['update:visible', 'select', 'plugin-created'],

  setup(props, { emit }) {
    const { stepId } = props
    const { t } = useI18n()
    const templateRef = ref()
    const fileData = ref<File[]>([])
    const isUploadEnabled = computed(() => fileData.value.length > 0)
    const { $handleApiError } = useNuxtApp();

    // ─── Active tab — bascule sur "manual" si édition ─────────────────
    const activeTab = ref<'upload' | 'manual'>(props.initialJson ? 'manual' : 'upload')

    // ─── Editor JSON — pré-rempli depuis initialJson si édition ──────
    const editorJson = ref<Record<string, any>>(
      props.initialJson ? _.cloneDeep(props.initialJson) : {}
    )

    // ─── Upload tab helpers ───────────────────────────────────────────
    const removeFile = (index: number, callback: Function) => {
      callback(index)
      fileData.value.splice(index, 1)
    }

    const formatSize = (size: number) => {
      if (size < 1024) return `${size} B`
      return `${Math.round(size / 1024)} KB`
    }

    const onSelect = async (event: any) => {
      const files: File[] = event.files
      fileData.value = files
      emit('select', files)

      // Pre-fill the manual editor with the uploaded JSON
      if (files.length) {
        try {
          const text = await files[0].text()
          editorJson.value = JSON.parse(text)
        }
        catch {
          // Not valid JSON — ignore pre-fill
        }
      }
    }

    // ─── Injecter step_id (et supprimer l'id existant lors d'un remplacement) ─
    function injectStepId(data: Record<string, any>) {
      delete data.id
      data.step_id = stepId
      if (data.children?.length) {
        data.children.forEach((child: any) => {
          delete child.id
          child.step_id = stepId
        })
      }
    }

    // ─── Configure from Upload tab ────────────────────────────────────
    const onConfigureFromUpload = async () => {
      if (!fileData.value.length) return
      try {
        const file = fileData.value[0]
        const text = await file?.text()
        const jsonData = JSON.parse(text)
        injectStepId(jsonData)
        await Plugin.createPluginPluginPost({ body: jsonData })
        emit('plugin-created')
        emit('update:visible', false)
      }
      catch (error: any) {
        console.error('Failed to configure plugin from upload:', error)
        $handleApiError(error)
      }
    }

    // ─── Configure depuis l'éditeur (création ou remplacement) ──────
    const onConfigureFromEditor = async () => {
      try {
        const jsonData = JSON.parse(JSON.stringify(editorJson.value))
        injectStepId(jsonData)
        await Plugin.createPluginPluginPost({ body: jsonData })
        // Mode édition : supprimer l'ancien plugin après création réussie
        if (props.pluginId) {
          await Plugin.deletePluginPluginPluginIdDelete({ path: { plugin_id: props.pluginId } })
        }
        emit('plugin-created')
        emit('update:visible', false)
      }
      catch (error: any) {
        console.error('Failed to configure plugin from editor:', error)
        $handleApiError(error)
      }
    }

    return {
      templateRef,
      fileData,
      activeTab,
      editorJson,
      onSelect,
      removeFile,
      formatSize,
      t,
      isUploadEnabled,
      onConfigureFromUpload,
      onConfigureFromEditor
    }
  }
})
