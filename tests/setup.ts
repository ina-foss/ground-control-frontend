import { beforeAll } from 'vitest';
import { setup } from '@nuxt/test-utils';
import path from 'path';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

beforeAll(async () => {
  await setup({
    server: true,
    browser: true,
    rootDir: path.resolve(__dirname, '../'), // Adjust this to point to your project's root directory
    server: {
      port: 3000, // Ensure the server is running on a specific port
    },
  });
});

export { baseURL };
