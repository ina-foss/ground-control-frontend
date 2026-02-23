import AtomLogoIna from "../../atoms/logo-ina/atom-logo-ina.vue";
import AtomLogoApp from "../../atoms/logo-app/atom-logo-app.vue";
import AvatarHeader from "../../atoms/avatar/avatar.vue";
import ButtonHeader from "../../atoms/button/button.vue";
import LinkHeader from "../../atoms/link/link.vue";
import SelectHeader from "../../atoms/select/select.vue";
import {
  HeaderSize,
  TextSize,
  ActionType,
} from "../../model/enumerations/header-type.model";
import type { Action } from "../../model/header.model";

export default defineComponent({
  name: "MoleculeHeader",
  compatConfig: { MODE: 3 },
  components: {
    AtomLogoIna,
    AtomLogoApp,
    AvatarHeader,
    ButtonHeader,
    LinkHeader,
    SelectHeader,
  },
  props: {
    title: {
      type: String,
      default: "Application",
    },
    size: {
      type: String as () => keyof typeof HeaderSize,
      default: "md",
      validator: (value: string) => Object.keys(HeaderSize).includes(value),
    },
    actionsRight: Array as PropType<Array<Action>>,
    actionsCenter: Array as PropType<Array<Action>>,
  },
  setup(props) {
    const headerSize = computed(() => HeaderSize[props.size]);
    const textSize = computed(() => TextSize[props.size]);
    const open = ref(false);

    const getComponents = (actions: Array<Action>) => {
      return actions
        ?.map((actionItem) => {
          switch (actionItem.type) {
            case ActionType.BUTTON:
              return { actionItem, component: "ButtonHeader" };
            case ActionType.DEFAULT:
              return { actionItem, component: "AvatarHeader" };
            case ActionType.LINK:
              return { actionItem, component: "LinkHeader" };
            case ActionType.SELECT:
              return { actionItem, component: "SelectHeader" };
            default:
              return null;
          }
        })
        .filter(Boolean); // Filtrer les valeurs null
    };

    const componentsRight = computed(() => getComponents(props.actionsRight!));
    const componentsCenter = computed(() =>
      getComponents(props.actionsCenter!),
    );

    return {
      sizeConfig: props.size,
      textSize,
      headerSize,
      componentsRight,
      componentsCenter,
      ActionType,
      open,
    };
  },
});
