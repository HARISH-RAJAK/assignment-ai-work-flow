import { Queue } from 'bullmq';
import { redisConnectionOptions } from './redis';
import { logger } from '../utils/logger';

export const TASK_QUEUE_NAME = 'ai-task-queue';

export const taskQueue = new Queue(TASK_QUEUE_NAME, {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // keep failed jobs for 7 days (Dead Letter Queue audit)
    },
  },
});

taskQueue.on('error', (err: Error) => {
  logger.error('BullMQ Task Queue Error:', err);
});
