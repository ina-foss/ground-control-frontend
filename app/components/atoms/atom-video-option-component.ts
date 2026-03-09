import { useOptions } from "~/stores/annotation-options";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtomVideoOption",
  setup(){
    const store = useOptions()
    const {options} =storeToRefs(store)
    const videoOptionPM = usePersistence<typeof options.value>('span-video-option',options.value)

    watch(
      () => options.value,
      (newValue) => {
        videoOptionPM.save(newValue)
      },
      { deep: true },
    );

    onMounted(()=>{
        const previousOptions = videoOptionPM.get()?.items
        if(previousOptions) options.value = previousOptions
    })

    return{
      options
    }

  }

})
