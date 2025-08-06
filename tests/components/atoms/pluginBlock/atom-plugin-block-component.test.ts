import { mount ,shallowMount,flushPromises} from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AtomPluginBlock from '@/components/atoms/pluginBlock/AtomPluginBlock.vue'
import AtomPluginAutocomplete from '@/components/atoms/pluginAutocomplete/AtomPluginAutocomplete.vue'
import AtomPluginLabel from '@/components/atoms/pluginLabel/AtomPluginLabel.vue'
import { nextTick } from 'vue'

// Mocks
vi.mock('~/composables/useTopicList', () => ({
  useTopicList: () => ({
    topicList: ref([
      { labels: [{ id: 1, label: 'test', plugin_id: 'autocomplete' }, 'Topic 0'] },
      { labels: [] }
    ])
  })
}))

const pluginItemsMock = Promise.resolve([
  { id: 'autocomplete', data: [{ id: 1, ext_id: 'a', label: 'test' }] },
  { id: 'label', data: [] }
])

const configMock = [
  { id: 'autocomplete', type: 'autocomplete', name: 'Autocomplete Plugin' },
  { id: 'label', type: 'label', name: 'Label Plugin' },
  { id: 'other', type: 'other', name: 'other Plugin' }
]

describe('AtomPluginBlock.vue', () => {
  let globalMountOptions: any

  beforeEach(() => {
    globalMountOptions = {
      global: {
        provide: {
          chipList: ref([]),
          'plugin-config': configMock,
          'plugin-items-config': pluginItemsMock
        },
        stubs: {
          AtomPluginAutocomplete: true,
          AtomPluginLabel: true
        }
      },
      props: {
        topicIndex: 0,
        isTopicFirstSegment: true,
        source: true
      }
    }
  })

  it('renders correctly with source=true (grid layout)', () => {
    const wrapper = shallowMount(AtomPluginBlock, globalMountOptions)
    expect(wrapper.get('[data-testid="plugin-block-container"]').classes()).toContain('grid')
  })

  it('renders correctly with source=false (flex layout)', () => {
    const wrapper = shallowMount(AtomPluginBlock, {
      ...globalMountOptions,
      props: { ...globalMountOptions.props, source: false }
    })
    expect(wrapper.get('[data-testid="plugin-block-container"]').classes()).toContain('flex')
  })


  it('renders the correct number of plugin components', async () => {
    const wrapper = mount(AtomPluginBlock, globalMountOptions = {
      global: {
        provide: {
          chipList: ref([]),
          'plugin-config': configMock,
          'plugin-items-config': {value:  pluginItemsMock}
        },
        stubs: {
          AtomPluginAutocomplete: true,
          AtomPluginLabel: true
        }
      },
      props: {
        topicIndex: 0,
        isTopicFirstSegment: true,
        source: true
      }
    })

    await nextTick()
    const autocomplete = wrapper.findComponent(AtomPluginAutocomplete)
    const label = wrapper.findComponent(AtomPluginLabel)
    const other = wrapper.findComponent('')
    expect(autocomplete.exists()).toBe(true)
    expect(label.exists()).toBe(true)
    expect(other.exists()).toBe(false)
  })

})
