  <template>
    <div class="card flex-grow h-0 max-h-full  pb-3">

      <Tabs :value="selectedTab" scrollable class="card h-full rounded-b-lg !bg-white">
        <TabList v-if="tabs.length > 0" >
          <Tab v-for="(tab,index) in tabs" :key="index" :value="index" class="!bg-white">
            {{ tab.title }}
          </Tab>
        </TabList>
        <ScrollPanel class="h-full" :dt="{
      bar : {
        background: 'var(--primary-color)',
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
        <TabPanels v-if="tabs.length > 0" class=" md:block flex-grow h-0 max-h-full ">

          <TabPanel v-for="(tab,index) in tabs" :key="index" :value="index">

              <AtomMarkdown :content="tab.text"/>
          </TabPanel>
        </TabPanels>
        </ScrollPanel>
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
