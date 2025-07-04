import {expect, describe, it }  from 'vitest'
import AtomTranscriptionSpan  from '@/components/atoms/AtomTranscriptionSpan.vue'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import { mockedTransciptionsWithoutTopics } from '@/tests/mock'
import { mount} from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';

describe('Atom Transcription Span',()=> {

  let wrapper : VueWrapper

  beforeAll(()=>{
  })

  beforeEach(async()=>{

    wrapper = await mountSuspended(AtomTranscriptionSpan,{
      props:{
        local: mockedTransciptionsWithoutTopics[0]
      },
      global:{
        provide:{
          spanService :{
            handleDrop: vi.fn()
          }
        }
      }
    })

  })

  it('should mount the component',async ()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Il est 20h')
  })

  it('should extend the selection to the right ',async ()=>{
    const word = wrapper.findAll('div').at(100)
    word?.element.appendChild(document.createElement('bg1'))
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('pin_position', 'right')
    dataTransfer.setData('spanid', '1')
    const target = wrapper.findAll('div').at(104)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('div .dragged_outer').length).toBe(4)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('div .dragged_outer').length).toBe(0)
  })

  it('should extend the selection to the left ',async ()=>{
    const word = wrapper.findAll('div').at(100)
    word?.element.appendChild(document.createElement('bg1'))
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('pin_position', 'left')
    dataTransfer.setData('spanid', '1')
    const target = wrapper.findAll('div').at(96)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('div .dragged_outer').length).toBe(4)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('div .dragged_outer').length).toBe(0)
  })

  it('should decrease the selection to the left ',async ()=>{
    const word1 = wrapper.findAll('div').at(100)
    word1?.element.appendChild(document.createElement('bg1'))
    const word2 = wrapper.findAll('div').at(101)
    word2?.element.appendChild(document.createElement('bg1'))
    const word3 = wrapper.findAll('div').at(102)
    word3?.element.appendChild(document.createElement('bg1'))
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('pin_position', 'right')
    dataTransfer.setData('spanid', '1')
    const target = wrapper.findAll('div').at(101)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('div .dragged_inner').length).toBe(2)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('div .dragged_inner').length).toBe(0)
  })

  it('should decrease the selection to the right ',async ()=>{
    const word1 = wrapper.findAll('div').at(100)
    word1?.element.appendChild(document.createElement('bg1'))
    const word2 = wrapper.findAll('div').at(101)
    word2?.element.appendChild(document.createElement('bg1'))
    const word3 = wrapper.findAll('div').at(102)
    word3?.element.appendChild(document.createElement('bg1'))
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('pin_position', 'left')
    dataTransfer.setData('spanid', '1')
    const target = wrapper.findAll('div').at(101)
    await target.trigger('dragover',{
      dataTransfer: dataTransfer
    })

    expect(wrapper.findAll('div .dragged_inner').length).toBe(2)

    await target.trigger('dragleave',{
      dataTransfer: dataTransfer
    })


    expect(wrapper.findAll('div .dragged_inner').length).toBe(0)
  })

})


