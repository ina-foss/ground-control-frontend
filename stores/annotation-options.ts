

export const useOptions = defineStore("annotation-options",() => {

    const player = ref<boolean>(false)
    const transcription = ref<boolean>(false)


    return {
      player,
      transcription,
  }
})


