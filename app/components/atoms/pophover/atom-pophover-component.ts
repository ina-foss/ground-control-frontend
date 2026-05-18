import { Status } from "~/api/generate";
import type { PropType } from "vue";
import { useI18n } from "#imports";
import AtomVerifyToggle from "~/components/atoms/verifyToggle/atom-verify-toggle-component";

export default defineComponent({
  name: 'AtomPophover',
  components: {AtomVerifyToggle},
  emits: ['update:pluginValue', 'edit','remove'],
  props: {
    pluginValue: {
      type: String as PropType<Status.PENDING | Status.VERIFIED>,
      default: Status.PENDING
    },
    span: {
      type: Object as PropType<any>,
      default: null
    },
    pluginName: {
      type: String,
      default: ''
    },
  },

  setup(props, { emit }) {
    const { pluginValue, pluginName, span } = toRefs(props)
    const { t } = useI18n()

    const status = ref<Status.PENDING | Status.VERIFIED>(pluginValue.value)

    watch(pluginValue, (newVal) => {
      status.value = newVal
    })

    watch(status, (newVal) => {
      emit('update:pluginValue', newVal)
    })

    const selectedValue= computed(() =>
      Object.values(span?.value.plugins ?? {})
          .find(values => values?.[0]?.plugin_id)?.[0]
    )

    function onEdit() {
      emit('edit', span.value)
    }

    function onRemove() {
      if (status.value !== Status.PENDING) {
        status.value = Status.PENDING
        emit('update:pluginValue', Status.PENDING)
      }
      emit('remove', span.value)
      emit('edit', span.value)
    }

    return {
      pluginValue,
      status,
      selectedValue,
      pluginName,
      onEdit,
      t,
      onRemove
    }
  },
})
