  <template>
    <div class="card h-[50%] !bg-[#212529]">
      <Tabs :value="selectedTab" scrollable class="m-0  !bg-[#212529] text-white">
        <TabList :pt="{
        tablist:{
          style: 'background-color:#212529;'
        }
      }" v-if="tabs.length > 0" class="m-0  !bg-[#212529] text-white">
          <Tab v-for="(tab,index) in tabs" :key="index" :value="index" class="m-0 !bg-[#212529] text-white">
            {{ tab.title }}
          </Tab>
        </TabList>
        <TabPanels v-if="tabs.length > 0" class=" h-[290px] !bg-[#212529] text-white md:block xs:hidden">
          <TabPanel v-for="(tab,index) in tabs" :key="index" :value="index" class="h-full bg-[#212529] text-white p-3">
            <ScrollPanel class="h-[240px]">
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
