import { Router, Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import { workflowService } from '../services/workflow.service.js';
import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowQuery,
  WorkflowListResponse,
  ErrorResponse
} from '../types/api.js';

export const workflowRouter = Router();

// Create workflow
workflowRouter.post('/', async (req: Request<unknown, unknown, CreateWorkflowRequest>, res: Response) => {
  try {
    // TODO: Get user ID from authentication middleware
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User ID not provided'
        }
      } satisfies ErrorResponse);
    }

    const workflow = await workflowService.create(req.body, userId);
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create workflow'
      }
    } satisfies ErrorResponse);
  }
});

// Get workflow by ID
workflowRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User ID not provided'
        }
      } satisfies ErrorResponse);
    }

    const workflow = await workflowService.findById(req.params.id, userId);
    res.json(workflow);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Workflow not found'
        }
      } satisfies ErrorResponse);
    }

    console.error('Error fetching workflow:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch workflow'
      }
    } satisfies ErrorResponse);
  }
});

// List workflows
workflowRouter.get('/', async (req: Request<unknown, unknown, unknown, WorkflowQuery>, res: Response) => {
  try {
    const [workflows, total] = await workflowService.findAll(req.query);
    const response: WorkflowListResponse = {
      items: workflows,
      total,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    };
    res.json(response);
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list workflows'
      }
    } satisfies ErrorResponse);
  }
});

// Update workflow
workflowRouter.put('/:id', async (req: Request<{ id: string }, unknown, UpdateWorkflowRequest>, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User ID not provided'
        }
      } satisfies ErrorResponse);
    }

    const workflow = await workflowService.update(req.params.id, req.body, userId);
    res.json(workflow);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Workflow not found'
        }
      } satisfies ErrorResponse);
    }

    console.error('Error updating workflow:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update workflow'
      }
    } satisfies ErrorResponse);
  }
});

// Delete workflow
workflowRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await workflowService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Workflow not found'
        }
      } satisfies ErrorResponse);
    }

    console.error('Error deleting workflow:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete workflow'
      }
    } satisfies ErrorResponse);
  }
});
