import { mount } from '@vue/test-utils'
import AtomComment from '@/components/atoms/AtomComment.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'


vi.mock('@/composables/useService', () => ({
  useService: () => ({
    $auth: {
      userEmail: 'user@localhost.com'
    },
    $application: {},
    $amalia: {}
  })
}))
describe('AtomComment', () => {
  let phraseMock: any
  let overlayMock: any

  beforeEach(() => {
    phraseMock = {
      data: {
        comments: [{
          text: 'Commentaire original',
          createdAt: '',
          createdBy: 'user@localhost.com',
          type: 'COMMENT'
        }]
      }
    }

    overlayMock = {
      hide: vi.fn()
    }
  })

  function createWrapper() {
    return mount(AtomComment, {
      global: {
        plugins: [PrimeVue],
        components: { InputText, Button },
        provide: {
          isAnnotationEditable: true
        }
      },
      props: {
        phrase: phraseMock,
        overlay: overlayMock
      }
    })
  }

  it('affiche "Commentaire" par défaut', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Commentaire')
  })

  it('crée un commentaire', async () => {

    phraseMock = {
      data: {
        comments: []
      }
    }
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('Nouveau commentaire')
    await wrapper.findAll('button').at(0)?.trigger('click')

    expect(phraseMock.data.comments.length).toBe(1)
    expect(phraseMock.data.comments[0].text).toBe('Nouveau commentaire')
  })

  it('crée un commentaire quand phrase est null', async () => {

    phraseMock = {
      data: {}
    }
    const wrapper = mount(AtomComment, {
      global: {
        plugins: [PrimeVue],
        components: { InputText, Button },
        provide: {
          isAnnotationEditable: true
        }
      },
      props: {
        phrase: phraseMock,
        overlay: overlayMock
      }
    })
    const input = wrapper.find('input')
    await input.setValue('Nouveau commentaire')
    await wrapper.findAll('button').at(0)?.trigger('click')
    expect(phraseMock.data.comments.length).toBe(1)
    expect(phraseMock.data.comments[0].text).toBe('Nouveau commentaire')
  })

  it('édite un commentaire', async () => {
    phraseMock = {
      data: {
        comments: [{
          text: 'Commentaire original',
          createdAt: '',
          createdBy: 'user@localhost.com',
          type: 'COMMENT'
        }]
      }
    }
    const wrapper = createWrapper()
    await wrapper.find('input').trigger('focus')
    const input = wrapper.find('input')
    await input.setValue('Texte modifié')
    await wrapper.findAll('button').at(1)?.trigger('click')
    expect(phraseMock.data.comments[0].text).toBe('Texte modifié')
  })

  it('annule l’édition d’un commentaire', async () => {
    phraseMock = {
      data: {
        comments: [{
          text: 'Commentaire original',
          createdAt: '',
          createdBy: 'user@localhost.com',
          type: 'COMMENT'
        }]
      }
    }

    const wrapper = createWrapper()
    const input = wrapper.findComponent({ name: 'InputText' })
    await input.trigger('focus')
    phraseMock.data.comments[0].text = 'Texte modifié'
    wrapper.vm.cancelEdit()
    expect(phraseMock.data.comments[0].text).toBe('Commentaire original')
    expect(wrapper.vm.isEdited).toBe(false)
  })

  it('supprime un commentaire', async () => {
    phraseMock.data.comments = [{
      text: 'À supprimer',
      createdAt: '1 janv. 2025',
      createdBy: 'user@localhost.com',
      type: 'COMMENT'
    }]
    const wrapper =  createWrapper()
    wrapper.vm.deleteComment(phraseMock.data.comments[0])
    expect(phraseMock.data.comments.length).toBe(0)
  })
})
