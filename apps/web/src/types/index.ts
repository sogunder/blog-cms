export type UserRole = 'admin' | 'editor' | 'reader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  /** Ausente en respuestas derivadas solo del JWT (p. ej. /auth/verify). */
  createdAt?: string;
}

export type PostStatus = 'draft' | 'pending' | 'published';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: User | null;
  category: Category | null;
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

export interface CommentPostRef {
  id: string;
  title: string;
  slug: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  post: CommentPostRef | null;
  status: 'pending' | 'approved' | 'spam';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}
