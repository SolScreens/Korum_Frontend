import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: inject JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('korum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('korum_token');
      localStorage.removeItem('korum_user');
      // Hard redirect — clears all React state cleanly
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helper: extract readable error message ──────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = (error as AxiosError<ApiError>).response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return (detail[0] as { msg?: string })?.msg || 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

export default api;
