import { defineConfig, OperationPath } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8000/docs/openapi.json',
  output: {
    path: './app/api/generate/',
    format: 'prettier',
  },
  plugins: [
    {
      name: '@hey-api/client-nuxt',
      runtimeConfigKey: 'public',
    },
    { name: '@hey-api/typescript', enums: true },
    {
      name: '@hey-api/sdk',
      operations: {
        strategy: 'byTags',
      },
    },
  ],
});
