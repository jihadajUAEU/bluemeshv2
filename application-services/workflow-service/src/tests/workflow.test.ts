import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Workflow } from '../models/Workflow.js';
import { WorkflowNode } from '../models/WorkflowNode.js';
import { WorkflowEdge } from '../models/WorkflowEdge.js';
import { WorkflowService } from '../services/workflow.service.js';
import type { CreateWorkflowRequest, UpdateWorkflowRequest } from '../types/api.js';

describe('WorkflowService', () => {
  let dataSource: DataSource;
  let workflowService: WorkflowService;
  const testUserId = '12345678-1234-1234-1234-123456789012';

  beforeAll(async () => {
    // Create a test database connection
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'bluemesh_test',
      entities: [Workflow, WorkflowNode, WorkflowEdge],
      synchronize: true,
      dropSchema: true
    });

    await dataSource.initialize();
    workflowService = new WorkflowService();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await dataSource.synchronize(true);
  });

  describe('create', () => {
    it('should create a new workflow', async () => {
      const createRequest: CreateWorkflowRequest = {
        name: 'Test Workflow',
        description: 'Test workflow description',
        data_region: 'us-east-1',
        data_classification: 'standard'
      };

      const workflow = await workflowService.create(createRequest, testUserId);

      expect(workflow).toBeDefined();
      expect(workflow.id).toBeDefined();
      expect(workflow.name).toBe(createRequest.name);
      expect(workflow.description).toBe(createRequest.description);
      expect(workflow.status).toBe('draft');
      expect(workflow.data_region).toBe(createRequest.data_region);
      expect(workflow.created_by).toBe(testUserId);
    });
  });

  describe('findById', () => {
    it('should find a workflow by ID', async () => {
      const createRequest: CreateWorkflowRequest = {
        name: 'Test Workflow',
        description: 'Test workflow description',
        data_region: 'us-east-1'
      };

      const created = await workflowService.create(createRequest, testUserId);
      const found = await workflowService.findById(created.id, testUserId);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.last_accessed_by).toBe(testUserId);
      expect(found.access_history).toHaveLength(1);
      expect(found.access_history![0].userId).toBe(testUserId);
      expect(found.access_history![0].action).toBe('view');
    });
  });

  describe('findAll', () => {
    it('should list all workflows with pagination', async () => {
      // Create multiple workflows
      const workflows = await Promise.all([
        workflowService.create({ name: 'Workflow 1', data_region: 'us-east-1' }, testUserId),
        workflowService.create({ name: 'Workflow 2', data_region: 'us-east-1' }, testUserId),
        workflowService.create({ name: 'Workflow 3', data_region: 'us-east-1' }, testUserId)
      ]);

      const [result, total] = await workflowService.findAll({ page: 1, limit: 2 });

      expect(total).toBe(3);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(workflows[0].id);
      expect(result[1].id).toBe(workflows[1].id);
    });
  });

  describe('update', () => {
    it('should update a workflow', async () => {
      const created = await workflowService.create({
        name: 'Original Name',
        data_region: 'us-east-1'
      }, testUserId);

      const updateRequest: UpdateWorkflowRequest = {
        name: 'Updated Name',
        status: 'active'
      };

      const updated = await workflowService.update(created.id, updateRequest, testUserId);

      expect(updated.name).toBe(updateRequest.name);
      expect(updated.status).toBe(updateRequest.status);
      expect(updated.last_accessed_by).toBe(testUserId);
    });
  });

  describe('delete', () => {
    it('should delete a workflow', async () => {
      const created = await workflowService.create({
        name: 'To Delete',
        data_region: 'us-east-1'
      }, testUserId);

      await workflowService.delete(created.id);

      await expect(workflowService.findById(created.id, testUserId))
        .rejects
        .toThrow();
    });
  });
});
