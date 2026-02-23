import { defineComponent } from 'vue';
import type { ButtonProps } from 'primevue';

type BtnProps = Partial<ButtonProps> & {
  label: string;
};

export default defineComponent({
  name: 'MoleculeDialogConfirm',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    withExclamation: {
      type: Boolean,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    cancelButton: {
      type: Object as PropType<BtnProps>,
      required: true,
    },
    confirmButton: {
      type: Object as PropType<BtnProps>,
      required: true,
    },
  },
  emits: ['update:visible', 'cancel', 'confirm'],
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    
    handleConfirm() {
      this.$emit('update:visible', false)
      this.$emit('confirm')
    },
  },
});
