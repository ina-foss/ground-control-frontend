import { mount } from '@vue/test-utils'
import Index from '@/pages/index.vue'
import { vi } from 'vitest'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))



describe('Index.vue', () => {
  it('redirect to dashboard', () => {
    mount(Index)
  })
})
