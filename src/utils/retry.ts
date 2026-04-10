/**
 * Retry utilities for failed operations
 */

import { isAxiosError } from "axios";

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
  /**
   * When false, the error is rethrown immediately (no further attempts).
   */
  retryIf?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delay: 1000,
  backoff: true,
};

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const retryIf = opts.retryIf ?? (() => true);
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < opts.maxAttempts && retryIf(error)) {
        if (opts.onRetry) {
          opts.onRetry(attempt, lastError);
        }

        const delay = opts.backoff
          ? opts.delay * Math.pow(2, attempt - 1)
          : opts.delay;

        await sleep(delay);
      } else if (attempt >= opts.maxAttempts) {
        break;
      } else {
        throw lastError;
      }
    }
  }

  throw lastError!;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  const retryableMessages = [
    "timeout",
    "network",
    "econnrefused",
    "enotfound",
    "etimedout",
    "rate limit",
    "too many requests",
  ];

  return retryableMessages.some((msg) => message.includes(msg));
}

/**
 * Whether an axios (or network) failure is worth retrying.
 * Avoids retrying client errors (4xx except 408/429) so mutating requests are not repeated pointlessly.
 */
export function isRetryableAxiosError(error: unknown): boolean {
  if (isAxiosError(error)) {
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNRESET"
    ) {
      return true;
    }
    if (error.response == null) {
      return true;
    }
    const status = error.response.status;
    return (
      status === 408 ||
      status === 429 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    );
  }

  if (error instanceof Error) {
    return isRetryableError(error);
  }

  return false;
}
