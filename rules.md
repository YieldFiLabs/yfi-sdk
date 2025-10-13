# 🏗️ @yieldfi/sdk Development Rules

## 📖 Table of Contents

- [📁 FILE: Folder Structure](#-file-folder-structure)
- [🏛️ ARCH: Architecture & Design Patterns](#️-arch-architecture--design-patterns)
- [⚙️ CONFIG: Configuration Management](#️-config-configuration-management)
- [🔧 DI: Dependency Injection](#-di-dependency-injection)
- [🏷️ NAME: Naming Conventions](#️-name-naming-conventions)
- [🌐 API: API Client Design](#-api-api-client-design)
- [🎯 TYPES: Type Definitions](#-types-type-definitions)
- [🧪 TEST: Testing & Quality](#-test-testing--quality)
- [📦 PACKAGE: Package Management](#-package-package-management)

---

## 📁 FILE: Folder Structure

### SDK Directory Structure

```
yieldfi-sdk/
├── src/
│   ├── client/                 # Main SDK client with DI container
│   ├── api/                    # API endpoint modules
│   │   ├── auth/              # Auth endpoints (/auth prefix)
│   │   └── glassbook/         # Glassbook endpoints (/gb prefix)
│   ├── http/                   # HTTP client with retry logic
│   ├── config/                 # Configuration management
│   ├── di/                     # Dependency injection (from @lib-core)
│   ├── errors/                 # Error classes
│   ├── types/                  # Type definitions
│   ├── utils/                  # Utility functions
│   └── index.ts                # Main export
├── tests/
│   ├── setup.ts
│   └── unit/                   # Unit tests (85% coverage)
│       ├── api/
│       │   ├── auth/
│       │   └── glassbook/
│       ├── client/
│       ├── config/
│       ├── di/
│       ├── errors/
│       ├── http/
│       └── utils/
├── package.json
├── tsconfig.json
├── jest.config.js
├── eslint.config.mjs
├── LICENSE (GPL-3.0)
└── rules.md
```

### Module Organization

- **`src/client/`** - Main SDK with DI container initialization
- **`src/api/auth/`** - Authentication API (login, refresh, logout via `/auth`)
- **`src/api/glassbook/`** - Glassbook service API (via `/gb` prefix)
- **`src/http/`** - HTTP client with retry, interceptors, auth headers
- **`src/di/`** - DI container from `@yieldfi/core`
- **`src/config/`** - Gateway URL, service prefixes, validation
- **`src/errors/`** - Custom error classes
- **`src/types/`** - Request/response interfaces
- **`src/utils/`** - Validators, formatters, helpers
- **`tests/unit/`** - Unit tests mirroring src structure

---

## 🏛️ ARCH: Architecture & Design Patterns

### 1. SDK Architecture with DI

```typescript
// Main SDK client
export class YieldFiSDK {
  private container: DependencyContainer;

  public readonly auth: AuthAPI;
  public readonly glassbook: GlassbookAPI;

  constructor(config: SDKConfig) {
    this.container = createContainer();

    // Register base services
    this.registerBaseServices(config);

    // Register API clients
    this.registerAPIClients();

    // Initialize container (for non-lazy dependencies)
    await this.container.initialize();

    // Resolve clients
    this.auth = this.container.get<AuthAPI>("authAPI");
    this.glassbook = this.container.get<GlassbookAPI>("glassbookAPI");
  }

  private registerBaseServices(config: SDKConfig) {
    this.container.setValue("config", config);

    this.container.register(
      "httpClient",
      () => new HttpClient(this.container.get("config")),
      { singleton: true },
    );
  }

  private registerAPIClients() {
    this.container.register(
      "authAPI",
      () =>
        new AuthAPI(
          this.container.get("httpClient"),
          this.container.get("config"),
        ),
      { singleton: true, lazy: true, dependencies: ["httpClient", "config"] },
    );

    this.container.register(
      "glassbookAPI",
      () =>
        new GlassbookAPI(
          this.container.get("httpClient"),
          this.container.get("authAPI"),
          this.container.get("config"),
        ),
      {
        singleton: true,
        lazy: true,
        dependencies: ["httpClient", "authAPI", "config"],
      },
    );
  }
}
```

### 2. Gateway Routing

```
SDK → Gateway → Backend Services

Routes:
- /auth/*  → Gateway auth endpoints (login, refresh, logout)
- /gb/*    → Glassbook Service
- /ks/*    → Keystone Service (future)
```

### 3. API Client Hierarchy

```
YieldFiSDK
├── auth: AuthAPI       → /auth/* (gateway-managed)
└── glassbook: GlassbookAPI → /gb/* (proxied to glassbook service)
```

---

## ⚙️ CONFIG: Configuration Management

### SDK Configuration

```typescript
export const SDKConfigSchema = z.object({
  gatewayUrl: z.string().url().default("http://localhost:9501"),
  servicePrefixes: z
    .object({
      auth: z.string().default("auth"),
      glassbook: z.string().default("gb"),
      keystone: z.string().default("ks"),
    })
    .default({ auth: "auth", glassbook: "gb", keystone: "ks" }),
  timeout: z.number().min(1000).max(60000).default(30000),
  retryAttempts: z.number().min(0).max(5).default(3),
  retryDelay: z.number().min(100).max(10000).default(1000),
  environment: z
    .enum(["development", "production", "test"])
    .default("development"),
  debug: z.boolean().default(false),
});
```

---

## 🔧 DI: Dependency Injection

### Service Registration

```typescript
// Base services
container.register("httpClient", () => new HttpClient(config), {
  singleton: true,
});

// API clients
container.register(
  "authAPI",
  () => new AuthAPI(container.get("httpClient"), container.get("config")),
  { singleton: true, lazy: true, dependencies: ["httpClient", "config"] },
);

container.register(
  "glassbookAPI",
  () =>
    new GlassbookAPI(
      container.get("httpClient"),
      container.get("authAPI"),
      container.get("config"),
    ),
  {
    singleton: true,
    lazy: true,
    dependencies: ["httpClient", "authAPI", "config"],
  },
);
```

### Service Names

```typescript
export const SERVICE_NAMES = {
  CONFIG: "config",
  HTTP_CLIENT: "httpClient",
  AUTH_API: "authAPI",
  GLASSBOOK_API: "glassbookAPI",
} as const;
```

---

## 🏷️ NAME: Naming Conventions

- Files: kebab-case (`auth-api.ts`, `glassbook-api.ts`)
- Classes: PascalCase (`AuthAPI`, `GlassbookAPI`)
- Functions: camelCase (`login`, `getPortfolio`)
- API suffix: All API classes end with `API`
- Test suffix: All tests end with `.test.ts`

---

## 🌐 API: API Client Design

### HTTP Client

```typescript
export class HttpClient {
  private axios: AxiosInstance;

  constructor(private config: SDKConfig) {
    this.axios = axios.create({
      baseURL: config.gatewayUrl,
      timeout: config.timeout,
    });
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    // Retry logic, auth headers, error handling
  }
}
```

### Auth API

```typescript
export class AuthAPI {
  private accessToken?: string;
  private refreshToken?: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.httpClient.post("/auth/login", credentials);
    this.accessToken = response.token;
    this.refreshToken = response.refreshToken;
    return response;
  }

  async refreshAccessToken(): Promise<RefreshResponse> {
    return this.httpClient.post("/auth/refresh", {
      refreshToken: this.refreshToken,
    });
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      throw new AuthenticationError("Not authenticated");
    }
    return { Authorization: `Bearer ${this.accessToken}` };
  }
}
```

### Glassbook API

```typescript
export class GlassbookAPI {
  constructor(
    private httpClient: HttpClient,
    private authAPI: AuthAPI,
    private config: SDKConfig,
  ) {}

  async getPortfolio(userId: string): Promise<PortfolioResponse> {
    return this.httpClient.get(
      `/${this.config.servicePrefixes.glassbook}/portfolio/${userId}`,
      { headers: this.authAPI.getAuthHeaders() },
    );
  }
}
```

---

## 🎯 TYPES: Type Definitions

- **MUST** define types for all requests/responses
- **MUST** use Zod for validation
- **NEVER** use `any` in public APIs

---

## 🧪 TEST: Testing & Quality

### Coverage Requirements

- Lines: 85%
- Branches: 85%
- Functions: 85%
- Statements: 85%

### Testing with DI

```typescript
describe("AuthAPI", () => {
  let authAPI: AuthAPI;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = { post: jest.fn(), get: jest.fn() } as any;
    authAPI = new AuthAPI(mockHttpClient, mockConfig);
  });

  it("should login and store tokens", async () => {
    mockHttpClient.post.mockResolvedValue({
      token: "access-token",
      refreshToken: "refresh-token",
    });

    await authAPI.login({ address: "0x123", signature: "sig" });

    expect(authAPI.getAuthHeaders()).toEqual({
      Authorization: "Bearer access-token",
    });
  });
});
```

---

## 📦 PACKAGE: Package Management

### Dependencies

- `@yieldfi/core` - DI, HTTP utils, logging
- `axios` - HTTP client
- `zod` - Schema validation

### Scripts

- `npm run build` - Build TypeScript
- `npm run test` - Run tests
- `npm run test:coverage` - Coverage report
- `npm run lint` - Lint code

---

## ✅ ENFORCE: Enforcement

- [ ] **📁 FILE**: Auth in api folder
- [ ] **🏛️ ARCH**: DI-based architecture
- [ ] **⚙️ CONFIG**: Gateway & service prefixes
- [ ] **🔧 DI**: All dependencies in container
- [ ] **🌐 API**: Gateway routing with /auth and /gb
- [ ] **🧪 TEST**: 85% coverage

Last Updated: January 2025  
Version: 1.0.0
