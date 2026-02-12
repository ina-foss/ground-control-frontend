import AtomLogoIna from '../../atoms/logo-ina/atom-logo-ina.vue';

export default defineComponent({
  name: 'MoleculeFooter',
  compatConfig: {MODE: 3},
  components: {
    AtomLogoIna
  },
  props: {
    version: {
      type: String,
      default: 'Application'
    }
  }
});
