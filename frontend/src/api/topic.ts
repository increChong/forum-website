import { request } from './request';
import type { Topic, Reply, CreateTopicParams, CreateReplyParams, PaginatedResponse } from '@/types';

export const topicApi = {
  getList(params?: {
    page?: number;
    limit?: number;
    boardId?: string;
    sortBy?: 'latest' | 'hot' | 'essence';
  }): Promise<PaginatedResponse<Topic>> {
    return request.get('/topics', { params });
  },

  getById(id: string): Promise<Topic> {
    return request.get(`/topics/${id}`);
  },

  create(data: CreateTopicParams): Promise<Topic> {
    return request.post('/topics', data);
  },

  update(id: string, data: Partial<CreateTopicParams>): Promise<Topic> {
    return request.put(`/topics/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return request.delete(`/topics/${id}`);
  },

  like(id: string): Promise<{ liked: boolean }> {
    return request.post(`/topics/${id}/like`);
  },

  favorite(id: string): Promise<{ favorited: boolean }> {
    return request.post(`/topics/${id}/favorite`);
  },

  getReplies(topicId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Reply>> {
    return request.get(`/topics/${topicId}/replies`, { params });
  },

  createReply(topicId: string, data: CreateReplyParams): Promise<Reply> {
    return request.post(`/topics/${topicId}/replies`, data);
  },
};
