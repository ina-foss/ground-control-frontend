import { beforeAll } from 'vitest';
import { setup } from '@nuxt/test-utils';
import path from 'path';

beforeAll(async () => {

  await setup({
    server: true,
    browser: true,
    rootDir: path.resolve(__dirname, '../'), // Adjust the path as needed
  });
});
