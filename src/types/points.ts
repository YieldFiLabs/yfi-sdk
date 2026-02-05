/**
 * Points API type definitions
 */

export interface TokenPointsData {
  address: string;
  points: string;
}

export interface ProtocolSummary {
  protocolId: string;
  chainId: string;
  totalPoints: string;
  lastUpdate: number | null;
  tokens: TokenPointsData[];
  records: unknown[];
}

export interface UserPointsResponse {
  address: string;
  totalPoints: string;
  protocols: ProtocolSummary[];
}

export interface TokenBalanceData {
  address: string;
  balance: number;
  timestamp?: number;
  blockNumber?: number;
  price?: number;
}

export interface ProtocolBalance {
  protocolId: string;
  chainId: string;
  tokens: TokenBalanceData[];
  lastUpdate: number | null;
}

export interface UserBalancesResponse {
  address: string;
  protocols: ProtocolBalance[];
}

export interface ChainData {
  chainId: string;
  tokens: TokenPointsData[];
  totalPoints: string;
}

export interface UserSummary {
  userAddress: string;
  totalPoints: string;
  chains: ChainData[];
  records: unknown[];
}

export interface ProtocolPointsResponse {
  protocolId: string;
  chainId: string;
  tokenAddress: string;
  users: UserSummary[];
}

export interface PointsApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
