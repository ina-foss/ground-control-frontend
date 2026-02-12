import { defineComponent, computed } from "vue";
import type { Action } from "../../molecules/header/molecule-header.component";
import Select, { type SelectChangeEvent } from "primevue/select";

export default defineComponent({
  name: "SelectHeader",
  components: { Select },
  props: {
    actionItem: {
      type: Object as PropType<Action>,
    },
  },
  setup(props) {
    const actionItem = computed(() => props.actionItem);
    const selectedStatus = ref(null);

    const handleChange = (event: SelectChangeEvent) => {
      const { action } =actionItem.value!;
      if (action) {
        action(event.value);
      }
    };

    return { actionItem, selectedStatus, handleChange };
  },
});
