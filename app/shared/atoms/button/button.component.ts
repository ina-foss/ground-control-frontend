import { Button } from "primevue";
import { defineComponent, computed } from "vue";
import type { Action } from "../../molecules/header/molecule-header.component";

export default defineComponent({
  name: "ButtonHeader",
  components: { Button },
  props: {
    actionItem: {
      type: Object as PropType<Action>
    }
  },
  setup(props) {
    const actionItem = computed(() => props.actionItem);
    
    return { actionItem };
  },
});