import {expect, describe, it }  from 'vitest'
import AtomTranscriptionSpan  from '@/components/atoms/AtomTranscriptionSpan.vue'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import { mockedTransciptionsWithoutTopics } from '../../mock'
import type { VueWrapper } from '@vue/test-utils';

mockNuxtImport('useSpanService', async()=>{
  const actual = await vi.importActual('~/composables/useSpanService')
  return ()=>({
    ...actual.default(),
      spanArray : ref([
        {id:0,plugins:[],label:"None"},
        {id:1,plugins:[],nodes:[],label:"span 1"}
      ])
  })
})

describe('Atom Transcription Span',()=> {

  let wrapper : VueWrapper

  vi.doMock('~/composables/useSpanService', () => ({
    default: () => ({
      dragData: reactive({
        pin_position: undefined,
        spanid: undefined
      }),
      spanArray: ref([{id:0,plugins:[],label:"None"},{id:1,plugins:[],nodes:[],label:"span 1"}]),
      handleDrop: vi.fn()
    })
  }))

  beforeEach(async()=>{

    wrapper = await mountSuspended(AtomTranscriptionSpan,{
      props:{
        local: mockedTransciptionsWithoutTopics[0]
      },
    })

  })


  it('should mount the component',async ()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Il est 20h')
  })

  it('should extend the selection to the right ',async ()=>{
    const { dragData } = useSpanService()
    const word = wrapper.findAll('div').at(100)
    word?.element.appendChild(document.createElement('bg1'))
    wrapper.vm.spanArray[1].nodes[0] = word?.element
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('pin_position', 'right')
    dataTransfer.setData('spanid', '1')
    dragData.pin_position = 'right'
    dragData.spanid = 1
    const target = wrapper.findAll('div').at(104)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('.dragged_outer').length).toBe(4)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('.dragged_outer').length).toBe(0)
  })

  it('should extend the selection to the left ',async ()=>{
    const { dragData } = useSpanService()
    const word = wrapper.findAll('div').at(100)
    word?.element.appendChild(document.createElement('bg1'))
    wrapper.vm.spanArray[1].nodes[0] = word?.element
    const dataTransfer = new DataTransfer()
    dragData.pin_position = 'left'
    dragData.spanid = 1
    const target = wrapper.findAll('div').at(96)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('.dragged_outer').length).toBe(4)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('.dragged_outer').length).toBe(0)
  })

  it('should decrease the selection to the left ',async ()=>{
    const {dragData} = useSpanService()
    const word1 = wrapper.findAll('div').at(100)
    word1?.element.appendChild(document.createElement('bg1'))
    const word2 = wrapper.findAll('div').at(101)
    word2?.element.appendChild(document.createElement('bg1'))
    const word3 = wrapper.findAll('div').at(102)
    word3?.element.appendChild(document.createElement('bg1'))
    wrapper.vm.spanArray[1].nodes = [word1?.element,word2?.element,word3?.element]
    const dataTransfer = new DataTransfer()
    dragData.pin_position = 'left'
    dragData.spanid = 1
    const target = wrapper.findAll('div').at(101)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('.dragged_inner').length).toBe(2)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('.dragged_inner').length).toBe(0)
  })

  it('should decrease the selection to the right ',async ()=>{
    const {dragData} = useSpanService()
    const word1 = wrapper.findAll('div').at(100)
    word1?.element.appendChild(document.createElement('bg1'))
    const word2 = wrapper.findAll('div').at(101)
    word2?.element.appendChild(document.createElement('bg1'))
    const word3 = wrapper.findAll('div').at(102)
    word3?.element.appendChild(document.createElement('bg1'))
    wrapper.vm.spanArray[1].nodes = [word1?.element,word2?.element,word3?.element]
    const dataTransfer = new DataTransfer()
    dragData.pin_position = 'right'
    dragData.spanid = 1
    const target = wrapper.findAll('div').at(100)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('.dragged_inner').length).toBe(3)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('.dragged_inner').length).toBe(0)
  })

})


