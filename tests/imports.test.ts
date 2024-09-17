import { expect, describe, test, vi } from 'vitest';
import global from '~/presets/lara/global';

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
