import { describe, it, expect, vi, beforeEach } from 'vitest'
import AtomSearch from '@/components/atoms/search/AtomSearch.vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('AtomSearch.vue', () => {
  let wrapper: VueWrapper<any>

  const createWrapper = (customProps = {}) => {
    return mount(AtomSearch, {
      props: {

        ...customProps
      },
      global: {
        config: {
          globalProperties: {
            $primevue: { config: {} }
          }
        },
        stubs: {
          // Stubs des composants PrimeVue pour éviter les erreurs de config
          InputText: {
            template: '<input />'
          },
          MultiSelect: {
            template: '<select><slot /></select>'
          }
        }
      }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('affiche le bouton "Recherche" par défaut', async () => {
    const wrapper = createWrapper()
    await nextTick()
    expect(wrapper.text()).toContain('Recherche')
  })

  it('toggle correctement la vue interface de recherche', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    //expect(wrapper.html()).toContain('InputText')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)

  })

  it('réagit à un label sélectionné', async () => {
    wrapper = createWrapper({
      labels: ['Label A'],
      spans: [{ tcin: '1', id: 'span-1' }]
    })

    // Simuler un élément dans le DOM
    const span = document.createElement('div')
    span.setAttribute('tcin', '1')
    span.innerText = 'Label A'
    document.body.appendChild(span)

    wrapper.vm.invertInterface()
    await nextTick()

    wrapper.vm.selectedSearch = 'Label A'
    await nextTick()

    expect(wrapper.vm.selectedSpan.length).toBe(1)

    document.body.removeChild(span)
  })

  it('clear le champ de recherche', async () => {
    wrapper.vm.selectedSearch = 'abc'
    await wrapper.vm.clear()
    expect(wrapper.vm.selectedSearch).toBe('')
  })

  it('navigue avec upIndex et downIndex', async () => {
    wrapper = createWrapper({
      list: [
        Object.assign(document.createElement('div'), { innerText: 'example one' }),
        Object.assign(document.createElement('div'), { innerText: 'example two' }),
        Object.assign(document.createElement('div'), { innerText: 'example three' })
      ]
    })
    wrapper.vm.selectedSearch = 'example'
    await nextTick()
    await wrapper.vm.highlightResults()
    wrapper.vm.highlightResults = vi.fn()
    await nextTick()
    wrapper.vm.searchIndex = 1
    wrapper.vm.upIndex()
    expect(wrapper.vm.searchIndex).toBe(0)

    wrapper.vm.downIndex()
    expect(wrapper.vm.searchIndex).toBe(-1)
  })

  it('navigue avec upIndex et downIndex with Label', async () => {
    wrapper = createWrapper({
      labels: ['Label A'],
      spans: [{ tcin: '1', id: 'span-1' }],
      list: [
        Object.assign(document.createElement('div'), { innerText: 'example one' }),
        Object.assign(document.createElement('div'), { innerText: 'example two' }),
        Object.assign(document.createElement('div'), { innerText: 'example three' })
      ]
    })
    wrapper.vm.selectedSearch = ''
    await nextTick()
    await wrapper.vm.highlightResults()
    wrapper.vm.highlightResults = vi.fn()
    await nextTick()
    wrapper.vm.searchIndex = 1
    wrapper.vm.upIndex()
    expect(wrapper.vm.searchIndex).toBe(2)

    wrapper.vm.downIndex()
    expect(wrapper.vm.searchIndex).toBe(1)
  })

  it('émet les bons événements', async () => {
    const span = document.createElement('div')
    span.setAttribute('tcin', '99')
    span.classList.add('customText')
    span.textContent = 'example'

    wrapper = createWrapper({
      spans: [{ tcin: '99', id: 'test-id' }],
      labels: [],
      list: []
    })

    wrapper.vm.selectedSpan = [span]
    wrapper.vm.searchIndex = 0

    await nextTick()
    expect(wrapper.emitted('find-element')).toBeTruthy()
  })



  it('réinitialise searchIndex à 0 si la longueur de iterableSegment est atteinte et labels est vide', () => {
    const emptyWrapper = mount(AtomSearch, {
      props: {
        spans: ref([{ id: 1 }, { id: 2 }, { id: 3 }]),
        labels: ref([]),
        list: [],
      },
      global: {
        config: {
          globalProperties: {
            $primevue: { config: {} }
          }
        },
        stubs: {
          // Stubs des composants PrimeVue pour éviter les erreurs de config
          InputText: {
            template: '<input />'
          },
          MultiSelect: {
            template: '<select><slot /></select>'
          }
        }
      }
    })
    emptyWrapper.vm.upIndex()

    expect(emptyWrapper.vm.searchIndex).toBe(0)
    emptyWrapper.vm.downIndex()
    expect(emptyWrapper.vm.searchIndex).toBe(-1)
  })

  it('incrémente searchIndex si aucune condition n\'est remplie', () => {
    const emptyWrapper = mount(AtomSearch, {
      props: {
        spans: ref([{ id: 1 }, { id: 2 }, { id: 3 }]),
        labels: ref(['Label A']),
        list: [],
      },
      global: {
        config: {
          globalProperties: {
            $primevue: { config: {} }
          }
        },
        stubs: {
          // Stubs des composants PrimeVue pour éviter les erreurs de config
          InputText: {
            template: '<input />'
          },
          MultiSelect: {
            template: '<select><slot /></select>'
          }
        }
      }
    })
    emptyWrapper.vm.upIndex()

    expect(emptyWrapper.vm.searchIndex).toBe(1)
    emptyWrapper.vm.downIndex()
    expect(emptyWrapper.vm.searchIndex).toBe(0)
  })
})

