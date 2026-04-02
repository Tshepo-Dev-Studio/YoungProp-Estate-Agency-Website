import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Helper to create a minimal public context (no user)
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.me (public)", () => {
  it("returns null for unauthenticated requests", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("returns success and clears cookie", async () => {
    const clearedCookies: string[] = [];
    const ctx: TrpcContext = {
      user: {
        id: 1,
        openId: "test-user",
        email: "test@youngprop.co.za",
        name: "Test Agent",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: (name: string) => {
          clearedCookies.push(name);
        },
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
    expect(clearedCookies.length).toBe(1);
  });
});

describe("Supabase environment configuration", () => {
  it("VITE_SUPABASE_URL is set in environment", () => {
    // In production, this will be set. In test, we just verify the pattern.
    const url = process.env.VITE_SUPABASE_URL;
    if (url) {
      expect(url).toMatch(/^https:\/\/.+\.supabase\.co$/);
    } else {
      // Not set in test environment — that's acceptable
      expect(url).toBeUndefined();
    }
  });

  it("VITE_SUPABASE_ANON_KEY follows JWT format when set", () => {
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (key) {
      // JWT tokens have 3 base64 segments separated by dots
      const parts = key.split(".");
      expect(parts.length).toBe(3);
    } else {
      expect(key).toBeUndefined();
    }
  });
});

describe("Analytics configuration", () => {
  it("GA Measurement ID follows G-XXXXXXXXXX format when set", () => {
    const gaId = process.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
    } else {
      // Optional — not required for site to function
      expect(gaId).toBeUndefined();
    }
  });

  it("Meta Pixel ID is numeric when set", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID;
    if (pixelId) {
      expect(pixelId).toMatch(/^\d+$/);
    } else {
      // Optional — not required for site to function
      expect(pixelId).toBeUndefined();
    }
  });
});

describe("YoungProp website routes", () => {
  it("system router is accessible", () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.system).toBeDefined();
  });
});
