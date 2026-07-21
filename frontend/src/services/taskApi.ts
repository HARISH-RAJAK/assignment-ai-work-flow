import { apiClient } from './apiClient';
import {
  CreateTaskPayload,
  TaskLogsResponse,
  TaskResponse,
  TasksResponse,
} from '../types/task';

export const taskApi = {
  createTask: async (payload: CreateTaskPayload): Promise<TaskResponse> => {
    const res = await apiClient.post<TaskResponse>('/tasks', payload);
    return res.data;
  },

  getTasks: async (): Promise<TasksResponse> => {
    const res = await apiClient.get<TasksResponse>('/tasks');
    return res.data;
  },

  getTaskById: async (id: string): Promise<TaskResponse> => {
    const res = await apiClient.get<TaskResponse>(`/tasks/${id}`);
    return res.data;
  },

  runTask: async (id: string, mode: 'direct' | 'redis' = 'direct'): Promise<TaskResponse> => {
    const res = await apiClient.post<TaskResponse>(`/tasks/${id}/run`, { mode });
    return res.data;
  },

  getTaskLogs: async (id: string): Promise<TaskLogsResponse> => {
    const res = await apiClient.get<TaskLogsResponse>(`/tasks/${id}/logs`);
    return res.data;
  },

  deleteTask: async (id: string): Promise<{ status: string; message: string }> => {
    const res = await apiClient.delete<{ status: string; message: string }>(`/tasks/${id}`);
    return res.data;
  },
};
