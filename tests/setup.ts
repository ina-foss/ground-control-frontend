import { beforeAll } from 'vitest';
import { setup } from '@nuxt/test-utils';
import { config } from '@vue/test-utils';
import path from 'path';

export const baseURL = process.env.BASE_URL || 'http://localhost:3000';

beforeAll(async () => {


  // Mock module: oidc-client-ts
  vi.mock("oidc-client-ts", () => {
    return {
      UserManager: vi.fn().mockImplementation(() => ({
        events: {
          addAccessTokenExpired: vi.fn(),
          addAccessTokenExpiring: vi.fn(),
          addUserLoaded: vi.fn(),
          addUserUnloaded: vi.fn(),
          addSilentRenewError: vi.fn(),
        },
        signInRedirect: vi.fn(),
        signInCallback: vi.fn(),
        getUser: vi.fn().mockResolvedValue({}),
        signinSilent: vi.fn(),
        signoutRedirect: vi.fn(),
      })),
      WebStorageStateStore: vi.fn(),
    };
  });

  config.global.stubs = {
    NuxtLink: {
      props: ["to"],
      template: '<a :href="to"><slot /></a>', // Mock NuxtLink with `to`
    },
  };
});
if (typeof window !== "undefined") {
  window.stop = vi.fn();
}
