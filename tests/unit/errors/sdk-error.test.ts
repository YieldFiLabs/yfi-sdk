/**
 * Tests for SDKError
 */

import { SDKError } from "../../../src/errors";

describe("SDKError", () => {
  describe("constructor", () => {
    it("should create error with message and code", () => {
      const error = new SDKError("Test error", "TEST_ERROR");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(SDKError);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_ERROR");
      expect(error.name).toBe("SDKError");
    });

    it("should create error with status code", () => {
      const error = new SDKError("Test error", "TEST_ERROR", 400);

      expect(error.statusCode).toBe(400);
    });

    it("should create error with details", () => {
      const details = { field: "value", count: 42 };
      const error = new SDKError(
        "Test error",
        "TEST_ERROR",
        undefined,
        details,
      );

      expect(error.details).toEqual(details);
    });

    it("should maintain stack trace", () => {
      const error = new SDKError("Test error", "TEST_ERROR");

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("SDKError");
    });
  });

  describe("toJSON", () => {
    it("should convert error to JSON", () => {
      const error = new SDKError("Test error", "TEST_ERROR", 400, {
        field: "value",
      });

      const json = error.toJSON();

      expect(json).toEqual({
        name: "SDKError",
        message: "Test error",
        code: "TEST_ERROR",
        statusCode: 400,
        details: { field: "value" },
        stack: error.stack,
      });
    });
  });
});
