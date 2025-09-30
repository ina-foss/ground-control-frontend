import _ from 'lodash';
import { useService } from '#imports';
import { ref,watch } from 'vue';
import settingIcon from '../../public/icons/icons-svg/icons-svg/setting-icon.svg';

export default defineComponent({
  name: "AtomVideoAmalia",
  emits: ["timecode-update"],
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
    const {unixToTimestamp} = $application
    const {getHistory, consumeTimecode} = useTimecodeHistory()

    const timecodeHistory = getHistory

    const showRollback = computed(()=>{
      return timecodeHistory.value.length > 0
    })


    const visibleRight = ref(false);
    const categories = ref([]);
    const audioCategories = [
      { name: "Retour 1 seconde par 1 seconde", key: "backward-second" },
      { name: "Avance 1 seconde par 1 seconde", key: "forward-second" }
    ];

    const videoCategories = [
      { name: "Retour 5 secondes par 5 secondes", key: "backward-5seconds" },
      { name: "Avance 5 secondes par 5 secondes", key: "forward-5seconds" },
      { name: "Retour image par image", key: "backward-frame" },
      { name: "Avance image par image", key: "forward-frame" },
      { name: "Retour ralenti", key: "slow-backward" },
      { name: "Avance ralentie", key: "slow-forward" }
    ];
    const selectedCategories = ref([]);

    watch([selectedCategories, visibleRight], async () => {
      const unselectedCategories=categories.value.filter(cat => !selectedCategories.value.includes(cat.key)).map(cat => cat.key);
      if (visibleRight.value === false) {
        await Promise.all([hlsPlayer(), playerParams()]).then(()=>{

          if (dynamicSrc.value) {
            myplayer.value.removeChild(myplayer.value.firstChild);
            myplayer.value?.appendChild($amalia.createPlayer('PLAYER', dynamicSrc.value, media_params.value, dynamicTumbnails?.value || "", downloadUrl?.value || "", getMediaType(videoSrc),waveformUrl?.value ||"",unselectedCategories))
          }
        });
      }
    }, { deep: true });


    onMounted(async () => {
      await Promise.all([hlsPlayer(), playerParams()]).then(()=>{
        if (dynamicSrc.value) {
          const mediaType = getMediaType(videoSrc);

          if (mediaType === 'audio') {
            categories.value = audioCategories;
          } else {
            categories.value = videoCategories;
          }
          selectedCategories.value = categories.value.map(cat => cat.key);
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
      visibleRight,
      categories,
      settingIcon,
      selectedCategories
    }
  }



})
