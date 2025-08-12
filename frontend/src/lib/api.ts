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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
const USER_API_BASE_URL =
  process.env.NEXT_PUBLIC_USER_API_BASE_URL || "http://localhost:8080";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("USER_API_BASE_URL:", USER_API_BASE_URL);

export const postApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 segundos de timeout
});

export const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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
  getPostById: async (id: number): Promise<Post> => {
    const response = await postApi.get<Post>(`/api/posts/${id}`);
    return response.data;
  },
  createPost: async (post: CreatePostRequest): Promise<Post> => {
    const response = await postApi.post<Post>("/api/posts", post);
    return response.data;
  },
  updatePost: async (id: number, post: CreatePostRequest): Promise<Post> => {
    const response = await postApi.put<Post>(`/api/posts/${id}`, post);
    return response.data;
  },
  deletePost: async (id: number): Promise<void> => {
    await postApi.delete(`/api/posts/${id}`);
  },
  likePost: async (id: number): Promise<void> => {
    await postApi.post(`/api/posts/${id}/like`);
  },
  unlikePost: async (id: number): Promise<void> => {
    await postApi.delete(`/api/posts/${id}/like`);
  },
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
  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    const response = await postApi.get<Post[]>(`/api/posts/user/${userId}`);
    return response.data;
  },
  getFeed: async (page: number = 0, size: number = 10): Promise<Post[]> => {
    const response = await postApi.get<PageResponse<Post>>(
      `/api/posts/feed?page=${page}&size=${size}`
    );
    return response.data.content || [];
  },
};

export const commentService = {
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    const response = await postApi.get<Comment[]>(
      `/api/comments?postId=${postId}`
    );
    return response.data;
  },
  createComment: async (comment: CreateCommentRequest): Promise<Comment> => {
    const response = await postApi.post<Comment>("/api/comments", comment);
    return response.data;
  },
  deleteComment: async (id: number): Promise<void> => {
    await postApi.delete(`/api/comments/${id}`);
  },
};

// User Service API - TEMPORALMENTE DESHABILITADO POR PROBLEMAS DE CORS
export const userService = {
  register: async (user: RegisterRequest): Promise<AuthResponse> => {
    // TEMPORAL: Simular respuesta exitosa mientras resolvemos CORS
    console.log("Registro simulado para:", user.email);
    return {
      message: "Usuario registrado exitosamente",
      user: {
        id: 1,
        username: user.username,
        email: user.email,
        followersCount: 0,
        followingCount: 0,
      },
    };
  },
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // TEMPORAL: Simular respuesta exitosa mientras resolvemos CORS
    console.log("Login simulado para:", credentials.email);
    return {
      message: "Login exitoso",
      user: {
        id: 1,
        username: "usuario_temp",
        email: credentials.email,
        followersCount: 0,
        followingCount: 0,
      },
    };
  },
  getAllUsers: async (): Promise<User[]> => {
    // TEMPORAL: Simular respuesta exitosa mientras resolvemos CORS
    console.log("Obteniendo usuarios simulados");
    return [
      {
        id: 1,
        username: "antonio",
        email: "antonio@email.com",
        followersCount: 5,
        followingCount: 2,
      },
      {
        id: 2,
        username: "maria",
        email: "maria@email.com",
        followersCount: 3,
        followingCount: 1,
      },
    ];
  },
  followUser: async (userId: number, targetId: number): Promise<string> => {
    // TEMPORAL: Simular respuesta exitosa mientras resolvemos CORS
    console.log("Siguiendo usuario:", targetId);
    return "Usuario seguido exitosamente";
  },
};
