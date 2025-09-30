import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentComponent from '@/components/atoms/AtomSegmentation.vue'
import PrimeVue from 'primevue/config'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Chip from 'primevue/chip'

vi.mock('lodash/remove', () => ({
  default: vi.fn()
}))
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn()
  })
}))
vi.mock('#imports', () => ({
  useService: () => ({
    $application: {
      timestampToUnix: vi.fn((tcin) => tcin),
      computeColor: vi.fn(() => ({ hex: '#000000' })),
      textColorPicker: vi.fn(() => 'black'),
      unixToTimestamp: vi.fn(),
    }
  }),
  useAuth: () => ({
    userEmail: 'test@example.com'
  }),
  useOptions: () => ({
    options: {
      number_segment: false,
      timecode_segment: false,
      timecode_bloc: false
    }
  })
}))

describe('SegmentComponent', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SegmentComponent, {
      global: {
        plugins: [PrimeVue],
        components: {
          Tag,
          Button,
          Chip
        },
        provide: {
          spanService: {
            handleSelection: vi.fn(),
          },
          annotation_type: 'segmentation',
          transcriptions: [],
          isAnnotationEditable: true,
          jumpToTopic: vi.fn()
        }
      },
      props: {
        phrase: {
          tcin: 123,
          tcout: 456,
          data: {
            text: ['Hello world'],
            comments: []
          }
        },
        topics: [1, 1, 2],
        index: 2,
        topicList: {
          2: { labels: [{ label: 'AI' }, { label: 'Tech' }] }
        },
        segmentationRefs: {},
        tcOffset: 0,
        transcriptions: []
      }
    })
  })

  it('affiche le titre du topic si isTopicFirstSegment est vrai', () => {
    expect(wrapper.text()).toContain('Topic 2')
  })

  it('affiche le titre quand index egale a 0', () => {
    const wrapper = mount(SegmentComponent, {
      global: {
        plugins: [PrimeVue],
        components: {
          Tag,
          Button,
          Chip
        },
        provide: {
          spanService: {
            handleSelection: vi.fn(),
          },
          annotation_type: 'segmentation',
          transcriptions: [],
          isAnnotationEditable: true,
          jumpToTopic: vi.fn()
        }
      },
      props: {
        phrase: {
          tcin: 123,
          tcout: 456,
          data: {
            text: ['Hello world'],
            comments: []
          }
        },
        topics: [0, 1, 2],
        index: 0,
        topicList: {
          2: { labels: [{ label: 'AI' }, { label: 'Tech' }] }
        },
        segmentationRefs: {},
        tcOffset: 0,
        transcriptions: []
      }
    })

    expect(wrapper.text()).toContain('Hello world')
  })

  it('title = null si isTopicFirstSegment est false', () => {
    const wrapper = mount(SegmentComponent, {
      props: { phrase: {
          tcin: 123,
          tcout: 456,
          data: {
            text: ['Hello world'],
            comments: []
          }
        },
        segment: {},
        index: 1,
        isSelected: false,
        topics: ['a', 'a'],
        topicList: {
        },
      },
      global: {
        provide: {
          topics: ['a', 'a'],
          spanService: {
            handleSelection: vi.fn(),
          },
          jumpToTopic: vi.fn()
        }
      }
    })

    expect(wrapper.vm.title).toBe(null)
  })

  it('appelle remove avec le bon tableau et le bon prédicat', async () => {
    const pluginValues = {'plugin-1':[
      {id: 1, ext_id: 1, label: 'label 1', plugin_id: 1},
      {id: 2, ext_id: 2, label: 'label 2', plugin_id: 1}
    ]}
    const mockTopicList = [
      { labels: ['labelA', 'labelB', 'labelC'] },
      { labels: ['labelD', 'labelE'] }
    ]

    const wrapper = mount(SegmentComponent, {
      props: {
        phrase: {
          tcin: 123,
          tcout: 456,
          data: {
            text: ['Hello world'],
            comments: []
          }
        },
        segment: {},
        index: 1,
        isSelected: false,
        topics: [1, 1],
        topicList: {
          1: { labels: [] }
        },
      },
      global: {
        provide: {
          spanService: {
            handleSelection: vi.fn(),
          },
          jumpToTopic: vi.fn(),
          topicList: mockTopicList
        }
      }
    })

    wrapper.vm.pluginValues['plugin-1'] = pluginValues['plugin-1']
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.chipList.length).toBe(2)
    wrapper.vm.handleRemove(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.chipList.length).toBe(1)
  })
})
