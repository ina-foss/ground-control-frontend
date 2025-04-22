  <template>
    <div class="card flex-grow h-0 max-h-full  pb-3">

      <Tabs :value="0" scrollable class="card h-full rounded-b-lg !bg-white">
        <TabList >
          <Tab  v-if="tabs.length > 0" v-for="(tab,index) in tabs" :key="index" :value="index" class="!bg-white">
            {{ tab.title }}
          </Tab>
          <Tab class="!bg-white" :value="(tabs.length > 0 && tabs.length==2)?2:(tabs.length > 0 && tabs.length==1)?1:0">Derniers Timecodes</Tab>
          <Tab v-if="transcriptions" class="!bg-white" :value="4">Résumé</Tab>
        </TabList>
        <ScrollPanel class="h-full" :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'3px'
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
      <TabPanels  class=" md:block flex-grow h-0 max-h-full">
        <TabPanel v-if="tabs.length > 0" v-for="(tab,index) in tabs" :key="index" :value="index">
            <AtomMarkdown :content="tab.text"/>
        </TabPanel>
        <TabPanel :value="(tabs.length > 0 && tabs.length==2)?2:(tabs.length > 0 && tabs.length==1)?1:0">
          <AtomTimecodeList class="pb-4" :thumbnailUrl="data.media.player_parameters?.thumbnail_base_url"/>
        </TabPanel>
        <TabPanel v-if="transcriptions" :value="4">
            <MoleculeTranscription ref="moleculeAnnotationRef" :transcriptions="transcriptions" :userAnnotations="userAnnotations" :status="status"  />
        </TabPanel>
      </TabPanels>
      </ScrollPanel>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import AtomMarkdown from "../atoms/AtomMarkdown.vue";
import AtomTimecodeList from "../atoms/AtomTimecodeList.vue";
import AtomTrancription from "../atoms/AtomTrancription.vue";
import MoleculeTranscription from "../../components/molecules/MoleculeTranscription.vue"
import {AnnotationStatus} from '../../api/generate';

const { topicList } = useTopicList()
const activeIndex =ref(0)
const moleculeAnnotationRef = ref()

interface tabItem{
  title:string;
  text:string;
}
const tabs=ref<tabItem[]>([])
const props = defineProps({
  status: {
    type: String,
    default: AnnotationStatus.DRAFT
  },
  data: {
    type: Object,
    default: () => null,
  },
  transcriptions: {
    type: Array<any>,
    default: () => null,
  },
  userAnnotations: {
    type: Array,
    default: () => []
  },
})

const  { transcriptions } = props

onMounted(()=>{
  if( props.data?.instruction!== "" && props.data?.instruction!== null){
    tabs.value.push({
      title:'Instruction',
      text:props.data.instruction,
    })
  }
  if(props.data?.documentation!== "" && props.data?.documentation!== null){

    tabs.value.push({
      title:'Documentation',
      text:props.data.documentation,
    })
  }

})

defineExpose({moleculeAnnotationRef: moleculeAnnotationRef})

</script>
