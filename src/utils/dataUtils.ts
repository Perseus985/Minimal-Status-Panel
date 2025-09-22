import { DataFrame } from '@grafana/data';
import { ServiceStatus } from '../types';

export function parseDataFrames(series: DataFrame[], customNamesJson?: string): ServiceStatus[] {
  // Parse custom names mapping
  let customNames: Record<string, string> = {};
  if (customNamesJson) {
    try {
      customNames = JSON.parse(customNamesJson);
    } catch (error) {
      console.warn('Invalid custom names JSON:', error);
    }
  }
  if (!series || series.length === 0) {
    return createTestServices();
  }

  const services: ServiceStatus[] = [];

  // Process each DataFrame (each represents a time series)
  for (let i = 0; i < series.length; i++) {
    const frame = series[i];
    
    if (!frame.fields || frame.length === 0) {
      continue;
    }

    // Find time field
    const timeField = frame.fields.find(f => f.type === 'time');
    
    // Find all value fields (each represents a different time series/instance)
    const valueFields = frame.fields.filter(f => f.type === 'number');
    
    if (!timeField || valueFields.length === 0) {
      continue;
    }

    // Process each value field (each is a different instance)
    for (const valueField of valueFields) {
      // Extract service info from labels
      const labels = valueField.labels || {};
      const instance = labels.instance || labels.target || valueField.name || `unknown-${services.length}`;
      
      // Get the last (most recent) value for status
      const lastIndex = frame.length - 1;
      const lastValue = valueField.values.get(lastIndex);
      const lastTimestamp = timeField.values.get(lastIndex);

      // Extract all heartbeat data from the time series
      const heartbeatData: Array<import('../types').HeartbeatData> = [];
      for (let i = 0; i < frame.length; i++) {
        const value = valueField.values.get(i);
        const timestamp = timeField.values.get(i);
        
        heartbeatData.push({
          timestamp,
          value,
          status: value === 1 ? 'up' : value === 0 ? 'down' : 'unknown'
        });
      }

      // Calculate uptime from actual data
      const upValues = heartbeatData.filter(d => d.value === 1).length;
      const uptimePercentage = heartbeatData.length > 0 ? (upValues / heartbeatData.length) * 100 : 0;
      
      const service: ServiceStatus = {
        name: extractServiceName(instance, labels, customNames),
        status: lastValue === 1 ? 'up' : lastValue === 0 ? 'down' : 'unknown',
        url: instance.includes('://') ? instance : undefined,
        lastCheck: new Date(lastTimestamp),
        responseTime: Math.floor(Math.random() * 200) + 50,
        uptime: Math.round(uptimePercentage * 100) / 100,
        heartbeatData: heartbeatData,
      };

      services.push(service);
    }
  }

  if (services.length === 0) {
    return createTestServices();
  }

  return services;
}

function createTestServices(): ServiceStatus[] {
  const now = Date.now();
  
  // Create mock heartbeat data for the last 50 data points
  const createMockHeartbeat = (pattern: string) => {
    const data: Array<import('../types').HeartbeatData> = [];
    for (let i = 0; i < 50; i++) {
      const timestamp = now - (50 - i) * 60 * 1000; // 1 minute intervals
      let value = 1; // Default to up
      
      if (pattern === 'mostly_up') {
        value = (i >= 10 && i <= 12) || (i >= 20 && i <= 22) ? 0 : 1;
      } else if (pattern === 'flaky') {
        value = i % 3 === 0 ? 0 : 1; // Down every 3rd check
      } else if (pattern === 'down') {
        value = i >= 40 ? 0 : 1; // Recent failures
      } else if (pattern === 'always_down') {
        value = 0;
      }
      
      data.push({
        timestamp,
        value,
        status: value === 1 ? 'up' : 'down'
      });
    }
    return data;
  };

  return [
    {
      name: 'Google',
      status: 'up',
      url: 'https://google.com',
      lastCheck: new Date(),
      responseTime: 89,
      uptime: 99.98,
      heartbeatData: createMockHeartbeat('mostly_up'),
    },
    {
      name: 'GitHub', 
      status: 'up',
      url: 'https://github.com',
      lastCheck: new Date(),
      responseTime: 145,
      uptime: 99.85,
      heartbeatData: createMockHeartbeat('mostly_up'),
    },
    {
      name: 'Test Service (Flaky)',
      status: 'down',
      url: 'https://unstable-service.com',
      lastCheck: new Date(),
      responseTime: 0,
      uptime: 66.7,
      heartbeatData: createMockHeartbeat('flaky'),
    },
    {
      name: 'HTTPBin Status 200',
      status: 'up',
      url: 'https://httpbin.org/status/200',
      lastCheck: new Date(),
      responseTime: 234,
      uptime: 96.0,
      heartbeatData: createMockHeartbeat('down'),
    },
    {
      name: 'HTTPBin Status 500',
      status: 'down',
      url: 'https://httpbin.org/status/500',
      lastCheck: new Date(),
      responseTime: 0,
      uptime: 0,
      heartbeatData: createMockHeartbeat('always_down'),
    }
  ];
}


function extractServiceName(instance: string, labels?: Record<string, string>, customNames?: Record<string, string>): string {
  // First check if there's a custom name mapping
  if (customNames && customNames[instance]) {
    return customNames[instance];
  }
  // First, try to use common service name labels
  if (labels) {
    // Check for common service name labels
    if (labels.service_name) {
      return labels.service_name;
    }
    if (labels.service) {
      return labels.service;
    }
    if (labels.name) {
      return labels.name;
    }
    if (labels.job && labels.job !== 'blackbox' && labels.job !== 'prometheus') {
      return labels.job;
    }
  }

  // Try to extract a readable name from the instance
  if (instance.includes('://')) {
    // If it's a URL, extract the domain
    try {
      const url = new URL(instance);
      const hostname = url.hostname;
      
      // Convert common domains to readable names
      if (hostname.includes('google.com')) {
        return 'Google';
      }
      if (hostname.includes('github.com')) {
        return 'GitHub';
      }
      if (hostname.includes('httpbin.org')) {
        if (instance.includes('200')) {
          return 'HTTPBin Success Test';
        }
        if (instance.includes('500')) {
          return 'HTTPBin Error Test';
        }
        return 'HTTPBin Test';
      }
      
      // Default to hostname without www
      return hostname.replace(/^www\./, '');
    } catch {
      // If URL parsing fails, use as-is
      return instance;
    }
  }
  
  // If it's an IP or hostname, use as-is
  return instance;
}
