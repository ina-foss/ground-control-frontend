import {expect, describe, it }  from 'vitest'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import { mockedTransciptionsWithoutTopics } from '@/tests/mock'
import { mount} from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import AtomSpanControlPanel from '~/components/atoms/spanControlPanel/AtomSpanControlPanel.vue';

let mock =vi.fn()

mockNuxtImport('useSpanService', async()=>{
  const actual = await vi.importActual('~/composables/useSpanService')
  return ()=>({
    ...actual.default(),
      spanArray : ref([
        {
          id: 0,
          spans:[{role: 'role 1 ',spanId: 1}],
          plugins:{
            "plugin-2": [
              {
                label: "Citation",
                id: 2,
                ext_id: 2,
                categories: ["role 1","role 2"]
              }
            ]
          }
        },
        {
          id:1,
          tcin: 0.10009765625,
          tcout: 0.94677734375,
          nodes:[],
          plugins:{
            "plugin-4": [
              {
                label: "Plugin Label",
                id: 1,
                ext_id: 1,
              }
            ]
          }
        },
        {
          id:2,
          tcin: 0.780029296875,
          tcout: 0.97998046875,
          nodes:[],
          plugins:{
            "plugin-4": [
              {
                label: "Plugin Label",
                id: 1,
                ext_id: 1,
              }
            ]
          }
        },
      ]),
      dropSpan: mock,
      mainPluginId: ref(4),
      newFocus: ref(),
    })
  })



describe('AtomSpanControlPanel', ()=>{
  let wrapper : VueWrapper
  beforeEach(async ()=>{
    wrapper = await mountSuspended(AtomSpanControlPanel,{
      attachTo: document.body
    })
  })

  it('should mount',() =>{
    expect(wrapper.text().includes('Spans')).toBeTruthy()
  })

  it('should display the list of spans', ()=>{
    const spanWrappers = wrapper.findAll('span-content-wrapper')
    expect(spanWrappers.length).toBe(2)
    expect(spanWrappers.at(0).text().includes('1')).toBeTruthy()
    expect(spanWrappers.at(1).text().includes('2')).toBeTruthy()
  })

  it('should display the list of group',()=>{
    const groupWrapper = wrapper.find('group-wrapper')
    expect(groupWrapper.text()).toContain('1Citation1')
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
    expect(dropzone.element.lastChild?.textContent).include('new span')

    await dropzone.trigger('dragleave')
    expect([...dropzone.element.children].map((child)=>child.localName)).not.include('preview')

  })

  it('should add the span to the group on drop', async()=>{
    const groupWrapper = wrapper.find('group-wrapper')
    await groupWrapper.trigger('click')
    const firstDropzone = wrapper.findAll('role-dropzone').at(0)
    const secondDropzone = wrapper.findAll('role-dropzone').at(1)
    expect([...secondDropzone.element.children].map(child=>child.localName)).not.include('role-span-content')
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('span',"2")
    await secondDropzone.trigger('drop',{
      dataTransfer: dataTransfer
    })
    await wrapper.vm.$nextTick()

    expect([...secondDropzone.element.children].map(child=>child.localName)).include('role-span-content')
    expect(wrapper.vm.groupArray[0].spans).toContainEqual({spanId: 2, role: 'role 2'})
  })

})
