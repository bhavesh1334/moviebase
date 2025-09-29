import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mb_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export type AuthResponse = {
  message: string;
  user: { id: string; name: string; email: string };
  token: string;
};

export type Movie = {
  _id: string;
  title: string;
  publishingYear: number;
  poster?: string;
};

export type PaginatedMovies = {
  movies: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export const AuthAPI = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
};

export const MoviesAPI = {
  list: (params: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedMovies>("/movies", { params }).then((r) => r.data),
  get: (id: string) => api.get<Movie>(`/movies/${id}`).then((r) => r.data),
  create: (data: { title: string; publishingYear: number; poster?: File }) => {
    const form = new FormData();
    form.append("title", data.title);
    form.append("publishingYear", String(data.publishingYear));
    if (data.poster) form.append("poster", data.poster);
    return api
      .post<Movie>("/movies", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  update: (
    id: string,
    data: { title?: string; publishingYear?: number; poster?: File | null }
  ) => {
    const form = new FormData();
    if (data.title !== undefined) form.append("title", data.title);
    if (data.publishingYear !== undefined)
      form.append("publishingYear", String(data.publishingYear));
    if (data.poster instanceof File) form.append("poster", data.poster);
    return api
      .patch<Movie>(`/movies/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  remove: (id: string) => api.delete(`/movies/${id}`).then((r) => r.data),
};
