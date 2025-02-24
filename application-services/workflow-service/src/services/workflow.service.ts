import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source.js';
import { Workflow } from '../models/Workflow.js';
import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowQuery,
  WorkflowResponse
} from '../types/api.js';

export class WorkflowService {
  private workflowRepository: Repository<Workflow>;

  constructor() {
    this.workflowRepository = AppDataSource.getRepository(Workflow);
  }

  async create(request: CreateWorkflowRequest, userId: string): Promise<WorkflowResponse> {
    const workflow = this.workflowRepository.create({
      ...request,
      created_by: userId,
      status: 'draft',
      data_classification: request.data_classification || 'standard'
    });

    const saved = await this.workflowRepository.save(workflow);
    return this.mapToResponse(saved);
  }

  async findById(id: string, userId: string): Promise<WorkflowResponse> {
    const workflow = await this.workflowRepository.findOneOrFail({
      where: { id },
      relations: ['nodes', 'edges']
    });

    // Update access history
    await this.workflowRepository.update(id, {
      last_accessed_by: userId,
      last_accessed_at: new Date(),
      access_history: [
        ...(workflow.access_history || []),
        {
          userId,
          action: 'view',
          timestamp: new Date()
        }
      ]
    });

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

    return [workflows.map(this.mapToResponse), total];
  }

  async update(id: string, request: UpdateWorkflowRequest, userId: string): Promise<WorkflowResponse> {
    const workflow = await this.workflowRepository.findOneOrFail({ where: { id } });

    // Update the workflow
    Object.assign(workflow, {
      ...request,
      last_accessed_by: userId,
      last_accessed_at: new Date()
    });

    const updated = await this.workflowRepository.save(workflow);
    return this.mapToResponse(updated);
  }

  async delete(id: string): Promise<void> {
    await this.workflowRepository.delete(id);
  }

  private mapToResponse(workflow: Workflow): WorkflowResponse {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      metadata: workflow.metadata,
      data_classification: workflow.data_classification,
      consent_status: workflow.consent_status,
      data_region: workflow.data_region,
      cross_border_allowed: workflow.cross_border_allowed,
      created_at: workflow.created_at,
      updated_at: workflow.updated_at,
      created_by: workflow.created_by,
      last_accessed_by: workflow.last_accessed_by,
      last_accessed_at: workflow.last_accessed_at
    };
  }
}

export const workflowService = new WorkflowService();
