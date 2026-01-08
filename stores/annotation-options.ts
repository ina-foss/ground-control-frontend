export type Options =  {
  /**
   * If the video is sync to the transcription scrolling
   * @defaultValue `false`
   */
  player: boolean

  /** If the click on the transcription update video time
   * @defaultValue `true`
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
   * @defaultValue `true`
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

  /** if the number are showed for each segment
   * @defaultValue `false`
   */
  number_segment: boolean

  /** if you can create a span without any label
  * @defaultValue true
  */
  unlabelled_span: boolean
}

export type AnnotationMode = 'read' | 'edit' | 'none'

export const useOptions = defineStore("annotation-options",() => {

    const options = reactive<Options>({
      span: true,
      timecode_bloc: true,
      timecode_segment:false,
      bloc: true,
      player: false,
      transcription: true,
      loop_bloc: false,
      number_segment:false,
      unlabelled_span: true,
    })

    return {
      options,
  }
})
