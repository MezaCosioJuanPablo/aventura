// Tipos para la aplicación de aventuras

export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  location: string;
  adventureType?: string;
  difficultyLevel?: string;
  estimatedDuration?: string;
  userId: number;
  userName: string;
  photos: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  description?: string;
  location: string;
  adventureType?: string;
  difficultyLevel?: string;
  estimatedDuration?: string;
  userId: number;
  userName: string;
  photos: string[];
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
  userId: number;
  userName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
