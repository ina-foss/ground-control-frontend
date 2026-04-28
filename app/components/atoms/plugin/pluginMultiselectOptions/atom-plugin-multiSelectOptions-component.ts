import { defineComponent, ref, computed, watch } from 'vue'
import AtomPluginSuggestionList
    from "~/components/atoms/plugin/pluginSuggestionList/atom-plugin-suggestionList-component";

export default defineComponent({
    name: 'AtomPluginEntityListInput',
    components: {AtomPluginSuggestionList},

    props: {
        plugin: { type: Object, required: true },
        pluginValue: { type: Object, default: () => ({}) }
    },

    emits: ['update:pluginValue'],

    setup(props, { emit }) {
        const { plugin } = toRefs(props)


      const pluginValue = computed({
          get: () => Array.isArray(props.pluginValue) ? props.pluginValue : [],
          set : newValue =>  emit('update:pluginValue',newValue)
      })


        const rawOptions = ref<any[]>([])
        const rows = ref<any[]>([])
        let isUpdating = false
        const parseDataSource = (source: any) => {
            if (!source) return []

            try {
                let parsed = source

                if (typeof parsed === 'string') parsed = JSON.parse(parsed)
                if (typeof parsed === 'string') parsed = JSON.parse(parsed)

                return Array.isArray(parsed) ? parsed : []
            } catch {
                return []
            }
        }


        const groups = computed(() => {
            const all = rawOptions.value.map(opt => opt.group).filter(Boolean)
            return [...new Set(all)]
        })


        const optionsByGroup = computed(() => {
            return rawOptions.value.reduce((acc: Record<string, any[]>, opt) => {
                if (!opt.group) return acc

                if (!acc[opt.group]) acc[opt.group] = []
                acc[opt.group].push(opt)

                return acc
            }, {})
        })

        function createRow() {
            const row: any = {
                id: Date.now() + Math.random(),
                showType: false
            }

            groups.value.forEach(group => {
                row[group] = []
            })

            return row
        }

        const initOptions = () => {

            rawOptions.value = parseDataSource(
                plugin.value.config_data?.data_source
            )

            if (!pluginValue.value || pluginValue.value.length === 0) {
                rows.value = [createRow()]
            }
        }

        watch(
            [() => plugin.value, () => pluginValue.value],
            () => {
                if (isUpdating) {
                    isUpdating = false
                    return
                }
                initOptions()

                if (!pluginValue.value) return
                if (!Array.isArray(pluginValue.value)) return
                rows.value = pluginValue.value?.map((item: any) => {
                    const row: any = {
                        id: Date.now() + Math.random(),
                        showType: false
                    }

                    groups.value.forEach(group => {
                        row[group] = (optionsByGroup.value[group] || []).filter(opt =>
                            item[group]?.includes(opt.id)
                        )
                    })

                    return row
                })
            },
            { immediate: true }
        )


        const toggleType = (row: any) => {
            row.showType = !row.showType
        }

        const addRow = (row: any) => {
            if(row.showType === true) toggleType(row)
            rows.value.push(createRow())
        }

        const removeRow = (id: number) => {
            rows.value = rows.value.filter(r => r.id !== id)
        }

        const getGroupLabel = (row: any, group: string) => {
            const count = row[group]?.length || 0
            return count ? `${group} (${count})` : group
        }



        const mapToIds = (list: any[]) => list.map(i => i.id)

        const updateValue = () => {
            isUpdating = true
            emit(
                'update:pluginValue',
                rows.value.map(row => {
                    const result: Record<string, any> = {}

                    groups.value.forEach(group => {
                        result[group] = mapToIds(row[group] || [])
                    })

                    return result
                })
            )
        }

        watch(
            () => plugin.value,
            () => {
                initOptions()
            },
            { immediate: true }
        )


        watch(
            rows,
            () => {
                updateValue()
            },
            { deep: true }
        )

        return {
            rows,
            groups,
            optionsByGroup,
            toggleType,
            addRow,
            removeRow,
            getGroupLabel,
        }
    }
})
