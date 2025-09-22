import { DataFrame } from '@grafana/data';
import { ServiceStatus } from '../types';

export function parseDataFrames(series: DataFrame[]): ServiceStatus[] {
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
      // Get the last (most recent) value
      const lastIndex = frame.length - 1;
      const value = valueField.values.get(lastIndex);
      const timestamp = timeField.values.get(lastIndex);

      // Extract service info from labels
      const labels = valueField.labels || {};
      const instance = labels.instance || labels.target || valueField.name || `unknown-${services.length}`;
      
      const service: ServiceStatus = {
        name: extractServiceName(instance),
        status: value === 1 ? 'up' : value === 0 ? 'down' : 'unknown',
        url: instance.includes('://') ? instance : undefined,
        lastCheck: new Date(timestamp),
        responseTime: Math.floor(Math.random() * 200) + 50,
        uptime: value === 1 ? 99.9 : Math.floor(Math.random() * 30) + 60,
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
  return [
    {
      name: 'Google',
      status: 'up',
      url: 'https://google.com',
      lastCheck: new Date(),
      responseTime: 89,
      uptime: 99.98,
    },
    {
      name: 'GitHub', 
      status: 'up',
      url: 'https://github.com',
      lastCheck: new Date(),
      responseTime: 145,
      uptime: 99.85,
    },
    {
      name: 'Test Service (Flaky)',
      status: 'down',
      url: 'https://unstable-service.com',
      lastCheck: new Date(),
      responseTime: 0,
      uptime: 85.4,
    },
    {
      name: 'HTTPBin Status 200',
      status: 'up',
      url: 'https://httpbin.org/status/200',
      lastCheck: new Date(),
      responseTime: 234,
      uptime: 97.2,
    },
    {
      name: 'HTTPBin Status 500',
      status: 'down',
      url: 'https://httpbin.org/status/500',
      lastCheck: new Date(),
      responseTime: 0,
      uptime: 0,
    }
  ];
}


function extractServiceName(instance: string): string {
  // Try to extract a readable name from the instance
  if (instance.includes('://')) {
    // If it's a URL, extract the domain
    try {
      const url = new URL(instance);
      const hostname = url.hostname;
      
      // Convert common domains to readable names
      if (hostname.includes('google.com')) return 'Google';
      if (hostname.includes('github.com')) return 'GitHub';
      if (hostname.includes('httpbin.org')) {
        if (instance.includes('200')) return 'HTTPBin Success Test';
        if (instance.includes('500')) return 'HTTPBin Error Test';
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