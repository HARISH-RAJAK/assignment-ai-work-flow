import { apiClient } from './apiClient';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  getMe: async (): Promise<{ status: string; data: { user: User } }> => {
    const res = await apiClient.get<{ status: string; data: { user: User } }>('/auth/me');
    return res.data;
  },
};
