import {expect, describe, it, vi, beforeEach }  from 'vitest'
import PrimeVue from 'primevue/config';
import {computed} from 'vue'
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import MoleculeSegmentation from '~/components/molecules/MoleculeSegmentation.vue'
import {mockedReturn, mockedTransciptionsWithoutTopics, mockedTransciptionsWithTopics} from '../../mock';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import AtomTopicList  from '@/components/atoms/topicList/AtomTopicList.vue'
import AtomProgressBar  from '@/components/atoms/AtomProgressBar.vue';
import AtomPluginBlock from '~/components/atoms/plugin/pluginBlock/AtomPluginBlock.vue';
import AtomSegmentation from "~/components/atoms/segmentation/AtomSegmentation.vue";
import AtomSpanOption from '@/components/atoms/AtomSpanOption.vue';
import AtomVideoOption from '@/components/atoms/atom-video-option.vue';
import { createI18n } from 'vue-i18n'

vi.mock('~/composables/useSpanService', () => ({
  default: () => ({
    loadSpan: vi.fn()
  })
}))

const i18n = createI18n({
  legacy: false,
  locale: 'fr'
})

vi.mock('~/utils/colors',()=>({
  computeColor: vi.fn(),
  textColorPicker: vi.fn(),
}))

describe('Molecule Segmentation', ()=>{
  let wrapper : VueWrapper
  let wrapper2 : VueWrapper

  beforeAll(()=>{
    mockNuxtImport('useToast', () => {
        return ()=>{
          vi.fn()
        }
      })

    mockNuxtImport('useTopicList',()=>{
      return ()=>{
        return {
          topicList: ref([]),
          deleteTopic: vi.fn(),
          createTopic: vi.fn(),
          fusionTopicData: vi.fn(),
          copyTopicData: vi.fn(),
        }
      }
    })

    vi.mock('~/composables/usePersistence',()=>({
      usePersistence: vi.fn(()=>({
        get: vi.fn().mockReturnValue(undefined),
        save: vi.fn()
      }))
    }))

  })

  beforeEach(async()=>{


    wrapper = mount(MoleculeSegmentation,{
      global: {
        plugins: [PrimeVue,i18n],
        provide: {
          jumpToTopic: vi.fn(),
          annotation_type: 'segmentation',
          isAnnotationEditable: computed(()=>true),
        }
      },
      props: {
        tcOffset: 0,
        locals: mockedTransciptionsWithoutTopics,
        colors: ['#BEBEBE'],
        topics: [],
        block: mockedReturn,
        transcriptions: []
      },
    })

    wrapper2 =  mount(MoleculeSegmentation,{
      global: {
        plugins: [PrimeVue,i18n],
        provide: {
          spanService:{
            loadSpan: vi.fn()
          },
          jumpToTopic: vi.fn(),
          annotation_type: 'segmentation',
          isAnnotationEditable: computed(()=>true),
        }
      },
      props: {
        tcOffset: 0,
        locals: mockedTransciptionsWithTopics,
        colors: ['#BEBEBE'],
        topics: [],
        block: mockedReturn,
        transcriptions: []
      },
    })
  })



  it('should mount',async()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.findComponent(AtomTopicList).exists()).toBeTruthy()
    expect(wrapper.findComponent(AtomProgressBar).exists()).toBeTruthy()
    expect(wrapper.findComponent(AtomSpanOption).exists()).toBeTruthy()
    expect(wrapper.findComponent(AtomVideoOption).exists()).toBeTruthy()

  })

  it('should load topics',async()=>{
    expect(wrapper2.exists()).toBeTruthy()
    expect(wrapper2.vm.topicList).toContainEqual({id: 1,title:"Topic 1",labels: []})
  })

  it('should display all the segmentation inside Atom Segmentation', ()=>{

    expect(wrapper.findAllComponents(AtomSegmentation).length).toBe(3)
  })

  it('should highlight the selected AtomSegmentation', async ()=>{

    const segmentationWrapper = wrapper.findComponent(AtomSegmentation)
    await segmentationWrapper.find('div[class^="bg-white"]').trigger('mouseup')

    expect(wrapper.emitted()).toHaveProperty('on-segment-click')
    expect(wrapper.emitted()['on-segment-click']).toStrictEqual([[{tcin: mockedTransciptionsWithoutTopics[0].tcin,tcout : mockedTransciptionsWithoutTopics[0].tcout, index: 0 }]])

  })

  it('should create a topic', async ()=>{
    const spy = vi.spyOn(wrapper.vm,'handleSegmentation')
    expect(wrapper.text()).not.toContain('Topic 1')
    expect(wrapper.findComponent(AtomPluginBlock).exists()).toBeFalsy()

    expect(window.onbeforeunload).toBeFalsy()

    const segmentationWrapper = wrapper.findComponent(AtomSegmentation)
    await segmentationWrapper.vm.$emit('segmentation',{index: 0})

    await wrapper.vm.$nextTick()

    expect(spy).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Topic 1')
    expect(wrapper.findComponent(AtomPluginBlock).exists()).toBeTruthy()
    expect(window.onbeforeunload).toBeTypeOf('function')
  })

  it('should divide existing topic', async()=>{

    const segmentationWrapper = wrapper2.findAllComponents(AtomSegmentation).at(1)

    expect(wrapper2.text()).toContain('Topic 1')
    expect(wrapper2.text()).not.toContain('Topic 2')

    await segmentationWrapper.vm.$emit('segmentation',{index: 1})

    expect(wrapper2.text()).toContain('Topic 1')
    expect(wrapper2.text()).toContain('Topic 2')

    expect(wrapper2.text().match(/Topic 2/)?.index).toBeLessThan(wrapper2.text().match(/Topic 1/)?.index)

  })

  it('should fusion topics', async()=>{
    const segmentationWrapper = wrapper2.findAllComponents(AtomSegmentation).at(1)
    await segmentationWrapper.vm.$emit('segmentation',{index: 1})
    await wrapper2.vm.$nextTick()
    expect(wrapper2.text()).toContain('Topic 2')

    await segmentationWrapper.vm.$emit('segmentation',{index: 1})
    await wrapper2.vm.$nextTick()
    expect(wrapper2.text()).not.toContain('Topic 2')
  })

  it('should be able to drag rupture', async()=>{
    const segmentationWrapper1 = wrapper2.findAllComponents(AtomSegmentation).at(0)
    const segmentationWrapper2 = wrapper2.findAllComponents(AtomSegmentation).at(1)
    await segmentationWrapper1.vm.$emit('segmentation',{index: 0})

    // get first postion of 'Topic 1' string
    const firstTopic1 = wrapper2.text().match(/Topic 1/)?.index

    // fire drag events to move the rupture
    await segmentationWrapper1.vm.$emit('dragging-start',0)
    await segmentationWrapper2.vm.$emit('dragging-end',1)

    // get  postion of 'Topic 1' string after dragging the rupture
    let secondTopic1 = wrapper2.text().match(/Topic 1/)?.index

    expect(firstTopic1).toBeLessThan(secondTopic1)

    await segmentationWrapper1.vm.$emit('dragging-end',0)
    await segmentationWrapper2.vm.$emit('dragging-start',1)

    secondTopic1 = wrapper2.text().match(/Topic 1/)?.index

    expect(firstTopic1).toEqual(secondTopic1)
  })

  it('should be able deactivate and reactivate topic', async()=>{
    const segmentationWrapper = wrapper2.findAllComponents(AtomSegmentation).at(0)
    expect(wrapper2.text()).toContain('Topic 1')
    await segmentationWrapper.vm.$emit('deactivate-topic')

    expect(wrapper2.text()).not.toContain('Topic 1')
    expect(wrapper2.text()).toContain('Ignor')

    await segmentationWrapper.vm.$emit('activate-topic')

    expect(wrapper2.text()).toContain('Topic 1')
    expect(wrapper2.text()).not.toContain('Ignor')
  })

})
