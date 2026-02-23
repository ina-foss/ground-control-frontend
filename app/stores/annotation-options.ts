export type Options =  {
  /**
   * If the video is sync to the transcription scrolling
   * @defaultValue `true`
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

  /**
  * Number of seconds to rewind before the target jump position.
  * This provides context by starting slightly earlier than the requested timestamp.
  *
  * @example If set to 2 and user jumps to 2m04s, playback starts at 2m02s
  * @defaultValue 2
  */
  jump_before_offset: number

  /**
  * Number of seconds to rewind before the target jump position.
  * This provides context by starting slightly earlier than the requested timestamp.
  *
  * @example If set to 2 and user jumps to 2m04s, playback starts at 2m02s
  * @defaultValue 2
  */
  jump_after_offset: number

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
      player: true,
      transcription: true,
      loop_bloc: false,
      jump_before_offset: 2,
      jump_after_offset: 2,
      number_segment:false,
      unlabelled_span: true,
    })

    return {
      options,
  }
})
