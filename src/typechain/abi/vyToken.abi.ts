/**
 * vyToken Contract ABI Type Definitions
 *
 * Simplified type definitions for vyToken contract methods and events.
 * vyToken extends YToken with additional yield optimization features.
 * For full TypeChain types, see ../contracts/vyToken.ts
 */

import type { AddressLike, BigNumberish } from "ethers";

/**
 * vyToken contract method parameters and return types
 * vyToken implements ERC-20, ERC-4626, and extends YToken with yield optimization
 */
export namespace VyTokenABI {
    // ============================================================================
    // ERC-20 Standard Methods (inherited from YToken)
    // ============================================================================

    export interface ERC20Methods {
        /**
         * Get token name
         * @returns Token name
         */
        name(): Promise<string>;

        /**
         * Get token symbol
         * @returns Token symbol
         */
        symbol(): Promise<string>;

        /**
         * Get token decimals
         * @returns Number of decimals
         */
        decimals(): Promise<bigint>;

        /**
         * Get total token supply
         * @returns Total supply
         */
        totalSupply(): Promise<bigint>;

        /**
         * Get balance of an account
         * @param account Account address
         * @returns Balance
         */
        balanceOf(account: AddressLike): Promise<bigint>;

        /**
         * Transfer tokens
         * @param to Recipient address
         * @param value Amount to transfer
         * @returns True if successful
         */
        transfer(to: AddressLike, value: BigNumberish): Promise<boolean>;

        /**
         * Transfer tokens from one address to another
         * @param from Sender address
         * @param to Recipient address
         * @param value Amount to transfer
         * @returns True if successful
         */
        transferFrom(
            from: AddressLike,
            to: AddressLike,
            value: BigNumberish,
        ): Promise<boolean>;

        /**
         * Approve spender to use tokens
         * @param spender Spender address
         * @param value Amount to approve
         * @returns True if successful
         */
        approve(spender: AddressLike, value: BigNumberish): Promise<boolean>;

        /**
         * Get allowance amount
         * @param owner Owner address
         * @param spender Spender address
         * @returns Allowance amount
         */
        allowance(owner: AddressLike, spender: AddressLike): Promise<bigint>;
    }

    // ============================================================================
    // ERC-4626 Vault Methods (inherited from YToken)
    // ============================================================================

    export interface ERC4626Methods {
        /**
         * Get underlying asset address
         * @returns Asset token address
         */
        asset(): Promise<string>;

        /**
         * Get total assets under management
         * @returns Total assets
         */
        totalAssets(): Promise<bigint>;

        /**
         * Convert shares to assets
         * @param shares Share amount
         * @returns Asset amount
         */
        convertToAssets(shares: BigNumberish): Promise<bigint>;

        /**
         * Convert assets to shares
         * @param assets Asset amount
         * @returns Share amount
         */
        convertToShares(assets: BigNumberish): Promise<bigint>;

        /**
         * Get maximum deposit amount
         * @param receiver Receiver address
         * @returns Maximum deposit amount
         */
        maxDeposit(receiver: AddressLike): Promise<bigint>;

        /**
         * Get maximum mint amount
         * @param receiver Receiver address
         * @returns Maximum mint amount
         */
        maxMint(receiver: AddressLike): Promise<bigint>;

        /**
         * Get maximum redeem amount
         * @param owner Owner address
         * @returns Maximum redeem amount
         */
        maxRedeem(owner: AddressLike): Promise<bigint>;

        /**
         * Get maximum withdraw amount
         * @param owner Owner address
         * @returns Maximum withdraw amount
         */
        maxWithdraw(owner: AddressLike): Promise<bigint>;

        /**
         * Preview deposit result
         * @param assets Asset amount to deposit
         * @returns Expected shares
         */
        previewDeposit(assets: BigNumberish): Promise<bigint>;

        /**
         * Preview mint result
         * @param shares Share amount to mint
         * @returns Required assets
         */
        previewMint(shares: BigNumberish): Promise<bigint>;

        /**
         * Preview withdraw result
         * @param assets Asset amount to withdraw
         * @returns Required shares
         */
        previewWithdraw(assets: BigNumberish): Promise<bigint>;

        /**
         * Preview redeem result
         * @param shares Share amount to redeem
         * @returns Expected assets
         */
        previewRedeem(shares: BigNumberish): Promise<bigint>;

        /**
         * Deposit assets and receive shares
         * @param assets Asset amount to deposit
         * @param receiver Receiver of shares
         * @returns Share amount minted
         */
        deposit(assets: BigNumberish, receiver: AddressLike): Promise<bigint>;

        /**
         * Mint shares by depositing assets
         * @param shares Share amount to mint
         * @param receiver Receiver of shares
         * @returns Asset amount deposited
         */
        mint(shares: BigNumberish, receiver: AddressLike): Promise<bigint>;

        /**
         * Withdraw assets by burning shares
         * @param assets Asset amount to withdraw
         * @param receiver Receiver of assets
         * @param owner Owner of shares
         * @returns Share amount burned
         */
        withdraw(
            assets: BigNumberish,
            receiver: AddressLike,
            owner: AddressLike,
        ): Promise<bigint>;

        /**
         * Redeem shares for assets
         * @param shares Share amount to redeem
         * @param receiver Receiver of assets
         * @param owner Owner of shares
         * @returns Asset amount withdrawn
         */
        redeem(
            shares: BigNumberish,
            receiver: AddressLike,
            owner: AddressLike,
        ): Promise<bigint>;
    }

    // ============================================================================
    // vyToken-Specific View Methods
    // ============================================================================

    export interface ViewMethods {
        /**
         * Get the underlying yToken address
         * @returns yToken contract address
         */
        yToken(): Promise<string>;

        /**
         * Get the guardrail multiplier for yToken shares
         * @returns Guardrail multiplier
         */
        guardrailMultiplier(): Promise<bigint>;

        /**
         * Check if an address is a registered strategy
         * @param strategy Strategy address to check
         * @returns True if registered as strategy
         */
        strategyAddress(strategy: AddressLike): Promise<boolean>;
    }

    // ============================================================================
    // vyToken-Specific User Methods
    // ============================================================================

    export interface UserMethods {
        /**
         * Deposit yToken to mint vyToken (without asset conversion)
         * This is more gas-efficient than depositing assets when you already hold yToken
         * @param to Receiver of vyToken shares
         * @param amountYToken Amount of yToken to deposit
         */
        depositYToken(to: AddressLike, amountYToken: BigNumberish): Promise<void>;
    }

    // ============================================================================
    // vyToken Admin-Only Methods (require admin role)
    // ============================================================================

    export interface AdminMethods {
        /**
         * Set the yToken address and approve infinite allowance
         * @param _yToken yToken contract address
         */
        setYTokenAndAllowance(_yToken: AddressLike): Promise<void>;

        /**
         * Set the guardrail multiplier
         * Limits the ratio of yToken shares to vyToken shares for security
         * @param _guardrailMultiplier New guardrail multiplier value
         */
        setGuardrailMultiplier(_guardrailMultiplier: BigNumberish): Promise<void>;

        /**
         * Enable or disable a strategy address
         * @param _strategy Strategy contract address
         * @param _status True to enable, false to disable
         */
        setStrategy(_strategy: AddressLike, _status: boolean): Promise<void>;

        /**
         * Send tokens to a strategy (collateral manager only)
         * @param token Token address to send
         * @param amount Amount to send
         * @param strategy Strategy address to receive tokens
         */
        sendToStrategy(
            token: AddressLike,
            amount: BigNumberish,
            strategy: AddressLike,
        ): Promise<void>;

        /**
         * Mint vyToken shares (manager only)
         * Used by the manager contract for external deposits
         * @param to Receiver of vyToken shares
         * @param shares Amount of shares to mint
         * @param isNewYToken Whether to mint new yToken or use existing
         */
        mintYToken(
            to: AddressLike,
            shares: BigNumberish,
            isNewYToken: boolean,
        ): Promise<void>;
    }

    // ============================================================================
    // Contract Events
    // ============================================================================

    export interface Events {
        /**
         * Emitted when tokens are transferred
         */
        Transfer: {
            from: string;
            to: string;
            value: bigint;
        };

        /**
         * Emitted when allowance is set
         */
        Approval: {
            owner: string;
            spender: string;
            value: bigint;
        };

        /**
         * Emitted when assets are deposited
         */
        Deposit: {
            sender: string;
            owner: string;
            assets: bigint;
            shares: bigint;
        };

        /**
         * Emitted when shares are redeemed
         */
        Withdraw: {
            sender: string;
            receiver: string;
            owner: string;
            assets: bigint;
            shares: bigint;
        };

        /**
         * Emitted when yToken address is set
         */
        YTokenSet: {
            yToken: string;
        };

        /**
         * Emitted when guardrail multiplier is updated
         */
        GuardrailMultiplierSet: {
            guardrailMultiplier: bigint;
        };
    }

    // ============================================================================
    // Combined Methods Interface
    // ============================================================================

    /**
     * All vyToken methods combined for convenience
     */
    export interface Methods
        extends ERC20Methods,
        ERC4626Methods,
        ViewMethods,
        UserMethods { }

    /**
     * All methods including admin-only functions
     */
    export interface AllMethods extends Methods, AdminMethods { }
}

