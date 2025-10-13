/**
 * Tests for AuthAPI
 */

import { AuthAPI } from "../../../../src/api/auth";
import { HttpClient } from "../../../../src/http";
import { SDKConfig } from "../../../../src/config";
import { AuthenticationError } from "../../../../src/errors";
import {
    LoginResponse,
    NonceResponse,
    RefreshTokenResponse,
    AuthUser,
} from "../../../../src/types";

jest.mock("../../../../src/http");

describe("AuthAPI", () => {
    let authAPI: AuthAPI;
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
            },
            partnerId: "test-partner-123",
        } as any;

        authAPI = new AuthAPI(mockHttpClient, mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("generateNonce", () => {
        it("should generate nonce for signing", async () => {
            const expectedResponse: NonceResponse = {
                message: "0x123|1234567890",
                timestamp: 1234567890,
                expiresAt: 1234568190,
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await authAPI.generateNonce({ address: "0x123" });

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/nonce", {
                address: "0x123",
            });
        });

        it("should throw AuthenticationError on failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error("Network error"));

            await expect(authAPI.generateNonce({ address: "0x123" })).rejects.toThrow(
                AuthenticationError,
            );
        });
    });

    describe("login", () => {
        it("should login with partnerId from config", async () => {
            const credentials = {
                address: "0x123",
                signature: "0xsig",
                message: "0x123|1234567890",
            };

            const mockUser: AuthUser = {
                id: "user-123",
                address: "0x123",
                role: "user",
            };

            const expectedResponse: LoginResponse = {
                token: "legacy-token",
                expiresAt: 1234567890,
                accessToken: "access-token-jwt",
                refreshToken: "refresh-token-hex",
                accessTokenExpiresAt: 1234567890,
                refreshTokenExpiresAt: 1234974890,
                user: mockUser,
            };

            mockHttpClient.post.mockResolvedValue(expectedResponse);

            const result = await authAPI.login(credentials);

            expect(result).toEqual(expectedResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/login", {
                ...credentials,
                partnerId: "test-partner-123",
            });
            // Verify the response contains tokens (but SDK doesn't store them)
            expect(result.accessToken).toBe("access-token-jwt");
            expect(result.refreshToken).toBe("refresh-token-hex");
            expect(result.user).toEqual(mockUser);
        });

        it("should throw AuthenticationError on failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error("Invalid signature"));

            await expect(
                authAPI.login({
                    address: "0x123",
                    signature: "0xbadsig",
                    message: "0x123|1234567890",
                }),
            ).rejects.toThrow(AuthenticationError);
        });
    });

    describe("refresh", () => {
        it("should refresh with explicit refresh token", async () => {
            const refreshResponse: RefreshTokenResponse = {
                accessToken: "new-access-token",
                refreshToken: "refresh-token-hex",
                accessTokenExpiresAt: 1234568790,
                refreshTokenExpiresAt: 1234974890,
            };

            mockHttpClient.post.mockResolvedValue(refreshResponse);

            const result = await authAPI.refresh({
                refreshToken: "refresh-token-hex",
            });

            expect(result).toEqual(refreshResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/refresh", {
                refreshToken: "refresh-token-hex",
                partnerId: "test-partner-123",
            });
            // Verify the response contains new tokens
            expect(result.accessToken).toBe("new-access-token");
            expect(result.refreshToken).toBe("refresh-token-hex");
        });

        it("should refresh with API key", async () => {
            const refreshResponse: RefreshTokenResponse = {
                accessToken: "new-access-token",
                accessTokenExpiresAt: 1234568790,
            };

            mockHttpClient.post.mockResolvedValue(refreshResponse);

            const result = await authAPI.refresh({
                apiKey: "yfi_api_key_abc123",
            });

            expect(result).toEqual(refreshResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/refresh", {
                apiKey: "yfi_api_key_abc123",
                partnerId: "test-partner-123",
            });
            // API key refresh returns access token only
            expect(result.accessToken).toBe("new-access-token");
        });

        it("should throw AuthenticationError on failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error("Token expired"));

            await expect(
                authAPI.refresh({ refreshToken: "expired-token" }),
            ).rejects.toThrow(AuthenticationError);
        });
    });

    describe("logout", () => {
        it("should logout with access token", async () => {
            const logoutResponse = {
                message: "Logged out successfully",
                tokensRevoked: 2,
            };

            mockHttpClient.post.mockResolvedValue(logoutResponse);

            const result = await authAPI.logout("access-token-jwt");

            expect(result).toEqual(logoutResponse);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                "/auth/logout",
                {},
                {
                    headers: {
                        Authorization: "Bearer access-token-jwt",
                    },
                },
            );
        });

        it("should throw AuthenticationError on failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error("Network error"));

            await expect(authAPI.logout("invalid-token")).rejects.toThrow(
                AuthenticationError,
            );
        });
    });

});
