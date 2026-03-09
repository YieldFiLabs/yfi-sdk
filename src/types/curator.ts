/**
 * Curator API type definitions
 */

export interface CreateCuratorRequest {
  name: string;
  userId: string;
  vaults?: Array<{
    vaultName: string;
    vaultSymbol: string;
    websiteUrl?: string;
  }>;
  contact?: {
    email?: string;
    telegram?: string;
    discord?: string;
  };
  additionalNotes?: string;
}

export interface CreateCuratorResponse {
  success: boolean;
  curator: {
    id: string;
    key: string;
    name: string | null;
    address: string | null;
    websiteUrl: string | null;
    email: string | null;
    telegram: string | null;
    discord: string | null;
    createdAt: string;
  };
  timestamp: string;
}

export interface CuratorVaultsResponse {
  success: boolean;
  vaults: Array<{
    id: string;
    vaultKey: string;
    address: string;
    chainId: number;
    symbol: string | null;
    name: string | null;
    status: string;
    inPartnershipWith: string | null;
  }>;
}

export interface VaultSlaBody {
  time?: number;
  threshold?: number;
}

export interface VaultSlaResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface AllCuratorsResponse {
  success: boolean;
  curators: Array<{
    id: string;
    key: string;
    name: string | null;
    address: string | null;
    websiteUrl: string | null;
    vault: string | null;
    email: string | null;
    telegram: string | null;
    discord: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  timestamp: string;
}

export interface AllCuratorVaultsResponse {
  success: boolean;
  data: Array<{
    curatorKey: string;
    curatorName: string | null;
    vaults: Array<{
      vaultKey: string;
      address: string;
      chainId: number;
      symbol: string | null;
      name: string | null;
      status: string;
    }>;
  }>;
  timestamp: string;
}
