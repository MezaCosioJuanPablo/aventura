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

// Interceptores para userApi - manejo silencioso de errores 400
userApi.interceptors.request.use(
  (config) => {
    console.log("User API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("User API Request Error:", error);
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response) => {
    console.log("User API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Para errores 400 (Bad Request), solo logear el error, no mostrar "Failed to load resource"
    if (error.response && error.response.status === 400) {
      console.log(
        "User API 400 Error (manejado):",
        error.response.data?.message || "Bad Request"
      );
      return Promise.reject(error);
    }

    // Para otros errores, logear normalmente
    console.error("User API Response Error:", error);
    if (error.response) {
      console.error("Error Response:", error.response.data);
      console.error("Error Status:", error.response.status);
    }
    return Promise.reject(error);
  }
);

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

// User Service API - AHORA FUNCIONAL CON CORS RESUELTO
export const userService = {
  register: async (user: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log("Registrando usuario real:", user.email);
      console.log("Datos enviados:", JSON.stringify(user, null, 2));
      const response = await userApi.post<AuthResponse>(
        "/api/users/register",
        user
      );
      console.log("Respuesta del backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en registro desde api.ts:", error);
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  },
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("Iniciando sesión real:", credentials.email);
      console.log("Datos enviados:", JSON.stringify(credentials, null, 2));
      const response = await userApi.post<AuthResponse>(
        "/api/users/login",
        credentials
      );
      console.log("Respuesta del backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en login desde api.ts:", error);
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  },
  getAllUsers: async (): Promise<User[]> => {
    console.log("Obteniendo usuarios reales");
    const response = await userApi.get<User[]>("/api/users");
    return response.data;
  },
  followUser: async (userId: number, targetId: number): Promise<string> => {
    console.log("Siguiendo usuario real:", targetId);
    const response = await userApi.post<string>(
      `/api/users/${userId}/follow/${targetId}`
    );
    return response.data;
  },
};
