/**
 * Tests for YieldFiSDK
 */

import { YieldFiSDK, createYieldFiSDK } from "../../../src/client";
import { ConfigurationError } from "../../../src/errors";

describe("YieldFiSDK", () => {
  describe("create", () => {
    it("should create SDK instance with valid config", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
      });

      expect(sdk).toBeInstanceOf(YieldFiSDK);
      expect(sdk.auth).toBeDefined();
      expect(sdk.glassbook).toBeDefined();
      expect(sdk.config.gatewayUrl).toBe("http://localhost:9501");
    });

    it("should throw configuration error for invalid config", async () => {
      await expect(
        YieldFiSDK.create({
          gatewayUrl: "invalid-url",
        } as any),
      ).rejects.toThrow(ConfigurationError);
    });

    it("should apply defaults", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
      });

      expect(sdk.config.timeout).toBe(30000);
      expect(sdk.config.retryAttempts).toBe(3);
      expect(sdk.config.environment).toBe("development");
    });

    it("should merge custom config with defaults", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
        timeout: 60000,
        debug: true,
      });

      expect(sdk.config.timeout).toBe(60000);
      expect(sdk.config.debug).toBe(true);
      expect(sdk.config.retryAttempts).toBe(3); // Default
    });
  });

  describe("API clients", () => {
    it("should have auth API client", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
      });

      expect(sdk.auth).toBeDefined();
      expect(sdk.auth.login).toBeDefined();
      expect(sdk.auth.refresh).toBeDefined();
      expect(sdk.auth.logout).toBeDefined();
    });

    it("should have glassbook API client", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
      });

      expect(sdk.glassbook).toBeDefined();
      expect(sdk.glassbook.createPartnerTransaction).toBeDefined();
      expect(sdk.glassbook.getMyReferral).toBeDefined();
    });
  });

  describe("getVersion", () => {
    it("should return SDK version", () => {
      const version = YieldFiSDK.getVersion();

      expect(version).toBe("0.1.0");
    });
  });

  describe("getContainer", () => {
    it("should return DI container", async () => {
      const sdk = await YieldFiSDK.create({
        gatewayUrl: "http://localhost:9501",
      });

      const container = sdk.getContainer();

      expect(container).toBeDefined();
      expect(container.has).toBeDefined();
      expect(container.get).toBeDefined();
    });
  });
});

describe("createYieldFiSDK", () => {
  it("should create SDK instance", async () => {
    const sdk = await createYieldFiSDK({
      gatewayUrl: "http://localhost:9501",
    });

    expect(sdk).toBeInstanceOf(YieldFiSDK);
    expect(sdk.config.gatewayUrl).toBe("http://localhost:9501");
  });
});
