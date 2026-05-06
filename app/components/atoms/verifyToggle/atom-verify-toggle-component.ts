import {Status} from "~/api/generate";
import type {PropType} from "vue";
import {useI18n} from "#imports";

export default defineComponent({
    name: 'AtomVerifyToggle',
    emits: ['update:pluginValue'],
    props: {
        pluginValue: { type: String as PropType<Status.PENDING | Status.VERIFIED>,  default: Status.PENDING},
        pendingVerifiedStatus: { type: String as PropType<Status.PENDING | Status.VERIFIED>,  default: Status.PENDING}
    },

    setup(props, {emit}) {

        const { pluginValue,pendingVerifiedStatus } = toRefs(props)
        const { t } = useI18n()

        const status = ref<Status.PENDING | Status.VERIFIED>(pendingVerifiedStatus.value)


        watch(pluginValue, (newVal) => {
            status.value = newVal
        })

        watch(status, (newVal) => {
            emit('update:pluginValue', newVal)
        })

        const options =computed(() => [
            { label:  t('plugin.status.toBeVerified'), value: Status.PENDING,  icon: 'pi pi-question-circle' },
            { label: t('plugin.status.verified'),    value: Status.VERIFIED, icon: 'pi pi-check-circle'    },
        ])
        return {
            pluginValue,
            status,
            options,
            t
        }
    },
})
