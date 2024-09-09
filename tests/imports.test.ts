import { expect, describe, test, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Dashboard from '~/pages/dashboard.vue';
import global from '~/presets/lara/global';
import {UserManager, UserManagerSettings} from "oidc-client-ts";

// Mock global window properties
global.window = {
  stop: vi.fn(),
  location: {
    href: '',
    assign: vi.fn(),
  },
  open: vi.fn().mockReturnValue({
    stop: vi.fn(),
  }),
};

describe('Dashboard.vue Tests', () => {
  // it('should call window.stop when a window is opened', async () => {
  //   const settings: UserManagerSettings = {
  //     authority: "http://localhost:9080/realms/ground-control",
  //     client_id: "web_app",
  //     redirect_uri: `${window.location.origin}/auth`,
  //     silent_redirect_uri: `${window.location.origin}/silent-refresh`,
  //     post_logout_redirect_uri: `${window.location.origin}`,
  //     response_type: "code",
  //     loadUserInfo: true,
  //   };
  //
  //   const userManager = new UserManager(settings);
  //   await userManager.signinRedirect();
  //
  //   expect(window.open).toHaveBeenCalled();
  //   // expect(window.open().stop).toHaveBeenCalled();
  // });


  test('Header component imports as expected', async () => {
    const cmp = await import('~/components/molecules/MoleculeHeader.vue');
    expect(cmp).toBeDefined();
  });

  test('DataDialog component imports as expected', async () => {
    const cmp = await import('~/components/DataDialog.vue');
    expect(cmp).toBeDefined();
  });

  test('SegmentationMolecules component imports as expected', async () => {
    const cmp = await import('~/components/molecules/MoleculeSegmentation.vue');
    expect(cmp).toBeDefined();
  });

  test('ProjectCard component imports as expected', async () => {
    const cmp = await import('~/components/ProjectCard.vue');
    expect(cmp).toBeDefined();
  });

  test('LoadingSpinner component imports as expected', async () => {
    const cmp = await import('~/components/LoadingSpinner.vue');
    expect(cmp).toBeDefined();
  });

  test('Default layout imports as expected', async () => {
    const cmp = await import('~/layouts/default.vue');
    expect(cmp).toBeDefined();
  });
});
