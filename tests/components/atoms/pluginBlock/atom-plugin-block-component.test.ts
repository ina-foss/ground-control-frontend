import { shallowMount} from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AtomPluginBlock from '@/components/atoms/pluginBlock/AtomPluginBlock.vue'
import AtomPluginAutocomplete from '@/components/atoms/pluginAutocomplete/AtomPluginAutocomplete.vue'
import AtomPluginLabel from '@/components/atoms/pluginLabel/AtomPluginLabel.vue'

// Mocks
vi.mock('~/composables/useTopicList', () => ({
  useTopicList: () => ({
    topicList: ref([
      { labels: [{ id: 1, label: 'test', plugin_id: 'autocomplete' }, 'Topic 0'] },
      { labels: [] }
    ])
  })
}))

vi.mock('~/stores/plugins',async ()=>{
  return {
  usePluginStore: () => ({
        getPluginList:  ref(configMock),
        getAllPluginOptionList:  ref(pluginItemsMock),
        selectComponent: (pluginConfig) => {
          if (pluginItemsMock.length === 0) return null;

          switch (pluginConfig.type) {
            case 'autocomplete': {
              const itemlist = pluginItemsMock.find((item) => item.id === pluginConfig.id)?.data
              return {
                component: AtomPluginAutocomplete,
                props: { pluginItemsConfig: itemlist, plugin: pluginConfig }
              }
            }
            case 'label':
              return {
                component: AtomPluginLabel,
                props: {
                  isTopicFirstSegment: true,
                  pluginItemsConfig: []
                }
              }
            default:
              return null;
          }
        }
      })
  }
})

const  pluginItemsMock = [
  { id: 'autocomplete', data: [{ id: 1, ext_id: 'a', label: 'test' }] },
  { id: 'label', data: [] }
]

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
        source: true,
        pluginValues: {
          'plugin-autocomplete': [],
          'plugin-label': [],
          'plugin-other' : [],
        }
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


    const wrapper = await mountSuspended(AtomPluginBlock, globalMountOptions = {
      global: {
        stubs: {
          AtomPluginAutocomplete: true,
          AtomPluginLabel: true
        }
      },
      props: {
        topicIndex: 0,
        isTopicFirstSegment: true,
        source: true,
        pluginValues: {
          'plugin-autocomplete': [],
          'plugin-label': [],
          'plugin-other' : [],
        }
      }
    })

    await wrapper.vm.$nextTick()
    const autocomplete = wrapper.findComponent(AtomPluginAutocomplete)
    const label = wrapper.findComponent(AtomPluginLabel)
    expect(autocomplete.exists()).toBe(true)
    expect(label.exists()).toBe(true)
  })

})
