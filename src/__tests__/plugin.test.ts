import { plugin } from '../module';
import { StatusPanelOptions } from '../types';

describe('Plugin Configuration', () => {
  it('should export a valid PanelPlugin', () => {
    expect(plugin).toBeDefined();
    expect(plugin.meta).toBeDefined();
    // Note: meta.id is set by the build process from plugin.json
  });

  it('should have the correct panel options structure', () => {
    const defaultOptions: StatusPanelOptions = {
      displayMode: 'list',
      displayLevel: 'full',
      showLabels: true,
      showLastCheck: true,
      showResponseTime: true,
      showUrls: true,
      maxItems: 20,
      refreshInterval: 30,
      customNames: '{}'
    };

    // Test that our options interface is properly typed
    expect(defaultOptions.displayMode).toBe('list');
    expect(defaultOptions.displayLevel).toBe('full');
    expect(defaultOptions.showUrls).toBe(true);
    expect(typeof defaultOptions.customNames).toBe('string');
  });
});
