/**
 * Forum API type definitions
 */

export type ProposalType =
  | "new_vault"
  | "parameter_change"
  | "governance_policy"
  | "curator_onboarding";

export type ProposalStatus =
  | "draft"
  | "discussion"
  | "active"
  | "passed"
  | "rejected"
  | "cancelled";

export type VoteChoice = "for" | "against" | "abstain";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposalType: ProposalType;
  authorAddress: string;
  vaultKey: string | null;
  status: ProposalStatus;
  discussionEndsAt: string | null;
  votingStartsAt: string | null;
  votingEndsAt: string | null;
  quorumThreshold: string;
  passThreshold: string;
  executionFlag: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  proposalId: string;
  authorAddress: string;
  content: string;
  parentCommentId: string | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  voterAddress: string;
  voteChoice: VoteChoice;
  votingPower: string;
  ypointsBalance: string;
  debankPortfolioUsd: string;
  createdAt: string;
}

export interface VoteSummary {
  forPower: number;
  againstPower: number;
  abstainPower: number;
  totalVotingPower: number;
  forCount: number;
  againstCount: number;
  abstainCount: number;
}

export interface VotingPower {
  votingPower: number;
  ypointsBalance: number;
  debankPortfolioUsd: number;
}

export interface GetProposalsFilters {
  status?: ProposalStatus;
  type?: ProposalType;
  vaultKey?: string;
  author?: string;
  page?: number;
  limit?: number;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  proposalType: ProposalType;
  vaultKey?: string;
  vaultSpecs?: Array<{
    chainId: number;
    assetSymbol?: string;
    strategyDescription?: string;
    targetApy?: number;
    riskLevel?: string;
  }>;
  parameterChanges?: Array<{
    parameterName: string;
    currentValue?: string;
    proposedValue: string;
  }>;
}

export interface GetProposalsResponse {
  success: boolean;
  data: {
    proposals: Proposal[];
    pagination: { page: number; limit: number; total: number };
  };
}

export interface GetProposalResponse {
  success: boolean;
  data: Proposal;
}

export interface GetCommentsResponse {
  success: boolean;
  data: Comment[];
}

export interface GetVotesResponse {
  success: boolean;
  data: {
    summary: VoteSummary;
    myVote: Vote | null;
  };
}

export interface GetVotingPowerResponse {
  success: boolean;
  data: VotingPower;
}
