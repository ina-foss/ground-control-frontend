import {expect, describe, it} from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '~/pages/dashboard.vue'
describe('import vue components',() => {
    const wrapper = mount(Dashboard)

    it('can mount dashboard', async () => {
        expect(wrapper.text()).toContain('')
        expect(wrapper.html()).toContain("<div class=\"py-8 px-4 grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2\">")
    })
})