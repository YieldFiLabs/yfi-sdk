/**
 * Tests for JWT utilities
 */

import { decodeJWT } from "../../../src/utils/jwt";

describe("jwt", () => {
  describe("decodeJWT", () => {
    it("should decode payload without base64 padding", () => {
      const payload = { sub: "user-1", exp: 1893456000 };
      const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
        "base64url",
      );
      const token = `e30.${encoded}.sig`;

      const decoded = decodeJWT(token);

      expect(decoded.sub).toBe("user-1");
      expect(decoded.exp).toBe(1893456000);
    });
  });
});
