import {expect, describe, it }  from 'vitest'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import MoleculeTabs from '../../../components/molecules/MoleculeTabs.vue'
import {mockedTransciptionsWithTopics, mockedTransciptionsWithTopics} from '~/tests/mock';
import type { VueWrapper } from '@vue/test-utils';
import { Carousel } from 'primevue';

mockNuxtImport('useToast',()=>{
  return ()=>{
    vi.fn()
  }
})

const mockJumpToTopic = vi.fn()

describe('Molecule Tabs', ()=>{
  let wrapper : VueWrapper
  beforeEach(async()=>{
    vi.useFakeTimers()
    wrapper = await mountSuspended(MoleculeTabs,{
      global:{
        stubs: {
          AtomSentence: true
        },
        provide:{
          jumpToTopic: mockJumpToTopic
        }
      },
        props:{
          data: {
            instruction: 'Instruction',
            documentation:'Documentation',
              media:{
                player_parameters: {}
              }
            },
          userAnnotations:[],
          transcriptions: mockedTransciptionsWithTopics.map((transcription)=>[transcription]),
          status: 'pending'
        },
      })

  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should Mount and display tabs', async ()=>{


    expect(wrapper.text()).toContain('Instruction')
    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Résumé')
    expect(wrapper.text()).toContain('Phrases')

    wrapper = await mountSuspended(MoleculeTabs,{
      props:{
        data:{
          instruction: '',
          documentation: '',
          media:{
            player_parameters: {}
          }
        },
        userAnnotations:[],
        status: 'pending'
      },
    })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Derniers Timecodes')
    expect(wrapper.text()).not.toContain('Instruction')
    expect(wrapper.text()).not.toContain('Documentation')
    expect(wrapper.text()).not.toContain('Résumé')
    expect(wrapper.text()).not.toContain('Phrases')

  })

  it('should trigger the topic jump on page update', async()=>{
    const sentenceCarousel  = wrapper.findAllComponents(Carousel).at(1)
    expect(sentenceCarousel.exists()).toBeTruthy()

    await sentenceCarousel.vm.$emit('update:page',1)

    expect(mockJumpToTopic).toHaveBeenCalledOnce()
    expect(mockJumpToTopic).toHaveBeenCalledWith({topic:1})
  })

  it('should make the carousel scroll to the given element', async()=>{

    const sentenceCarousel  = wrapper.findAllComponents(Carousel).at(1)

    expect(wrapper.vm.currentPage).toBe(0)

    await wrapper.vm.carouselNavTo(2)

    expect(wrapper.vm.currentPage).toBe(2)
    expect(sentenceCarousel?.emitted()).toHaveProperty('update:page')

    await wrapper.vm.carouselNavTo(1)

    expect(wrapper.vm.currentPage).toBe(1)
  })


})
