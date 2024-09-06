import { describe, it, expect, beforeEach, vi } from 'vitest'
import {getApplicationConfiguration, initApplicationConfiguration} from '../../services/dynamic-configuration-service'

// Mock the global fetch function
global.fetch = vi.fn()
const useRuntimeConfig = vi.fn();

vi.mock('#app', () => ({
    useRuntimeConfig
}))

global.targetWindow = {
    stop: vi.fn()
};
describe('dynamicConfigurationService', () => {
    // Reset mocks before each test
    beforeEach(() => {
      vi.clearAllMocks();
    })

    it('should call stop on targetWindow', () => {
        targetWindow.stop();
        expect(targetWindow.stop).toHaveBeenCalled();
    });
  it('loads configuration from config.json and runtimeConfig', async () => {
    const mockConfig = { key: 'value' };
    const mockRuntimeConfig = { public: { runtimeKey: 'runtimeValue' } };

    fetch.mockResolvedValueOnce({
      json: async () => mockConfig,
    });
    useRuntimeConfig.mockReturnValue(mockRuntimeConfig);

    await initApplicationConfiguration();

    const config = getApplicationConfiguration();
    expect(config.key).toEqual(mockConfig.key);
  });


    it('should handle fetch error and use runtime config only', async () => {
        fetch.mockRejectedValue(new Error('Fetch error'))

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        await initApplicationConfiguration()

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error))
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({ message: 'Fetch error' }))
        consoleErrorSpy.mockRestore()
    })
  it('handles fetch error and loads runtimeConfig', async () => {
    const mockRuntimeConfig = { public: { runtimeKey: 'runtimeValue' } };
    fetch.mockRejectedValueOnce({
      json: async () => new Error('Fetch error'),
    });
    useRuntimeConfig.mockReturnValue(mockRuntimeConfig);
    // fetch.mockRejectedValueOnce(new Error('Fetch error'));
    useRuntimeConfig.mockReturnValue(mockRuntimeConfig);

    await initApplicationConfiguration();

    const config = getApplicationConfiguration();
    expect(config).toEqual(config);
  });
})
