import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AtomPluginAutocomplete from '@/components/atoms/pluginAutocomplete/AtomPluginAutocomplete.vue'
import PrimeVue from 'primevue/config'
import { AutoComplete } from 'primevue'
import { nextTick, ref } from 'vue'

// Mock du composable useTopicList
vi.mock('~/composables/useTopicList', () => ({
  useTopicList: () => ({
    topicList: {
      1: { title: 'Thème important', labels: ['label1'] },
      2: { title: '', labels: [] },
    }
  })
}))

vi.mock('~/api/generate',async (importOriginal) => {
  const actual =  await importOriginal()
  return {
    ...actual,
    PluginService: {
      searchPluginsPluginsPluginIdSearchGet: vi.fn().mockResolvedValue([
        { id: 1, label: 'Option A', ext_id: 'a' }
      ])
    }
  }
})
describe('AtomPluginAutocomplete.vue', () => {
  let pluginMock: any
  let chipListMock: any
  let pluginItemsConfigMock: any

  beforeEach(() => {
    pluginMock = ref({ id: 1, name: 'Plugin test' })
    chipListMock = ref([])
    pluginItemsConfigMock = ref([
      { id: 1, ext_id: 'ext1', label: 'Option A' },
      { id: 2, ext_id: 'ext2', label: 'Option B' }
    ])
    const input = document.createElement('input')
    input.id = 'autocomplete-input'
    document.body.appendChild(input)
  })

  function createWrapper(propsOverride = {}) {
    return mount(AtomPluginAutocomplete, {
      global: {
        plugins: [PrimeVue],
        provide: {
          chipList: chipListMock,
          isAnnotationEditable: true
        },
        mocks: {
          useTopicList: () => ({ topicList })
        },
        components: { AutoComplete }
      },
      props: {
        topicIndex: 0,
        plugin: pluginMock.value,
        pluginItemsConfig: pluginItemsConfigMock.value,
        index: 0,
        source: false,
        ...propsOverride
      }
    })
  }

  it("affiche l'AutoComplete si index < 3 et source est false", () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(AutoComplete).exists()).toBe(true)
  })

  it('rend le AutoComplete source quand source est true', async () => {
    const pluginNullMock = ref({ id: 2, name: '' })
    const wrapper = createWrapper({plugin:pluginNullMock.value, source: true })
    await flushPromises()
    expect(wrapper.findComponent(AutoComplete).exists()).toBe(true)
    wrapper.vm.keepDropdownOpen()
  })

  it('ne rend pas le AutoComplete principal si index >= 3', () => {
    const wrapper = createWrapper({ index: 3 })
    expect(wrapper.findComponent(AutoComplete).exists()).toBe(false)
  })

  it('charge les options depuis pluginItemsConfig', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.options.length).toBe(2)
    expect(wrapper.vm.options[0].label).toBe('Option A')
  })

  it('met à jour le filtre et trie les options', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handleFilter({ value: 'B' })
    await nextTick()

    const sorted = wrapper.vm.sortedOptionsByFilter
    expect(sorted[0].label).toBe('Option A')
  })

  it('met à jour chipList si un élément est retiré', async () => {
    chipListMock.value.push({ id: 1, label: 'Option A', plugin_id: 1 })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.selectedItems = ref([]) // simulate deselection
    await nextTick()

    expect(chipListMock.value.length).toBe(1)

    const topicList = ref([{ labels: [] }])
    const wrapper2 = mount(AtomPluginAutocomplete, {
      global: {
        plugins: [PrimeVue],
        provide: {
          chipList: chipListMock,
          isAnnotationEditable: true
        },
        mocks: {
          useTopicList: () => ({ topicList })
        },
        components: { AutoComplete }
      },
      props: {
        topicIndex: 1,
        plugin: pluginMock.value,
        pluginItemsConfig: pluginItemsConfigMock.value,
        index: 1,
        source: false
      }
    })
    await nextTick()
    wrapper2.vm.selectedItems = [{ id: 1, label: 'New Item', plugin_id: 1 }]

    expect(topicList.value[0].labels).toHaveLength(0)
  })

  it('met à jour chipList si aucun élément est retiré', async () => {
    const pluginMock = ref({ id: 1, label: 'Plugin 1' })
    const pluginItemsConfigMock = ref([])
    const topicList = ref([{ labels: [{ id: 1, label: 'Option A' }] }])
    const pluginValue =[ {id:1,extId: 34124, label: 'Option A' }]

    const wrapper = mount(AtomPluginAutocomplete, {
      global: {
        plugins: [PrimeVue],
        provide: {
          isAnnotationEditable: true
        },
        mocks: {
          useTopicList: () => ({ topicList })
        },
        components: { AutoComplete }
      },
      props: {
        topicIndex: 1,
        plugin: pluginMock.value,
        pluginItemsConfig: pluginItemsConfigMock.value,
        index:1,
        source: false,
        pluginValue: pluginValue
      }
    })

    await flushPromises()
    await nextTick()
    const multiselect = wrapper.findComponent(AutoComplete)
    expect(wrapper.emitted('update:pluginValue')).toBeFalsy()
    await multiselect.vm.$emit('update:modelValue', [])
    expect(wrapper.emitted('update:pluginValue')).toBeTruthy()

    expect(topicList.value[0].labels).toHaveLength(1)
  })

})
