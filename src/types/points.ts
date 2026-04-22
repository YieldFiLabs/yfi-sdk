/**
 * Points API type definitions
 */

export type PointsHolderTag = 'whale' | 'active' | 'new' | 'og';

/**
 * Single row on the public points leaderboard (matches evolve-ui mock shape)
 */
export interface PointsLeaderboardEntry {
    id: string;
    addr: string;
    walletAddress: string;
    label: string;
    /** Balance / deposit amount (e.g. from pt_balance), not leaderboard points */
    deposit: number;
    /** Points total (e.g. from pt_points) for ranking and points column */
    points: number;
    days: number;
    tags: PointsHolderTag[];
    region: string;
    epoch: number;
}

/**
 * Gateway GET /api/public/points/leaderboard/:protocolId payload (data field)
 */
export interface PointsLeaderboardResult {
    protocolId: string;
    /** Sum of all points for the protocol in pt_points (not limited by pagination) */
    totalPoints: number;
    holders: PointsLeaderboardEntry[];
    updatedAt: string;
}

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
