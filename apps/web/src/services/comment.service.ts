import api from './api';
import type { Comment } from '../types';
import type { PaginatedResult } from './post.service';

export const commentService = {
  // Public
  async createComment(commentData: any): Promise<Comment> {
    const { data } = await api.post('/comments', commentData);
    return data;
  },

  // Admin
  async getAdminComments(page = 1, limit = 10): Promise<PaginatedResult<Comment>> {
    const { data } = await api.get('/admin/comments', { params: { page, limit } });
    return data;
  },

  async updateCommentStatus(id: string, status: string): Promise<Comment> {
    const { data } = await api.patch(`/admin/comments/${id}`, { status });
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/admin/comments/${id}`);
  },
};
