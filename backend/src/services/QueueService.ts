import { taskQueue } from '../config/queue';
import { logger } from '../utils/logger';

export class QueueService {
  async addJob(taskId: string, operationType: string, inputText: string): Promise<boolean> {
    try {
      await taskQueue.add(
        'process-task',
        {
          taskId,
          operationType,
          inputText,
        },
        {
          jobId: taskId,
        }
      );
      logger.info(`Job for task ${taskId} successfully added to BullMQ.`);
      return true;
    } catch (error) {
      logger.warn(`Redis BullMQ unavailable for task ${taskId}. Error: ${(error as Error).message}`);
      return false;
    }
  }
}
