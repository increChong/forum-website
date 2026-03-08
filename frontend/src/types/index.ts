export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  level: number;
  points: number;
  role: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  author: User;
  board?: Board;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  favoriteCount: number;
  isPinned: boolean;
  isEssence: boolean;
  lastReplyAt: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  topicId: string;
  parentId?: string;
  floor: number;
  likeCount: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  cover: string;
  link: string;
  extractCode?: string;
  author: User;
  category?: ResourceCategory;
  pointsRequired: number;
  downloadCount: number;
  favoriteCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreateTopicParams {
  title: string;
  content: string;
  boardId?: string;
  tags?: string[];
}

export interface CreateReplyParams {
  content: string;
  parentId?: string;
}

export interface CreateResourceParams {
  title: string;
  description: string;
  link: string;
  extractCode?: string;
  categoryId?: string;
  pointsRequired?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
