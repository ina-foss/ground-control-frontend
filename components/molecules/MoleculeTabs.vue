  <template>
    <div class="card flex-grow h-0 max-h-full  pb-3">

      <Tabs :value="0" scrollable class="card h-full rounded-b-lg !bg-white">
        <TabList >
          <Tab  v-if="tabs.length > 0" v-for="(tab,index) in tabs" :key="index" :value="index" class="!bg-white">
            {{ tab.title }}
          </Tab>
          <Tab class="!bg-white" :value="(tabs.length > 0 && tabs.length==2)?2:(tabs.length > 0 && tabs.length==1)?1:0">Derniers Timecodes</Tab>
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
            <AtomTimecodeList class="pb-4"/>
          </TabPanel>
        </TabPanels>
        </ScrollPanel>
      </Tabs>
    </div>
  </template>

  <script setup lang="ts">
import AtomMarkdown from "../atoms/AtomMarkdown.vue";
import AtomTimecodeList from "../atoms/AtomTimecodeList.vue";
  interface tabItem{
    title:string;
    text:string;
  }
  const tabs=ref<tabItem[]>([])
  const props = defineProps({
    data: {
      type: Object,
      default: () => null
    }
  })
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
  </script>
