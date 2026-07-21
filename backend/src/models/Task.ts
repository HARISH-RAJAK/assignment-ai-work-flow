import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'Pending' | 'Running' | 'Success' | 'Failed';
export type OperationType = 'uppercase' | 'lowercase' | 'reverse' | 'word_count';

export interface IExecutionRun {
  runId: string;
  runNumber: number;
  mode: 'direct' | 'redis';
  status: TaskStatus;
  result?: string;
  logs: string[];
  executedAt: Date;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  inputText: string;
  operationType: OperationType;
  status: TaskStatus;
  result?: string;
  logs: string[];
  executionHistory: IExecutionRun[];
  startedAt?: Date;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const executionRunSchema = new Schema<IExecutionRun>({
  runId: { type: String, required: true },
  runNumber: { type: Number, required: true },
  mode: { type: String, enum: ['direct', 'redis'], required: true },
  status: { type: String, enum: ['Pending', 'Running', 'Success', 'Failed'], required: true },
  result: { type: String, default: null },
  logs: { type: [String], default: [] },
  executedAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    inputText: {
      type: String,
      required: [true, 'Input text is required'],
    },
    operationType: {
      type: String,
      enum: ['uppercase', 'lowercase', 'reverse', 'word_count'],
      required: [true, 'Valid operation type is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Running', 'Success', 'Failed'],
      default: 'Pending',
      index: true,
    },
    result: {
      type: String,
      default: null,
    },
    logs: {
      type: [String],
      default: [],
    },
    executionHistory: {
      type: [executionRunSchema],
      default: [],
    },
    startedAt: {
      type: Date,
      default: null,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal querying per user and status / date sorting
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });

taskSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).__v;
    return ret;
  },
});

export const Task = model<ITask>('Task', taskSchema);
