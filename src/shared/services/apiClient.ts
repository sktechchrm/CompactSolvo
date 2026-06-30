import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly details?: unknown) {
    super(message); this.name = 'ApiError';
  }
}

function toApiError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const res = (err as AxiosError<{ message?: string; code?: string }>).response;
    throw new ApiError(res?.status ?? 0, res?.data?.code ?? `HTTP_${res?.status ?? 0}`, res?.data?.message ?? err.message, res?.data);
  }
  throw err;
}

function authInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const key = import.meta.env.VITE_API_KEY;
  if (key) config.headers.set('X-Api-Key', key);
  return config;
}

function errorInterceptor(err: unknown): never {
  if (axios.isAxiosError(err) && err.response?.status === 401) {
    window.dispatchEvent(new CustomEvent('chrm:unauthorized'));
  }
  return toApiError(err);
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.response.use((r) => r, errorInterceptor);

export const sheetsClient = axios.create({
  baseURL: import.meta.env.VITE_SHEETS_BASE_URL ?? '',
  timeout: 30_000,
});
sheetsClient.interceptors.response.use((r) => r, errorInterceptor);
