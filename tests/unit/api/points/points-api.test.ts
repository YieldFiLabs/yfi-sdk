/**
 * Tests for PointsAPI (leaderboard gateway route)
 */

import { PointsAPI } from "../../../../src/api/points/points-api";
import { HttpClient } from "../../../../src/http";
import { SDKConfig } from "../../../../src/config";
import { PointsLeaderboardResult } from "../../../../src/types";

jest.mock("../../../../src/http");

describe("PointsAPI", () => {
    let pointsAPI: PointsAPI;
    let mockHttpClient: jest.Mocked<HttpClient>;
    let mockConfig: SDKConfig;

    beforeEach(() => {
        mockHttpClient = {
            post: jest.fn(),
            get: jest.fn(),
        } as any;

        mockConfig = {
            servicePrefixes: {
                auth: "auth",
                glassbook: "gb",
                keystone: "ks",
                vault: "vault",
                points: "pts",
                forum: "forum",
            },
        } as any;

        pointsAPI = new PointsAPI(mockHttpClient, mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getPointsLeaderboard", () => {
        it("should call gateway public leaderboard path and return data payload", async () => {
            const inner: PointsLeaderboardResult = {
                protocolId: "yieldfi-v3",
                totalPoints: 1250,
                holders: [
                    {
                        id: "pt-yieldfi-v3-0xabc",
                        addr: "0xabcd...1234",
                        walletAddress: "0xabcdef0123456789abcdef0123456789abcdef12",
                        label: "",
                        deposit: 50.25,
                        points: 100,
                        days: 1,
                        tags: [],
                        region: "",
                        epoch: 1700000000,
                    },
                ],
                updatedAt: "2026-01-01T00:00:00.000Z",
            };

            mockHttpClient.get.mockResolvedValue({
                success: true,
                data: inner,
            });

            const result = await pointsAPI.getPointsLeaderboard("yieldfi-v3", {
                limit: 100,
                offset: 0,
                chainId: "1",
            });

            expect(result).toEqual(inner);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "/api/public/points/leaderboard/yieldfi-v3",
                {
                    params: { limit: 100, offset: 0, chainId: "1" },
                },
            );
        });
    });
});
