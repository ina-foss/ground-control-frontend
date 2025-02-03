  <template>
    <div class="card">
      <Tabs :value="selectedTab" scrollable class="card rounded-b-lg  overflow-auto">
        <TabList v-if="tabs.length > 0" >
          <Tab v-for="(tab,index) in tabs" :key="index" :value="index" >
            {{ tab.title }}
          </Tab>
        </TabList>
        <TabPanels v-if="tabs.length > 0" class=" md:block xs:hidden">
          <TabPanel v-for="(tab,index) in tabs" :key="index" :value="index" class="h-full p-1">
            <ScrollPanel class="max-h-[450px] overflow-y-auto">
              <AtomMarkdown :content="tab.text"/>
            </ScrollPanel>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </template>

  <script setup lang="ts">
import AtomMarkdown from "../atoms/AtomMarkdown.vue";
  interface tabItem{
    title:string;
    text:string;
  }
  const tabs=ref<tabItem[]>([])
  const selectedTab = ref(0);
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
