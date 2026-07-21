import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import { CreateTaskPayload } from '../types/task';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await taskApi.getTasks();
      return res.data.tasks;
    },
    // Poll every 5 seconds if there are active (Pending or Running) tasks
    refetchInterval: (query) => {
      const tasks = query.state.data;
      if (!tasks) return 5000;
      const hasActive = tasks.some((t) => t.status === 'Pending' || t.status === 'Running');
      return hasActive ? 5000 : false;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const runTaskMutation = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode?: 'direct' | 'redis' }) =>
      taskApi.runTask(id, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    runTask: runTaskMutation.mutateAsync,
    isRunning: runTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
  };
};

export const useTaskDetails = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await taskApi.getTaskById(taskId);
      return res.data.task;
    },
    enabled: !!taskId,
    refetchInterval: (query) => {
      const task = query.state.data;
      if (!task) return 5000;
      return task.status === 'Pending' || task.status === 'Running' ? 5000 : false;
    },
  });
};
