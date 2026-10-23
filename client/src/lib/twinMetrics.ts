/** Money and status presentation rules shared by the Digital Twin UI. */
export type TwinSummary = {
  accountCount: number;
  balance: string;
  activeAgents: number;
  pendingPayments: number;
  monthOut: string;
  monthVolume: string;
  unmatchedSlips: number;
  monthIn: string | null;
  cardUsage: number | null;
  asOf: string;
};

export function formatBaht(value: string | null | undefined): string {
  if (value == null || !/^-?\d+(?:\.\d{1,2})?$/.test(value)) return "NO SOURCE";
  const negative = value.startsWith("-");
  const [whole, fractional = ""] = (negative ? value.slice(1) : value).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (negative ? "−" : "") + "฿" + grouped + "." + fractional.padEnd(2, "0");
}

export function getSyncState(
  hasError: boolean,
  hasData: boolean,
  updatedAt: number,
  now: number,
): "live" | "stale" | "error" | "loading" {
  if (hasError) return "error";
  if (!hasData || updatedAt === 0) return "loading";
  return now - updatedAt > 16000 ? "stale" : "live";
}

export function deriveTwinMetrics(data: TwinSummary | null) {
  if (!data) {
    return {
      vault: "NO SOURCE", payments: "NO SOURCE", card: "NO SOURCE",
      transactions: "NO SOURCE", agents: "NO SOURCE", documents: "NO SOURCE",
      balance: "NO SOURCE", cashIn: "NO SOURCE", cashOut: "NO SOURCE", alerts: null,
    };
  }
  return {
    vault: data.accountCount + " บัญชี",
    payments: data.pendingPayments + " ค้าง",
    card: data.cardUsage === null ? "NO SOURCE" : data.cardUsage.toLocaleString("th-TH") + "%",
    transactions: formatBaht(data.monthVolume),
    agents: data.activeAgents + " ใช้งาน",
    documents: data.unmatchedSlips + " ไม่จับคู่",
    balance: formatBaht(data.balance),
    cashIn: formatBaht(data.monthIn),
    cashOut: formatBaht(data.monthOut),
    alerts: data.pendingPayments + data.unmatchedSlips,
  };
}
