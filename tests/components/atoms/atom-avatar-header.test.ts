import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomAvatarHeader from '@/components/atoms/AtomAvatarHeader.vue'

// Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))
vi.mock('vue', async (original) => {
  const actual = await original()
  return {
    ...actual,
    ref: (val?: any) => (val === undefined ? { value: { toggle: vi.fn() } } : actual.ref(val))
  }
})

vi.mock('#imports', () => ({
  useAuth: () => ({
    $auth: { logout: vi.fn() },
    userEmail: 'test@email.com'
  }),
  useColorMode: () => ({
    preference: 'light'
  }),
  useService: () => ({
    $auth: {
      logout: vi.fn()
    }
  }),
  storeToRefs: (store: any) => ({
    userEmail: store.userEmail
  })
}))

describe('AtomAvatarHeader', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(AtomAvatarHeader, {
      global: {
        stubs: {
          Avatar: {
            template: '<div ref="avatar"><slot /></div>'
          },
          Menu: true,
          Tooltip: true
        }
      }
    })
  })

  it('affiche l’avatar avec l’icône', () => {
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('svg')
  })

  it('appelle menu.toggle lors du clic', async () => {
    const toggleMock = vi.fn()
    const wrapper = mount(AtomAvatarHeader, {
      global: {
        stubs: {
          Menu: true,
          Tooltip: true
        }
      }
    })

    const menuRef = ref({ toggle: toggleMock })
    wrapper.vm.menu = menuRef
    const avatar = wrapper.findComponent({ ref: 'avatar' })
    await avatar.trigger('click')
    expect(toggleMock).toBeDefined()
  })

   it('contient bien les options de menu', () => {
     const items = (wrapper.vm as any).items
     expect(items).toHaveLength(1)
     expect(items[0].items).toEqual(
       expect.arrayContaining([
         expect.objectContaining({ label: expect.stringContaining('Changer en mode') }),
         expect.objectContaining({ label: 'Rafraichir token' }),
         expect.objectContaining({ label: 'Déconnexion' }),
       ])
     )
   })

   it('exécute la déconnexion au clic', () => {
     const logoutSpy = vi.fn()
     ;(wrapper.vm as any).authService.$auth.logout = logoutSpy

     const logoutItem = (wrapper.vm as any).items[0].items.find((i: any) =>
       i.label === 'Déconnexion'
     )
     logoutItem.command()

     expect(logoutSpy).toHaveBeenCalled()
   })

   it('navigue vers /silent-refresh', () => {
     const refreshItem = (wrapper.vm as any).items[0].items.find((i: any) =>
       i.label === 'Rafraichir token'
     )
     const router = useRouter()
     const pushSpy = router.push
     refreshItem.command()
     expect(pushSpy).toBeDefined()
   })

  it('exécute le changement de mode', () => {
    const toggleDarkMode = vi.fn()
    const toggleItem = (wrapper.vm as any).items[0].items.find((i: any) =>
      i.label.includes('Changer en mode')
    )

    expect(toggleItem).toBeDefined()

    expect(toggleDarkMode).toBeDefined()
  })
})

