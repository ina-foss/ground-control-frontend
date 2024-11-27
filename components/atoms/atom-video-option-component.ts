import { useOptions } from "~/stores/annotation-options";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomVideoOption",
  setup(){
    const store = useOptions()
    const {options} =storeToRefs(store)






    return{
      options
    }
  }
})
