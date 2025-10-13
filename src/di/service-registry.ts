import "reflect-metadata";

/**
 * Factory function type for creating dependencies
 */
export type DependencyFactory<T = unknown> = () => T | Promise<T>;

/**
 * Service lifecycle options
 */
export enum ServiceLifetime {
  TRANSIENT = "transient",
  SINGLETON = "singleton",
  SCOPED = "scoped",
}

/**
 * Dependency definition with metadata
 */
export interface DependencyDefinition<T = unknown> {
  factory: DependencyFactory<T>;
  singleton?: boolean;
  lazy?: boolean;
  dependencies?: string[];
}

/**
 * Enhanced Dependency Container with async support and lifecycle management
 */
export class DependencyContainer {
  private dependencies = new Map<string, unknown>();
  private definitions = new Map<string, DependencyDefinition>();
  private singletons = new Map<string, unknown>();
  private initializing = new Set<string>();
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Register a dependency with its factory function
   */
  register<T>(
    name: string,
    factory: DependencyFactory<T>,
    options: {
      singleton?: boolean;
      lazy?: boolean;
      dependencies?: string[];
    } = {},
  ): this {
    const { singleton = true, lazy = false, dependencies = [] } = options;

    this.definitions.set(name, {
      factory,
      singleton,
      lazy,
      dependencies,
    });

    return this;
  }

  /**
   * Register a value directly (already constructed)
   */
  setValue<T>(name: string, value: T): this {
    this.dependencies.set(name, value);
    return this;
  }

  /**
   * Initialize all non-lazy dependencies
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  private async _doInitialize(): Promise<void> {
    const nonLazyDeps = Array.from(this.definitions.entries()).filter(
      ([, def]) => !def.lazy,
    );

    const sorted = this.topologicalSort(nonLazyDeps.map(([name]) => name));

    for (const name of sorted) {
      if (!this.dependencies.has(name)) {
        await this._createDependency(name);
      }
    }

    this.initialized = true;
  }

  /**
   * Get a dependency by name
   */
  get<T>(name: string): T {
    if (this.dependencies.has(name)) {
      return this.dependencies.get(name) as T;
    }

    if (this.singletons.has(name)) {
      return this.singletons.get(name) as T;
    }

    if (!this.definitions.has(name)) {
      throw new Error(
        `Dependency '${name}' not found. Make sure it's registered.`,
      );
    }

    const definition = this.definitions.get(name)!;

    if (!definition.singleton) {
      return this._createDependencySync(name) as T;
    }

    if (definition.lazy) {
      return this._createDependencySync(name) as T;
    }

    if (!this.initialized) {
      throw new Error(
        `Container not initialized. Call initialize() first or register '${name}' as lazy.`,
      );
    }

    throw new Error(`Dependency '${name}' not found after initialization.`);
  }

  /**
   * Get a dependency asynchronously
   */
  async getAsync<T>(name: string): Promise<T> {
    if (this.dependencies.has(name)) {
      return this.dependencies.get(name) as T;
    }

    if (this.singletons.has(name)) {
      return this.singletons.get(name) as T;
    }

    return (await this._createDependency(name)) as T;
  }

  /**
   * Check if a dependency exists
   */
  has(name: string): boolean {
    return (
      this.dependencies.has(name) ||
      this.singletons.has(name) ||
      this.definitions.has(name)
    );
  }

  /**
   * Check if container is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Clear all dependencies
   */
  clear(): void {
    this.dependencies.clear();
    this.definitions.clear();
    this.singletons.clear();
    this.initializing.clear();
    this.initialized = false;
    this.initializationPromise = null;
  }

  /**
   * Create a dependency and handle both sync and async factories
   */
  private async _createDependency(name: string): Promise<unknown> {
    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }

    const definition = this.definitions.get(name);
    if (!definition) {
      throw new Error(`No definition found for dependency: ${name}`);
    }

    this.initializing.add(name);

    try {
      for (const depName of definition.dependencies || []) {
        if (!this.dependencies.has(depName) && !this.singletons.has(depName)) {
          await this._createDependency(depName);
        }
      }

      const result = definition.factory();
      const value = result instanceof Promise ? await result : result;

      if (definition.singleton) {
        this.singletons.set(name, value);
      }

      return value;
    } finally {
      this.initializing.delete(name);
    }
  }

  /**
   * Create a dependency synchronously
   */
  private _createDependencySync(name: string): unknown {
    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }

    const definition = this.definitions.get(name);
    if (!definition) {
      throw new Error(`No definition found for dependency: ${name}`);
    }

    this.initializing.add(name);

    try {
      for (const depName of definition.dependencies || []) {
        if (!this.dependencies.has(depName) && !this.singletons.has(depName)) {
          this._createDependencySync(depName);
        }
      }

      const result = definition.factory();

      if (result instanceof Promise) {
        throw new Error(
          `Cannot create async dependency '${name}' synchronously. Use getAsync() or initialize the container first.`,
        );
      }

      if (definition.singleton) {
        this.singletons.set(name, result);
      }

      return result;
    } finally {
      this.initializing.delete(name);
    }
  }

  /**
   * Simple topological sort for dependency ordering
   */
  private topologicalSort(names: string[]): string[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: string[] = [];

    const visit = (name: string) => {
      if (temp.has(name)) {
        throw new Error(`Circular dependency detected involving: ${name}`);
      }
      if (visited.has(name)) {
        return;
      }

      temp.add(name);

      const definition = this.definitions.get(name);
      if (definition) {
        for (const dep of definition.dependencies || []) {
          if (names.includes(dep)) {
            visit(dep);
          }
        }
      }

      temp.delete(name);
      visited.add(name);
      result.push(name);
    };

    for (const name of names) {
      if (!visited.has(name)) {
        visit(name);
      }
    }

    return result;
  }
}
