import OrganismAnnotationComponent from "../../../../components/organisms/annotation/OrganismAnnotation.vue";
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { computed,nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('~/stores/auth', () => ({
  useAuth: vi.fn()
}))

vi.mock('~/stores/annotation-options', () => ({
  useOptions: vi.fn()
}))

vi.mock('~/composables/useTcOffset', () => ({ useTcOffset: () => ({ setTcOffset: vi.fn() }) }))
vi.mock('~/composables/useTopicList', () => ({ useTopicList: () => ({ topicList: [] }) }))

const mockHasRole = vi.fn()
const mockedUseService = vi.fn().mockReturnValue({
  $application: {
    hasRole: mockHasRole,
    unixToTimestamp: vi.fn()
  }
})

vi.mock('#imports', () => ({ useService: mockedUseService }))


import { useAuth } from '~/stores/auth'
import { useOptions } from '~/stores/annotation-options'
import {mockedReturn} from "~/tests/mock";

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => ({
      query: {
        email: 'test@example.com'
      }    })
  }
})


vi.mock('~/api/generate', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    PluginService: {
      readPluginsPluginsStepStepIdPluginTypeDisplayZoneGet: vi.fn().mockResolvedValue([]),
      searchPluginsPluginsPluginIdSearchGet: vi.fn().mockResolvedValue([]),
    },
    AnnotationStatus: {
      DRAFT: 'draft',
      FINAL: 'final'
    }
  }
})

describe('OrganismAnnotationComponent', () => {
  let authMock, optionsMock
  beforeEach(() => {

    authMock = {
      userEmail: 'test@example.com'
    }
    optionsMock = {
      options: {
        player: true,
        transcription: true,
        timecode_bloc: true,
        timecode_segment: true,
        number_segment: true,
      }
    }
    useAuth.mockReturnValue(authMock)
    useOptions.mockReturnValue(optionsMock)

    mockHasRole.mockImplementation((role) => {
      return computed(() => role === 'ANNOTATOR')
    })
  })
  const factory = (props = {}) => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return shallowMount(OrganismAnnotationComponent, {
      global: {
        plugins: [pinia],
        stubs: ['MoleculeAnnotationLeftPanel', 'MoleculeSpan', 'MoleculeSegmentation', 'MoleculeTranscription', 'MoleculeTabs', 'AtomSearch'],
      },
      props: {
        data: {
          step: {
            annotation_type: 'transcription',
          },
          media: {
            player_parameters: {
              tc_offset: 0,
            }
          }
        },
        annotationsIn: [
          {
            result: {
              asset: { url: 'http://video.test' },
              data: mockedReturn
            }
          }
        ],
        annotationsOut: [],
        allFetched: true,
        ...props
      }
    })
  }
  const factoryAutoSummary = (props = {}) => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return shallowMount(OrganismAnnotationComponent, {
      global: {
        plugins: [pinia],
        stubs: ['MoleculeAnnotationLeftPanel', 'MoleculeSpan', 'MoleculeSegmentation', 'MoleculeTranscription', 'MoleculeTabs', 'AtomSearch'],
      },
      props: {
        data: {
          step: {
            annotation_type: 'auto-summary',

          },
          media: {
            player_parameters: {
              tc_offset: 0,
            }
          }
        },
        annotationsIn: [
          {
            result: {
              asset: { url: 'http://video.test' },
              data: mockedReturn
            }
          }
        ],
        annotationsOut: [],
        allFetched: true,
        ...props
      }
    })
  }

  it('mounts and renders properly', () => {

    const factorySegmentation = (props = {}) => {
      const pinia = createPinia()
      setActivePinia(pinia)
      return shallowMount(OrganismAnnotationComponent, {
        global: {
          plugins: [pinia],
          stubs: ['MoleculeAnnotationLeftPanel', 'MoleculeSpan', 'MoleculeSegmentation', 'MoleculeTranscription', 'MoleculeTabs', 'AtomSearch'],
        },
        props: {
          data: {
            step: {
              annotation_type: 'segmentation',
            },
            media: {
              player_parameters: {
                tc_offset: 0,
              }
            }
          },
          allFetched: true,
          ...props
        }
      })
    }

    const wrapper = factorySegmentation()
    expect(wrapper.exists()).toBe(true)
  })

 it('emits finish-annotation on finish', async () => {
    const wrapper = factory()
    wrapper.vm.isAdmin=true
    wrapper.vm.moleculeAnnotationRef.annotationFunction =vi.fn().mockReturnValue([])
    wrapper.vm.moleculeAnnotationRef.locals =  []
    expect(wrapper.emitted()['finish-annotation']).toBeFalsy()
    await wrapper.vm.handleFinish()
    expect(wrapper.emitted()['finish-annotation']).toBeTruthy()
  })

  it('computes annotationComponent for auto-summary', async () => {
    const wrapper = factoryAutoSummary()
    await nextTick()
    const component = wrapper.vm.annotationComponent
    expect(component?.component).toBeDefined()
    expect(component?.events).toBeDefined()
  })

  it('computes annotationComponent for span', async () => {
    const factorySpan = (props = {}) => {
      const pinia = createPinia()
      setActivePinia(pinia)
      return shallowMount(OrganismAnnotationComponent, {
        global: {
          plugins: [pinia],
          stubs: ['MoleculeAnnotationLeftPanel', 'MoleculeSpan', 'MoleculeSegmentation', 'MoleculeTranscription', 'MoleculeTabs', 'AtomSearch'],
        },
        props: {
          data: {
            step: {
              annotation_type: 'span',
            },
            media: {
              player_parameters: {
                tc_offset: 0,
              }
            }
          },
          annotationsIn: [
            {
              result: {
                asset: { url: 'http://video.test' },
                data: mockedReturn
              }
            }
          ],
          annotationsOut:[
          ],
          allFetched: false,
          ...props
        }
      })
    }
    const wrapper = factorySpan()
    await nextTick()
    wrapper.vm.annotationInfo=[
      {
        result: {
          asset: { url: 'http://video.test' },
          data: mockedReturn
        }
      }
    ]
    const component = wrapper.vm.annotationComponent
    expect(component?.component).toBeDefined()
    expect(component?.events).toBeDefined()
    expect(wrapper.vm.annotationInfo).toBe(null)
  })

  it('sets videoSrc when allFetched is true', () => {
    const wrapper = factory()
    expect(wrapper.vm.videoSrc).toBe('http://video.test')
  })

  it('emits submit-annotation on handleSubmit', async () => {
    const wrapper = factoryAutoSummary()

    wrapper.vm.tabsRef = {
      moleculeAnnotationRef: ref({
        annotationFunction: vi.fn().mockReturnValue([]),
        locals: []
      })
    }

    wrapper.vm.spanService = { saveSpan: vi.fn().mockReturnValue([]) }

    await wrapper.vm.handleSubmit({ showToast: true })
    expect(wrapper.emitted()['submit-annotation']).toBeTruthy()
  })

  it('getSelectedSegment returns the selected segment', () => {
    const divMock = { classList: { contains: (cls) => cls === 'selected-segment' } }
    const wrapper = factory()
    wrapper.vm.moleculeAnnotationRef.annotationFunction =vi.fn().mockReturnValue([])
    wrapper.vm.moleculeAnnotationRef.locals =  []
    wrapper.vm.moleculeAnnotationRef.listRefs = [divMock]
    const result = wrapper.vm.getSelectedSegment()
    expect(result).toStrictEqual(divMock)
  })


  it('computes annotationComponent for transcription', async () => {
    const wrapper = factory({
      data: {
        step: { annotation_type: 'transcription' },
        media: { player_parameters: { tc_offset: 0 } }
      },
      annotationsIn: [{
        result: {
          asset: { url: 'http://video.test' },
          data: {
            localisation: [{ sublocalisations: { localisation: [{ tcin: 0, data: {} }] } }],
            algorithm: 'algo1'
          }
        }
      }],
      allFetched: true
    })
    await nextTick()
    const component = wrapper.vm.annotationComponent
    expect(component?.component).toBeDefined()
    expect(component?.props?.transcriptions).toBeDefined()
  })

})



