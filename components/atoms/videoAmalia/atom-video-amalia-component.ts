import _ from 'lodash';
import { useService } from '#imports';

export default defineComponent({
  name: "AtomVideoAmalia",
  emits: ["timecode-update"],
  components:{
  },
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
    }
  },
  setup(props, { emit,expose }) {

    const {$amalia, $application} = useService()
    const { media_params,locals,videoSrc } = toRefs(props)

    const myplayer = ref()
    let lastIndex = 0
    let dynamicSrc = ref()
    let dynamicTumbnails = ref()
    let downloadUrl = ref()
    let waveformUrl = ref()
    const {timestampToUnix, unixToTimestamp} = $application
    const {getHistory, consumeTimecode} = useTimecodeHistory()

    const timecodeHistory = getHistory

    const showRollback = computed(()=>{
      return timecodeHistory.value.length > 0
    })

    onMounted(async () => {
      await Promise.all([hlsPlayer(), playerParams()]).then(()=>{
        if (dynamicSrc.value) {
          myplayer.value?.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value, media_params.value, dynamicTumbnails?.value || "", downloadUrl?.value || "", getMediaType(videoSrc),waveformUrl?.value ||"")) // add amalia player once src is ready
        }
      });

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

    const getMediaType=(url:string)=>{
      const parsedUrl = new URL(url.value);
      return parsedUrl.searchParams.get("typemedia")??""
    }

    const playerParams = async () => {
      if (media_params.value?.thumbnail_base_url) {
        dynamicTumbnails.value = await fetchRedirectUrl(media_params.value?.thumbnail_base_url)
      }
      if (media_params.value?.download_base_url) {
        downloadUrl.value = await fetchRedirectUrl(media_params.value?.download_base_url)
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

        let bestIndex = currentTime < $application.unixToTimestamp(locals.value[endIndex].tcin) ? startIndex : endIndex

        emit('timecode-update', {tcin: currentTime, lastIndex: lastIndex, bestIndex: bestIndex, fromHistory: fromHistory}) // emit both times to scroll and adapt css
        lastIndex = bestIndex
      }
    }

    expose({seek, consumeTimecode: handleRewindTimecode});

    return {
      showRollback,
      handleRewindTimecode,
      seek,
      myplayer,
      dynamicSrc,
    }
  }



})
