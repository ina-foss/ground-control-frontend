import type { PluginWithIdDto } from '~/api/generate'

export default defineComponent({
    name: 'AtomPluginInputLabel',
    props: {
        pluginValue: { type: [Object, String] },
        plugin: { type: Object as PropType<PluginWithIdDto>, required: true },
        showError: { type: Boolean, default: false }
    },
    emits: ['update:pluginValue'],
    setup(props, {emit}) {

        const { plugin } = toRefs(props)

        const defaultLabel = computed({
            get: () => props.pluginValue as string ?? "",
            set: newValue => emit('update:pluginValue', newValue)
        })

        const isEmpty = computed(() => !defaultLabel.value || defaultLabel.value.trim() === "")
        const hasError = computed(() => props.showError && isEmpty.value)

        return {
            defaultLabel,
            plugin,
            hasError
        }
    },
})
