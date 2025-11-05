type Breadcrumb = {
  label: string;
  link?: string;
  icon?: string;
};

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: "Breadcrumb",
  props: {
    breadcrumbs: Array as PropType<Array<Breadcrumb>>,
    class: {
        type: String,
        required: false,
    }
  },
  setup(props) {
    const {breadcrumbs} = props

    return { breadcrumbs };
  },
});
