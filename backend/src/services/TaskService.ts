import { TaskRepository } from '../repositories/TaskRepository';
import { QueueService } from './QueueService';
import { AppError } from '../utils/appError';
import { ITask, OperationType, IExecutionRun } from '../models/Task';
import { executeTextOperation } from '../utils/operations';
import { logger } from '../utils/logger';
import { Task } from '../models/Task';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
  private taskRepo: TaskRepository;
  private queueService: QueueService;

  constructor() {
    this.taskRepo = new TaskRepository();
    this.queueService = new QueueService();
  }

  async createTask(
    userId: string,
    title: string,
    inputText: string,
    operationType: OperationType
  ): Promise<ITask> {
    return this.taskRepo.create({ userId, title, inputText, operationType });
  }

  async getTasks(userId: string): Promise<ITask[]> {
    return this.taskRepo.findByUserId(userId);
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await this.taskRepo.findByIdAndUserId(taskId, userId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async runTask(taskId: string, userId: string, mode: 'direct' | 'redis' = 'direct'): Promise<ITask> {
    const task = await this.getTaskById(taskId, userId);

    if (task.status === 'Running') {
      throw new AppError('Task is already running', 400);
    }

    if (mode === 'redis') {
      // Set task to Pending & update log
      await this.taskRepo.updateStatus(
        taskId,
        'Pending',
        'Enqueued for Python worker processing via Redis Queue'
      );

      // Attempt push to BullMQ
      const enqueued = await this.queueService.addJob(taskId, task.operationType, task.inputText);

      if (enqueued) {
        const updated = await this.taskRepo.findByIdAndUserId(taskId, userId);
        return updated || task;
      } else {
        logger.info(`Redis offline. Falling back to direct execution for task ${taskId}`);
        // Fallback to direct execution
        return this.executeDirectly(task, 'direct');
      }
    } else {
      // Direct execution mode without Redis
      return this.executeDirectly(task, 'direct');
    }
  }

  private async executeDirectly(task: ITask, usedMode: 'direct' | 'redis'): Promise<ITask> {
    const taskIdStr = task._id.toString();
    const now = new Date();
    const runNumber = (task.executionHistory?.length || 0) + 1;
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const startLog = `[${now.toISOString()}] Started Execution Run #${runNumber} (Mode: ${usedMode.toUpperCase()}).`;

    // Set Running status
    await Task.findByIdAndUpdate(taskIdStr, {
      status: 'Running',
      startedAt: now,
      $push: { logs: startLog },
    });

    try {
      // Execute operation
      const result = executeTextOperation(task.operationType, task.inputText);
      const finishedAt = new Date();
      const successLog = `[${finishedAt.toISOString()}] Run #${runNumber} finished successfully via Direct Engine.`;

      const runEntry: IExecutionRun = {
        runId,
        runNumber,
        mode: usedMode,
        status: 'Success',
        result,
        logs: [startLog, successLog],
        executedAt: finishedAt,
      };

      const updatedTask = await Task.findByIdAndUpdate(
        taskIdStr,
        {
          status: 'Success',
          result: result,
          finishedAt: finishedAt,
          $push: {
            logs: successLog,
            executionHistory: runEntry,
          },
        },
        { new: true }
      );

      return updatedTask!;
    } catch (error) {
      const finishedAt = new Date();
      const errorMsg = (error as Error).message;
      const failLog = `[${finishedAt.toISOString()}] Run #${runNumber} ERROR: ${errorMsg}`;

      const runEntry: IExecutionRun = {
        runId,
        runNumber,
        mode: usedMode,
        status: 'Failed',
        result: undefined,
        logs: [startLog, failLog],
        executedAt: finishedAt,
      };

      const failedTask = await Task.findByIdAndUpdate(
        taskIdStr,
        {
          status: 'Failed',
          finishedAt: finishedAt,
          $push: {
            logs: failLog,
            executionHistory: runEntry,
          },
        },
        { new: true }
      );

      return failedTask!;
    }
  }

  async getTaskLogs(taskId: string, userId: string): Promise<string[]> {
    const task = await this.getTaskById(taskId, userId);
    return task.logs || [];
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const deleted = await this.taskRepo.deleteByIdAndUserId(taskId, userId);
    if (!deleted) {
      throw new AppError('Task not found or unauthorized', 404);
    }
  }
}
