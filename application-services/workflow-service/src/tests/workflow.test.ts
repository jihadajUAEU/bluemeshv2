import { beforeAll, afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { WorkflowService } from '../services/workflow.service.js';
import { AppDataSource } from '../config/data-source.js';
import { daprService } from '../services/dapr.service.js';
import type { CreateWorkflowRequest, UpdateWorkflowRequest } from '../types/api.js';

// Mock Dapr service
jest.mock('../services/dapr.service.js');

beforeEach(() => {
  jest.spyOn(daprService, 'getState').mockResolvedValue(null);
  jest.spyOn(daprService, 'saveState').mockResolvedValue();
  jest.spyOn(daprService, 'deleteState').mockResolvedValue();
  jest.spyOn(daprService, 'publishEvent').mockResolvedValue();
  jest.spyOn(daprService, 'subscribeToTopic').mockImplementation(() => {});
});

describe('WorkflowService', () => {
  let workflowService: WorkflowService;
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(() => {
    workflowService = new WorkflowService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a workflow and publish event', async () => {
      const request: CreateWorkflowRequest = {
        name: 'Test Workflow',
        description: 'Test Description',
        data_region: 'us-east-1'
      };

      const result = await workflowService.create(request, userId);

      expect(result).toMatchObject({
        name: request.name,
        description: request.description,
        data_region: request.data_region,
        status: 'draft',
        created_by: userId
      });

      expect(daprService.publishEvent).toHaveBeenCalledWith('workflow.created', {
        id: result.id,
        userId,
        action: 'create'
      });
    });
  });

  describe('findById', () => {
    it('should return cached workflow if available', async () => {
      const cachedWorkflow = {
        id: '123',
        name: 'Cached Workflow',
        created_by: userId
      };

      jest.spyOn(daprService, 'getState').mockResolvedValueOnce(cachedWorkflow);

      const result = await workflowService.findById('123', userId);

      expect(result).toMatchObject({
        id: cachedWorkflow.id,
        name: cachedWorkflow.name
      });
      expect(daprService.getState).toHaveBeenCalledWith('workflow-123');
    });

    it('should fetch from database and cache if not in cache', async () => {
      jest.spyOn(daprService, 'getState').mockResolvedValueOnce(null);

      const request: CreateWorkflowRequest = {
        name: 'Test Workflow',
        description: 'Test Description',
        data_region: 'us-east-1'
      };

      const created = await workflowService.create(request, userId);
      const result = await workflowService.findById(created.id, userId);

      expect(result).toMatchObject({
        name: request.name,
        description: request.description
      });
      expect(daprService.saveState).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update workflow, invalidate cache and publish event', async () => {
      const request: CreateWorkflowRequest = {
        name: 'Original Name',
        description: 'Original Description',
        data_region: 'us-east-1'
      };

      const created = await workflowService.create(request, userId);

      const updateRequest: UpdateWorkflowRequest = {
        name: 'Updated Name',
        description: 'Updated Description'
      };

      const result = await workflowService.update(created.id, updateRequest, userId);

      expect(result).toMatchObject({
        id: created.id,
        name: updateRequest.name,
        description: updateRequest.description
      });

      expect(daprService.deleteState).toHaveBeenCalledWith(`workflow-${created.id}`);
      expect(daprService.publishEvent).toHaveBeenCalledWith('workflow.updated', {
        id: created.id,
        userId,
        action: 'update'
      });
    });
  });

  describe('delete', () => {
    it('should delete workflow, invalidate cache and publish event', async () => {
      const request: CreateWorkflowRequest = {
        name: 'To Be Deleted',
        description: 'This workflow will be deleted',
        data_region: 'us-east-1'
      };

      const created = await workflowService.create(request, userId);
      await workflowService.delete(created.id);

      expect(daprService.deleteState).toHaveBeenCalledWith(`workflow-${created.id}`);
      expect(daprService.publishEvent).toHaveBeenCalledWith('workflow.deleted', {
        id: created.id,
        action: 'delete'
      });

      await expect(workflowService.findById(created.id, userId)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return cached results if available', async () => {
      const cachedResults: [any[], number] = [
        [{ id: '123', name: 'Cached Workflow' }],
        1
      ];

      jest.spyOn(daprService, 'getState').mockResolvedValueOnce(cachedResults);

      const [results, total] = await workflowService.findAll({});

      expect(results).toHaveLength(1);
      expect(total).toBe(1);
      expect(results[0]).toMatchObject({
        id: '123',
        name: 'Cached Workflow'
      });
    });

    it('should fetch from database and cache results if not cached', async () => {
      jest.spyOn(daprService, 'getState').mockResolvedValueOnce(null);

      const request1: CreateWorkflowRequest = {
        name: 'Workflow 1',
        data_region: 'us-east-1'
      };

      const request2: CreateWorkflowRequest = {
        name: 'Workflow 2',
        data_region: 'us-east-1'
      };

      await workflowService.create(request1, userId);
      await workflowService.create(request2, userId);

      const [results, total] = await workflowService.findAll({});

      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(total).toBeGreaterThanOrEqual(2);
      expect(daprService.saveState).toHaveBeenCalled();
    });
  });
});
