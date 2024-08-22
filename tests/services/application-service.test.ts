import { describe, it, expect, beforeEach, vi } from 'vitest';
import ApplicationService from '@/services/application-service';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';

// Mock `useAuth` and `storeToRefs`
vi.mock('@/stores/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('pinia', () => ({
  storeToRefs: vi.fn(),
}));

describe('ApplicationService', () => {
  let applicationService: ApplicationService;

  beforeEach(() => {
    applicationService = new ApplicationService();
    vi.clearAllMocks();
  });

  describe('getUserRoles', () => {
    it('should return an array of roles when user is defined', () => {
      const mockUser = {
        value: {
          profile: {
            roles: ['admin', 'editor', 'viewer'],
          },
        },
      };
      storeToRefs.mockReturnValue({ user: mockUser });

      const roles = applicationService.getUserRoles();

      expect(roles).toEqual(['admin', 'editor', 'viewer']);
    });

    it('should return an empty array when user roles are not defined', () => {
      const mockUser = {
        value: {
          profile: {},
        },
      };
      storeToRefs.mockReturnValue({ user: mockUser });

      const roles = applicationService.getUserRoles();

      expect(roles).toEqual([]);
    });

    it('should return an empty array when user is not defined', () => {
      storeToRefs.mockReturnValue({ user: { value: undefined } });

      const roles = applicationService.getUserRoles();

      expect(roles).toEqual([]);
    });
  });

  describe('getDefaultHeader', () => {
    it('should return the correct Authorization header', () => {
      const mockAuthStore = {
        access_token: { value: 'test_token' },
      };
      storeToRefs.mockReturnValue(mockAuthStore);

      const header = applicationService.getDefaultHeader();

      expect(header).toEqual({ Authorization: 'Bearer test_token' });
    });
  });
});
