import { request } from './request';
import type { Resource, ResourceCategory, CreateResourceParams, PaginatedResponse } from '@/types';

export const resourceApi = {
  getList(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    sortBy?: 'latest' | 'popular' | 'downloads';
  }): Promise<PaginatedResponse<Resource>> {
    return request.get('/resources', { params });
  },

  getById(id: string): Promise<Resource> {
    return request.get(`/resources/${id}`);
  },

  create(data: CreateResourceParams): Promise<Resource> {
    return request.post('/resources', data);
  },

  update(id: string, data: Partial<CreateResourceParams>): Promise<Resource> {
    return request.put(`/resources/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return request.delete(`/resources/${id}`);
  },

  getDownloadLink(id: string): Promise<{ link: string; extractCode?: string }> {
    return request.post(`/resources/${id}/download`);
  },

  getCategories(): Promise<ResourceCategory[]> {
    return request.get('/resources/categories');
  },
};
