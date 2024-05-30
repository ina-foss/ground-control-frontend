import {expect, describe, test, it} from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '~/pages/dashboard.vue'
describe('import vue components',() =>{

    it('can mount some component', async () => {
        const component = mount(Dashboard)
        expect(component.text()).toContain('')
    })

    test('Header imports as expected', async ()=>{
        const cmp = await import('../components/Header.vue')
        expect(cmp).toBeDefined()
    })
    test('DataDialog imports as expected', async ()=>{
        const cmp = await import('../components/DataDialog.vue')
        expect(cmp).toBeDefined()
    })
    test('SegmentationMolecules imports as expected', async ()=>{
        const cmp = await import('../components/SegmentationMolecules.vue')
        expect(cmp).toBeDefined()
    })
    test('ProjectCard imports as expected', async ()=>{
        const cmp = await import('../components/ProjectCard.vue')
        expect(cmp).toBeDefined()
    })
    test('LoadingSpinner imports as expected', async ()=>{
        const cmp = await import('../components/LoadingSpinner.vue')
        expect(cmp).toBeDefined()
    })
    test('Default imports as expected', async ()=>{
        const cmp = await import('../layouts/default.vue')
        expect(cmp).toBeDefined()
    })

})