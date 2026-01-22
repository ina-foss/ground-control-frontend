import { expect, describe, test, vi, beforeAll } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

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

// Mock Nuxt composables before imports
beforeAll(() => {
  mockNuxtImport('useService', () => {
    return () => ({
      $application: {
        hasRole: vi.fn().mockReturnValue(true)
      }
    });
  });

  mockNuxtImport('useNuxtApp', () => {
    return () => ({
      $handleApiError: vi.fn()
    });
  });

  mockNuxtImport('useToast', () => {
    return () => ({
      add: vi.fn()
    });
  });

  mockNuxtImport('useRefreshStore', () => {
    return () => ({
      fetchProjects: vi.fn()
    });
  });

  mockNuxtImport('useAsyncData', () => {
    return vi.fn();
  });

  mockNuxtImport('useAuth', () => {
    return () => ({
      userEmail: 'test@example.com'
    });
  });
});

describe('Dashboard.vue Tests', () => {

  test('Header component imports as expected', async () => {
    const cmp = await import('../components/molecules/MoleculeHeader.vue');
    expect(cmp).toBeDefined();
  });

  test('SegmentationMolecules component imports as expected', async () => {
    const cmp = await import('../components/molecules/MoleculeSegmentation.vue');
    expect(cmp).toBeDefined();
  });

  test('ProjectCard component imports as expected', async () => {
    const cmp = await import('../components/molecules/MoleculeProjectCard.vue');
    expect(cmp).toBeDefined();
  });

  test('LoadingSpinner component imports as expected', async () => {
    const cmp = await import('../components/LoadingSpinner.vue');
    expect(cmp).toBeDefined();
  });

  test('Default layout imports as expected', async () => {
    const cmp = await import('../layouts/default.vue');
    expect(cmp).toBeDefined();
  });
});
