import { describe, expect, it } from "vitest";
import { deriveTwinMetrics, formatBaht, getSyncState } from "../client/src/lib/twinMetrics";

const summary = {
  accountCount: 3,
  balance: "12000.50",
  pendingPayments: 2,
  unmatchedSlips: 1,
  monthVolume: "2500.00",
  monthOut: "1500.00",
  activeAgents: 4,
  monthIn: null,
  cardUsage: null,
  asOf: "2026-10-23T00:00:00.000Z",
};

describe("digital twin metrics — source integrity", () => {
  it("never invents card usage or cash in without a source", () => {
    const result = deriveTwinMetrics(summary);
    expect(result.card).toBe("NO SOURCE");
    expect(result.cashIn).toBe("NO SOURCE");
    expect(result.alerts).toBe(3);
  });
  it("returns unknown values when no summary exists", () => {
    const result = deriveTwinMetrics(null);
    expect(result.balance).toBe("NO SOURCE");
    expect(result.alerts).toBeNull();
  });
  it("formats decimal money without converting it to a floating-point number", () => {
    expect(formatBaht("1234567890123.40")).toBe("฿1,234,567,890,123.40");
    expect(formatBaht(null)).toBe("NO SOURCE");
    expect(formatBaht("invalid")).toBe("NO SOURCE");
  });
  it("reports errors and stale data without showing EMPIRE LIVE", () => {
    expect(getSyncState(false, true, 1000, 10000)).toBe("live");
    expect(getSyncState(false, true, 1000, 17001)).toBe("stale");
    expect(getSyncState(true, true, 1000, 10000)).toBe("error");
    expect(getSyncState(false, false, 0, 10000)).toBe("loading");
  });
});
