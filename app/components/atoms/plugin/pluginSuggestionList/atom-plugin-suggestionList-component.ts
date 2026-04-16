import type { PluginWithIdDto } from '~/api/generate'

export default defineComponent({
    name: 'AtomPluginSuggestionList',
    props: {
        pluginValue: {
            type: Object,
        },
        plugin: {type :Object as PropType<PluginWithIdDto>, required: true}
    },
    emits:['update:pluginValue'],
    setup(props, {emit}) {

        const {plugin} = toRefs(props)

        const selectedCategory = computed({
            get: () => {
                const val = props.pluginValue
                if (Array.isArray(val)) return val[0]?.label ?? ""
                return val ?? ""
            },
            set: (newValue) => {
                const val = options.value?.find(o => o.label === newValue)
                emit('update:pluginValue', val ? [val] : [])
            }
        })

        const options = computed(()=>{
            if(plugin.value.config_data)
        {
           return  JSON.parse(plugin.value.config_data.data_source?.replace(/'/g, '"'))
        }
return
    })


        return {
            plugin,
            selectedCategory,
            options
        }
    },
})
