import { z } from 'zod'

const optionsSchema = z.strictObject({
  /**
   * If the video is sync to the transcription scrolling
   * @defaultValue `true`
   */
  player: z.boolean(),

  /** If the click on the transcription update video time
   * @defaultValue `true`
   */
  transcription: z.boolean(),

  /** If the player stops at the end of the selected segment
   * @defaultValue `false`
   */
  loop_bloc: z.boolean(),

  /**
  * Number of seconds to rewind before the target jump position.
  * This provides context by starting slightly earlier than the requested timestamp.
  *
  * @example If set to 2 and user jumps to 2m04s, playback starts at 2m02s
  * @defaultValue 2
  */
  jump_before_offset: z.number(),

  /**
  * Number of seconds to rewind before the target jump position.
  * This provides context by starting slightly earlier than the requested timestamp.
  *
  * @example If set to 2 and user jumps to 2m04s, playback starts at 2m02s
  * @defaultValue 2
  */
  jump_after_offset: z.number(),

  /**
   * Whether or not the user need to hold down the Ctrl Key when clicking a word to jump in the media
   *
   * @defaultValue `true`
   */
  ctrlWordClick: z.boolean(),

  /** if the span are displayed
   * @defaultValue `true`
   */
  span: z.boolean(),

  /** if the timecode are showed for each bloc
   * @defaultValue `true`
   */
  timecode_bloc: z.boolean(),

  /** if the timecode are showed for each segment
   * @defaultValue `false`
   */
  timecode_segment: z.boolean(),

  /** if the annotations are divided by bloc
   * @defaultValue `false`
   */
  bloc: z.boolean(),

  /** if the number are showed for each segment
   * @defaultValue `false`
   */
  number_segment: z.boolean(),

  /** if you can create a span without any label
  * @defaultValue true
  */
  unlabelled_span: z.boolean(),
});

export type Options = z.infer<typeof optionsSchema>



export type AnnotationMode = 'read' | 'edit' | 'none'

export const useOptions = defineStore("annotation-options",() => {

    const options = ref<Options>({
      span: true,
      timecode_bloc: true,
      timecode_segment:false,
      bloc: true,
      player: true,
      transcription: true,
      loop_bloc: false,
      jump_before_offset: 2,
      jump_after_offset: 2,
      ctrlWordClick: true,
      number_segment:false,
      unlabelled_span: true,
    })

    const videoOptionPM = usePersistence<Options>('span-annotation-option',options.value, optionsSchema)

    watch(
      () => options.value,
      (newValue) => {
        videoOptionPM.save(newValue)
      },
      { deep: true },
    );

    onMounted(()=>{
        const previousOptions = videoOptionPM.get()?.items
        if(previousOptions) Object.assign(options, previousOptions)
        else videoOptionPM.save(options.value)
    })

    return {
      options
  }
})
