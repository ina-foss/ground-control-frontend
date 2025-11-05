import { defineComponent, computed, ref, type PropType } from "vue";
import { useColorMode } from "#build/imports";
import { Button } from "primevue";
import type { Action, ActionItem } from "../../molecules/header/molecule-header.component";
import type { MenuItem } from "primevue/menuitem";

type Props = {
  userEmail: string;
  handleLogout: () => void;
};

export default defineComponent({
  name: "AvatarHeader",
  compatConfig: { MODE: 3 },
  components: { Button },
  props: {
    actionItem: {
      type: Object as PropType<Action>,
    },
  },
  setup(props) {
    const {action,label, items} = props.actionItem!
    const colorMode = useColorMode();
    const menu = ref();

    const list = computed(() => {
      const nextColorMode = colorMode.preference === "light" ? "dark" : "light";
      const newItems = items?.map(item => ({label: item.label, icon: item.icon, command: item.action}))

      return [
        {
          label: "Options",
          items: [
            {
              label: `Changer en mode ${nextColorMode}`,
              icon: `pi pi-${nextColorMode === "dark" ? "moon" : "sun"}`,
              command: toggleDarkMode,
            },
            ...newItems!,
          ],
        },
      ];
    });

    const toggle = (event: Event) => {
      menu.value?.toggle(event);
    };

    const toggleDarkMode = () => {
      colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
    };

    return {
      label,
      list,
      menu,
      toggle,
      toggleDarkMode,
      action,
    };
  },
});
