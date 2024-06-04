# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Running unit tests

`npm run test` to execute the unit tests via vitest (`vitest`: the default command).
`npm run coverage` to run and get a coverage report of unit tests (`vitest run --coverage`: the default command) .
 
These commands are specified in a script in `package.json` 
To make your own vitest unit tests configuration , you may use `vitest.config.ts` file to set up various options like environment, outputFile ... 

## About authentication

The authentication flow of the application is handled by Keycloak. All the variable needed for configuration are in the [config.json file](./assets/config.json).
In development mode, you can see all the tokens and user information in Pinia tab of the Nuxt DevTool. These infos are also store in a WebStorageSession which means the user is still connecting after closing the application tabs on its browser.

The global middleware of the application redirect any incoming user who are not logged. After login in the Keycloak page, user gets redirected to `/auth` page where the actual
sign in function is called. Finally, he comes back to the root of the application.

The access token, used in every API call to the backend application, may eventually expire during long session. The page `/silent-refresh` allow user to refresh its access token using the refresh token. This route is called automatically upon access token expiration.


## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
