import useTimeline from '~/composables/useTimeline';
import { usePlayer } from '~/composables/usePlayer';
import type AmaliaPlayerService from '~/services/amalia-player-service';
import TimelineManager from '~/utils/timeline-manager';

export default defineComponent({
  name: 'MoleculeVideoSegmentation',
  setup() {
    let timelineManager: TimelineManager;

    const player = ref<AmaliaPlayerService>();
    const selectedSegment = ref<any>();

    const splitOverride = () => {
      if (selectedSegment.value.group == 2) {
        const currentTime = timelineManager.video.callSeek() * 1000;
        timelineManager.segmentManager.splitItem(
          currentTime,
          selectedSegment.value.id,
        );
      }
    };

    onMounted(() => {
      try {
        const playerOrPromise = usePlayer();

        if (playerOrPromise instanceof Promise) {
          playerOrPromise.then((value) => {
            player.value = value;
          });
        }
        timelineManager = useTimeline({handlers:{"split":splitOverride}});
        timelineManager.on('split', callbackReportSplitting);
        timelineManager.on('select', (event) => {
          const segmentId = event.items[0];
          const segment = timelineManager.items.get(segmentId);
          selectedSegment.value = segment;
        });
      } catch (e) {
        console.error(e);
      }
    });

    function callbackReportSplitting(id: number) {
      const splittedSegment = timelineManager.items.get(id);

      if (splittedSegment.group == 3) return; // if the event emited from splittig the third row, don't spit again

      const targetSegment = timelineManager.segmentManager.getSegmentsByTime(
        splittedSegment.start,
        3,
      )[0];

      timelineManager.segmentManager.splitItem(
        splittedSegment.start,
        targetSegment.id,
      );
    }

    return {
      player,
    };
  },
});
