import axios from "axios";
import {
  Post,
  Comment,
  CreatePostRequest,
  CreateCommentRequest,
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types";

// Configuración de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
const USER_API_BASE_URL =
  process.env.NEXT_PUBLIC_USER_API_BASE_URL || "http://localhost:8080";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("USER_API_BASE_URL:", USER_API_BASE_URL);

// Instancia de axios para el Post Service
export const postApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Instancia de axios para el User Service
export const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptores para logging
postApi.interceptors.request.use(
  (config) => {
    console.log("Post API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Post API Request Error:", error);
    return Promise.reject(error);
  }
);

postApi.interceptors.response.use(
  (response) => {
    console.log("Post API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Post API Response Error:", error);
    if (error.response) {
      console.error("Error Response:", error.response.data);
      console.error("Error Status:", error.response.status);
    }
    return Promise.reject(error);
  }
);

// Interfaz para la respuesta paginada
interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Post Service API
export const postService = {
  // Obtener todas las publicaciones
  getAllPosts: async (page: number = 0, size: number = 10): Promise<Post[]> => {
    try {
      console.log(
        "Intentando obtener posts desde:",
        `${API_BASE_URL}/api/posts?page=${page}&size=${size}`
      );
      const response = await postApi.get<PageResponse<Post>>(
        `/api/posts?page=${page}&size=${size}`
      );
      console.log(
        "Posts obtenidos exitosamente:",
        response.data.content?.length || 0
      );
      return response.data.content || [];
    } catch (error) {
      console.error("Error en getAllPosts:", error);
      throw error;
    }
  },

  // Obtener publicación por ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await postApi.get<Post>(`/api/posts/${id}`);
    return response.data;
  },

  // Crear nueva publicación
  createPost: async (post: CreatePostRequest): Promise<Post> => {
    const response = await postApi.post<Post>("/api/posts", post);
    return response.data;
  },

  // Actualizar publicación
  updatePost: async (id: number, post: CreatePostRequest): Promise<Post> => {
    const response = await postApi.put<Post>(`/api/posts/${id}`, post);
    return response.data;
  },

  // Eliminar publicación
  deletePost: async (id: number): Promise<void> => {
    await postApi.delete(`/api/posts/${id}`);
  },

  // Dar like a publicación
  likePost: async (id: number): Promise<void> => {
    await postApi.post(`/api/posts/${id}/like`);
  },

  // Quitar like de publicación
  unlikePost: async (id: number): Promise<void> => {
    await postApi.delete(`/api/posts/${id}/like`);
  },

  // Buscar publicaciones
  searchPosts: async (
    location?: string,
    adventureType?: string
  ): Promise<Post[]> => {
    try {
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (adventureType) params.append("adventureType", adventureType);

      console.log(
        "Intentando buscar posts desde:",
        `${API_BASE_URL}/api/posts/search?${params.toString()}`
      );
      const response = await postApi.get<PageResponse<Post>>(
        `/api/posts/search?${params.toString()}`
      );
      console.log("Búsqueda exitosa:", response.data.content?.length || 0);
      return response.data.content || [];
    } catch (error) {
      console.error("Error en searchPosts:", error);
      throw error;
    }
  },

  // Obtener publicaciones por usuario
  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    const response = await postApi.get<Post[]>(`/api/posts/user/${userId}`);
    return response.data;
  },

  // Obtener feed de publicaciones
  getFeed: async (page: number = 0, size: number = 10): Promise<Post[]> => {
    const response = await postApi.get<PageResponse<Post>>(
      `/api/posts/feed?page=${page}&size=${size}`
    );
    return response.data.content || [];
  },
};

// Comment Service API
export const commentService = {
  // Obtener comentarios de una publicación
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    const response = await postApi.get<Comment[]>(
      `/api/comments?postId=${postId}`
    );
    return response.data;
  },

  // Crear comentario
  createComment: async (comment: CreateCommentRequest): Promise<Comment> => {
    const response = await postApi.post<Comment>("/api/comments", comment);
    return response.data;
  },

  // Eliminar comentario
  deleteComment: async (id: number): Promise<void> => {
    await postApi.delete(`/api/comments/${id}`);
  },
};

// User Service API
export const userService = {
  // Registro de usuario
  register: async (user: RegisterRequest): Promise<AuthResponse> => {
    const response = await userApi.post<AuthResponse>(
      "/api/users/register",
      user
    );
    return response.data;
  },

  // Login de usuario
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await userApi.post<AuthResponse>(
      "/api/users/login",
      credentials
    );
    return response.data;
  },

  // Obtener todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const response = await userApi.get<User[]>("/api/users");
    return response.data;
  },

  // Seguir usuario
  followUser: async (userId: number, targetId: number): Promise<string> => {
    const response = await userApi.post(
      `/api/users/${userId}/follow/${targetId}`
    );
    return response.data;
  },
};
