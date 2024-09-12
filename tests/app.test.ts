import {expect, describe, it} from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

global.fetch = vi.fn();

describe('Nuxt Application', () => {
    beforeEach(() => {
        fetch.mockReset()
    })
    setup({
        browser: false,
    });

    it('renders the index page', async () => {
        const html = await $fetch('/');
        expect(html).toContain('');
    });
});
