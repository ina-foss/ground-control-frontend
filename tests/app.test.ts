import {expect, describe, it} from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('Nuxt Application', () => {
    setup({
        browser: true,
    });

    it('renders the index page', async () => {
        const html = await $fetch('/');
        expect(html).toContain('');
    });
});