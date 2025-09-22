import { parseDataFrames } from '../utils/dataUtils';
import { DataFrame, FieldType } from '@grafana/data';

describe('Data Utils', () => {
  describe('parseDataFrames', () => {
    it('should return test services when no data is provided', () => {
      const result = parseDataFrames([]);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Check first service structure
      const firstService = result[0];
      expect(firstService).toHaveProperty('name');
      expect(firstService).toHaveProperty('status');
      expect(firstService).toHaveProperty('heartbeatData');
      expect(['up', 'down', 'unknown']).toContain(firstService.status);
    });

    it('should parse DataFrame correctly', () => {
      const mockDataFrame: DataFrame = {
        name: 'test',
        length: 2,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [Date.now() - 60000, Date.now()]
          },
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: [1, 0],
            labels: {
              instance: 'https://example.com'
            }
          }
        ]
      };

      const result = parseDataFrames([mockDataFrame]);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      
      const service = result[0];
      expect(service.name).toBe('example.com');
      expect(['up', 'down']).toContain(service.status);
      expect(service.heartbeatData).toBeDefined();
      expect(service.heartbeatData!.length).toBe(2);
    });

    it('should handle custom names correctly', () => {
      const customNames = '{"https://example.com":"My Custom Service"}';
      const mockDataFrame: DataFrame = {
        name: 'test',
        length: 1,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [Date.now()]
          },
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: [1],
            labels: {
              instance: 'https://example.com'
            }
          }
        ]
      };

      const result = parseDataFrames([mockDataFrame], customNames);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('My Custom Service');
    });

    it('should handle invalid custom names JSON gracefully', () => {
      const invalidCustomNames = 'invalid json';
      const result = parseDataFrames([], invalidCustomNames);
      
      // Should not throw and should return test services
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});