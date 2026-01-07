# yieldfi-sdk

Official YieldFi SDK for interacting with YieldFi services through the gateway.

## Installation

```bash
npm install yieldfi-sdk
```

## Quick Start

```typescript
import { YieldFiSDK } from "yieldfi-sdk";

// Initialize SDK (async)
const sdk = await YieldFiSDK.create({
  gatewayUrl: "https://gw.yield.fi",
  partnerId: "your-partner-id", // Optional
});

// 1. Generate nonce
const nonce = await sdk.auth.generateNonce({
  address: "0x...",
});

// 2. Sign message with wallet
const signature = await wallet.signMessage(nonce.message);

// 3. Login
const authResponse = await sdk.auth.login({
  address: "0x...",
  signature,
  message: nonce.message,
});

// 4. Store tokens (in your preferred storage)
localStorage.setItem("accessToken", authResponse.accessToken);
localStorage.setItem("refreshToken", authResponse.refreshToken);

// 5. Use Glassbook API with stored token
const accessToken = localStorage.getItem("accessToken");
const ptx = await sdk.glassbook.createPartnerTransaction(accessToken, {
  transactionHash: "0x...",
  chainId: "1",
});
```

## Configuration

```typescript
const sdk = await YieldFiSDK.create({
  gatewayUrl: "https://gw.yield.fi",
  partnerId: "your-partner-id", // Optional: for tracking
  timeout: 60000,
  retryAttempts: 3,
  retryDelay: 1000,
  debug: true,
  environment: "production", // 'development', 'production', or 'test'
});

// Alternative: use the factory function
import { createYieldFiSDK } from "yieldfi-sdk";

const sdk = await createYieldFiSDK({
  gatewayUrl: "https://gw.yield.fi",
});
```

## Token Management

**Important:** This SDK does not store tokens internally. You are responsible for storing and managing authentication tokens in your application.

```typescript
// After login, store tokens
const authResponse = await sdk.auth.login(credentials);
localStorage.setItem("accessToken", authResponse.accessToken);
localStorage.setItem("refreshToken", authResponse.refreshToken);
localStorage.setItem("user", JSON.stringify(authResponse.user));

// Retrieve tokens when needed
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// Refresh token when access token expires
const newTokens = await sdk.auth.refresh({ refreshToken });
localStorage.setItem("accessToken", newTokens.accessToken);

// Logout (revokes all tokens on server)
await sdk.auth.logout(accessToken);
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("user");
```

## API Modules

### Authentication (`sdk.auth`)

The Authentication API handles user authentication via Ethereum wallet signatures. All authentication state (tokens, user info) must be managed by your application.

```typescript
// 1. Generate a nonce for signing
const nonce = await sdk.auth.generateNonce({
  address: "0x...",
});

// 2. Login with signature
const authResponse = await sdk.auth.login({
  address: "0x...",
  signature: "0x...",
  message: nonce.message,
});
// Store tokens in your application (localStorage, sessionStorage, etc.)

// 3. Refresh access token
const newTokens = await sdk.auth.refresh({
  refreshToken: storedRefreshToken,
});
// Or with API key
const newTokens = await sdk.auth.refresh({
  apiKey: "yfi_...",
});

// 4. Logout (revokes all tokens)
await sdk.auth.logout(accessToken);
```

#### User Consent Management

The SDK provides comprehensive consent management APIs for tracking user agreements and permissions. Consent records are immutable for audit compliance - once recorded, they cannot be deleted or revoked.

**Available Consent Types:**
- `TERMS_OF_SERVICE` - User acceptance of terms of service (required)
- `PRIVACY_POLICY` - User acceptance of privacy policy (required)
- `MARKETING` - User consent for marketing communications (optional)
- `ANALYTICS` - User consent for analytics tracking (optional)
- `COOKIES` - User consent for cookie usage (optional)

```typescript
const accessToken = localStorage.getItem("accessToken");

// Record user consent
const consent = await sdk.auth.recordConsent(accessToken, {
  consentType: ConsentType.TERMS_OF_SERVICE,
  version: "1.0",
  granted: true,
  metadata: {
    documentHash: "0x...",
    sourceUrl: "https://yield.fi/terms"
  }
});

// Get specific consent by type
const termsConsent = await sdk.auth.getConsent(
  accessToken,
  ConsentType.TERMS_OF_SERVICE,
  "1.0" // Optional version
);

// Get all user consents (full audit trail)
const allConsents = await sdk.auth.getUserConsents(accessToken);
console.log(`User has ${allConsents.count} consent records`);

// Get consent status summary (latest status for each type)
const statuses = await sdk.auth.getConsentStatuses(accessToken);

// Check if user has consented to marketing
const marketingStatus = statuses.data.find(
  s => s.consentType === ConsentType.MARKETING
);

if (marketingStatus?.granted) {
  // User has consented, can send marketing emails
  sendMarketingEmail();
} else {
  // Show consent banner
  showConsentBanner();
}
```

**Important Notes:**
- All consent APIs require authentication (JWT access token)
- Consent records are immutable - once created, they cannot be deleted or revoked
- Each consent type can have multiple versions (e.g., terms v1.0, v2.0)
- Consent records include IP address and user agent for audit purposes

### Glassbook (`sdk.glassbook`)

All Glassbook API methods require an access token. The API provides Partner Transaction (PTX) and Referral endpoints.

#### Partner Transactions (PTX)

```typescript
const accessToken = localStorage.getItem("accessToken");

// Create a partner transaction
const ptx = await sdk.glassbook.createPartnerTransaction(accessToken, {
  transactionHash: "0x...",
  chainId: "1",
});

// Get all partner transactions
const transactions = await sdk.glassbook.getPartnerTransactions(accessToken, {
  page: 1,
  pageSize: 10,
  chainId: "1",
});

// Get user's partner transactions
const myTransactions =
  await sdk.glassbook.getMyPartnerTransactions(accessToken);

// Get specific transaction by ID
const transaction = await sdk.glassbook.getPartnerTransactionById(
  accessToken,
  123
);
```

#### Referrals

```typescript
const accessToken = localStorage.getItem("accessToken");

// Get your referral data
const myReferral = await sdk.glassbook.getMyReferral(accessToken);

// Get your referral stats
const stats = await sdk.glassbook.getMyReferralStats(accessToken);

// Get addresses you referred
const referred = await sdk.glassbook.getMyReferredAddresses(accessToken, 1, 10);

// Create a referral
const referral = await sdk.glassbook.createReferral(accessToken, {
  code: "MYCODE123",
  referredBy: "REFERRER_CODE",
});

// Check if code is available
const availability = await sdk.glassbook.checkReferralCodeAvailability(
  accessToken,
  "MYCODE123"
);

// Get referral by code
const referralByCode = await sdk.glassbook.getReferralByCode(
  accessToken,
  "MYCODE123"
);

// Get referral by address
const referralByAddress = await sdk.glassbook.getReferralByAddress(
  accessToken,
  "0x..."
);
```

## Contract Addresses

The SDK includes constants for YieldFi contract addresses across all supported chains. See the [official documentation](https://docs.yield.fi/resources/contract-addresses) for the latest contract addresses.

```typescript
import {
  Chain,
  getContractAddresses,
  getContractAddress,
  getChainId,
  isChainSupported,
  getSupportedChains,
} from "yieldfi-sdk";

// Get all contract addresses for a chain
const ethContracts = getContractAddresses(Chain.ETHEREUM);
console.log(ethContracts.yUSD); // yUSD contract address on Ethereum
console.log(ethContracts.manager); // Manager contract address on Ethereum

// Get a specific contract address
const yUSDAddress = getContractAddress(Chain.ARBITRUM, "yUSD");

// Get chain ID
const chainId = getChainId(Chain.BASE); // '8453'

// Check if chain is supported
if (isChainSupported(Chain.ETHEREUM)) {
  // Chain is supported
}

// Get all supported chains
const chains = getSupportedChains();
// [Chain.ETHEREUM, Chain.ARBITRUM, Chain.BASE, ...]
```

### Supported Chains

- **Ethereum** (1) - Manager, yUSD, vyUSD, yBTC, yETH, vyETH, vyBTC
- **Arbitrum** (42161) - Manager, yUSD, vyUSD
- **Base** (8453) - Manager, yUSD, vyUSD
- **Optimism** (10) - Manager, yUSD, vyUSD
- **Sonic** (146) - Manager, yUSD, vyUSD
- **Plume** (98866) - Manager, yUSD, vyUSD
- **Katana** (747474) - Manager, yUSD, vyUSD
- **BNB** (56) - Manager, yUSD, vyUSD
- **Avalanche** (43114) - Manager, yUSD, vyUSD
- **TAC** (239) - Manager, yUSD, vyUSD

## Whitelisted Tokens

The SDK includes a comprehensive list of whitelisted tokens supported across all chains, complete with decimals and utility functions.

```typescript
import {
  getTokensByChainId,
  getTokenByAddress,
  getTokensBySymbol,
  isTokenWhitelisted,
  getTokenDecimals,
  formatTokenAmount,
  parseTokenAmount,
} from "yieldfi-sdk";

// Get all tokens on Ethereum
const ethTokens = getTokensByChainId("1");
console.log(ethTokens);
// [{ address: '0xdac1...', symbol: 'USDT', decimals: 6, chainId: '1', active: true }, ...]

// Get specific token info
const usdt = getTokenByAddress(
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "1"
);
console.log(usdt?.symbol); // 'USDT'
console.log(usdt?.decimals); // 6

// Get all yUSD tokens across chains
const yUSDTokens = getTokensBySymbol("yUSD");
// Returns yUSD on Ethereum, Arbitrum, Base, Optimism, etc.

// Check if token is whitelisted
if (isTokenWhitelisted("0xdac17f958d2ee523a2206206994597c13d831ec7", "1")) {
  // USDT on Ethereum is whitelisted
}

// Get token decimals
const decimals = getTokenDecimals(
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "1"
);
console.log(decimals); // 6

// Format token amount (raw to human-readable)
const formatted = formatTokenAmount(
  "1000000",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "1"
);
console.log(formatted); // '1.000000'

// Parse token amount (human-readable to raw)
const raw = parseTokenAmount(
  "1.5",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "1"
);
console.log(raw); // 1500000n
```

### Supported Tokens by Chain

- **Ethereum (1)**: USDT, USDC, USR, wstUSR, DAI, yUSD, WETH, WBTC, yETH, yBTC, PT tokens, lvlUSD
- **Arbitrum (42161)**: USDT, USDC, yUSD, WETH, yETH
- **Base (8453)**: USDC, yUSD, WETH, yETH
- **Optimism (10)**: USDT, USDC, yUSD
- **Sonic (146)**: USDC, yUSD, scUSD
- **Plume (98866)**: pUSD, yUSD
- **Katana (747474)**: vbUSDC, yUSD
- **BNB (56)**: BUSDT, yUSD
- **Avalanche (43114)**: USDC, yUSD
- **TAC (239)**: USDT, yUSD
- **Linea (59144)**: USDC, USDT, yUSD
- **Zetachain (9745)**: USDT, yUSD
- **Tron (728126428)**: USDT, USDC

## Contract Interactions

The SDK provides TypeScript types for type-safe smart contract interactions using ethers.js, along with simplified ABI type definitions for easier documentation and type checking.

### Available Contracts

- **Manager**: Core protocol manager contract for deposits and withdrawals
- **YToken**: YieldFi yield-bearing token contracts (yUSD, yBTC, yETH, etc.)
- **VyToken**: YieldFi volatile yield token contracts (vyUSD, vyBTC, vyETH, etc.) with enhanced yield optimization

### ABI Type Definitions

For documentation and easier type checking, the SDK exports simplified ABI type definitions:

```typescript
import { ManagerABI, YTokenABI, VyTokenABI } from "yieldfi-sdk";

// Use these types for documentation and type checking
type DepositParams = Parameters<ManagerABI.UserMethods["deposit"]>;
type BalanceOfReturn = ReturnType<YTokenABI.ERC20Methods["balanceOf"]>;
type GuardrailReturn = ReturnType<
  VyTokenABI.ViewMethods["guardrailMultiplier"]
>;

// ManagerABI namespaces:
// - ManagerABI.Methods - Read-only methods
// - ManagerABI.UserMethods - User-callable methods (deposit, redeem, etc.)
// - ManagerABI.AdminMethods - Admin-only methods
// - ManagerABI.Events - Contract events

// YTokenABI namespaces:
// - YTokenABI.ERC20Methods - Standard ERC-20 methods
// - YTokenABI.ERC4626Methods - ERC-4626 vault methods
// - YTokenABI.ViewMethods - YToken-specific view methods
// - YTokenABI.Events - Contract events

// VyTokenABI namespaces:
// - VyTokenABI.ERC20Methods - Standard ERC-20 methods (inherited)
// - VyTokenABI.ERC4626Methods - ERC-4626 vault methods (inherited)
// - VyTokenABI.ViewMethods - vyToken-specific view methods (yToken, guardrailMultiplier, etc.)
// - VyTokenABI.UserMethods - User-callable methods (depositYToken)
// - VyTokenABI.Events - Contract events
```

### Basic Usage

**Important:** You must provide contract ABIs from your contract compilation or a block explorer. The SDK provides TypeScript types but not the ABIs themselves.

```typescript
import {
  connectManager,
  connectYToken,
  connectVyToken,
  CONTRACT_ADDRESSES,
  Chain,
} from "yieldfi-sdk";
import { ethers, Contract } from "ethers";

// Setup provider and signer
const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
const signer = new ethers.Wallet(privateKey, provider);

// Get ABIs from your contract compilation or block explorer
const managerAbi = [...]; // Your Manager contract ABI
const yTokenAbi = [...];  // Your YToken contract ABI
const vyTokenAbi = [...]; // Your vyToken contract ABI

// Connect to contracts with full type safety
const manager = connectManager(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].manager,
  managerAbi,
  provider
);
const yUSD = connectYToken(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].yUSD,
  yTokenAbi,
  signer
);
const vyUSD = connectVyToken(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].vyUSD,
  vyTokenAbi,
  signer
);

// Manager operations - deposit assets
await yUSD.approve(manager.target, ethers.parseUnits("100", 18));
await manager.deposit(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].yUSD,
  assetAddress,
  amount,
  receiver,
  ethers.ZeroAddress,
  "0x",
  "0x"
);

// YToken operations - ERC-20
const balance = await yUSD.balanceOf(userAddress);
await yUSD.transfer(recipient, amount);

// YToken operations - ERC-4626 vault
const shares = await yUSD.deposit(amount, receiver);
await yUSD.redeem(shares, receiver, owner);

// VyToken operations - deposit yToken directly
await yUSD.approve(vyUSD.target, amount);
await vyUSD.depositYToken(receiver, amount);

// VyToken operations - check guardrail
const guardrail = await vyUSD.guardrailMultiplier();
const underlyingYToken = await vyUSD.yToken();
```

### Alternative: Using ethers.Contract Directly

You can also use ethers.js `Contract` class directly with type casting:

```typescript
import { Contract } from "ethers";
import type { Manager, YToken, VyToken } from "yieldfi-sdk";

const manager = new Contract(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].manager,
  managerAbi,
  provider
) as unknown as Manager;

const yUSD = new Contract(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].yUSD,
  yTokenAbi,
  signer
) as unknown as YToken;

const vyUSD = new Contract(
  CONTRACT_ADDRESSES[Chain.ETHEREUM].vyUSD,
  vyTokenAbi,
  signer
) as unknown as VyToken;
```

### Getting Contract ABIs

You can obtain contract ABIs from:

1. **Official YieldFi Documentation**: [docs.yield.fi](https://docs.yield.fi)
2. **Block Explorers**: Etherscan, Arbiscan, Basescan, etc.
3. **Contract Repository**: If you have access to the contract source code
4. **NPM Package**: Some projects publish ABIs as separate packages

> **Note:** Admin-only functions require proper access control. Regular users should focus on:
>
> - **Manager**: `deposit()`, `redeem()`
> - **YToken**: Standard ERC-20 and ERC-4626 methods
> - **VyToken**: `depositYToken()`, plus all YToken methods

## JWT Utilities

The SDK exports JWT utilities for token validation and management:

```typescript
import {
  decodeJWT,
  validateJWT,
  isTokenExpired,
  getTimeUntilExpiration,
} from "yieldfi-sdk";

// Decode a JWT token
const payload = decodeJWT(accessToken);
console.log("User:", payload.address);
console.log("Expires:", new Date(payload.exp! * 1000));

// Check if token is expired
if (isTokenExpired(accessToken)) {
  // Refresh the token
  const newTokens = await sdk.auth.refresh({ refreshToken });
}

// Check expiration with buffer (e.g., refresh if expiring in 5 minutes)
if (isTokenExpired(accessToken, 300)) {
  // Proactively refresh
}

// Get time until expiration
const secondsLeft = getTimeUntilExpiration(accessToken);
console.log(`Token expires in ${secondsLeft} seconds`);
```

## Error Handling

The SDK provides specialized error classes for different error scenarios:

```typescript
import {
  SDKError,
  AuthenticationError,
  NetworkError,
  ValidationError,
  ConfigurationError,
} from "yieldfi-sdk";

try {
  await sdk.auth.login(credentials);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Auth failed:", error.message);
    console.error("Details:", error.details);
    // Could be: invalid credentials, expired token, malformed JWT, etc.
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message, error.statusCode);
    // Network issues, timeout, or server errors
  } else if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
    // Invalid input data
  } else if (error instanceof ConfigurationError) {
    console.error("Config error:", error.message);
    // Invalid SDK configuration
  } else if (error instanceof SDKError) {
    console.error("SDK error:", error.code, error.message);
    // Base SDK error
  }
}
```

All SDK errors extend from `SDKError` and include:

- `message`: Human-readable error message
- `code`: Error code for programmatic handling
- `statusCode`: HTTP status code (for network errors)
- `details`: Additional error context

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yieldfi/yieldfi-sdk.git
cd yieldfi-sdk

# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Run all quality checks
npm run quality
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove build artifacts and node_modules
- `npm test` - Run test suite with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run quality` - Run all checks (build, lint, typecheck, test)

### Project Structure

```
yieldfi-sdk/
├── src/
│   ├── api/              # API client modules
│   │   ├── auth/         # Authentication API
│   │   └── glassbook/    # Glassbook API
│   ├── client/           # Main SDK client
│   ├── config/           # Configuration schemas and defaults
│   ├── constants/        # Contract addresses and token constants
│   ├── di/               # Dependency injection container
│   ├── errors/           # Error classes
│   ├── http/             # HTTP client
│   ├── typechain/        # TypeChain contract types
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── tests/
│   └── unit/             # Unit tests
└── dist/                 # Compiled output
```

## Testing

The SDK maintains high test coverage with comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Coverage Requirements

- Statements: 85%
- Branches: 85%
- Functions: 95%
- Lines: 95%

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions out of the box. No need for `@types` packages.

```typescript
import { YieldFiSDK, Chain, LoginResponse } from "yieldfi-sdk";

// Full IntelliSense and type checking
const sdk = await YieldFiSDK.create({
  gatewayUrl: "https://gw.yield.fi",
});

// Type-safe API calls
const response: LoginResponse = await sdk.auth.login({
  address: "0x...",
  signature: "0x...",
  message: "...",
});
```

## Versioning

This SDK follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

Check the SDK version:

```typescript
import { YieldFiSDK } from "yieldfi-sdk";

console.log(YieldFiSDK.getVersion()); // "0.1.0"
```

## Support

- Documentation: [https://docs.yield.fi](https://docs.yield.fi)
- Issues: [GitHub Issues](https://github.com/yieldfi/yieldfi-sdk/issues)
- Discord: [YieldFi Discord](https://discord.gg/yieldfi)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

GPL-3.0 with restrictive distribution clause. See [LICENSE](./LICENSE) for details.

This SDK is licensed under the GNU General Public License v3.0 with an additional restrictive distribution clause. You may use this SDK, but redistribution requires explicit written permission from YieldFi.

---

**Built with ❤️ by the YieldFi team**
