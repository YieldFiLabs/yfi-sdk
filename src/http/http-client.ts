/**
 * HTTP client with retry logic and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { SDKConfig } from "../config";
import {
  NetworkError,
  TimeoutError,
  RateLimitError,
  AuthenticationError,
} from "../errors";
import { retry, isRetryableError } from "../utils";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export class HttpClient {
  private axios: AxiosInstance;

  constructor(private config: SDKConfig) {
    this.axios = axios.create({
      baseURL: config.gatewayUrl,
      timeout: config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(
    path: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("POST", path, data, options);
  }

  async put<T>(path: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, data, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  async patch<T>(
    path: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PATCH", path, data, options);
  }

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url: path,
      data,
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout || this.config.timeout,
    };

    try {
      const response = await retry<AxiosResponse<T>>(
        () => this.axios.request<T>(requestConfig),
        {
          maxAttempts: this.config.retryAttempts,
          delay: this.config.retryDelay,
          onRetry: (attempt, error) => {
            if (this.config.debug) {
              console.log(
                `Retry attempt ${attempt} for ${method} ${path}:`,
                error.message,
              );
            }
          },
        },
      );

      return response.data;
    } catch (error: any) {
      if (this.config.debug) {
        console.error(`Request failed: ${method} ${path}`, error);
      }

      // Handle specific error types
      if (error.response?.status === 401) {
        throw new AuthenticationError(
          "Unauthorized - Token may be invalid or expired",
          {
            status: error.response.status,
            message: error.response.data?.message,
          },
        );
      }

      if (error.response?.status === 429) {
        throw new RateLimitError("Rate limit exceeded", {
          status: error.response.status,
        });
      }

      if (error.code === "ECONNABORTED") {
        throw new TimeoutError("Request timeout", {
          timeout: this.config.timeout,
        });
      }

      if (isRetryableError(error)) {
        throw new NetworkError(error.message, { error });
      }

      throw new NetworkError(`Request failed: ${error.message}`, {
        method,
        path,
        error: error.message,
      });
    }
  }
}
