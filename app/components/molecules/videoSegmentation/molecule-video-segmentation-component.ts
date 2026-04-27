import useTimeline from '~/composables/useTimeline';
import { usePlayer } from '~/composables/usePlayer';
import type AmaliaPlayerService from '~/services/amalia-player-service';
import TimelineManager from '~/utils/vis-timeline/timeline-manager';
import AtomSegmentForm from '~/components/atoms/segmentForm/AtomSegmentForm.vue';
import _ from 'lodash'
import {extractVideoSegments, convertDatasetToAmalia} from '~/utils/vis-timeline/video';

export default defineComponent({
  name: 'MoleculeVideoSegmentation',
  components: {AtomSegmentForm},
  props:{
    block: Object
  },
  setup(props) {

    const {block} = props

    let timelineManager: TimelineManager;

    const player = ref<AmaliaPlayerService>();
    const selectedSegment = ref<any>();
    const segmentForm = ref()


    const annotationRegister = useAnnotationTypeRegistry()

    const splitOverride = () => {
      if(selectedSegment.value == undefined) return
      if (selectedSegment.value.group == 2) {
        const currentTime = timelineManager.video.callSeek() * 1000;
        timelineManager.segmentManager.splitItem(
          currentTime,
          selectedSegment.value.id,
        );
      }
    };

    onMounted(async () => {
      try {
            player.value = await usePlayer();
            timelineManager = useTimeline({items: extractVideoSegments(block),handlers:{"split":splitOverride}});
            timelineManager.on('split', callbackReportSplitting);
            timelineManager.on('fusion',callbackReportFusion)
            timelineManager.on('select', (event) => {
              const segmentId = event.items[0];
              const segment = timelineManager.items.get(segmentId);

              selectedSegment.value = segment;
            });
            timelineManager.on('doubleClick', (event) => {
              doubleClickCallback(event)
            })
            annotationRegister(
              'timeline',
              {
                formatForSave: (locals,block,meta)=>{
                  if(block){
                    const patched = _.cloneDeep(block)

                    patched.localisation[0].sublocalisations.localisation = convertDatasetToAmalia(timelineManager.items)

                    return patched
                  }
                  else console.log('pas de block')
                }
              }
            )
            annotationRegister(
            'init-STREAMedia',
            {
              formatForSave: (data,block,meta)=>{
                if(!data.find( d => d.type == 'timline') && data.length == 1 ) {
                  data.push({...data[0],localisation:[{sublocalisations:{localisation:[]}}],type:'timeline'})
                }
               return data
              }
          }
        )


      } catch (e) {
        console.error(e);
      }
    });

    function doubleClickCallback(event) {
        // open the segment modal
        const segment = timelineManager.segmentManager.getSegmentsByTime(event.time, event.group)[0]
        if(segment.group == 1) return // use transcription to annotate those segments
        if(segment.start == 0 && segment.end == timelineManager.video.getDuration()) return
        segmentForm.value.open(segment)
    }

    function createSegment(segment){
      segment.content = Object.values(segment.plugins).find(plugin=>plugin.length)[0].label
      timelineManager.items.update(segment)
    }

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

    function callbackReportFusion(tc: number,newItem: any){
      if(newItem.group == 3) return
      const segments = timelineManager.segmentManager.getSegmentsByTime(tc,3)
      timelineManager.segmentManager.fusionItems(...segments)
    }


    return {
      player,
      segmentForm,
      createSegment
    };
  },
});
