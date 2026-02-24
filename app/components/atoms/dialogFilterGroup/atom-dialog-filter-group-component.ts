import { useI18n } from '#imports'

export default defineNuxtComponent({
    name:'AtomDialogFilterGroup',
    emits: ['update:visible'],
    props: {
        visible:  {
            type: Boolean,
            required: true,
        },
        authorizedTypeList:  {
            type:  Array as () => string[],
        },
    },
    setup(props, { emit }) {

        const { t } = useI18n()

        return {
            t,
            emit
        }
    },
})
