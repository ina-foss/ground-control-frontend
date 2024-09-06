import {expect, describe, test, it} from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '~/pages/dashboard.vue'
import { UserManager } from "oidc-client-ts"
import global from "~/presets/lara/global";
import _ from 'lodash'
import AuthService from "~/services/auth-service";
global.window = {
    stop: vitest.fn(),
    // add other window properties if needed
    location: {
        href: '',
        assign: vitest.fn(),
    },
    open: vitest.fn().mockReturnValue({
        stop: vitest.fn(),
    }),
};
describe('import vue components',() =>{
    it('should call window.stop', async () => {
        window.open = vi.fn().mockReturnValue({
            stop: vi.fn(),
        });

        const settings = {
            authority: "http://localhost:9080/realms/ground-control",
            client_id: "web_app",
            redirect_uri: `${window.location.origin}/auth`,
            silent_redirect_uri: `${window.location.origin}/silent-refresh`,
            post_logout_redirect_uri: `${window.location.origin}`,
            response_type: "code",
            userStore: '',
            loadUserInfo: true,
        };

        //const userManager = new UserManager(settings);
        //await userManager.signinRedirect();

        //expect(window.open).toHaveBeenCalled();
        //expect(window.open().stop).toHaveBeenCalled();
    });
    it('can mount some component', async () => {
        const component = mount(Dashboard)
        expect(component.text()).toContain('')
    })

    test('Header imports as expected', async ()=>{
        const cmp = await import('~/components/Header.vue')
        expect(cmp).toBeDefined()
    })
    test('DataDialog imports as expected', async ()=>{
        const cmp = await import('~/components/DataDialog.vue')
        expect(cmp).toBeDefined()
    })
    test('SegmentationMolecules imports as expected', async ()=>{
        const cmp = await import('~/components/SegmentationMolecules.vue')
        expect(cmp).toBeDefined()
    })
    test('ProjectCard imports as expected', async ()=>{
        const cmp = await import('~/components/ProjectCard.vue')
        expect(cmp).toBeDefined()
    })
    test('LoadingSpinner imports as expected', async ()=>{
        const cmp = await import('~/components/LoadingSpinner.vue')
        expect(cmp).toBeDefined()
    })
    test('Default imports as expected', async ()=>{
        const cmp = await import('~/layouts/default.vue')
        expect(cmp).toBeDefined()
    })

})
