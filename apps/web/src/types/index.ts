export type UserRole = 'admin' | 'editor' | 'reader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type PostStatus = 'published' | 'draft';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: User;
  category: Category;
  tags: Tag[];
  status: PostStatus;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  post: string; // post ID
  status: 'pending' | 'approved' | 'spam';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
