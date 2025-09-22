import { PanelData, TimeRange } from '@grafana/data';

export interface StatusPanelOptions {
  displayMode: 'list' | 'grid' | 'compact';
  displayLevel: 'minimal' | 'full';
  showLabels: boolean;
  showLastCheck: boolean;
  showResponseTime: boolean;
  maxItems: number;
  refreshInterval: number;
}

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'maintenance' | 'warning' | 'unknown';
  lastCheck?: Date;
  responseTime?: number;
  url?: string;
  uptime?: number;
  message?: string;
}

export interface StatusPanelProps {
  options: StatusPanelOptions;
  data: PanelData;
  width: number;
  height: number;
  timeRange: TimeRange;
  onOptionsChange: (options: StatusPanelOptions) => void;
}
