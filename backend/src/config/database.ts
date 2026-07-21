import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errorMsg = (error as Error).message;
    if (errorMsg.includes('IP address') || errorMsg.includes('selection timed out') || errorMsg.includes('whitelist')) {
      logger.error('================================================================');
      logger.error('MONGODB ATLAS IP WHITELIST ERROR:');
      logger.error('Your current IP address is not whitelisted in MongoDB Atlas.');
      logger.error('Please go to MongoDB Atlas Dashboard -> Network Access -> Add IP Address -> 0.0.0.0/0 (Allow Access From Anywhere)');
      logger.error('================================================================');
    } else {
      logger.error('Failed to connect to MongoDB', error as Error);
    }
    process.exit(1);
  }
};
