import type { VueWrapper} from '@vue/test-utils';
import {mount, flushPromises} from '@vue/test-utils'
import { vi } from 'vitest'

import SilentRefresh from '@/pages/silent-refresh.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

const renewTokenMock = vi.fn()
const pushMock = vi.fn()
let wrapper : VueWrapper
vi.mock('@/composables/useService', () => ({
  useService: () => ({
    $auth: {
      renewToken: renewTokenMock
    }
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

describe('silent-refresh.vue', () => {
  beforeEach(async()=>{
    wrapper = await mountSuspended(SilentRefresh)
  })

  it('can mount SilentRefresh', async () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Refreshing Token')
  })

  it('get error if renewToken fail', async () => {
    const error = new Error('Token refresh failed')
    renewTokenMock.mockRejectedValueOnce(error)

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mount(SilentRefresh)
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
  })

})
