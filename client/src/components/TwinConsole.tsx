import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { deriveTwinMetrics, formatBaht, getSyncState } from "@/lib/twinMetrics";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type Destination = "accounts" | "payment" | "virtual-card" | "transactions" | "agents" | "documents";
type TwinActions = {
  navigate: (page: Destination) => void;
  onAddAccount: () => void;
  onAddExpense: () => void;
  onScanCard: () => void;
  onUploadSlip: () => void;
};
const modules: { id: Destination; title: string; x: number; y: number; color: string; shape: string }[] = [
  { id: "accounts", title: "VAULT", x: 21, y: 28, color: "#E5C04A", shape: "M-24 14L-24-9L0-29L24-9L24 14Z" },
  { id: "payment", title: "PAYMENTS", x: 50, y: 16, color: "#00F0FF", shape: "M-25 14L-25-14L25-14L25 14Z" },
  { id: "virtual-card", title: "CARD", x: 79, y: 29, color: "#E5C04A", shape: "M-27-16H27V16H-27Z" },
  { id: "transactions", title: "TRANSACTIONS", x: 20, y: 77, color: "#00F0FF", shape: "M-22 13L-22-20L0-29L22-20L22 13Z" },
  { id: "agents", title: "AGENTS", x: 50, y: 67, color: "#7657FF", shape: "M-23 14L-17-25H17L23 14Z" },
  { id: "documents", title: "DOCUMENTS", x: 79, y: 77, color: "#19F59A", shape: "M-22-25H12L22-15V18H-22Z" },
];
const derivation = [
  "BALANCE = SUM(accounts.balance)",
  "CASH IN = NO SOURCE (ไม่มีรายรับแยกใน schema)",
  "CASH OUT = SUM(paid expenses.createdAt in UTC month)",
  "ALERTS = pending expenses + slips without expenseId",
];

export function TwinConsole({ navigate, onAddAccount, onAddExpense, onScanCard, onUploadSlip }: TwinActions) {
  const summaryQ = trpc.dashboard.twinSummary.useQuery(undefined, { refetchInterval: 8000, retry: 1 });
  const activityQ = trpc.expenses.list.useQuery(undefined, { refetchInterval: 8000, retry: 1 });
  const [now, setNow] = useState(() => Date.now());
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  useEffect(() => {
    const openByHotkey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", openByHotkey);
    return () => window.removeEventListener("keydown", openByHotkey);
  }, []);

  const syncState = getSyncState(summaryQ.isError, !!summaryQ.data, summaryQ.dataUpdatedAt, now);
  const age = summaryQ.dataUpdatedAt ? Math.max(0, Math.floor((now - summaryQ.dataUpdatedAt) / 1000)) : null;
  const metrics = deriveTwinMetrics(summaryQ.data ?? null);
  const metricByPage: Record<Destination, string> = {
    accounts: metrics.vault,
    payment: metrics.payments,
    "virtual-card": metrics.card,
    transactions: metrics.transactions,
    agents: metrics.agents,
    documents: metrics.documents,
  };
  const attention: Partial<Record<Destination, number>> = summaryQ.data ? {
    payment: summaryQ.data.pendingPayments,
    documents: summaryQ.data.unmatchedSlips,
  } : {};
  const commands = [
    { title: "เพิ่มบัญชี", action: onAddAccount },
    { title: "เพิ่มรายจ่าย", action: onAddExpense },
    { title: "สแกนบัตรในฟอร์มบัญชี", action: onScanCard },
    { title: "อัปโหลดสลิปในฟอร์มรายจ่าย", action: onUploadSlip },
  ];
  const run = (action: () => void) => { setCommandOpen(false); action(); };
  const ringValues = [metrics.balance, metrics.cashIn, metrics.cashOut, metrics.alerts === null ? "NO SOURCE" : String(metrics.alerts)];
  const ringNames = ["BALANCE", "CASH IN", "CASH OUT", "ALERTS"];

  return (
    <section className="twin-console" aria-label="CE Empire Digital Twin">
      <div className="twin-livebar" role="status" aria-live="polite">
        <span className={syncState === "live" ? "twin-led" : "twin-led twin-led-stale"} />
        <strong>{syncState === "live" ? "EMPIRE LIVE" : syncState === "error" ? "SYNC ERROR" : syncState === "stale" ? "SYNC STALE" : "CONNECTING"}</strong>
        <span>{age === null ? "SYNC —" : "SYNC " + age + "s"}</span>
        <span>{metrics.alerts === null ? "ALERTS NO SOURCE" : "ALERTS " + metrics.alerts}</span>
      </div>
      <div className="twin-scene">
        <svg className="twin-map" viewBox="0 0 1000 590" preserveAspectRatio="none" aria-hidden="true">
          <defs><radialGradient id="twin-sea"><stop stopColor="#00F0FF" stopOpacity=".20"/><stop offset="1" stopColor="#05050A" stopOpacity="0"/></radialGradient></defs>
          <ellipse cx="500" cy="380" rx="540" ry="295" fill="url(#twin-sea)"/>
          <path d="M210 165L500 95L790 171L790 454L500 395L210 454Z M210 165L210 454 M500 95L500 395" fill="none" stroke="#00F0FF" strokeOpacity=".3" strokeWidth="2" strokeDasharray="8 13" className="twin-route"/>
        </svg>
        {modules.map((m, i) => (
          <button key={m.id} className="twin-island" style={{ left: m.x + "%", top: m.y + "%", animationDelay: i * -1.1 + "s", ["--island-color" as string]: m.color } as React.CSSProperties} onClick={() => navigate(m.id)} aria-label={m.title + ": " + metricByPage[m.id]}>
            <svg viewBox="-42 -49 84 83" aria-hidden="true"><ellipse cy="21" rx="37" ry="13" fill={m.color} opacity=".14"/><path d="M-34 17L0 34L34 17L0 2Z" fill="#101118" stroke={m.color} strokeWidth="1.3"/><path d={m.shape} fill="#1A2235" stroke={m.color} strokeWidth="1.8"/><path d="M-31 17L0 30L31 17" fill="none" stroke={m.color} opacity=".6"/></svg>
            <strong className="twin-heading">{m.title}</strong>
            <span className="twin-number">{metricByPage[m.id]}</span>
            <small>{syncState !== "live" ? "UNKNOWN" : attention[m.id] ? "ATTENTION " + attention[m.id] : metricByPage[m.id] === "NO SOURCE" ? "NO SOURCE" : "ACTIVE"}</small>
          </button>
        ))}
      </div>
      <div className="twin-mobile-list">{modules.map(m => <button key={m.id} onClick={() => navigate(m.id)}><strong>{m.title}</strong><span>{metricByPage[m.id]}</span></button>)}</div>
      <p className="twin-source-note">VAULT = COUNT(accounts) • PAYMENTS = pending expenses • TRANSACTIONS = SUM(expenses.amount) เดือน UTC • AGENTS = active • DOCUMENTS = สลิปไม่มี expenseId • CARD = ยังไม่มีแหล่งข้อมูล</p>

      <div className="twin-ring-grid" aria-label="กฎที่มาของตัวเลขการเงิน">
        {ringNames.map((name, i) => (
          <div className="twin-ring-item" key={name}>
            <div className="twin-ring" aria-label={name + ": " + ringValues[i]}><span className="twin-number">{ringValues[i]}</span></div>
            <strong className="twin-heading">{name}</strong>
            <small>{derivation[i]}</small>
          </div>
        ))}
      </div>

      <div className="twin-commandbar" aria-label="ทางลัด">
        {commands.map(cmd => <button type="button" key={cmd.title} onClick={() => run(cmd.action)}>{cmd.title}</button>)}
        <button type="button" onClick={() => setCommandOpen(true)} aria-label="เปิดคำสั่งด่วน">⌘K คำสั่ง</button>
      </div>

      {commandOpen && <div className="twin-command-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCommandOpen(false); }}>
        <div role="dialog" aria-modal="true" aria-label="คำสั่งด่วน CE Empire" className="twin-command-dialog">
          <Command><CommandInput placeholder="ค้นหาคำสั่ง..." autoFocus /><CommandList><CommandEmpty>ไม่พบคำสั่ง</CommandEmpty><CommandGroup heading="ทางลัด">{commands.map(cmd => <CommandItem key={cmd.title} onSelect={() => run(cmd.action)}>{cmd.title}</CommandItem>)}</CommandGroup></CommandList></Command>
          <button type="button" onClick={() => setCommandOpen(false)}>ปิดคำสั่ง</button>
        </div>
      </div>}

      <div className="twin-activity">
        <div className="twin-activity-head"><h2>LIVE ACTIVITY</h2><span>แหล่งข้อมูล: expenses.list • อัปเดตทุก 8 วินาที</span></div>
        {activityQ.isError ? <p role="alert">โหลดกิจกรรมไม่สำเร็จ — ไม่แสดงข้อมูลจำลอง</p>
          : activityQ.isLoading ? <p>กำลังโหลดกิจกรรม...</p>
          : !activityQ.data?.length ? <p>ยังไม่มีกิจกรรมรายจ่ายในระบบ</p>
          : <ol>{activityQ.data.slice(0, 6).map(expense => <li key={expense.id}>
            <div><strong>{expense.description || (expense.type === "due" ? "รายการค้างจ่าย" : "รายการเบิก")}</strong><small>{new Date(expense.createdAt).toLocaleString("th-TH")} · {expense.status === "paid" ? "จ่ายแล้ว" : expense.status === "cancelled" ? "ยกเลิก" : "รอดำเนินการ"}</small></div>
            <span className="twin-number">{formatBaht(expense.amount)}</span>
          </li>)}</ol>}
      </div>
    </section>
  );
}
