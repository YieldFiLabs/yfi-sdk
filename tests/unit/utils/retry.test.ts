/**
 * Tests for retry utility
 */

import { AxiosError } from "axios";
import {
  retry,
  sleep,
  isRetryableError,
  isRetryableAxiosError,
} from "../../../src/utils";

describe("retry", () => {
  describe("retry function", () => {
    it("should return result on first success", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const result = await retry(fn, { maxAttempts: 3, delay: 100 });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Attempt 1"))
        .mockRejectedValueOnce(new Error("Attempt 2"))
        .mockResolvedValue("success");

      const result = await retry(fn, {
        maxAttempts: 3,
        delay: 10,
        backoff: false,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should throw error after max attempts", async () => {
      const error = new Error("Failed");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(retry(fn, { maxAttempts: 3, delay: 10 })).rejects.toThrow(
        "Failed",
      );
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should call onRetry callback", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Attempt 1"))
        .mockResolvedValue("success");

      const onRetry = jest.fn();

      await retry(fn, { maxAttempts: 3, delay: 10, onRetry, backoff: false });

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });

    it("should not retry when retryIf returns false", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("no retry"));

      await expect(
        retry(fn, {
          maxAttempts: 3,
          delay: 10,
          backoff: false,
          retryIf: () => false,
        }),
      ).rejects.toThrow("no retry");

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("sleep", () => {
    it("should sleep for specified time", async () => {
      const startTime = Date.now();
      await sleep(100);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(90);
    });
  });

  describe("isRetryableError", () => {
    it("should return true for retryable errors", () => {
      expect(isRetryableError(new Error("Network timeout"))).toBe(true);
      expect(isRetryableError(new Error("ECONNREFUSED"))).toBe(true);
      expect(isRetryableError(new Error("Rate limit exceeded"))).toBe(true);
    });

    it("should return false for non-retryable errors", () => {
      expect(isRetryableError(new Error("Invalid input"))).toBe(false);
      expect(isRetryableError(new Error("Validation error"))).toBe(false);
    });
  });

  describe("isRetryableAxiosError", () => {
    it("should not retry typical 4xx responses", () => {
      const err401 = new AxiosError("Unauthorized");
      err401.response = { status: 401 } as any;
      expect(isRetryableAxiosError(err401)).toBe(false);

      const err404 = new AxiosError("Not found");
      err404.response = { status: 404 } as any;
      expect(isRetryableAxiosError(err404)).toBe(false);
    });

    it("should retry 429 and 5xx responses", () => {
      const err429 = new AxiosError("Too many");
      err429.response = { status: 429 } as any;
      expect(isRetryableAxiosError(err429)).toBe(true);

      const err503 = new AxiosError("Unavailable");
      err503.response = { status: 503 } as any;
      expect(isRetryableAxiosError(err503)).toBe(true);
    });

    it("should retry when there is no response", () => {
      const err = new AxiosError("Network Error", "ECONNREFUSED");
      expect(isRetryableAxiosError(err)).toBe(true);
    });
  });
});
