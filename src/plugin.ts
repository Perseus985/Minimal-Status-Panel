import { PanelPlugin } from '@grafana/data';
import { StatusPanelOptions } from './types';
import { StatusPanel } from './components/StatusPanel';

export const plugin = new PanelPlugin<StatusPanelOptions>(StatusPanel).setPanelOptions((builder) => {
  return builder
    .addSelect({
      path: 'displayMode',
      name: 'Display Mode',
      description: 'How to display the status items',
      defaultValue: 'list',
      settings: {
        options: [
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'compact', label: 'Compact' },
        ],
      },
    })
    .addSelect({
      path: 'displayLevel',
      name: 'Display Level',
      description: 'Choose between minimal (header only) or full view (with stats)',
      defaultValue: 'full',
      settings: {
        options: [
          { value: 'minimal', label: 'Minimal (Header + Heartbeat only)' },
          { value: 'full', label: 'Full (Header + Heartbeat + Stats)' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'showLabels',
      name: 'Show Labels',
      description: 'Display service names',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showLastCheck',
      name: 'Show Last Check',
      description: 'Display last check time',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showResponseTime',
      name: 'Show Response Time',
      description: 'Display response time',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showUrls',
      name: 'Show URLs',
      description: 'Display service URLs/instance links',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'maxItems',
      name: 'Max Items',
      description: 'Maximum number of items to display',
      defaultValue: 20,
      settings: {
        min: 1,
        max: 100,
      },
    })
    .addNumberInput({
      path: 'refreshInterval',
      name: 'Refresh Interval (seconds)',
      description: 'How often to refresh the data',
      defaultValue: 30,
      settings: {
        min: 5,
        max: 300,
      },
    })
    .addTextInput({
      path: 'customNames',
      name: 'Custom Service Names',
      description: 'JSON mapping of instance URLs to custom names. Example: {"https://google.com":"Google","https://github.com":"GitHub"}',
      defaultValue: '{}',
      settings: {
        placeholder: '{"https://google.com":"Google","https://github.com":"GitHub"}',
      },
    });
});
