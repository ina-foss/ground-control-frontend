<template>
  <molecule-span-wrapper class="col-span-8 flex">
    <div :class="` flex flex-col h-full relative `">
      <div class="grow h-0 flex justify-center relative overflow-visible ">
        <ScrollPanel class="h-full pr-2 overflow-x-visible ">
          <div  ref="blockArray" class="text-sm/4 p-lg bg-grey-150 rounded-md gap-sm flex flex-col" >
            <Skeleton width="75ch" height="160px" />
            <Skeleton width="75ch" height="91px" />
            <Skeleton width="75ch" height="400px"/>
            <Skeleton width="75ch" height="61px"/>
            <Skeleton width="75ch" height="560px" />
            <Skeleton width="75ch" height="91px" />
            <Skeleton width="75ch" height="400px"/>
            <Skeleton width="75ch" height="61px"/>
          </div>
        </ScrollPanel>
      </div>
    </div>
    <div class="flex flex-col items-center w-full h-full gap-10 overflow-hidden ">
              <Tabs value="span" class="w-full h-full flex flex-col">
                <TabList  >
                  <Tab value="span">Spans</Tab>
                  <Tab value="parameters">Paramètres</Tab>
                </TabList>
                <ScrollPanel class="pr-2 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-170px)]" >
                <TabPanels class="!bg-secondary  w-full !pl-0 !pb-2 flex-1">
                  <TabPanel value="span" class="flex-col flex flex-1 items-center gap-3">
                    <Skeleton height="100px"/>
                    <Skeleton height="50px"/>
                    <Skeleton height="60px"/>
                  </TabPanel>
                </TabPanels>
                </ScrollPanel>
              </Tabs>
    </div>
  </molecule-span-wrapper>
</template>
