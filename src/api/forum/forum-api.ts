/**
 * Forum API client
 *
 * Provides access to proposals, comments, and votes.
 * Requests go through the gateway (e.g. /forum/api/...).
 */

import { HttpClient } from "../../http";
import { SDKConfig } from "../../config";
import type {
  Proposal,
  Comment,
  Vote,
  VoteSummary,
  VotingPower,
  GetProposalsFilters,
  CreateProposalRequest,
  GetProposalsResponse,
  GetProposalResponse,
  GetCommentsResponse,
  GetVotesResponse,
  GetVotingPowerResponse,
} from "../../types/forum";

export class ForumAPI {
  private readonly servicePrefix: string;

  constructor(
    private httpClient: HttpClient,
    private config: SDKConfig,
  ) {
    this.servicePrefix = this.config.servicePrefixes.forum;
  }

  private getAuthHeaders(accessToken?: string): Record<string, string> {
    if (!accessToken) return {};
    return { Authorization: `Bearer ${accessToken}` };
  }

  async getProposals(
    filters?: GetProposalsFilters,
    accessToken?: string,
  ): Promise<GetProposalsResponse> {
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.type) params.type = filters.type;
    if (filters?.vaultKey) params.vaultKey = filters.vaultKey;
    if (filters?.author) params.author = filters.author;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await this.httpClient.get<GetProposalsResponse>(
      `/${this.servicePrefix}/api/proposals`,
      { params },
    );
    return response as GetProposalsResponse;
  }

  async getProposalById(id: string): Promise<GetProposalResponse> {
    const response = await this.httpClient.get<GetProposalResponse>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(id)}`,
    );
    return response as GetProposalResponse;
  }

  async createProposal(
    data: CreateProposalRequest,
    accessToken: string,
  ): Promise<{ success: boolean; data: Proposal }> {
    const response = await this.httpClient.post<{ success: boolean; data: Proposal }>(
      `/${this.servicePrefix}/api/proposals`,
      data,
      { headers: this.getAuthHeaders(accessToken) },
    );
    return response as { success: boolean; data: Proposal };
  }

  async getComments(proposalId: string): Promise<GetCommentsResponse> {
    const response = await this.httpClient.get<GetCommentsResponse>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(proposalId)}/comments`,
    );
    return response as GetCommentsResponse;
  }

  async postComment(
    proposalId: string,
    content: string,
    accessToken: string,
    parentCommentId?: string,
  ): Promise<{ success: boolean; data: Comment }> {
    const response = await this.httpClient.post<{ success: boolean; data: Comment }>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(proposalId)}/comments`,
      { content, parentCommentId },
      { headers: this.getAuthHeaders(accessToken) },
    );
    return response as { success: boolean; data: Comment };
  }

  async getVotes(proposalId: string, accessToken?: string): Promise<GetVotesResponse> {
    const options = accessToken
      ? { headers: this.getAuthHeaders(accessToken) }
      : undefined;
    const response = await this.httpClient.get<GetVotesResponse>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(proposalId)}/votes`,
      options,
    );
    return response as GetVotesResponse;
  }

  async getVotingPower(
    proposalId: string,
    accessToken: string,
  ): Promise<GetVotingPowerResponse> {
    const response = await this.httpClient.get<GetVotingPowerResponse>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(proposalId)}/votes/power`,
      { headers: this.getAuthHeaders(accessToken) },
    );
    return response as GetVotingPowerResponse;
  }

  async castVote(
    proposalId: string,
    choice: "for" | "against" | "abstain",
    accessToken: string,
  ): Promise<{ success: boolean; data: Vote }> {
    const response = await this.httpClient.post<{ success: boolean; data: Vote }>(
      `/${this.servicePrefix}/api/proposals/${encodeURIComponent(proposalId)}/votes`,
      { choice },
      { headers: this.getAuthHeaders(accessToken) },
    );
    return response as { success: boolean; data: Vote };
  }

  async updateComment(
    commentId: string,
    content: string,
    accessToken: string,
  ): Promise<{ success: boolean; data: Comment }> {
    const response = await this.httpClient.patch<{ success: boolean; data: Comment }>(
      `/${this.servicePrefix}/api/comments/${encodeURIComponent(commentId)}`,
      { content },
      { headers: this.getAuthHeaders(accessToken) },
    );
    return response as { success: boolean; data: Comment };
  }

  async deleteComment(
    commentId: string,
    accessToken: string,
  ): Promise<void> {
    await this.httpClient.delete(
      `/${this.servicePrefix}/api/comments/${encodeURIComponent(commentId)}`,
      { headers: this.getAuthHeaders(accessToken) },
    );
  }
}
