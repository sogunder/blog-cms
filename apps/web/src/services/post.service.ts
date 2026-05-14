import api from './api';
import type { Post, PostStatus } from '../types';

export interface PostWritePayload {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  category: string;
  tags?: string[];
  status?: PostStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const postService = {
  // Public
  async getPublishedPosts(page = 1, limit = 10): Promise<PaginatedResult<Post>> {
    const { data } = await api.get('/posts', { params: { page, limit } });
    return data;
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const { data } = await api.get(`/posts/slug/${slug}`);
    return data;
  },

  // Admin
  async getAdminPosts(page = 1, limit = 10): Promise<PaginatedResult<Post>> {
    const { data } = await api.get('/admin/posts', { params: { page, limit } });
    return data;
  },

  async getAdminPost(id: string): Promise<Post> {
    const { data } = await api.get(`/admin/posts/${id}`);
    return data;
  },

  async createPost(postData: PostWritePayload): Promise<Post> {
    const { data } = await api.post('/admin/posts', postData);
    return data;
  },

  async updatePost(id: string, postData: PostWritePayload): Promise<Post> {
    const { data } = await api.patch(`/admin/posts/${id}`, postData);
    return data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/admin/posts/${id}`);
  },
};
