import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomTopicList from '@/components/atoms/topicList/AtomTopicList.vue'
import ScrollPanel from 'primevue/scrollpanel'

vi.mock('~/composables/useTopicList', () => ({
  useTopicList: () => ({
    topicList: {
      1: { title: 'Thème important', labels: ['label1'] },
      2: { title: '', labels: [] },
    }
  })
}))

vi.mock('#imports', () => ({
  useService: () => ({
    $application: {
      computeColor: (id: number) => ({ hex: id === 1 ? '#FF0000' : '#00FF00' }),
      extractRGB: (hex: string) => {
        const bigint = parseInt(hex.replace('#', ''), 16)
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
      }
    }
  })
}))

describe('AtomTopicList.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AtomTopicList, {
      global: {
        components: {ScrollPanel}
      },
      props: {
        topics: [1, 2, 1]
      }
    })
  })

  it('affiche les titres des topics correctement', () => {
    const titles = wrapper.findAll('h2')
    expect(titles).toHaveLength(2)
    expect(titles[0].text()).toBe('Thème important') // topic 1
  })

  it('applique le bon style au cercle', () => {
    const circles = wrapper.findAll('.rounded-full')
    expect(circles[0].attributes('style')).toContain('rgba(0, 0, 0')
  })

  it('affiche une icône si le topic a des labels', () => {
    const icons = wrapper.findAll('.pi-check-square')
    expect(icons).toHaveLength(1)
  })

  it('émet un événement topicClick avec le bon payload au clic', async () => {
    const clickable = wrapper.findAll('.hover\\:cursor-pointer')
    await clickable[0].trigger('click')

    expect(wrapper.emitted('topicClick')).toBeTruthy()
    expect(wrapper.emitted('topicClick')[0]).toEqual([{topic: 1}])
  })

  it('n’affiche rien si la liste est vide', async () => {
    const emptyWrapper = mount(AtomTopicList, {
      global: {
        components: {ScrollPanel}
      },
      props: {}
    })
    expect(emptyWrapper.findAll('h2')).toHaveLength(0)
  })
})
