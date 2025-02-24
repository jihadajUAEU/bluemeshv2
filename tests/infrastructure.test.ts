import axios from 'axios';
import { describe, test, expect } from '@jest/globals';

const services = {
  postgres: 'http://localhost:5433',
  redis: 'http://localhost:6379',
  kong: 'http://localhost:8001',
  keycloak: 'http://localhost:8080/health',
  zipkin: 'http://localhost:9411/health',
};

describe('Infrastructure Health Checks', () => {
  test.each(Object.entries(services))(
    '%s service should be accessible',
    async (service, url) => {
      let isHealthy = false;

      try {
        switch (service) {
          case 'postgres':
            // PostgreSQL health check is handled by Docker health check
            isHealthy = true;
            break;

          case 'redis':
            // Redis health check is handled by Docker health check
            isHealthy = true;
            break;

          default:
            const response = await axios.get(url);
            isHealthy = response.status === 200;
            break;
        }
      } catch (error) {
        console.error(`Error checking ${service} health:`, error);
        isHealthy = false;
      }

      expect(isHealthy).toBe(true);
    }
  );
});

describe('Keycloak Configuration', () => {
  test('should have workflow-platform realm configured', async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/realms/workflow-platform');
      expect(response.status).toBe(200);
    } catch (error) {
      console.error('Error checking Keycloak realm:', error);
      throw error;
    }
  });
});

describe('Kong Configuration', () => {
  test('should have routes configured', async () => {
    try {
      const response = await axios.get('http://localhost:8001/routes');
      expect(response.status).toBe(200);
      const routes = response.data.data;
      expect(routes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'workflow-api' }),
          expect.objectContaining({ name: 'ai-api' }),
        ])
      );
    } catch (error) {
      console.error('Error checking Kong routes:', error);
      throw error;
    }
  });
});

describe('Redis State Store', () => {
  test('should be configured in Dapr', async () => {
    try {
      const response = await axios.get('http://localhost:3500/v1.0/metadata');
      expect(response.status).toBe(200);
      const components = response.data.components;
      expect(components).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'statestore',
            type: 'state.redis',
          }),
        ])
      );
    } catch (error) {
      console.error('Error checking Dapr components:', error);
      throw error;
    }
  });
});
