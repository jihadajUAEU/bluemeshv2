import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source.js';
import { Workflow } from '../models/Workflow.js';
import { daprService } from './dapr.service.js';
import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowQuery,
  WorkflowResponse,
  WorkflowExecutionStatus,
  DataClassification
} from '../types/api.js';

export class WorkflowService {
  private workflowRepository: Repository<Workflow>;
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly AI_SERVICE_NAME = 'crew-service';

  constructor() {
    this.workflowRepository = AppDataSource.getRepository(Workflow);
    this.setupEventSubscriptions();
  }

  private setupEventSubscriptions(): void {
    daprService.subscribeToTopic('workflow.updated', async (data) => {
      const workflowData = data as { id: string };
      await this.invalidateCache(workflowData.id);
    });

    daprService.subscribeToTopic('workflow.execution', async (data) => {
      const executionData = data as {
        workflow_id: string;
        status: WorkflowExecutionStatus;
        phase?: string;
        progress?: number;
        message?: string;
      };
      await this.updateExecutionStatus(executionData);
    });
  }

  private async invalidateCache(workflowId: string): Promise<void> {
    await daprService.deleteState(`workflow-${workflowId}`);
  }

  private async updateExecutionStatus(data: {
    workflow_id: string;
    status: WorkflowExecutionStatus;
    phase?: string;
    progress?: number;
    message?: string;
  }): Promise<void> {
    const { workflow_id, status, phase, progress, message } = data;

    // Use Repository.update to avoid TypeORM validation
    await this.workflowRepository
      .createQueryBuilder()
      .update(Workflow)
      .set({
        execution_status: status,
        current_phase: phase,
        execution_progress: progress,
        last_status_message: message,
        updated_at: new Date()
      })
      .where("id = :id", { id: workflow_id })
      .execute();

    // Invalidate cache
    await this.invalidateCache(workflow_id);

    // Publish status update event
    await daprService.publishEvent('workflow.status.updated', {
      workflow_id,
      status,
      phase,
      progress,
      message,
      timestamp: new Date().toISOString()
    });
  }

  async create(request: CreateWorkflowRequest, userId: string): Promise<WorkflowResponse> {
    const workflow = new Workflow();
    workflow.name = request.name;
    workflow.description = request.description;
    workflow.metadata = request.metadata;
    workflow.data_classification = (request.data_classification || 'internal') as DataClassification;
    workflow.data_region = request.data_region || 'default';
    workflow.cross_border_allowed = request.cross_border_allowed || false;
    workflow.status = 'draft';
    workflow.execution_status = 'not_started';
    workflow.created_by = userId;

    const saved = await this.workflowRepository.save(workflow);
    
    // Publish event
    await daprService.publishEvent('workflow.created', {
      id: saved.id,
      userId,
      action: 'create'
    });

    return this.mapToResponse(saved);
  }

  async findById(id: string, userId: string): Promise<WorkflowResponse> {
    // Try to get from cache first
    const cached = await daprService.getState<Workflow>(`workflow-${id}`);
    let workflow: Workflow;

    if (cached) {
      workflow = cached;
    } else {
      workflow = await this.workflowRepository.findOneOrFail({
        where: { id },
        relations: ['nodes', 'edges']
      });
      // Cache the workflow
      await daprService.saveState(`workflow-${id}`, workflow);
    }

    // Update access history using query builder to avoid validation
    await this.workflowRepository
      .createQueryBuilder()
      .update(Workflow)
      .set({
        last_accessed_by: userId,
        last_accessed_at: new Date(),
        access_history: () => `array_append(access_history, '${JSON.stringify({
          userId,
          action: 'view',
          timestamp: new Date()
        })}'::jsonb)`
      })
      .where("id = :id", { id })
      .execute();

    return this.mapToResponse(workflow);
  }

  async findAll(query: WorkflowQuery): Promise<[WorkflowResponse[], number]> {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC',
      status,
      data_region,
      data_classification,
      created_by,
      search
    } = query;

    const cacheKey = `workflows-${JSON.stringify(query)}`;
    const cached = await daprService.getState<[Workflow[], number]>(cacheKey);

    if (cached) {
      return [cached[0].map(w => this.mapToResponse(w)), cached[1]];
    }

    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .leftJoinAndSelect('workflow.nodes', 'nodes')
      .leftJoinAndSelect('workflow.edges', 'edges');

    if (status) {
      queryBuilder.andWhere('workflow.status = :status', { status });
    }

    if (data_region) {
      queryBuilder.andWhere('workflow.data_region = :data_region', { data_region });
    }

    if (data_classification) {
      queryBuilder.andWhere('workflow.data_classification = :data_classification', { data_classification });
    }

    if (created_by) {
      queryBuilder.andWhere('workflow.created_by = :created_by', { created_by });
    }

    if (search) {
      queryBuilder.andWhere(
        '(workflow.name ILIKE :search OR workflow.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [workflows, total] = await queryBuilder
      .orderBy(`workflow.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Cache the results
    await daprService.saveState(cacheKey, [workflows, total]);

    return [workflows.map(w => this.mapToResponse(w)), total];
  }

  async update(id: string, request: UpdateWorkflowRequest, userId: string): Promise<WorkflowResponse> {
    const workflow = await this.workflowRepository.findOneOrFail({ where: { id } });

    // Update the workflow using Object.assign for type safety
    Object.assign(workflow, {
      ...request,
      last_accessed_by: userId,
      last_accessed_at: new Date()
    });

    const updated = await this.workflowRepository.save(workflow);

    // Invalidate cache
    await this.invalidateCache(id);

    // Publish event
    await daprService.publishEvent('workflow.updated', {
      id,
      userId,
      action: 'update'
    });

    return this.mapToResponse(updated);
  }

  async delete(id: string): Promise<void> {
    await this.workflowRepository.delete(id);
    
    // Invalidate cache
    await this.invalidateCache(id);

    // Publish event
    await daprService.publishEvent('workflow.deleted', {
      id,
      action: 'delete'
    });
  }

  async executeWorkflow(id: string, userId: string): Promise<void> {
    const workflow = await this.workflowRepository.findOneOrFail({
      where: { id },
      relations: ['nodes', 'edges']
    });

    // Update workflow status using query builder
    await this.workflowRepository
      .createQueryBuilder()
      .update(Workflow)
      .set({
        execution_status: 'running' as WorkflowExecutionStatus,
        current_phase: 'initializing',
        execution_progress: 0,
        last_status_message: 'Starting workflow execution',
        last_executed_by: userId,
        last_executed_at: new Date()
      })
      .where("id = :id", { id })
      .execute();

    // Invoke AI service
    try {
      await daprService.invokeMethod(
        this.AI_SERVICE_NAME,
        `workflows/${id}/execute`,
        {
          workflow_data: {
            id,
            name: workflow.name,
            nodes: workflow.nodes,
            edges: workflow.edges,
            metadata: workflow.metadata,
            data_classification: workflow.data_classification,
            data_region: workflow.data_region
          }
        }
      );
    } catch (error: any) {
      // Update workflow status to failed
      await this.updateExecutionStatus({
        workflow_id: id,
        status: 'failed',
        message: `Failed to start execution: ${error?.message || 'Unknown error'}`
      });
      throw error;
    }
  }

  private mapToResponse(workflow: Workflow): WorkflowResponse {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      execution_status: workflow.execution_status,
      current_phase: workflow.current_phase,
      execution_progress: workflow.execution_progress,
      last_status_message: workflow.last_status_message,
      metadata: workflow.metadata,
      data_classification: workflow.data_classification,
      consent_status: workflow.consent_status,
      data_region: workflow.data_region,
      cross_border_allowed: workflow.cross_border_allowed,
      created_at: workflow.created_at,
      updated_at: workflow.updated_at,
      last_executed_at: workflow.last_executed_at,
      created_by: workflow.created_by,
      last_accessed_by: workflow.last_accessed_by,
      last_executed_by: workflow.last_executed_by,
      last_accessed_at: workflow.last_accessed_at
    };
  }
}

export const workflowService = new WorkflowService();
