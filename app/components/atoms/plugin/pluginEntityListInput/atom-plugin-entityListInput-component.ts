import type { PluginWithIdDto } from '~/api/generate'
import {useI18n} from "#imports";
import type {PropType} from "vue";

export interface Intervenant {
    nom: string
    role: any | null
}
export type IntervenantsPluginValue = Intervenant[]
export default defineComponent({
    name: 'AtomPluginEntityListInput',
    props: {
        pluginValue: { type: Array as PropType<IntervenantsPluginValue> },
        plugin: { type: Object as PropType<PluginWithIdDto>, required: true },
        index: { type: Number },
        topicIndex: { type: Number }
    },
    emits: ['update:pluginValue'],
    setup(props, {emit}) {

        const { plugin } = toRefs(props)
        const { t } = useI18n()
        const pluginValue = computed<IntervenantsPluginValue>({
            get: () => props.pluginValue ?? [],
            set: (newValue) => emit('update:pluginValue', newValue),
        })


        let nextId = 1

        const intervenants = ref(
            pluginValue.value.length
                ? pluginValue.value.map(i => ({ ...i, _id: nextId++ }))
                : [createIntervenant()]
        )


        const roles = computed(()=>{
            if(plugin.value.config_data)
            {
                return  JSON.parse(plugin.value.config_data.data_source?.replace(/'/g, '"'))
            }
            return []
        })



        function createIntervenant() {
            return {
                _id: nextId++,
                nom: '',
                role: null
            }
        }

        function removeIntervenant(id: number): void {
            if (intervenants.value.length === 1) return

            intervenants.value = intervenants.value.filter(i => i._id !== id)

            const validRows = intervenants.value.filter(i => i.nom.trim() !== '' && i.role !== null)

            pluginValue.value = validRows.map(i => ({
                nom: i.nom,
                role: i.role
            })) as any
        }

        function updateIntervenant(id: number): void {
            const current = intervenants.value.find(i => i._id === id)
            if (!current) return

            const validRows = intervenants.value.filter(
                i => i.nom.trim() !== '' && i.role !== null
            )

            pluginValue.value = validRows.map(i => ({
                nom: i.nom,
                role: i.role
            }))
        }



        return {
            intervenants,
            roles,
            removeIntervenant,
            updateIntervenant,
            createIntervenant,
            t
        }
    },
})
