import _ from 'lodash';
import { useService,useI18n } from '#imports';
import { ref,watch } from 'vue';
import settingIcon from '/icons/icons-svg/icons-svg/setting-icon.svg';

export default defineComponent({
  name: "AtomVideoAmalia",
  emits: ["timecode-update",'update:focusPlayer'],
  props: {
    media_params: {
      type: Object,
      default: () => null
    },
    locals: {
      type: Object,
      default: () => null
    },
    videoSrc: {
      type: String,
      default: ''
    },
    focusPlayer: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit,expose }) {

    const {$amalia, $application} = useService()
    const { media_params,locals,videoSrc } = toRefs(props)
    const { t } = useI18n();
    const myplayer = ref()
    let lastIndex = 0
    let dynamicSrc = ref()
    let dynamicTumbnails = ref()
    let waveformUrl = ref()
    const {unixToTimestamp} = $application
    const {getHistory, consumeTimecode} = useTimecodeHistory()

    const categories = ref([]);
    const selectedCategories = ref([]);


    let amaliaOptionPM = usePersistence<typeof selectedCategories.value>(
      'ground-control-amalia-preference',
      selectedCategories.value,
    );

    function retrieveLocalStorage() {
      const localStorageValues = amaliaOptionPM.get()?.items;
      if (localStorageValues) selectedCategories.value = localStorageValues;
    };

    watch(
      () => selectedCategories.value,
      (value) => {
        amaliaOptionPM.save(value);
      },
      {deep:true}
    );

    const timecodeHistory = getHistory

    const showRollback = computed(()=>{
      return timecodeHistory.value.length > 0
    })
    const focusPlayerModel  = computed({
      get: () =>  props.focusPlayer,
      set: (value) => emit('update:focusPlayer', value)
    })

    const resizeIcon = computed(() =>
      focusPlayerModel.value ? 'pi pi-arrow-down-left-and-arrow-up-right-to-center' : 'pi pi-arrow-up-right-and-arrow-down-left-from-center'
    )
    const resizeLabel = computed(() =>
      focusPlayerModel.value
        ? t('player.actions.shrink')
        : t('player.actions.expand')
    )
    const actionsRef = ref<HTMLElement | null>(null)
    const isCompact = ref(false)
    let observer: ResizeObserver | null = null

    const visibleRight = ref(false);
    const audioCategories = computed(() => [
      { name: t('player.config.audio.backwardSecond'), key: "backward-second" },
      { name: t('player.config.audio.forwardSecond'), key: "forward-second" }
    ]);

    const videoCategories = computed(() => [
      { name: t('player.config.video.backwardStart'), key: "backward-start" },
      { name: t('player.config.video.forwardEnd'), key: "forward-end" },
      { name: t('player.config.video.forward'), key: "forward" },
      { name: t('player.config.video.backward5Seconds'), key: "backward-5seconds" },
      { name:  t('player.config.video.forward5Seconds'), key: "forward-5seconds" },
      { name: t('player.config.video.volume'), key: "volume" },
      { name: t('player.config.video.toggleFullScreen'), key: "toggleFullScreen" }
    ]);

    watch([selectedCategories, visibleRight], async () => {
      const unselectedCategories=categories.value.filter(cat => !selectedCategories.value.includes(cat.key)).map(cat => cat.key);
      if (visibleRight.value === false) {
        await Promise.all([hlsPlayer(), playerParams()]).then(()=>{

          if (dynamicSrc.value) {
            myplayer.value.removeChild(myplayer.value.firstChild);
            myplayer.value?.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value, media_params.value, dynamicTumbnails?.value || "",  getMediaType(videoSrc),waveformUrl?.value ||"",unselectedCategories))
          }
        });
      }
    }, { deep: true });


    onMounted(async () => {
      await Promise.all([hlsPlayer(), playerParams()]).then(()=>{
        if (dynamicSrc.value) {
          const mediaType = getMediaType(videoSrc);

          if (mediaType === 'audio') {
            categories.value = audioCategories.value;
          } else {
            categories.value = videoCategories.value;
          }
          selectedCategories.value = categories.value.map(cat => cat.key);

          amaliaOptionPM = usePersistence(
                `ground-control-amalia-${mediaType}-preference`,
                selectedCategories.value,
              );
          retrieveLocalStorage()
          myplayer.value?.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value, media_params.value, dynamicTumbnails?.value || "",  getMediaType(videoSrc),waveformUrl?.value ||"")) // add amalia player once src is ready
        }
      });
      if (!actionsRef.value) return
      observer = new ResizeObserver(entries => {
        const width = entries[0].contentRect.width
        isCompact.value = width < 330
      })
      observer.observe(actionsRef.value)
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
    })

    function handleRewindTimecode(index?:any) {
      const tc = consumeTimecode(index)
      $amalia.updateCurrentTc(unixToTimestamp(tc))
      seek()
    }

    const hlsPlayer = async () => {
      const content = await fetchVideoStream(videoSrc)
      const src = `data:application/vnd.apple.mpegurl;base64,${content}`
      dynamicSrc.value = src
    }

    async function fetchVideoStream(url) {
      const response = await fetch(url.value);
      const videoHls = response.text();
      return videoHls;
    }

    const getMediaType=(url:string) => {
      const parsedUrl = new URL(url.value);
      return parsedUrl.searchParams.get("typemedia")??""
    }

    const playerParams = async () => {
      if (media_params.value?.thumbnail_base_url) {
        dynamicTumbnails.value = await fetchRedirectUrl(media_params.value?.thumbnail_base_url)
      }
      if (media_params.value?.waveform_base_url) {
        waveformUrl.value = await fetchRedirectUrl(media_params.value?.waveform_base_url)
      }
    }

    async function fetchRedirectUrl(url: string) {
      const response = await fetch(url, {headers:media_params.value?.headers??new Headers()}).then((resp) => {
        return resp.text()
      });
      return response;
    }

    const seek = async (fromHistory?: boolean) => {
      if (myplayer.value) {
        const currentTime = $amalia.callSeek() // retreive the current time of the video
        let startIndex = 0
        let endIndex = locals.value.length - 1
        while (Math.abs(startIndex - endIndex) > 1) { // binary search of the 2 segments surruonding the videotime
          const mid = Math.floor(((endIndex + startIndex) / 2))
          $application.unixToTimestamp(locals.value[mid].tcin) >= currentTime ? endIndex = mid : startIndex = mid
        }

        const bestIndex = currentTime < $application.unixToTimestamp(locals.value[endIndex].tcin) ? startIndex : endIndex

        emit('timecode-update', {tcin: currentTime, lastIndex: lastIndex, bestIndex: bestIndex, fromHistory: fromHistory}) // emit both times to scroll and adapt css
        lastIndex = bestIndex
      }
    }
    const annotation_type = inject('annotation_type')

    expose({seek, consumeTimecode: handleRewindTimecode});

    return {
      showRollback,
      handleRewindTimecode,
      seek,
      myplayer,
      dynamicSrc,
      visibleRight,
      categories,
      selectedCategories,
      focusPlayerModel,
      t,
      resizeIcon,
      resizeLabel,
      actionsRef,
      isCompact,
      annotation_type
    }
  }



})
