/**
 * Main YieldFi SDK client
 */

import { createContainer, DependencyContainer, SERVICE_NAMES } from "../di";
import { SDKConfig, SDKConfigSchema, DEFAULT_CONFIG } from "../config";
import { ConfigurationError } from "../errors";
import { HttpClient } from "../http";
import { AuthAPI } from "../api/auth";
import { GlassbookAPI } from "../api/glassbook";

/**
 * YieldFi SDK initialization options
 */
export interface YieldFiSDKOptions extends Partial<SDKConfig> {
    gatewayUrl: string;
}

/**
 * Main YieldFi SDK class
 */
export class YieldFiSDK {
    private container: DependencyContainer;

    /**
     * Authentication API
     */
    public auth!: AuthAPI;

    /**
     * Glassbook API
     */
    public glassbook!: GlassbookAPI;

    /**
     * SDK configuration
     */
    public readonly config: SDKConfig;

    /**
     * Private constructor - use YieldFiSDK.create() instead
     * Note: Constructor sets up the container but doesn't initialize it.
     * Initialization happens in the async initialize() method.
     */
    private constructor(options: YieldFiSDKOptions) {
        // Merge with defaults
        const mergedConfig = { ...DEFAULT_CONFIG, ...options };

        // Validate configuration
        const result = SDKConfigSchema.safeParse(mergedConfig);
        if (!result.success) {
            throw new ConfigurationError("Invalid SDK configuration", {
                errors: result.error.errors,
            });
        }

        this.config = result.data;
        this.container = createContainer();

        // Register services (but don't resolve them yet)
        this.registerBaseServices();
        this.registerAPIClients();
    }

    /**
     * Create a new YieldFi SDK instance (async factory method)
     *
     * @param options - SDK configuration options
     * @returns Promise resolving to YieldFi SDK instance
     *
     * @example
     * ```typescript
     * // Basic initialization
     * const sdk = await YieldFiSDK.create({
     *   gatewayUrl: 'https://gw.yield.fi'
     * });
     *
     * // With custom config
     * const sdk = await YieldFiSDK.create({
     *   gatewayUrl: 'https://gw.yield.fi',
     *   partnerId: 'my-partner-id',
     *   timeout: 60000,
     *   debug: true
     * });
     * ```
     */
    public static async create(options: YieldFiSDKOptions): Promise<YieldFiSDK> {
        // Create instance
        const sdk = new YieldFiSDK(options);

        // Perform any async initialization here if needed in the future
        await sdk.initialize();

        return sdk;
    }

    /**
     * Initialize async resources
     * This method initializes the DI container and resolves all dependencies
     */
    private async initialize(): Promise<void> {
        // Initialize the DI container (this will resolve all non-lazy dependencies)
        await this.container.initialize();

        // Resolve API clients after container initialization
        this.auth = this.container.get<AuthAPI>(SERVICE_NAMES.AUTH_API);
        this.glassbook = this.container.get<GlassbookAPI>(
            SERVICE_NAMES.GLASSBOOK_API,
        );

        // Future extensibility:
        // - Loading remote config
        // - Validating gateway connection
        // - etc.
    }

    /**
     * Register base services in DI container
     * All services are registered as singletons and actively loaded (not lazy)
     */
    private registerBaseServices(): void {
        // Register config
        this.container.setValue(SERVICE_NAMES.CONFIG, this.config);

        // Register HTTP client (singleton, not lazy)
        this.container.register(
            SERVICE_NAMES.HTTP_CLIENT,
            () => new HttpClient(this.container.get(SERVICE_NAMES.CONFIG)),
            {
                singleton: true,
                lazy: false, // Actively loaded
                dependencies: [SERVICE_NAMES.CONFIG],
            },
        );
    }

    /**
     * Register API clients in DI container
     * All services are registered as singletons and actively loaded (not lazy)
     */
    private registerAPIClients(): void {
        // Register AuthAPI (singleton, not lazy)
        this.container.register(
            SERVICE_NAMES.AUTH_API,
            () =>
                new AuthAPI(
                    this.container.get(SERVICE_NAMES.HTTP_CLIENT),
                    this.container.get(SERVICE_NAMES.CONFIG),
                ),
            {
                singleton: true,
                lazy: false, // Actively loaded
                dependencies: [SERVICE_NAMES.HTTP_CLIENT, SERVICE_NAMES.CONFIG],
            },
        );

        // Register GlassbookAPI (singleton, not lazy)
        this.container.register(
            SERVICE_NAMES.GLASSBOOK_API,
            () =>
                new GlassbookAPI(
                    this.container.get(SERVICE_NAMES.HTTP_CLIENT),
                    this.container.get(SERVICE_NAMES.CONFIG),
                ),
            {
                singleton: true,
                lazy: false, // Actively loaded
                dependencies: [SERVICE_NAMES.HTTP_CLIENT, SERVICE_NAMES.CONFIG],
            },
        );
    }

    /**
     * Get SDK version
     */
    public static getVersion(): string {
        return "0.1.0";
    }

    /**
     * Get DI container (for advanced usage)
     */
    public getContainer(): DependencyContainer {
        return this.container;
    }
}

/**
 * Create a new YieldFi SDK instance (async factory function)
 *
 * @param options - SDK configuration options
 * @returns Promise resolving to YieldFi SDK instance
 *
 * @example
 * ```typescript
 * const sdk = await createYieldFiSDK({
 *   gatewayUrl: 'https://gw.yield.fi'
 * });
 * ```
 */
export async function createYieldFiSDK(
    options: YieldFiSDKOptions,
): Promise<YieldFiSDK> {
    return YieldFiSDK.create(options);
}
