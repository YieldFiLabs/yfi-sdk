/**
 * Retry utilities for failed operations
 */

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
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
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < opts.maxAttempts) {
        if (opts.onRetry) {
          opts.onRetry(attempt, lastError);
        }

        const delay = opts.backoff
          ? opts.delay * Math.pow(2, attempt - 1)
          : opts.delay;

        await sleep(delay);
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
