import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const user: AuthenticatedUser = {
    id: 999,
    openId: "test-user-ce-empire",
    email: "test@ceempire.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1, httpOnly: true, path: "/" });
  });
});

describe("auth.me", () => {
  it("returns current user when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.openId).toBe("test-user-ce-empire");
    expect(user?.role).toBe("user");
  });

  it("returns null when not authenticated", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

describe("CE Empire - bankData validation", () => {
  it("THAI_BANKS should have required fields", async () => {
    const { THAI_BANKS } = await import("../shared/bankData");
    expect(THAI_BANKS.length).toBeGreaterThan(5);
    for (const bank of THAI_BANKS) {
      expect(bank.code).toBeTruthy();
      expect(bank.name).toBeTruthy();
      expect(bank.shortName).toBeTruthy();
      expect(bank.color).toMatch(/^#[0-9A-Fa-f]{3,8}$/);
    }
  });

  it("getBankByCode returns correct bank", async () => {
    const { getBankByCode } = await import("../shared/bankData");
    const kbank = getBankByCode("KBANK");
    expect(kbank.code).toBe("KBANK");
    expect(kbank.name).toContain("กสิกร");
    const scb = getBankByCode("SCB");
    expect(scb.code).toBe("SCB");
    const unknown = getBankByCode("UNKNOWN_BANK");
    expect(unknown.code).toBe("OTHER");
  });
});
