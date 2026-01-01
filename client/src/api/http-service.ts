import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import { type ProblemDetailsDto, ApiError } from '@/services/api/api-error';

export class HttpService {
  private readonly axiosInstance: AxiosInstance;
  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || '',
    });
  }

  async get<T>(
    url: string,
    params?: Record<string, unknown>,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const res = await this.axiosInstance.get<T>(url, { ...config, params });
      return res.data;
    } catch (error) {
      this.throwApiError(error);
    }
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await this.axiosInstance.post<TResponse>(url, body, config);
      return res.data;
    } catch (error) {
      this.throwApiError(error);
    }
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await this.axiosInstance.patch<TResponse>(url, body, config);
      return res.data;
    } catch (error) {
      this.throwApiError(error);
    }
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await this.axiosInstance.put<TResponse>(url, body, config);
      return res.data;
    } catch (error) {
      this.throwApiError(error);
    }
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await this.axiosInstance.delete<TResponse>(url, config);
      return res.data;
    } catch (error) {
      this.throwApiError(error);
    }
  }

  // Backwards compatible alias
  async fetcher<T>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.get<T>(url, params, config);
  }

  private isProblemDetails(value: unknown): value is ProblemDetailsDto {
    return (
      Boolean(value) &&
      typeof value === 'object' &&
      ('title' in (value as Record<string, unknown>) ||
        'status' in (value as Record<string, unknown>))
    );
  }

  private throwApiError(error: unknown): never {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const axiosError = error as AxiosError<unknown>;
    const status = axiosError.response?.status ?? 0;
    const data = axiosError.response?.data;
    const problemDetails = this.isProblemDetails(data)
      ? (data as ProblemDetailsDto)
      : undefined;
    const message =
      problemDetails?.title ??
      axiosError.message ??
      `Request failed (${status || 'network'})`;
    throw new ApiError(message, status, problemDetails);
  }
}

const instance = new HttpService(
	import.meta.env.DEV ? '' : ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''),
);

export default instance;
