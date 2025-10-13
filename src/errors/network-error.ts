/**
 * Network error classes
 */

import { SDKError } from "./sdk-error";

export class NetworkError extends SDKError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "NETWORK_ERROR", undefined, details);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends SDKError {
  constructor(
    message: string = "Request timeout",
    details?: Record<string, unknown>,
  ) {
    super(message, "TIMEOUT", 408, details);
    this.name = "TimeoutError";
  }
}

export class RateLimitError extends SDKError {
  constructor(
    message: string = "Rate limit exceeded",
    details?: Record<string, unknown>,
  ) {
    super(message, "RATE_LIMIT", 429, details);
    this.name = "RateLimitError";
  }
}
