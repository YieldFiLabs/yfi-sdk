/**
 * YToken Contract ABI Type Definitions
 *
 * Simplified type definitions for YToken contract methods and events.
 * For full TypeChain types, see ../contracts/YToken.ts
 */

import type { AddressLike, BigNumberish } from "ethers";

/**
 * YToken contract method parameters and return types
 * YToken implements ERC-20 and ERC-4626 standards
 */
export namespace YTokenABI {
  // ============================================================================
  // ERC-20 Standard Methods
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
  // ERC-4626 Vault Methods
  // ============================================================================

  export interface ERC4626Methods {
    /**
     * Get underlying asset address
     * @returns Asset token address
     */
    asset(): Promise<string>;

    /**
     * Get total assets managed by vault
     * @returns Total assets
     */
    totalAssets(): Promise<bigint>;

    /**
     * Convert shares to assets
     * @param shares Amount of shares
     * @returns Equivalent assets
     */
    convertToAssets(shares: BigNumberish): Promise<bigint>;

    /**
     * Convert assets to shares
     * @param assets Amount of assets
     * @returns Equivalent shares
     */
    convertToShares(assets: BigNumberish): Promise<bigint>;

    /**
     * Preview deposit operation
     * @param assets Amount of assets to deposit
     * @returns Shares that would be minted
     */
    previewDeposit(assets: BigNumberish): Promise<bigint>;

    /**
     * Preview mint operation
     * @param shares Amount of shares to mint
     * @returns Assets that would be required
     */
    previewMint(shares: BigNumberish): Promise<bigint>;

    /**
     * Preview withdraw operation
     * @param assets Amount of assets to withdraw
     * @returns Shares that would be burned
     */
    previewWithdraw(assets: BigNumberish): Promise<bigint>;

    /**
     * Preview redeem operation
     * @param shares Amount of shares to redeem
     * @returns Assets that would be received
     */
    previewRedeem(shares: BigNumberish): Promise<bigint>;

    /**
     * Get maximum deposit amount for an address
     * @param receiver Receiver address
     * @returns Maximum deposit amount
     */
    maxDeposit(receiver: AddressLike): Promise<bigint>;

    /**
     * Get maximum mint amount for an address
     * @param receiver Receiver address
     * @returns Maximum mint amount
     */
    maxMint(receiver: AddressLike): Promise<bigint>;

    /**
     * Get maximum withdraw amount for an address
     * @param owner Owner address
     * @returns Maximum withdraw amount
     */
    maxWithdraw(owner: AddressLike): Promise<bigint>;

    /**
     * Get maximum redeem amount for an address
     * @param owner Owner address
     * @returns Maximum redeem amount
     */
    maxRedeem(owner: AddressLike): Promise<bigint>;

    /**
     * Deposit assets and receive shares
     * @param assets Amount of assets to deposit
     * @param receiver Address to receive shares
     * @returns Amount of shares minted
     */
    deposit(assets: BigNumberish, receiver: AddressLike): Promise<bigint>;

    /**
     * Mint shares by depositing assets
     * @param shares Amount of shares to mint
     * @param receiver Address to receive shares
     * @returns Amount of assets deposited
     */
    mint(shares: BigNumberish, receiver: AddressLike): Promise<bigint>;

    /**
     * Withdraw assets by burning shares
     * @param assets Amount of assets to withdraw
     * @param receiver Address to receive assets
     * @param owner Owner of shares
     * @returns Amount of shares burned
     */
    withdraw(
      assets: BigNumberish,
      receiver: AddressLike,
      owner: AddressLike,
    ): Promise<bigint>;

    /**
     * Redeem shares for assets
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive assets
     * @param owner Owner of shares
     * @returns Amount of assets received
     */
    redeem(
      shares: BigNumberish,
      receiver: AddressLike,
      owner: AddressLike,
    ): Promise<bigint>;
  }

  // ============================================================================
  // Events
  // ============================================================================

  export interface Events {
    AdministratorSet: {
      caller: string;
      newAdministrator: string;
    };

    Approval: {
      owner: string;
      spender: string;
      value: bigint;
    };

    Deposit: {
      sender: string;
      owner: string;
      assets: bigint;
      shares: bigint;
    };

    FeeSet: {
      caller: string;
      fee: bigint;
    };

    GasFeeSet: {
      caller: string;
      gasFee: bigint;
    };

    Initialized: {
      version: bigint;
    };

    ManagerSet: {
      caller: string;
      manager: string;
    };

    Rescue: {
      caller: string;
      token: string;
      to: string;
      amount: bigint;
    };

    TotalAssetsUpdated: {
      caller: string;
      amount: bigint;
      add: boolean;
    };

    Transfer: {
      from: string;
      to: string;
      value: bigint;
    };

    TransferRewards: {
      caller: string;
      amount: bigint;
    };

    VestingPeriodSet: {
      caller: string;
      vestingPeriod: bigint;
    };

    Withdraw: {
      sender: string;
      receiver: string;
      owner: string;
      assets: bigint;
      shares: bigint;
    };

    YieldSet: {
      caller: string;
      yield: string;
    };
  }
}
