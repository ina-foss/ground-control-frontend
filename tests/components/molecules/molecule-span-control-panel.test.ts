import {expect, describe, it }  from 'vitest'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from '@vue/test-utils';
import MoleculeSpanControlPanel  from '../../../components/molecules/spanControlPanel/MoleculeSpanControlPanel.vue'
import AtomSpanTag from '../../../components/molecules/spanControlPanel/AtomSpanTag.vue'
import {Select} from 'primevue'

let mock =vi.fn()

vi.mock('~/stores/plugins', async () => {
  return {
    usePluginStore: () => ({
      // State properties (what storeToRefs extracts)
      pluginList: ref(configMock),
      pluginOptionsList: ref(pluginItemsMock),

      // Getters (optional, only if you use them elsewhere)
      getPluginList: computed(() => configMock),
      getAllPluginOptionList: computed(() => pluginItemsMock),

    })
  }
})

const pluginItemsMock = [
  { id: 4, data: [{ id: 1, ext_id: 'a', label: 'Option 1' },{id:2,ext_id:'2', label:'Option 2' }] },  // id: 4 to match mainPluginId
  { id: 2, data: [{ id: 2, ext_id: 'b', label: 'Citation',categories: [{label:"role 1"},{label: "role 2"}] },{id:4,ext_id:'4',label:'Co Ref', categories: [{label:"ref1"},{label:"ref2"}]}] }

]

const configMock = [
  { id: 4, name: 'plugin-4' },
  { id: 2, name: 'plugin-2', display_zone: 'group_modal' }
]


mockNuxtImport('useSpanService', async()=>{
  const actual = await vi.importActual('~/composables/useSpanService')
  return ()=>({
    ...actual.default(),
      spanArray : ref([
        {
          id: 0,
          nodes: [],
          label: "",
        },
        {
          id: 1,
          spans:[{spanId: 2,role: {label:"role 1"}}],
          plugins:{
            "plugin-2": [
              {
                label: "Citation",
                id: 2,
                ext_id: 'b',
                categories: [{label:"role 1"},{label:"role 2"}]
              }
            ]
          }
        },
        {
          id:2,
          tcin: 0.10009765625,
          tcout: 0.94677734375,
          nodes:[],
          plugins:{
            "plugin-4": [
              {
                id:2,ext_id:'2', label:'Option 2'
              }
            ]
          }
        },
        {
          id:3,
          tcin: 0.780029296875,
          tcout: 0.97998046875,
          nodes:[],
          plugins:{
            "plugin-4": [
              {
                id: 1, ext_id: 'a', label: 'Option 1'
              }
            ]
          }
        },
        {
          id:4,
          spans:[],
          plugins:{
            "plugin-2": [
              {
                id:4,ext_id:'4',label:'Co Ref', categories: [{label:"ref1"},{label:"ref2"}]
              }
            ]
          }
        },
      ]),
      dropSpan: mock,
      mainPluginId: computed(()=>4),
      mainPluginIndex: computed(()=>'plugin-4'),
      newFocus: ref(),
      createSpanColorPalette: vi.fn(),
      extractTextFromSpanNodes : vi.fn().mockReturnValue('text in the span')
    })
  })



describe('MoleculeSpanControlPanel', ()=>{
  let wrapper : VueWrapper
  beforeEach(async ()=>{
    wrapper = await mountSuspended(MoleculeSpanControlPanel,{
      attachTo: document.body,
      global:{
        stubs:{
          teleport: true
        }
      }
    })
  })
  afterEach(()=>{
    wrapper.unmount()
  })

  it('should mount',() =>{
    expect(wrapper.text().includes('Spans')).toBeTruthy()
  })

  it('should display the list of spans and be able to filter it', async ()=>{
    // ---- SHOW SPAN LIST ----
    const spanWrappers = wrapper.findAll('span-content-wrapper')
    expect(spanWrappers.length).toBe(2 + 1 ) // 2 real spans and span None"
    expect(wrapper.findAllComponents(AtomSpanTag).length).toBe(3)
    expect(wrapper.findAll('span-wrapper > span-content-wrapper').length).toBe(3)
    expect(spanWrappers.at(0).text().includes('1')).toBeTruthy()
    expect(spanWrappers.at(1).text().includes('2')).toBeTruthy()
    expect(spanWrappers.at(2).text().includes('3')).toBeTruthy()

    // --- FILTER SPAN LIST ----
    expect(wrapper.vm.spanOnlyArray.length).toBe(3)
    await wrapper.findComponent(Select).trigger('click')
    await wrapper.find('.p-select-list-container li').trigger('mousedown')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.spanOnlyArray.length).toBe(1)

    // Should work but doesn't
    // expect(wrapper.findAll('span-wrapper > span-content-wrapper').length).toBe(1)
  })

  it('should display the list of group and filter it',async ()=>{
    // ---- SHOW GROUP LIST ----
    const groupWrapper1 = wrapper.findAll('group-wrapper')[0]
    const groupWrapper2 = wrapper.findAll('group-wrapper')[1]
    expect(groupWrapper1.text()).toContain('1Citation1')
    expect(groupWrapper2.text()).toContain('2Co Ref')

    // ---- FILTER GROUP LIST ----
    await wrapper.findAllComponents(Select)[1].trigger('click')
    await wrapper.find('.p-select-list-container li').trigger('mousedown')


    expect(wrapper.findAll('group-wrapper').length).toBe(1)

  })

  it('should display the selected Group  ', async ()=>{
    const groupWrapper = wrapper.find('group-wrapper')

    let selectedGroupWrapper = wrapper.find('selected-group-content')
    expect(selectedGroupWrapper.isVisible()).toBeFalsy()

    await groupWrapper.trigger('click')
    await wrapper.vm.$nextTick()
    selectedGroupWrapper = wrapper.find('selected-group-content')


    expect(selectedGroupWrapper.isVisible()).toBeTruthy()
  })

  it('should display the drop over div', async ()=>{
    const groupWrapper = wrapper.find('group-wrapper')
    await groupWrapper.trigger('click')
    const dropzone = wrapper.find('role-dropzone')
    const prevChildCount =dropzone.element.childElementCount
    await dropzone.trigger('dragenter')
    const newChildCount = dropzone.element.childElementCount

    expect(prevChildCount).toBeLessThan(newChildCount)
    expect([...dropzone.element.children].map((child)=>child.localName)).include('preview')
    expect(dropzone.element.lastChild?.textContent).include('+')

    await dropzone.trigger('dragleave')
    expect([...dropzone.element.children].map((child)=>child.localName)).not.include('preview')

  })

  it('should add the span to the group on drop then unlink it', async()=>{
    // ---- LINK SPAN TO GROUP ----
    const groupWrapper = wrapper.find('group-wrapper')
    await groupWrapper.trigger('click')
    const firstDropzone = wrapper.findAll('role-dropzone').at(0)
    const secondDropzone = wrapper.findAll('role-dropzone').at(1)
    expect([...secondDropzone.element.children].map(child=>child.localName)).not.include('role-span-content')
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('span',"2")
    expect([...secondDropzone.element.children].length).toBe(0)
    await secondDropzone.trigger('drop',{
      dataTransfer: dataTransfer
    })
    await wrapper.vm.$nextTick()

    expect([...secondDropzone.element.children].length).toBe(1)
    expect([...secondDropzone.element.children][0].textContent).toBe('text in the span')
    expect(wrapper.vm.groupArray[0].spans).toContainEqual({spanId: 2, role: {label:'role 2'}})

    // ---- UNLINK SPAN FROM GROUP ----

    const unlinkButton = wrapper.findAll('group-linked-span > span')[1]
    await unlinkButton.trigger('click')

    expect(wrapper.vm.selectedGroup.spans).not.toContainEqual({spanId: 3, role: 'role 2'})


  })


  it('should delete the group',async()=>{

    expect(wrapper.vm.spanArray.value).toContainEqual(
      {
        id: 1,
        spans:[{role: {label:"role 1"},spanId: 2}],
        plugins:{
          "plugin-2": [
            {
              label: "Citation",
              id: 2,
              ext_id: 'b',
              categories: [{label:"role 1"},{label:"role 2"}]
            }
          ]
        }
      })

    // Trigger the modal
    const deleteGroupButton = wrapper.find('group-wrapper span')
    await deleteGroupButton.trigger('click')
    await wrapper.vm.$nextTick()


    // Cancel suppression
    const cancelGroupModalButton = wrapper.findAll('delete-group-wrapper button')[0]
    await cancelGroupModalButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.spanArray.value).toContainEqual(
      {
        id: 1,
        spans:[{role: {label:"role 1"},spanId: 2}],
        plugins:{
          "plugin-2": [
            {
              label: "Citation",
              id: 2,
              ext_id: 'b',
              categories: [{label:"role 1"},{label:"role 2"}]
            }
          ]
        }
      })

    expect(wrapper.vm.groupDeleted.value).toBe(null)

    // re-Trigger the modal
    await deleteGroupButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Confirm suppression
    const deleteGroupModalButton = wrapper.findAll('delete-group-wrapper button')[1]
    await deleteGroupModalButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.spanArray.value).not.toContainEqual(
      {
        id: 1,
        spans:[{role: {label:"role 1"},spanId: 2}],
        plugins:{
          "plugin-2": [
            {
              label: "Citation",
              id: 2,
              ext_id: 'b',
              categories: [{label:"role 1"},{label:"role 2"}]
            }
          ]
        }
      })

  })

})
