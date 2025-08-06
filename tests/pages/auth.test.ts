import {vi,it,expect} from "vitest";
import { mount } from '@vue/test-utils'
import Auth from '@/pages/auth.vue'
vi.mock('@/composables/useService', () => ({
  useService: () => ({
    $auth: {
      signInCallback: vi.fn()
    }
  })
}))

const navigateTo = vi.fn()
vi.stubGlobal('navigateTo', navigateTo)

describe('Auth.vue', () => {
  const wrapper = mount(Auth, {
  })
  it('show loading message', async () => {

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Loading authentication...')
  })
})
