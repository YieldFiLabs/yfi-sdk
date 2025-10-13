/**
 * Tests for configuration schema
 */

import { SDKConfigSchema } from "../../../src/config";

describe("SDKConfigSchema", () => {
  it("should validate valid config", () => {
    const config = {
      gatewayUrl: "http://localhost:9501",
    };

    const result = SDKConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gatewayUrl).toBe("http://localhost:9501");
      expect(result.data.timeout).toBe(30000); // Default
      expect(result.data.retryAttempts).toBe(3); // Default
    }
  });

  it("should reject invalid gateway URL", () => {
    const config = {
      gatewayUrl: "invalid-url",
    };

    const result = SDKConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it("should apply defaults", () => {
    const config = {
      gatewayUrl: "http://localhost:9501",
    };

    const result = SDKConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.environment).toBe("development");
      expect(result.data.timeout).toBe(30000);
      expect(result.data.retryAttempts).toBe(3);
      expect(result.data.debug).toBe(false);
    }
  });

  it("should validate custom timeout", () => {
    const config = {
      gatewayUrl: "http://localhost:9501",
      timeout: 60000,
    };

    const result = SDKConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timeout).toBe(60000);
    }
  });

  it("should reject invalid timeout", () => {
    const config = {
      gatewayUrl: "http://localhost:9501",
      timeout: 100, // Too small
    };

    const result = SDKConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });
});
