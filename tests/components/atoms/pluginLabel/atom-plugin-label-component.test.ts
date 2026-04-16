import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AtomPluginLabel from '@/components/atoms/plugin/pluginLabel/AtomPluginLabel.vue'
import { nextTick, ref } from 'vue'
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

describe('AtomPluginLabel', () => {
  beforeAll(()=>{

    mockNuxtImport('useTopicList',()=>{
      return ()=>{
        return {
          topicList: ref([
            { labels: ['Label 1'] },
            { labels: ['Label 2'] },
          ])
        }
      }
    })

  })
  let wrapper: any

  const mountComponent = (props = { topicIndex: 0, isTopicFirstSegment: true }) => {
    wrapper = mount(AtomPluginLabel, {
      props,
      global: {
        stubs: {
          InputText: {
            template: `<input @focusout="$emit('focusout')" v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
            props: ['modelValue'],
            emits: ['update:modelValue', 'focusout']
          },
          Button: {
            template: '<button @click="$emit(\'click\')"><slot /></button>'
          }
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le titre initial basé sur les labels', async () => {
    mountComponent()
    await nextTick()
    expect(wrapper.text()).toContain('Label 1')
  })

  it('affiche un titre null', async () => {
    mountComponent({ topicIndex: 0, isTopicFirstSegment: false })
    await nextTick()
    expect(wrapper.text()).not.toContain('Label 1')
    expect(wrapper.text()).not.toContain('Topic 0')
  })

  it('passe en mode édition au clic sur le bouton', async () => {
    mountComponent()
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(false)
    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('met à jour le label dans topicList après édition', async () => {
    mountComponent()
    await nextTick()
    await wrapper.find('button').trigger('click')
    await nextTick()

    const input = wrapper.find('input')
    await input.setValue('New Label')
    await input.trigger('focusout')
    await nextTick()

    const { topicList } = useTopicList()
    expect(topicList.value[0].labels[0]).toBe('Label 1')
  })

  it('affiche "Topic N" si aucun label n\'est présent', async () => {

    mountComponent()
    await nextTick()

    expect(wrapper.text()).toContain('Label 1')
  })
  it('met à jour editedTitle quand isTopicFirstSegment devient true', async () => {
    mountComponent({ topicIndex: 0, isTopicFirstSegment: false })

    await nextTick()
    expect(wrapper.vm.editedTitle).toBe(null)
    await wrapper.setProps({ isTopicFirstSegment: true })

    await nextTick()
    expect(wrapper.vm.editedTitle).undefined
  })

  it('désactive le champ d\'édition après un focusout', async () => {
    mountComponent()

    await nextTick()

    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.vm.showInput).toBe(true)

    const input = wrapper.find('input')
    await input.trigger('focusout')
    await nextTick()

    expect(wrapper.vm.showInput).toBe(false)
  })

})
