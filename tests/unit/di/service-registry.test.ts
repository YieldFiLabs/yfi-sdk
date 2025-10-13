/**
 * Tests for DependencyContainer
 */

import { DependencyContainer } from "../../../src/di";

describe("DependencyContainer", () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  afterEach(() => {
    container.clear();
  });

  describe("register", () => {
    it("should register a singleton dependency", async () => {
      const factory = jest.fn(() => ({ id: "test" }));

      container.register("testService", factory, {
        singleton: true,
        lazy: false,
      });
      await container.initialize();
      const instance1 = container.get("testService");
      const instance2 = container.get("testService");

      expect(instance1).toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should register a transient dependency", () => {
      const factory = jest.fn(() => ({ id: Math.random() }));

      container.register("testService", factory, { singleton: false });
      const instance1 = container.get("testService");
      const instance2 = container.get("testService");

      expect(instance1).not.toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should throw error for circular dependencies", async () => {
      container.register("serviceA", () => container.get("serviceB"), {
        singleton: true,
        lazy: false,
        dependencies: ["serviceB"],
      });
      container.register("serviceB", () => container.get("serviceA"), {
        singleton: true,
        lazy: false,
        dependencies: ["serviceA"],
      });

      await expect(container.initialize()).rejects.toThrow(
        "Circular dependency detected",
      );
    });
  });

  describe("setValue", () => {
    it("should set a value directly", () => {
      const value = { id: "direct" };

      container.setValue("directValue", value);
      const retrieved = container.get("directValue");

      expect(retrieved).toBe(value);
    });
  });

  describe("has", () => {
    it("should return true for registered dependencies", () => {
      container.register("testService", () => ({ id: "test" }));

      expect(container.has("testService")).toBe(true);
    });

    it("should return false for unregistered dependencies", () => {
      expect(container.has("unknownService")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all dependencies", () => {
      container.register("testService", () => ({ id: "test" }));
      container.setValue("directValue", { id: "direct" });

      container.clear();

      expect(container.has("testService")).toBe(false);
      expect(container.has("directValue")).toBe(false);
    });
  });
});
