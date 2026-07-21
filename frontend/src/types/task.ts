export type TaskStatus = 'Pending' | 'Running' | 'Success' | 'Failed';
export type OperationType = 'uppercase' | 'lowercase' | 'reverse' | 'word_count';

export interface ExecutionRun {
  runId: string;
  runNumber: number;
  mode: 'direct' | 'redis';
  status: TaskStatus;
  result?: string | null;
  logs: string[];
  executedAt: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  inputText: string;
  operationType: OperationType;
  status: TaskStatus;
  result?: string | null;
  logs: string[];
  executionHistory?: ExecutionRun[];
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  inputText: string;
  operationType: OperationType;
}

export interface TasksResponse {
  status: string;
  data: {
    tasks: Task[];
  };
}

export interface TaskResponse {
  status: string;
  message?: string;
  data: {
    task: Task;
  };
}

export interface TaskLogsResponse {
  status: string;
  data: {
    logs: string[];
  };
}
