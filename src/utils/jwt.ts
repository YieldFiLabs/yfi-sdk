/**
 * JWT validation utilities
 */

import { AuthenticationError } from "../errors";

/**
 * JWT payload interface
 */
export interface JWTPayload {
  /**
   * Subject (user ID)
   */
  sub?: string;

  /**
   * User address
   */
  address?: string;

  /**
   * User role
   */
  role?: string;

  /**
   * Issued at (Unix timestamp in seconds)
   */
  iat?: number;

  /**
   * Expiration time (Unix timestamp in seconds)
   */
  exp?: number;

  /**
   * Issuer
   */
  iss?: string;

  /**
   * Partner ID
   */
  partnerId?: string;

  /**
   * Token type
   */
  type?: string;
}

/**
 * Decode a JWT token without verification
 * @param token JWT token string
 * @returns Decoded payload
 * @throws AuthenticationError if token is malformed
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();

    // JWT format: header.payload.signature
    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      throw new Error(
        "Invalid JWT format - expected 3 parts separated by dots",
      );
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Base64 decode (handle URL-safe base64)
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error: any) {
    throw new AuthenticationError("Failed to decode JWT token", {
      error: error.message,
    });
  }
}

/**
 * Check if a JWT token is expired
 * @param token JWT token string or decoded payload
 * @param bufferSeconds Optional buffer time in seconds (default: 0)
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(
  token: string | JWTPayload,
  bufferSeconds: number = 0,
): boolean {
  try {
    const payload = typeof token === "string" ? decodeJWT(token) : token;

    if (!payload.exp) {
      // If no expiration, consider it as non-expiring (or handle as needed)
      return false;
    }

    // Get current time in seconds (JWT uses seconds, not milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired (with optional buffer)
    return payload.exp < currentTime + bufferSeconds;
  } catch (error) {
    // If we can't decode the token, consider it expired
    return true;
  }
}

/**
 * Validate a JWT token
 * @param token JWT token string
 * @param bufferSeconds Optional buffer time in seconds before expiration (default: 0)
 * @returns Decoded payload if valid
 * @throws AuthenticationError if token is invalid or expired
 */
export function validateJWT(
  token: string,
  bufferSeconds: number = 0,
): JWTPayload {
  // Decode the token
  const payload = decodeJWT(token);

  // Check expiration
  if (isTokenExpired(payload, bufferSeconds)) {
    const expiredAt = payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : "unknown";
    throw new AuthenticationError("JWT token has expired", {
      expiredAt,
      currentTime: new Date().toISOString(),
    });
  }

  return payload;
}

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value
 * @returns Token string without 'Bearer ' prefix
 * @throws AuthenticationError if header format is invalid
 */
export function extractTokenFromHeader(authHeader: string): string {
  if (!authHeader) {
    throw new AuthenticationError("Authorization header is missing");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new AuthenticationError(
      "Invalid Authorization header format. Expected 'Bearer <token>'",
    );
  }

  return parts[1];
}

/**
 * Get time until token expiration in seconds
 * @param token JWT token string or decoded payload
 * @returns Seconds until expiration, or null if no expiration
 */
export function getTimeUntilExpiration(
  token: string | JWTPayload,
): number | null {
  try {
    const payload = typeof token === "string" ? decodeJWT(token) : token;

    if (!payload.exp) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExp = payload.exp - currentTime;

    return Math.max(0, timeUntilExp);
  } catch (error) {
    return null;
  }
}
