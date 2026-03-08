import { request } from './request';
import type { User, LoginParams, RegisterParams, AuthResponse } from '@/types';

export const authApi = {
  login(params: LoginParams): Promise<AuthResponse> {
    return request.post('/auth/login', params);
  },

  register(params: RegisterParams): Promise<AuthResponse> {
    return request.post('/auth/register', params);
  },

  logout(): Promise<void> {
    return request.post('/auth/logout');
  },

  getCurrentUser(): Promise<User> {
    return request.get('/auth/me');
  },
};

export const userApi = {
  getById(id: string): Promise<User> {
    return request.get(`/users/${id}`);
  },

  updateProfile(data: Partial<User>): Promise<User> {
    return request.put('/users/me', data);
  },

  getTopics(id: string, page = 1) {
    return request.get(`/users/${id}/topics`, { params: { page } });
  },

  getResources(id: string, page = 1) {
    return request.get(`/users/${id}/resources`, { params: { page } });
  },
};
