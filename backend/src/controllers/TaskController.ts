import { Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { createTaskSchema } from '../validators/taskValidator';
import { AuthRequest } from '../middlewares/authMiddleware';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = createTaskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const task = await this.taskService.createTask(
        req.userId!,
        value.title,
        value.inputText,
        value.operationType
      );

      res.status(201).json({
        status: 'success',
        data: { task },
      });
    } catch (err) {
      next(err);
    }
  };

  getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.taskService.getTasks(req.userId!);
      res.status(200).json({
        status: 'success',
        data: { tasks },
      });
    } catch (err) {
      next(err);
    }
  };

  getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id, req.userId!);
      res.status(200).json({
        status: 'success',
        data: { task },
      });
    } catch (err) {
      next(err);
    }
  };

  runTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mode = (req.body?.mode || req.query?.mode || 'direct') as 'direct' | 'redis';
      const task = await this.taskService.runTask(req.params.id, req.userId!, mode);
      res.status(200).json({
        status: 'success',
        message: mode === 'redis' ? 'Task queued for execution' : 'Task executed directly',
        data: { task },
      });
    } catch (err) {
      next(err);
    }
  };

  getTaskLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = await this.taskService.getTaskLogs(req.params.id, req.userId!);
      res.status(200).json({
        status: 'success',
        data: { logs },
      });
    } catch (err) {
      next(err);
    }
  };

  deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params.id, req.userId!);
      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };
}
