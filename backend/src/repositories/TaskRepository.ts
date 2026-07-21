import { Task, ITask, TaskStatus, OperationType } from '../models/Task';
import { Types } from 'mongoose';

export class TaskRepository {
  async create(data: {
    userId: string;
    title: string;
    inputText: string;
    operationType: OperationType;
  }): Promise<ITask> {
    const task = new Task({
      userId: new Types.ObjectId(data.userId),
      title: data.title,
      inputText: data.inputText,
      operationType: data.operationType,
      status: 'Pending',
      logs: [`[${new Date().toISOString()}] Task created with status Pending.`],
    });
    return task.save();
  }

  async findByUserId(userId: string, limit = 50, skip = 0): Promise<ITask[]> {
    return Task.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async findByIdAndUserId(taskId: string, userId: string): Promise<ITask | null> {
    return Task.findOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
  }

  async updateStatus(
    taskId: string,
    status: TaskStatus,
    logMessage?: string
  ): Promise<ITask | null> {
    const update: any = { status };
    if (logMessage) {
      update.$push = { logs: `[${new Date().toISOString()}] ${logMessage}` };
    }
    return Task.findByIdAndUpdate(taskId, update, { new: true });
  }

  async deleteByIdAndUserId(taskId: string, userId: string): Promise<boolean> {
    const result = await Task.deleteOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }
}
