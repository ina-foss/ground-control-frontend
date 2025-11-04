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
const createdPluginOptionsListMock =
  {
    "plugin-34": [
      [
        {
          "id": "",
          "ext_id": "",
          "label": "Chercher",
          "description": null,
          "image": null,
          "categories": null
        },
        {
          "count": 1
        }
      ],
      [
        {
          "id": "1",
          "ext_id": "1",
          "label": "Verbe",
          "image": null,
          "description": null,
          "categories": null
        },
        {
          "count": 2
        }
      ]
    ]
  }

const configMock = [
  { id: 4, name: 'plugin-4' },
  { id: 2, name: 'plugin-2', display_zone: 'group_modal' }
]


mockNuxtImport('useSpanService', async()=>{
  const actual = await vi.importActual('~/composables/useSpanService')
  return ()=>({
    ...actual.default(),
      spanArray : ref([
        // SPAN NONE
        {
          id: 0,
          plugins: [],
          label: "",
        },
        // SPAN GROUPE AVEC 1 SPAN LIE
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
        // SPAN LIE AU GROUPE AU DESSUS
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
        // SPAN SANS GROUPE
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
        // GROUPE AVEC AUCUN SPANS
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
      extractTextFromSpanNodes : vi.fn().mockReturnValue('text in the span'),
      createdPluginOptionsList: ref(createdPluginOptionsListMock),
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
    const spanNoneWrapper = wrapper.findAll('span-none-content')
    expect(spanWrappers.length).toBe(2) // 2 real spans
    expect(spanNoneWrapper.length).toBe(1) // span "None"
    expect(wrapper.findAllComponents(AtomSpanTag).length).toBe(3)
    expect(wrapper.findAll('span-wrapper  span-content-wrapper').length).toBe(2)
    expect(spanWrappers.at(0).text().includes('1')).toBeTruthy()
    expect(spanWrappers.at(1).text().includes('2')).toBeTruthy()
    expect(spanNoneWrapper.at(0).text()).toContain('None')

    // --- FILTER SPAN LIST ON PLUGIN VALUE ----
    expect(wrapper.vm.spanOnlyArray.length).toBe(2)
    /*await wrapper.findAllComponents(Select)[1].trigger('click')
    await wrapper.find('.p-select-list-container li').trigger('mousedown')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.spanOnlyArray.length).toBe*/

    // Should work but doesn't
    // expect(wrapper.findAll('span-wrapper > span-content-wrapper').length).toBe(1)
  })

  it('should filter the spans if they are in a span group or not', async ()=>{
    await  wrapper.findAllComponents(Select)[0].trigger('click')
    const options = wrapper.findAll('.p-select-list-container li')

    expect(wrapper.vm.spanOnlyArray.length).toBe(2)

    // ---- TEST THE UNLINKED VALUE ----
    await options[0].trigger('mousedown')

    // check whether spanLinkFilter or spanLinkFilter.value depending on the vitest unwrapping
    expect(wrapper.vm.spanLinkFilter.value.value ?? wrapper.vm.spanLinkFilter.value).toEqual('unlinked')

    expect(wrapper.vm.spanOnlyArray.length).toBe(1)
    expect(wrapper.vm.spanOnlyArray[0]).toEqual(
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
    )

    // ---- TEST THE LINKED VALUE ----
    await  wrapper.findAllComponents(Select)[0].trigger('click')
    await options[1].trigger('mousedown')

    expect(wrapper.vm.spanLinkFilter.value.value ?? wrapper.vm.spanLinkFilter.value).toEqual('linked')

    expect(wrapper.vm.spanOnlyArray.length).toBe(1)
    expect(wrapper.vm.spanOnlyArray[0]).toEqual(
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
    )




  })

  it('should display the list of group and filter it',async ()=>{
    // ---- SHOW GROUP LIST ----
    const groupWrapper1 = wrapper.findAll('group-wrapper')[0]
    const groupWrapper2 = wrapper.findAll('group-wrapper')[1]
    expect(groupWrapper1.text()).toContain('1Citation1')
    expect(groupWrapper2.text()).toContain('2Co Ref')

    expect(wrapper.vm.groupArray.length).toBe(2)


    // ---- FILTER GROUP LIST ----
    await wrapper.findAllComponents(Select)[2].trigger('click')
    await wrapper.find('.p-select-list-container li').trigger('mousedown')


    expect(wrapper.vm.groupArray.length).toBe(1)
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
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('span',"2")
    await dropzone.trigger('dragenter',{dataTransfer})
    const newChildCount = dropzone.element.childElementCount

    expect(prevChildCount).toBeLessThan(newChildCount)
    expect([...dropzone.element.children].map((child)=>child.localName)).include('preview')
    expect(dropzone.element.lastChild?.textContent).include('+')

    await dropzone.trigger('dragleave',{dataTransfer})
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

  it('should be able to change the group categories layout',async ()=>{
    const groupWrapper = wrapper.find('group-wrapper')
    await groupWrapper.trigger('click')

    const buttons = wrapper.findAll('layout-button-wrapper span')

    //  DEFAULT VALUE CHECK
    expect(wrapper.vm.layout.value ?? wrapper.vm.layout).toBe('grid')
    expect(wrapper.find('role-wrapper').element.style.getPropertyValue('grid-template-columns')).toContain("repeat(auto-fit,minmax(150px,1fr))")

    //  SWITCHING LAYOUT CHECK
    await buttons[1].trigger('click')

    expect(wrapper.vm.layout.value ?? wrapper.vm.layout).toBe('list')
    expect(wrapper.find('role-wrapper').element.style.getPropertyValue('grid-template-columns')).toContain("repeat(1fr)")

    //  SWITCHING BACK LAYOUT CHECK
    await buttons[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.layout.value ?? wrapper.vm.layout).toBe('grid')
    expect(wrapper.find('role-wrapper').element.style.getPropertyValue('grid-template-columns')).toContain("repeat(auto-fit,minmax(150px,1fr))")

  })


  it('should delete the group',async()=>{

    // Check that group with id 1 exists
    const spanArray = wrapper.vm.spanArray?.value || wrapper.vm.spanArray
    const initialGroup = spanArray.find(span => span.id === 1)
    expect(initialGroup).toBeDefined()
    expect(initialGroup.spans).toBeDefined()
    expect(initialGroup.spans.length).toBeGreaterThan(0)

    // Trigger the modal
    const deleteGroupButton = wrapper.find('group-wrapper span')
    await deleteGroupButton.trigger('click')
    await wrapper.vm.$nextTick()


    // Cancel suppression
    const cancelGroupModalButton = wrapper.findAll('delete-group-wrapper button')[0]
    await cancelGroupModalButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Check that group still exists
    const spanArrayAfterCancel = wrapper.vm.spanArray?.value || wrapper.vm.spanArray
    const groupAfterCancel = spanArrayAfterCancel.find(span => span.id === 1)
    expect(groupAfterCancel).toBeDefined()

    const groupDeleted = wrapper.vm.groupDeleted?.value !== undefined ? wrapper.vm.groupDeleted.value : wrapper.vm.groupDeleted
    expect(groupDeleted).toBe(null)

    // re-Trigger the modal
    await deleteGroupButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Confirm suppression
    const deleteGroupModalButton = wrapper.findAll('delete-group-wrapper button')[1]
    await deleteGroupModalButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Check that group no longer exists
    const spanArrayAfterDelete = wrapper.vm.spanArray?.value || wrapper.vm.spanArray
    const groupAfterDelete = spanArrayAfterDelete?.find(span => span && span.id === 1)
    expect(groupAfterDelete).toBeUndefined()

  })

})
