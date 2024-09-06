import { beforeAll } from 'vitest';
import { setup } from '@nuxt/test-utils';

beforeAll(async () => {
    await setup({
        server: true,
        browser: true,
    });
});