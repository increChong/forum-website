import { request } from './request';

export const searchApi = {
  search(params: {
    q: string;
    type?: 'all' | 'topic' | 'resource' | 'user';
    page?: number;
    limit?: number;
  }) {
    return request.get('/search', { params });
  },

  getSuggestions(keyword: string, limit?: number) {
    return request.get('/search/suggestions', {
      params: { q: keyword, limit },
    });
  },
};
