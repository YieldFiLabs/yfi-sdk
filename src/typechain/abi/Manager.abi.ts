/**
 * Manager Contract ABI Type Definitions
 *
 * Simplified type definitions for Manager contract methods and events.
 * For full TypeChain types, see ../contracts/Manager.ts
 */

import type { AddressLike, BigNumberish, BytesLike } from "ethers";

/**
 * Manager contract method parameters and return types
 */
export namespace ManagerABI {
  export interface Methods {

    /**
     * Check if an asset is enabled for deposits on a yToken
     * @param yToken YToken address
     * @param asset Asset address
     * @returns True if enabled
     */
    depositAssets(yToken: AddressLike, asset: AddressLike): Promise<boolean>;

    /**
     * Check if an asset is enabled for withdrawals from a yToken
     * @param yToken YToken address
     * @param asset Asset address
     * @returns True if enabled
     */
    withdrawAssets(yToken: AddressLike, asset: AddressLike): Promise<boolean>;

    /**
     * Get minimum shares required for a yToken
     * @param yToken YToken address
     * @returns Minimum shares
     */
    minSharesInYToken(yToken: AddressLike): Promise<bigint>;
  }

  // ============================================================================
  // Write Methods (User-Callable)
  // ============================================================================

  export interface UserMethods {
    /**
     * Deposit assets into a yToken
     * @param yToken YToken address to deposit into
     * @param asset Asset token address to deposit
     * @param amount Amount of assets to deposit
     * @param receiver Address to receive yToken shares
     * @param callback Optional callback contract address
     * @param callbackData Optional callback data
     * @param referralCode Optional referral code
     */
    deposit(
      yToken: AddressLike,
      asset: AddressLike,
      amount: BigNumberish,
      receiver: AddressLike,
      callback: AddressLike,
      callbackData: BytesLike,
      referralCode: BytesLike,
    ): Promise<void>;

    /**
     * Redeem yToken shares for assets
     * @param caller Original caller address
     * @param yToken YToken address to redeem from
     * @param asset Asset token address to receive
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive assets
     * @param callback Optional callback contract address
     * @param callbackData Optional callback data
     */
    redeem(
      caller: AddressLike,
      yToken: AddressLike,
      asset: AddressLike,
      shares: BigNumberish,
      receiver: AddressLike,
      callback: AddressLike,
      callbackData: BytesLike,
    ): Promise<void>;
  }

  // ============================================================================
  // Structs
  // ============================================================================

  export interface ManageAssetAndSharesStruct {
    yToken: AddressLike;
    shares: BigNumberish;
    assetAmount: BigNumberish;
    updateAsset: boolean;
    isMint: boolean;
  }

  // ============================================================================
  // Events
  // ============================================================================

  export interface Events {
    AdministratorSet: {
      caller: string;
      newAdministrator: string;
    };

    AssetAndShareManaged: {
      caller: string;
      yToken: string;
      shares: bigint;
      assetAmount: bigint;
      updateAsset: boolean;
      isMint: boolean;
    };

    AssetStatus: {
      orderType: boolean;
      yToken: string;
      asset: string;
      status: boolean;
    };

    CustodyWalletSet: {
      caller: string;
      wallet: string;
      status: boolean;
    };

    Deposit: {
      caller: string;
      asset: string;
      amount: bigint;
      receiver: string;
      yToken: string;
      shares: bigint;
      feeShare: bigint;
      gasFeeShare: bigint;
    };

    Initialized: {
      version: bigint;
    };

    MinSharesInYTokenSet: {
      caller: string;
      yToken: string;
      minShares: bigint;
    };

    OrderRequest: {
      caller: string;
      yToken: string;
      asset: string;
      receiver: string;
      amount: bigint;
      orderType: boolean;
      exchangeRateInUnderlying: bigint;
      receiptId: bigint;
      referralCode: string;
    };

    ReceiptSet: {
      caller: string;
      receipt: string;
    };

    Rescue: {
      caller: string;
      token: string;
      to: string;
      amount: bigint;
    };

    TreasurySet: {
      caller: string;
      treasury: string;
    };

    Withdraw: {
      caller: string;
      asset: string;
      amount: bigint;
      receiver: string;
      yToken: string;
      shares: bigint;
      feeShare: bigint;
      gasFeeShare: bigint;
    };

    YieldFeesTransferred: {
      treasury: string;
      yToken: string;
      shares: bigint;
    };
  }
}
