import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { ReactNode } from "react";

type Destination = "accounts" | "payment" | "virtual-card" | "transactions" | "agents" | "documents";
const modules: { id: Destination; title: string; x: number; y: number; color: string; shape: string }[] = [
  { id: "accounts", title: "VAULT", x: 21, y: 28, color: "#E5C04A", shape: "M-24 14L-24-9L0-29L24-9L24 14Z" },
  { id: "payment", title: "PAYMENTS", x: 50, y: 16, color: "#00F0FF", shape: "M-25 14L-25-14L25-14L25 14Z" },
  { id: "virtual-card", title: "CARD", x: 79, y: 29, color: "#E5C04A", shape: "M-27-16H27V16H-27Z" },
  { id: "transactions", title: "TRANSACTIONS", x: 20, y: 77, color: "#00F0FF", shape: "M-22 13L-22-20L0-29L22-20L22 13Z" },
  { id: "agents", title: "AGENTS", x: 50, y: 67, color: "#7657FF", shape: "M-23 14L-17-25H17L23 14Z" },
  { id: "documents", title: "DOCUMENTS", x: 79, y: 77, color: "#19F59A", shape: "M-22-25H12L22-15V18H-22Z" },
];

export function TwinConsole({ navigate }: { navigate: (page: Destination) => void }) {
  const q = trpc.dashboard.twinSummary.useQuery(undefined, { refetchInterval: 8000, retry: 1 });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const stale = q.isError || !q.data || (q.dataUpdatedAt > 0 && now - q.dataUpdatedAt > 16000);
  const age = q.dataUpdatedAt ? Math.max(0, Math.floor((now - q.dataUpdatedAt) / 1000)) : null;
  const summary = q.data;
  const metrics: Record<Destination, string> = {
    accounts: summary ? String(summary.accountCount) + " บัญชี" : "NO SOURCE",
    payment: summary ? String(summary.pendingPayments) + " รายการค้าง" : "NO SOURCE",
    "virtual-card": "NO SOURCE",
    transactions: summary ? "฿" + Number(summary.monthVolume).toLocaleString("th-TH") : "NO SOURCE",
    agents: summary ? String(summary.activeAgents) + " ใช้งาน" : "NO SOURCE",
    documents: summary ? String(summary.unmatchedSlips) + " ยังไม่จับคู่" : "NO SOURCE",
  };
  const attention: Partial<Record<Destination, number>> = summary ? { payment: summary.pendingPayments, documents: summary.unmatchedSlips } : {};
  return (
    <section className="twin-console" aria-label="CE Empire Digital Twin">
      <div className="twin-livebar" role="status" aria-live="polite">
        <span className={stale ? "twin-led twin-led-stale" : "twin-led"} />
        <strong>{stale ? (q.isError ? "SYNC ERROR" : "SYNC STALE") : "EMPIRE LIVE"}</strong>
        <span>{age === null ? "SYNC —" : "SYNC " + age + "s"}</span>
        {summary && <span>ALERTS {summary.pendingPayments + summary.unmatchedSlips}</span>}
      </div>
      <div className="twin-scene">
        <svg className="twin-map" viewBox="0 0 1000 590" preserveAspectRatio="none" aria-hidden="true">
          <defs><radialGradient id="twin-sea"><stop stopColor="#00F0FF" stopOpacity=".20"/><stop offset="1" stopColor="#05050A" stopOpacity="0"/></radialGradient></defs>
          <ellipse cx="500" cy="380" rx="540" ry="295" fill="url(#twin-sea)"/>
          <path d="M210 165L500 95L790 171L790 454L500 395L210 454Z M210 165L210 454 M500 95L500 395" fill="none" stroke="#00F0FF" strokeOpacity=".3" strokeWidth="2" strokeDasharray="8 13" className="twin-route"/>
        </svg>
        {modules.map((m, i) => (
          <button key={m.id} className="twin-island" style={{ left: m.x + "%", top: m.y + "%", animationDelay: i * -1.1 + "s", ["--island-color" as string]: m.color }} onClick={() => navigate(m.id)} aria-label={m.title + ": " + metrics[m.id]}>
            <svg viewBox="-42 -49 84 83" aria-hidden="true"><ellipse cy="21" rx="37" ry="13" fill={m.color} opacity=".14"/><path d="M-34 17L0 34L34 17L0 2Z" fill="#101118" stroke={m.color} strokeWidth="1.3"/><path d={m.shape} fill="#1A2235" stroke={m.color} strokeWidth="1.8"/><path d="M-31 17L0 30L31 17" fill="none" stroke={m.color} opacity=".6"/></svg>
            <strong className="twin-heading">{m.title}</strong>
            <span className="twin-number">{metrics[m.id]}</span>
            <small>{stale ? "UNKNOWN" : attention[m.id] ? "ATTENTION " + attention[m.id] : metrics[m.id] === "NO SOURCE" ? "NO SOURCE" : "ACTIVE"}</small>
          </button>
        ))}
      </div>
      <div className="twin-mobile-list">{modules.map(m => <button key={m.id} onClick={() => navigate(m.id)}><strong>{m.title}</strong><span>{metrics[m.id]}</span></button>)}</div>
      <p className="twin-source-note">VAULT = จำนวนบัญชี • PAYMENTS = pending expenses • TRANSACTIONS = ผลรวมรายการเดือน UTC ปัจจุบัน • AGENTS = active • DOCUMENTS = สลิปไม่มี expenseId • CARD = ยังไม่มีแหล่งข้อมูล</p>
    </section>
  );
}
