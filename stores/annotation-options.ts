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

  /** If the player stops at the end of the selected segment
   * @defaultValue `false`
   */
  loop_bloc: boolean

  /** if the span are displayed
   * @defaultValue `true`
   */
  span : boolean

  /** if the timecode are showed for each bloc
   * @defaultValue `false`
   */
  timecode_bloc: boolean

  /** if the timecode are showed for each segment
   * @defaultValue `false`
   */
  timecode_segment: boolean

  /** if the annotations are divided by bloc
   * @defaultValue `false`
   */
  bloc: boolean
}

export const useOptions = defineStore("annotation-options",() => {

    const options = reactive<Options>({
      span: true,
      timecode_bloc: false,
      timecode_segment:false,
      bloc: true,
      player: true,
      transcription: true,
      loop_bloc: false
    })


    return {
      options
  }
})
