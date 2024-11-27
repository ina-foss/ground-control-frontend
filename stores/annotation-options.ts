export type Options =  {
  /**
   * If the video is sync to the transcription scrolling
   * @defaultValue `false`
   */
  player: boolean

  /** If the click on the transcription update video time
   * @defaultValue `false`
   */
  transcription: boolean

  /** if the span are displayed
   * @defaultValue `true`
   */
  span : boolean

  /** if the timecode are showed
   * @defaultValue `false`
   */
  timecode: boolean

  /** if the annotations are divided by bloc
   * @defaultValue `false`
   */
  bloc: boolean
}

export const useOptions = defineStore("annotation-options",() => {


    const player = ref<boolean>(false)

    const transcription = ref<boolean>(false)

    const options = reactive<Options>({
      span: true,
      timecode: false,
      bloc: true,
      player: false,
      transcription: false
    })


    return {
      player,
      transcription,
      options
  }
})
