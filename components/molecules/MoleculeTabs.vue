  <template>
    <div class="card flex-grow h-0 max-h-full  pb-3">

      <Tabs :value="0" scrollable class="card h-full rounded-b-lg !bg-white">
        <TabList >
          <Tab  v-if="tabs.length > 0" v-for="(tab,index) in tabs" :key="index" :value="index" class="!bg-white">
            {{ tab.title }}
          </Tab>
          <Tab class="!bg-white" :value="(tabs.length > 0 && tabs.length==2)?2:(tabs.length > 0 && tabs.length==1)?1:0">Derniers Timecodes</Tab>
          <Tab v-if="transcriptions" class="!bg-white" :value="4">Résumé</Tab>
          <Tab v-if="transcriptions" class="!bg-white" :value="5">Phrases</Tab>
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
        <TabPanel v-if="transcriptions" :value="5">
          <Carousel
              ref="carouselRef"
              :show-indicators="false" vertical-view-port-height="550px" :value="transcriptions"
              :prev-button-props="{class: ' z-index-50  !self-end order-first', severity:'secondary', text:true }"
              :next-button-props="{class: ' z-index-50  !absolute mr-10 !self-end order-first  ', severity:'secondary', text:true }"
              :num-visible="1" :num-scroll="1" orientation="vertical" container-class="flex items-center" content-class="w-full"
              @update:page=" onUpdatePage"
            >
              <template #item="slotProps" >
                <div class="h-[450px] overflow-auto " >
                  <AtomSentence :transcriptions="slotProps.data"/>
                </div>
              </template>
            </Carousel>
        </TabPanel>
      </TabPanels>
      </ScrollPanel>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import AtomMarkdown from "../atoms/AtomMarkdown.vue";
import AtomTimecodeList from "../atoms/AtomTimecodeList.vue";
import AtomSentence from "../atoms/sentence/AtomSentence.vue"
import MoleculeTranscription from "../../components/molecules/MoleculeTranscription.vue"
import {AnnotationStatus} from '../../api/generate';

const carouselRef = ref()
const currentPage = computed(()=>carouselRef.value.d_page)
const moleculeAnnotationRef = ref()
const jumpToTopic = inject('jumpToTopic')

let skipNextUpdate = false
const onUpdatePage = (value) => {
  if (skipNextUpdate == true ) {
    skipNextUpdate = false
    return
  }
  else if( value == -1 ){
    skipNextUpdate = true
    return
  }
  jumpToTopic({topic:transcriptions[value][0].data.topic})
}

const carouselNavTo = (index) =>  {
    // emit to don't trigger scroll after update:page
    carouselRef.value.$emit('update:page',-1)
    if( currentPage.value < index){
      carouselRef.value.navForward(new Event("click"),index)
    }
    else{
      carouselRef.value.navBackward(new Event("click"),index)
    }
}

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

defineExpose({moleculeAnnotationRef: moleculeAnnotationRef, sentenceCarouselFunction: carouselNavTo})

</script>
