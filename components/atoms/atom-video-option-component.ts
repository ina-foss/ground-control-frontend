import { useOptions } from "~/stores/annotation-options";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomVideoOption",
  setup(){
    const store = useOptions()
    const {player, transcription} =storeToRefs(store)






    return{
      player,
      transcription
    }
  }
})
