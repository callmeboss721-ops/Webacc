<<<<<<< Updated upstream
(paste of updated CEEmpire.tsx)
=======
import React, { useState, useCallback, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BankLogo, BankSelect } from "@/components/BankLogo";
import { getBankByCode, THAI_BANKS } from "../../../shared/bankData";
import {
  Home, BarChart2, CreditCard, ArrowLeftRight, FileText,
  Bell, User, Plus, Search, Filter, Download, Copy,
  Edit, Trash2, RefreshCw, Settings, Shield, Eye, EyeOff,
  CheckCircle, Clock, XCircle, Star, Upload, X, ChevronDown,
  ChevronUp, Wallet, TrendingUp, TrendingDown, Users, Zap,
  Building2, Receipt, AlertCircle, MoreVertical, QrCode,
  Camera, Sparkles, Loader2,
} from "lucide-react";

// ===== TYPES =====
type Page = "dashboard" | "accounts" | "payment" | "agents" | "documents" | "settings";

// ===== ANIMATED METRIC CARD (KPI) =====
function AnimatedMetricCard({ label, value, icon: Icon, color }: any) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const numValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) || 0 : value;

  React.useEffect(() => {
    if (typeof numValue !== 'number') return;
    let current = 0;
    const target = numValue;
    const step = Math.max(1, Math.ceil(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(interval);
      } else {
        setDisplayValue(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [numValue]);

  const colors: any = {
    cyan: { text: "#38F1FF", glow: "rgba(56,241,255,.35)" },
    gold: { text: "#FFD66B", glow: "rgba(255,215,106,.35)" },
    green: { text: "#2EF2B1", glow: "rgba(46,242,177,.35)" },
    violet: { text: "#8B5CFF", glow: "rgba(139,92,255,.35)" },
  };
  const c = colors[color] || colors.cyan;

  return (
    <div style={{
      borderRadius: 16, padding: 14, background: "linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.02)), radial-gradient(circle at 50% 0%, rgba(56,241,255,.12), transparent 60%)",
      border: `1px solid ${c.glow}`,
      boxShadow: `0 0 20px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.08)`,
      transition: "all .3s ease",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.12)`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.08)`; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center", background: `${c.text}15`, border: `1px solid ${c.text}30`, boxShadow: `0 0 12px ${c.text}20` }}>
          <Icon size={16} color={c.text} />
        </div>
        <div style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 700 }}>{label}</div>
      </div>
      <div style={{
        fontSize: 24, fontWeight: 900, color: c.text,
        textShadow: `0 0 20px ${c.text}40`,
        fontFamily: "'Orbitron', monospace",
        letterSpacing: "-.02em",
        animation: "glow-pulse 2s ease-in-out infinite",
      }}>
        {typeof value === 'string' ? value.replace(/\d+/, displayValue.toLocaleString()) : displayValue.toLocaleString()}
      </div>
    </div>
  );
}

// ===== NEON ICON BUTTON =====
function NeonBtn({ icon: Icon, onClick, color = "cyan", title = "", size = 16 }: {
  icon: React.ElementType; onClick?: () => void; color?: "cyan" | "gold" | "violet" | "green" | "red";
  title?: string; size?: number;
}) {
  const colors = {
    cyan: { border: "rgba(56,241,255,.28)", bg: "rgba(56,241,255,.12)", text: "#38F1FF", glow: "rgba(56,241,255,.22)" },
    gold: { border: "rgba(255,215,106,.28)", bg: "rgba(255,215,106,.12)", text: "#FFD66B", glow: "rgba(255,215,106,.22)" },
    violet: { border: "rgba(139,92,255,.28)", bg: "rgba(139,92,255,.12)", text: "#8B5CFF", glow: "rgba(139,92,255,.22)" },
    green: { border: "rgba(46,242,177,.28)", bg: "rgba(46,242,177,.12)", text: "#2EF2B1", glow: "rgba(46,242,177,.22)" },
    red: { border: "rgba(255,79,109,.28)", bg: "rgba(255,79,109,.12)", text: "#FF4F6D", glow: "rgba(255,79,109,.22)" },
  };
  const c = colors[color];
  return (
    <button
      onClick={onClick} title={title}
      style={{
        width: 34, height: 34, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        boxShadow: `0 0 14px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.10)`,
        cursor: "pointer", transition: "all .18s ease", flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 22px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.16)`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${c.glow}, inset 0 1px 0 rgba(255,255,255,.10)`; }}
    >
      <Icon size={size} />
    </button>
  );
}

// ===== GLASS CARD =====
function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`glass rounded-3xl p-4 ${className}`} style={style}>
      {children}
    </div>
  );
}

// ===== METRIC CARD =====
function MetricCard({ label, value, icon: Icon, color = "cyan", trend }: {
  label: string; value: string | number; icon: React.ElementType; color?: string; trend?: number;
}) {
  const colors: Record<string, { text: string; glow: string; bg: string }> = {
    cyan: { text: "#38F1FF", glow: "rgba(56,241,255,.18)", bg: "rgba(56,241,255,.08)" },
    gold: { text: "#FFD66B", glow: "rgba(255,215,106,.18)", bg: "rgba(255,215,106,.08)" },
    violet: { text: "#8B5CFF", glow: "rgba(139,92,255,.18)", bg: "rgba(139,92,255,.08)" },
    green: { text: "#2EF2B1", glow: "rgba(46,242,177,.18)", bg: "rgba(46,242,177,.08)" },
  };
  const c = colors[color] ?? colors.cyan;
  return (
    <div style={{
      borderRadius: 22, padding: 14, position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, rgba(255,255,255,.085), rgba(255,255,255,.025)), rgba(5,8,22,.42)`,
      border: "1px solid rgba(122,181,255,.18)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,.10), 0 12px 38px rgba(0,0,0,.22), 0 0 28px ${c.glow}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, color: "#AAB9D3", fontWeight: 800 }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", background: c.bg, border: `1px solid ${c.text}30` }}>
          <Icon size={16} color={c.text} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 1000, marginTop: 6, letterSpacing: "-.045em", color: c.text, textShadow: `0 0 20px ${c.glow}` }}>
        {value}
      </div>
      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: trend >= 0 ? "#2EF2B1" : "#FF4F6D" }}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}

// ===== COPY BUTTON =====
function CopyBtn({ text, label = "" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`คัดลอก${label ? ` ${label}` : ""}แล้ว`, { duration: 1800 });
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={copy} title={`คัดลอก ${label}`}
      style={{
        width: 32, height: 32, borderRadius: 11, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: copied ? "rgba(46,242,177,.18)" : "rgba(56,241,255,.10)",
        border: `1px solid ${copied ? "rgba(46,242,177,.40)" : "rgba(56,241,255,.28)"}`,
        color: copied ? "#2EF2B1" : "#38F1FF", cursor: "pointer", transition: "all .18s ease", flexShrink: 0,
      }}>
      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ===== STATUS BADGE =====
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "จ่ายแล้ว", cls: "badge-paid" },
    pending: { label: "รอดำเนินการ", cls: "badge-pending" },
    cancelled: { label: "ยกเลิก", cls: "badge-due" },
    active: { label: "ใช้งาน", cls: "badge-paid" },
    inactive: { label: "ปิดใช้", cls: "badge-due" },
  };
  const s = map[status] ?? { label: status, cls: "badge-pending" };
  return <span className={s.cls}>{s.label}</span>;
}

// ===== ACCOUNT FORM MODAL =====
// Cycling status text for AI scan animation
function ScanStatusText() {
  const messages = [
    "กำลังอัพโหลด...",
    "วิเคราะห์รูปภาพ...",
    "ตรวจจับโลโก้ธนาคาร...",
    "อ่านตัวอักษร (OCR)...",
    "สกัดข้อมูลบัญชี...",
    "AI กำลังประมวลผล...",
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 900);
    return () => clearInterval(t);
  }, []);
  return <span>{messages[idx]}</span>;
}

function AccountFormModal({ open, onClose, editData, onSuccess }: {
  open: boolean; onClose: () => void; editData?: any; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: editData?.name ?? "",
    bankCode: editData?.bankCode ?? "",
    bankName: editData?.bankName ?? "",
    accountNumber: editData?.accountNumber ?? "",
    accountType: editData?.accountType ?? "savings",
    pin: editData?.pin ?? "",
    phone: editData?.phone ?? "",
    lineId: editData?.lineId ?? "",
    promptpay: editData?.promptpay ?? "",
    balance: editData?.balance ?? "0",
    amountDue: editData?.amountDue ?? "0",
    amountPaid: editData?.amountPaid ?? "0",
    note: editData?.note ?? "",
  });

  React.useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? "",
        bankCode: editData.bankCode ?? "",
        bankName: editData.bankName ?? "",
        accountNumber: editData.accountNumber ?? "",
        accountType: editData.accountType ?? "savings",
        pin: editData.pin ?? "",
        phone: editData.phone ?? "",
        lineId: editData.lineId ?? "",
        promptpay: editData.promptpay ?? "",
        balance: editData.balance ?? "0",
        amountDue: editData.amountDue ?? "0",
        amountPaid: editData.amountPaid ?? "0",
        note: editData.note ?? "",
      });
    } else {
      setForm({ name: "", bankCode: "", bankName: "", accountNumber: "", accountType: "savings", pin: "", phone: "", lineId: "", promptpay: "", balance: "0", amountDue: "0", amountPaid: "0", note: "" });
    }
  }, [editData, open]);

  const createMut = trpc.accounts.create.useMutation({ onSuccess: () => { toast.success("เพิ่มบัญชีสำเร็จ"); onSuccess(); onClose(); } });
  const updateMut = trpc.accounts.update.useMutation({ onSuccess: () => { toast.success("อัพเดตบัญชีสำเร็จ"); onSuccess(); onClose(); } });

  // ===== AI CARD SCANNER =====
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const scanMut = trpc.ai.scanCard.useMutation();

  const handleScanCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("ไฟล์ใหญ่เกิน 8MB"); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.loading("AI กำลังอ่านบัตร...", { id: "scan" });
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        const res = await scanMut.mutateAsync({ base64Data, mimeType: file.type || "image/jpeg" });
        if (res.success && res.data) {
          const d: any = res.data;
          setForm((p: any) => ({
            ...p,
            name: d.name || p.name,
            bankCode: d.bankCode || p.bankCode,
            bankName: d.bankName || p.bankName,
            accountNumber: d.accountNumber ? String(d.accountNumber).replace(/[^0-9]/g, "") : p.accountNumber,
          }));
          const conf = Math.round((d.confidence || 0) * 100);
          toast.success(`✨ อ่านบัตรสำเร็จ (มั่นใจ ${conf}%)`, { id: "scan" });
        } else {
          toast.error((res as any).error || "อ่านบัตรไม่สำเร็จ", { id: "scan" });
        }
      } catch (err: any) {
        toast.error(err?.message || "สแกนล้มเหลว", { id: "scan" });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.bankCode || !form.accountNumber) { toast.error("กรุณากรอกข้อมูลที่จำเป็น"); return; }
    if (editData) updateMut.mutate({ id: editData.id, ...form });
    else createMut.mutate(form);
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 16, fontSize: 13, fontWeight: 600,
    background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)",
    border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none",
  };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#9FB2CE", fontWeight: 800, marginBottom: 5, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.72)", backdropFilter: "blur(12px)" }}>
      <div style={{
        width: "min(640px, calc(100% - 20px))", maxHeight: "92vh", borderRadius: 28,
        background: "radial-gradient(circle at 18% 0%, rgba(56,241,255,.12), transparent 36%), linear-gradient(145deg, rgba(8,19,42,.98), rgba(2,7,18,.98))",
        border: "1px solid rgba(56,241,255,.32)", boxShadow: "0 28px 80px rgba(0,0,0,.60), 0 0 48px rgba(56,241,255,.10)",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(122,181,255,.16)", background: "rgba(5,8,22,.34)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(56,241,255,.22), rgba(37,99,255,.16))", border: "1px solid rgba(56,241,255,.34)" }}>
              <Building2 size={16} color="#38F1FF" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15 }}>{editData ? "แก้ไขบัญชี" : "เพิ่มบัญชีใหม่"}</div>
              <div style={{ fontSize: 11, color: "#9FB2CE" }}>กรอกข้อมูลบัญชีธนาคาร</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,79,109,.12)", border: "1px solid rgba(255,79,109,.28)", color: "#FF4F6D", cursor: "pointer" }}>
            <X size={14} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 16, overflowY: "auto", flex: 1 }}>
          {/* AI Scan Card Banner */}
          <div style={{
            marginBottom: 14, padding: 12, borderRadius: 18,
            background: "linear-gradient(135deg, rgba(139,92,255,.18), rgba(56,241,255,.10) 60%, rgba(255,215,106,.10))",
            border: "1px solid rgba(139,92,255,.38)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: "linear-gradient(135deg, #8B5CFF, #38F1FF)", boxShadow: "0 0 18px rgba(139,92,255,.5)", flexShrink: 0 }}>
                {scanMut.isPending ? <Loader2 size={20} color="white" className="animate-spin" /> : <Sparkles size={20} color="white" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 12.5, color: "#F8FCFF", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  AI กรอกข้อมูลอัตโนมัติ
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, background: "linear-gradient(90deg, #FFD66B, #FFA73A)", color: "#1A0F00", fontWeight: 900 }}>NEW</span>
                </div>
                <div style={{ fontSize: 10.5, color: "#9FB2CE", marginTop: 2 }}>ถ่ายรูปบัตร/สมุดบัญชี → กรอกให้ทันที</div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScanCard} style={{ display: "none" }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={scanMut.isPending} style={{
                padding: "10px 12px", borderRadius: 12, fontWeight: 900, fontSize: 11.5,
                background: scanMut.isPending ? "rgba(139,92,255,.3)" : "linear-gradient(135deg, #8B5CFF, #38F1FF)",
                color: "white", border: "none", cursor: scanMut.isPending ? "wait" : "pointer",
                display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                boxShadow: scanMut.isPending ? "none" : "0 4px 14px rgba(139,92,255,.4)", flexShrink: 0,
              }}>
                {scanMut.isPending ? <><Loader2 size={13} className="animate-spin" /> สแกน</> : <><Camera size={13} /> สแกน</>}
              </button>
            </div>
            {previewUrl && (
              <div className="animate-fade-up" style={{ marginTop: 12 }}>
                <div style={{
                  position: "relative", borderRadius: 14, overflow: "hidden",
                  border: scanMut.isPending ? "1.5px solid rgba(56,241,255,.55)" : "1px solid rgba(46,242,177,.45)",
                  boxShadow: scanMut.isPending
                    ? "0 0 24px rgba(56,241,255,.45), inset 0 0 18px rgba(56,241,255,.18)"
                    : "0 0 14px rgba(46,242,177,.28)",
                  background: "#020812",
                  aspectRatio: "16 / 9", maxHeight: 180,
                  transition: "box-shadow .25s, border-color .25s",
                }}>
                  <img src={previewUrl} alt="card preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block",
                      filter: scanMut.isPending ? "brightness(.65) contrast(1.1)" : "none",
                      transition: "filter .3s" }} />

                  {scanMut.isPending && (
                    <>
                      {/* Grid overlay */}
                      <div className="scan-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
                      {/* Scan line - top to bottom */}
                      <div className="scan-line" style={{ position: "absolute", left: 0, right: 0, height: 3, pointerEvents: "none" }} />
                      {/* Corner brackets */}
                      <div className="scan-corner scan-corner-tl" />
                      <div className="scan-corner scan-corner-tr" />
                      <div className="scan-corner scan-corner-bl" />
                      <div className="scan-corner scan-corner-br" />
                      {/* Status badge */}
                      <div style={{
                        position: "absolute", left: 10, bottom: 10, right: 10,
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 10px", borderRadius: 10,
                        background: "rgba(2,8,21,.78)",
                        border: "1px solid rgba(56,241,255,.4)",
                        backdropFilter: "blur(8px)",
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38F1FF", boxShadow: "0 0 10px #38F1FF", animation: "glow-pulse 1s ease-in-out infinite" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10.5, fontWeight: 900, color: "#38F1FF", letterSpacing: ".06em", fontFamily: "'Orbitron', sans-serif" }}>
                            <ScanStatusText />
                          </div>
                        </div>
                        <Loader2 size={13} color="#38F1FF" className="animate-spin" />
                      </div>
                    </>
                  )}

                  {!scanMut.isPending && (
                    <div style={{
                      position: "absolute", right: 8, top: 8,
                      padding: "4px 8px", borderRadius: 8,
                      background: "rgba(46,242,177,.18)",
                      border: "1px solid rgba(46,242,177,.5)",
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 10.5, color: "#2EF2B1", fontWeight: 900,
                    }}>
                      <CheckCircle size={11} /> สำเร็จ
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>ชื่อบัญชี / ชื่อเจ้าของ *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="ชื่อ-นามสกุล หรือชื่อบัญชี" required />
            </div>
            <div>
              <label style={labelStyle}>ธนาคาร *</label>
              <BankSelect
                value={form.bankCode}
                onChange={(code, name) => setForm(p => ({ ...p, bankCode: code, bankName: name }))}
              />
            </div>
            <div>
              <label style={labelStyle}>ประเภทบัญชี</label>
              <select style={inputStyle} value={form.accountType} onChange={e => setForm(p => ({ ...p, accountType: e.target.value }))}>
                <option value="savings">ออมทรัพย์</option>
                <option value="current">กระแสรายวัน</option>
                <option value="fixed">ฝากประจำ</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>เลขบัญชี *</label>
              <input style={inputStyle} value={form.accountNumber} onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))} placeholder="xxx-x-xxxxx-x" required />
            </div>
            <div>
              <label style={labelStyle}>PIN / รหัสผ่าน</label>
              <input style={inputStyle} type="text" value={form.pin} onChange={e => setForm(p => ({ ...p, pin: e.target.value }))} placeholder="รหัส PIN" />
            </div>
            <div>
              <label style={labelStyle}>เบอร์โทร</label>
              <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0xx-xxx-xxxx" />
            </div>
            <div>
              <label style={labelStyle}>LINE ID</label>
              <input style={inputStyle} value={form.lineId} onChange={e => setForm(p => ({ ...p, lineId: e.target.value }))} placeholder="@lineid" />
            </div>
            <div>
              <label style={labelStyle}>พร้อมเพย์</label>
              <input style={inputStyle} value={form.promptpay} onChange={e => setForm(p => ({ ...p, promptpay: e.target.value }))} placeholder="เบอร์/เลขบัตร" />
            </div>
            <div>
              <label style={labelStyle}>ยอดค้างจ่าย (฿)</label>
              <input style={inputStyle} type="number" value={form.amountDue} onChange={e => setForm(p => ({ ...p, amountDue: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label style={labelStyle}>ยอดจ่ายแล้ว (฿)</label>
              <input style={inputStyle} type="number" value={form.amountPaid} onChange={e => setForm(p => ({ ...p, amountPaid: e.target.value }))} placeholder="0.00" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>หมายเหตุ</label>
              <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="หมายเหตุเพิ่มเติม" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{ padding: "12px", borderRadius: 16, background: "rgba(255,255,255,.06)", border: "1px solid rgba(122,181,255,.18)", color: "#F8FCFF", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>ยกเลิก</button>
            <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary" style={{ padding: "12px", borderRadius: 16, cursor: "pointer", fontWeight: 900, fontSize: 13 }}>
              {(createMut.isPending || updateMut.isPending) ? "กำลังบันทึก..." : editData ? "บันทึกการแก้ไข" : "เพิ่มบัญชี"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== EXPENSE FORM MODAL =====
function ExpenseFormModal({ open, onClose, agents, onSuccess }: {
  open: boolean; onClose: () => void; agents: any[]; onSuccess: () => void;
}) {
  const [form, setForm] = useState({ agentId: "", type: "due" as "due" | "reimbursed", amount: "", description: "", category: "", note: "" });
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const createMut = trpc.expenses.create.useMutation({ onSuccess: () => { toast.success("เพิ่มรายการสำเร็จ"); onSuccess(); onClose(); } });
  const uploadMut = trpc.slips.upload.useMutation();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error("ไฟล์ใหญ่เกิน 10MB"); return; }
    setSlipFile(f);
    const reader = new FileReader();
    reader.onload = ev => setSlipPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error("กรุณากรอกจำนวนเงิน"); return; }
    let slipUrl: string | undefined;
    let slipKey: string | undefined;
    if (slipFile) {
      const reader = new FileReader();
      const base64 = await new Promise<string>(res => { reader.onload = e => res((e.target?.result as string).split(",")[1]!); reader.readAsDataURL(slipFile); });
      const result = await uploadMut.mutateAsync({ fileName: slipFile.name, mimeType: slipFile.type, base64Data: base64 });
      slipUrl = result.url; slipKey = result.key;
    }
    createMut.mutate({ agentId: form.agentId ? parseInt(form.agentId) : undefined, type: form.type, amount: form.amount, description: form.description, category: form.category, note: form.note, slipUrl, slipKey });
  };

  if (!open) return null;
  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 16, fontSize: 13, fontWeight: 600, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)", border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#9FB2CE", fontWeight: 800, marginBottom: 5, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.72)", backdropFilter: "blur(12px)" }}>
      <div style={{ width: "min(560px, calc(100% - 20px))", maxHeight: "92vh", borderRadius: 28, background: "radial-gradient(circle at 18% 0%, rgba(56,241,255,.12), transparent 36%), linear-gradient(145deg, rgba(8,19,42,.98), rgba(2,7,18,.98))", border: "1px solid rgba(56,241,255,.32)", boxShadow: "0 28px 80px rgba(0,0,0,.60)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(122,181,255,.16)", background: "rgba(5,8,22,.34)" }}>
          <div style={{ fontWeight: 900, fontSize: 15 }}>เพิ่มรายการค่าใช้จ่าย</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,79,109,.12)", border: "1px solid rgba(255,79,109,.28)", color: "#FF4F6D", cursor: "pointer" }}><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 16, overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={labelStyle}>ประเภท</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(["due", "reimbursed"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))} style={{ padding: "10px", borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all .18s", border: form.type === t ? "1px solid rgba(56,241,255,.56)" : "1px solid rgba(122,181,255,.18)", background: form.type === t ? "linear-gradient(135deg, rgba(56,241,255,.22), rgba(37,99,255,.16))" : "rgba(5,8,22,.42)", color: form.type === t ? "#38F1FF" : "#9FB2CE" }}>
                    {t === "due" ? "💸 ค้างจ่าย" : "💰 เบิก/รับเงิน"}
                  </button>
                ))}
              </div>
            </div>
            {agents.length > 0 && (
              <div>
                <label style={labelStyle}>ทีมงาน</label>
                <select style={inputStyle} value={form.agentId} onChange={e => setForm(p => ({ ...p, agentId: e.target.value }))}>
                  <option value="">-- ไม่ระบุ --</option>
                  {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={labelStyle}>จำนวนเงิน (฿) *</label>
              <input style={inputStyle} type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" required />
            </div>
            <div>
              <label style={labelStyle}>รายละเอียด</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="รายละเอียดรายการ" />
            </div>
            <div>
              <label style={labelStyle}>หมวดหมู่</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="">-- เลือกหมวดหมู่ --</option>
                <option value="transport">ค่าเดินทาง</option>
                <option value="food">ค่าอาหาร</option>
                <option value="equipment">อุปกรณ์</option>
                <option value="service">ค่าบริการ</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>
            {/* Slip Upload */}
            <div>
              <label style={labelStyle}>อัพโหลดสลิป</label>
              <div style={{ border: "1px dashed rgba(56,241,255,.38)", borderRadius: 18, padding: 12, background: "linear-gradient(135deg, rgba(56,241,255,.06), rgba(139,92,255,.04))", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                {slipPreview ? (
                  <div style={{ position: "relative" }}>
                    <img src={slipPreview} alt="slip" style={{ width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 12 }} />
                    <button type="button" onClick={e => { e.stopPropagation(); setSlipFile(null); setSlipPreview(null); }} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 8, background: "rgba(255,79,109,.8)", border: "none", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><X size={12} /></button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <Upload size={24} color="#38F1FF" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 12, color: "#9FB2CE", fontWeight: 700 }}>คลิกเพื่ออัพโหลดสลิป</div>
                    <div style={{ fontSize: 11, color: "#6B7FA0", marginTop: 4 }}>PNG, JPG, PDF (สูงสุด 10MB)</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFile} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{ padding: "12px", borderRadius: 16, background: "rgba(255,255,255,.06)", border: "1px solid rgba(122,181,255,.18)", color: "#F8FCFF", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>ยกเลิก</button>
            <button type="submit" disabled={createMut.isPending || uploadMut.isPending} className="btn-primary" style={{ padding: "12px", borderRadius: 16, cursor: "pointer", fontWeight: 900, fontSize: 13 }}>
              {(createMut.isPending || uploadMut.isPending) ? "กำลังบันทึก..." : "เพิ่มรายการ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== ACCOUNT CARD =====
function AccountCard({ account, onEdit, onDelete, onRefresh }: { account: any; onEdit: () => void; onDelete: () => void; onRefresh: () => void }) {
  const [showPin, setShowPin] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bank = getBankByCode(account.bankCode);
  const deleteMut = trpc.accounts.delete.useMutation({ onSuccess: () => { toast.success("ลบบัญชีแล้ว"); onRefresh(); } });

  const handleDelete = () => {
    if (confirm(`ยืนยันลบบัญชี "${account.name}"?`)) deleteMut.mutate({ id: account.id });
  };

  return (
    <div className="card-account animate-fade-up">
      {/* Top line glow */}
      <div style={{ position: "absolute", inset: "0 18px auto 18px", height: 1, background: "linear-gradient(90deg, transparent, rgba(56,241,255,.65), rgba(139,92,255,.55), transparent)", opacity: 0.9 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Row */}
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, alignItems: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 20, background: "linear-gradient(135deg, #35e9ff, #2563ff 48%, #8b5cf6)", display: "grid", placeItems: "center", boxShadow: "0 0 24px rgba(56,241,255,.28), inset 0 1px 0 rgba(255,255,255,.28)", border: "1px solid rgba(56,241,255,.28)" }}>
            <span style={{ fontSize: 22, fontWeight: 1000, color: "#fff", textShadow: "0 0 12px rgba(56,241,255,.8)" }}>
              {account.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{account.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <BankLogo bankCode={account.bankCode} size={24} />
              <span style={{ fontSize: 12, color: "#BED1EA", fontWeight: 750 }}>{bank.shortName}</span>
              <StatusBadge status={account.status} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <NeonBtn icon={Edit} onClick={onEdit} color="cyan" title="แก้ไข" />
            <NeonBtn icon={Trash2} onClick={handleDelete} color="red" title="ลบ" />
          </div>
        </div>

        {/* Info Section */}
        <div style={{ marginTop: 14, padding: 13, borderRadius: 20, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)), rgba(1,8,22,.42)", border: "1px solid rgba(97,185,255,.15)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)" }}>
          {/* Account Number */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", gap: 8, alignItems: "center", minHeight: 34, borderBottom: "1px solid rgba(105,185,255,.10)", paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 900 }}>เลขบัญชี</span>
            <span style={{ fontSize: 14, fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{account.accountNumber}</span>
            <CopyBtn text={account.accountNumber} label="เลขบัญชี" />
          </div>
          {/* Name + PIN row */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px 1fr", gap: 8, alignItems: "center", minHeight: 34 }}>
            <span style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 900 }}>ชื่อบัญชี</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{account.name}</span>
              <CopyBtn text={account.name} label="ชื่อ" />
            </div>
            {account.pin && <>
              <span style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 900 }}>PIN</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: showPin ? ".05em" : ".2em" }}>{showPin ? account.pin : "••••"}</span>
                <button onClick={() => setShowPin(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#38F1FF", padding: 0 }}>{showPin ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                {showPin && <CopyBtn text={account.pin} label="PIN" />}
              </div>
            </>}
          </div>
          {/* Phone / LINE */}
          {(account.phone || account.lineId) && (
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px 1fr", gap: 8, alignItems: "center", minHeight: 34, borderTop: "1px solid rgba(105,185,255,.10)", marginTop: 8, paddingTop: 8 }}>
              {account.phone && <>
                <span style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 900 }}>เบอร์โทร</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 900 }}>{account.phone}</span>
                  <CopyBtn text={account.phone} label="เบอร์โทร" />
                </div>
              </>}
              {account.lineId && <>
                <span style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 900 }}>LINE</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 900 }}>{account.lineId}</span>
                  <CopyBtn text={account.lineId} label="LINE ID" />
                </div>
              </>}
            </div>
          )}
        </div>

        {/* Money Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <div style={{ borderRadius: 18, padding: 11, background: "radial-gradient(circle at 0% 0%, rgba(46,242,177,.14), transparent 48%), rgba(3,11,26,.62)", border: "1px solid rgba(56,241,255,.14)" }}>
            <div style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 800 }}>จ่ายแล้ว</div>
            <div style={{ fontSize: 19, fontWeight: 1000, marginTop: 4, color: "#89ffbf", letterSpacing: "-.04em" }}>฿{parseFloat(account.amountPaid ?? 0).toLocaleString()}</div>
          </div>
          <div style={{ borderRadius: 18, padding: 11, background: "radial-gradient(circle at 0% 0%, rgba(255,79,109,.14), transparent 48%), rgba(3,11,26,.62)", border: "1px solid rgba(255,79,109,.16)" }}>
            <div style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 800 }}>ค้างจ่าย</div>
            <div style={{ fontSize: 19, fontWeight: 1000, marginTop: 4, color: "#ff9aaa", letterSpacing: "-.04em" }}>฿{parseFloat(account.amountDue ?? 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Expandable details */}
        {(account.promptpay || account.note) && (
          <div style={{ marginTop: 10, borderRadius: 18, border: "1px solid rgba(92,178,255,.14)", background: "rgba(1,8,22,.42)", overflow: "hidden" }}>
            <button onClick={() => setExpanded(p => !p)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "none", border: "none", color: "#F8FCFF", cursor: "pointer", fontWeight: 900, fontSize: 13 }}>
              <span>ข้อมูลเพิ่มเติม</span>
              <span style={{ color: "#38F1FF" }}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
            </button>
            {expanded && (
              <div style={{ padding: "0 14px 12px", display: "grid", gap: 8 }}>
                {account.promptpay && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#9FB2CE", fontWeight: 800 }}>พร้อมเพย์</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800 }}>{account.promptpay}</span>
                      <CopyBtn text={account.promptpay} label="พร้อมเพย์" />
                    </div>
                  </div>
                )}
                {account.note && <div style={{ fontSize: 12, color: "#9FB2CE", background: "rgba(56,241,255,.04)", borderRadius: 10, padding: "8px 10px" }}>{account.note}</div>}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 9, marginTop: 12 }}>
          <button onClick={onEdit} className="btn-primary" style={{ padding: "10px 8px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Edit size={13} /> แก้ไข
          </button>
          <button onClick={() => { navigator.clipboard.writeText(`${account.name}\n${account.bankCode}: ${account.accountNumber}${account.pin ? `\nPIN: ${account.pin}` : ""}`); toast.success("คัดลอกข้อมูลครบแล้ว"); }} style={{ padding: "10px 8px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(56,241,255,.10)", border: "1px solid rgba(56,241,255,.24)", color: "#38F1FF" }}>
            <Copy size={13} /> คัดลอกทั้งหมด
          </button>
          <button onClick={handleDelete} className="btn-danger" style={{ padding: "10px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN CE EMPIRE APP =====
// ===== LOGIN SCREEN =====
function LoginScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Prompt","Noto Sans Thai","Inter",sans-serif', position: "relative", overflow: "hidden" }}>
      {/* Animated background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(56,241,255,.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(139,92,255,.18), transparent 40%), radial-gradient(circle at 50% 50%, rgba(37,99,255,.12), transparent 60%)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 32, borderRadius: 36, background: "linear-gradient(145deg, rgba(8,19,42,.96), rgba(2,7,18,.96))", border: "1px solid rgba(56,241,255,.32)", boxShadow: "0 28px 80px rgba(0,0,0,.60), 0 0 60px rgba(56,241,255,.12)", maxWidth: 420, width: "calc(100% - 32px)" }}>
        {/* Logo */}
        <div style={{ width: 88, height: 88, borderRadius: 28, display: "grid", placeItems: "center", margin: "0 auto 20px", position: "relative", background: "linear-gradient(135deg, rgba(56,241,255,.28), rgba(37,99,255,.22) 38%, rgba(139,92,255,.18) 62%, rgba(255,215,106,.24)), rgba(5,8,22,.86)", border: "1px solid rgba(56,241,255,.52)", boxShadow: "0 0 40px rgba(56,241,255,.26), 0 0 30px rgba(255,215,106,.14)" }}>
          <span style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 22, color: "#FFD66B", textShadow: "0 0 18px rgba(255,215,106,.85)" }}>♕</span>
          <span style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 22, fontWeight: 900, letterSpacing: "-.08em", color: "#F8FDFF", textShadow: "0 0 16px rgba(56,241,255,.95), 0 0 20px rgba(255,215,106,.50)" }}>CE</span>
        </div>
        <div style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 28, fontWeight: 950, letterSpacing: "-.03em", marginBottom: 6 }}>CE Empire</div>
        <div style={{ fontSize: 13, color: "#AFC0D8", marginBottom: 8 }}>Banking Management System</div>
        <div style={{ fontSize: 12, color: "#6B7FA0", marginBottom: 28 }}>ระบบจัดการบัญชีธนาคาร • ติดตามรายจ่าย • ทีมงาน</div>
        {/* Bank logos preview */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {["KBANK","SCB","KTB","BBL","TTB","GSB","BAY"].map(code => (
            <BankLogo key={code} bankCode={code} size={32} />
          ))}
        </div>
        <a href={getLoginUrl()} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 18, background: "linear-gradient(135deg, rgba(56,241,255,.22), rgba(37,99,255,.28), rgba(139,92,255,.20))", border: "1px solid rgba(56,241,255,.52)", color: "#E8FCFF", fontWeight: 900, fontSize: 15, textDecoration: "none", boxShadow: "0 0 32px rgba(56,241,255,.22), 0 8px 24px rgba(0,0,0,.28)", transition: "all .2s ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(56,241,255,.32), 0 12px 32px rgba(0,0,0,.32)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(56,241,255,.22), 0 8px 24px rgba(0,0,0,.28)"; }}
        >
          <Shield size={18} />
          เข้าสู่ระบบ CE Empire
        </a>
        <div style={{ marginTop: 16, fontSize: 11, color: "#6B7FA0" }}>ปลอดภัย • เข้ารหัสข้อมูล • ส่วนตัว</div>
      </div>
    </div>
  );
}

export default function CEEmpire() {
  const { user, loading, isAuthenticated } = useAuth();
  const [page, setPage] = useState<Page>("dashboard");
  const [accountSearch, setAccountSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editAccount, setEditAccount] = useState<any>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // tRPC queries - MUST be called every render. Use `enabled` to gate fetching when not authenticated.
  const statsQ = trpc.dashboard.stats.useQuery(undefined, { enabled: isAuthenticated });
  const accountsQ = trpc.accounts.list.useQuery({ search: accountSearch, bankCode: bankFilter === "all" ? undefined : bankFilter }, { enabled: isAuthenticated });
  const agentsQ = trpc.agents.list.useQuery(undefined, { enabled: isAuthenticated });
  const expensesQ = trpc.expenses.list.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const refreshAll = useCallback(() => {
    utils.accounts.list.invalidate();
    utils.dashboard.stats.invalidate();
    utils.expenses.list.invalidate();
    utils.agents.list.invalidate();
  }, [utils]);

  // Export
  const handleExport = () => {
    const data = { accounts: accountsQ.data ?? [], expenses: expensesQ.data ?? [], agents: agentsQ.data ?? [], exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ce-empire-export-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Export สำเร็จ");
  };

  const stats = statsQ.data;

  // Show loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Prompt",sans-serif' }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, display: "grid", placeItems: "center", margin: "0 auto 16px", background: "linear-gradient(135deg, rgba(56,241,255,.28), rgba(37,99,255,.22))", border: "1px solid rgba(56,241,255,.52)", animation: "pulse 1.5s infinite" }}>
            <span style={{ fontFamily: '"Orbitron",sans-serif', fontSize: 16, fontWeight: 900, color: "#38F1FF" }}>CE</span>
          </div>
          <div style={{ color: "#9FB2CE", fontSize: 14 }}>กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) return <LoginScreen />;

  // ===== SIDEBAR MENU =====
  const menuItems: { id: Page; label: string; icon: React.ElementType; color: string }[] = [
    { id: "dashboard", label: "หน้าหลัก", icon: Home, color: "cyan" },
    { id: "accounts", label: "บัญชี", icon: Building2, color: "cyan" },
    { id: "payment", label: "ชำระเงิน", icon: ArrowLeftRight, color: "gold" },
    { id: "agents", label: "ทีมงาน", icon: Users, color: "violet" },
    { id: "documents", label: "เอกสาร", icon: FileText, color: "cyan" },
    { id: "settings", label: "ตั้งค่า", icon: Settings, color: "violet" },
  ];

  const iconColors = { cyan: "#38F1FF", gold: "#FFD66B", violet: "#8B5CFF" };

  return (
    <div style={{ minHeight: "100vh", fontFamily: '"Prompt","Noto Sans Thai","Inter",sans-serif' }}>
      {/* Topbar */}
      <header className="glass" style={{ position: "sticky", top: 10, zIndex: 40, borderRadius: 26, padding: "11px 14px", margin: "10px 12px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* CE Logo */}
          <div style={{ width: 56, height: 56, borderRadius: 18, display: "grid", placeItems: "center", position: "relative", background: "linear-gradient(135deg, rgba(56,241,255,.28), rgba(37,99,255,.22) 38%, rgba(139,92,255,.18) 62%, rgba(255,215,106,.24)), rgba(5,8,22,.86)", border: "1px solid rgba(56,241,255,.52)", boxShadow: "0 0 26px rgba(56,241,255,.26), 0 0 22px rgba(255,215,106,.14), inset 0 1px 0 rgba(255,255,255,.16)" }}>
            <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", fontSize: 16, color: "#FFD66B", textShadow: "0 0 14px rgba(255,215,106,.85)" }}>♕</span>
            <span style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 15, fontWeight: 900, letterSpacing: "-.08em", color: "#F8FDFF", textShadow: "0 0 12px rgba(56,241,255,.95), 0 0 16px rgba(255,215,106,.50)" }}></span>
          </div>
          <div>
            <div style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 20, fontWeight: 950, letterSpacing: "-.03em", textAlign: 'center' }}>CE Empire</div>
            <div style={{ fontSize: 11, color: "#B7C6DE", letterSpacing: ".04em", textAlign: 'center' }}>Banking Management System</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={() => { setEditAccount(null); setShowAccountForm(true); }} className="btn-primary" style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> เพิ่มบัญชี
          </button>
          <button onClick={() => setShowExpenseForm(true)} style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,215,106,.12)", border: "1px solid rgba(255,215,106,.28)", color: "#FFD66B" }}>
            <Receipt size={14} /> รายการ
          </button>
          <button onClick={handleExport} className="btn-gold" style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="glass" style={{ margin: "12px 12px 0", borderRadius: 28, padding: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 16% 14%, rgba(56,241,255,.18), transparent 32%), radial-gradient(circle at 88% 22%, rgba(139,92,255,.18), transparent 31%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#B9F6FF", fontWeight: 900, textShadow: "0 0 16px rgba(56,241,255,.62)" }}>CE Empire Command</div>
            <div style={{ fontSize: "clamp(26px,5vw,40px)", lineHeight: 1.06, fontWeight: 1000, letterSpacing: "-.055em", margin: "7px 0 8px" }}>
              บัญชี + ชำระเงิน{" "}
              <span className="gradient-text">Neo Empire</span>
            </div>
            <div style={{ fontSize: 12, color: "#AFC0D8", lineHeight: 1.45 }}></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <MetricCard label="บัญชีทั้งหมด" value={stats?.totalAccounts ?? 0} icon={Building2} color="cyan" />
            <MetricCard label="จ่ายแล้ว" value={`฿${(stats?.totalPaid ?? 0).toLocaleString()}`} icon={CheckCircle} color="green" />
            <MetricCard label="ค้างจ่าย" value={`฿${(stats?.totalDue ?? 0).toLocaleString()}`} icon={AlertCircle} color="gold" />
            <MetricCard label="หลักฐาน" value={stats?.totalProof ?? 0} icon={FileText} color="violet" />
          </div>
        </div>
      </section>

      {/* Mobile Nav */}
      <nav style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 12px 0", scrollbarWidth: "none" }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            borderRadius: 16, padding: "9px 14px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 800, fontSize: 13, transition: "all .18s", display: "flex", alignItems: "center", gap: 7,
            background: page === item.id ? "linear-gradient(135deg, rgba(56,241,255,.22), rgba(37,99,255,.16), rgba(139,92,255,.16))" : "rgba(9,16,34,.60)",
            border: page === item.id ? "1px solid rgba(56,241,255,.62)" : "1px solid rgba(122,181,255,.16)",
            color: page === item.id ? "#E8FCFF" : "#9FB2CE",
            boxShadow: page === item.id ? "0 0 24px rgba(56,241,255,.16)" : "none",
          }}>
            <item.icon size={14} color={page === item.id ? iconColors[item.color as keyof typeof iconColors] : "#9FB2CE"} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Layout */}
      <div className="main-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, padding: "12px 12px 100px", maxWidth: 1080, margin: "0 auto" }}>
        {/* Sidebar */}
        <aside className="glass desktop-sidebar" style={{ borderRadius: 26, padding: 12, height: "max-content", position: "sticky", top: 90 }}>
          <div style={{ fontFamily: '"Orbitron","Inter",sans-serif', fontSize: 11, color: "#9FB2CE", fontWeight: 900, margin: "4px 6px 10px", letterSpacing: ".16em", textTransform: "uppercase" }}>เมนู</div>
          <div style={{ display: "grid", gap: 8 }}>
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                textAlign: "left", borderRadius: 16, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer", fontWeight: 850, fontSize: 13, transition: "all .18s", width: "100%",
                background: page === item.id ? "linear-gradient(135deg, rgba(56,241,255,.22), rgba(37,99,255,.16), rgba(139,92,255,.13))" : "linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(4,11,25,.68)",
                border: page === item.id ? "1px solid rgba(56,241,255,.62)" : "1px solid rgba(122,181,255,.16)",
                color: page === item.id ? "#E8FCFF" : "#9FB2CE",
                boxShadow: page === item.id ? "0 0 28px rgba(56,241,255,.16), inset 0 1px 0 rgba(255,255,255,.14)" : "none",
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, display: "grid", placeItems: "center", background: page === item.id ? `linear-gradient(135deg, ${iconColors[item.color as keyof typeof iconColors]}30, ${iconColors[item.color as keyof typeof iconColors]}18)` : "rgba(56,241,255,.08)", border: `1px solid ${page === item.id ? iconColors[item.color as keyof typeof iconColors] + "50" : "rgba(56,241,255,.20)"}`, flexShrink: 0 }}>
                  <item.icon size={13} color={page === item.id ? iconColors[item.color as keyof typeof iconColors] : "#9FB2CE"} />
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main>
          {/* DASHBOARD PAGE */}
          {page === "dashboard" && (
            <div className="animate-fade-up">
              <GlassCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.04em" }}>Dashboard</div>
                    <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 4 }}>ภาพรวมระบบ CE Empire</div>
                  </div>
                  <NeonBtn icon={RefreshCw} onClick={refreshAll} color="cyan" title="รีเฟรช" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
                  <AnimatedMetricCard label="บัญชีทั้งหมด" value={stats?.totalAccounts ?? 0} icon={Building2} color="cyan" />
                  <AnimatedMetricCard label="ยอดจ่ายแล้ว" value={`฿${(stats?.totalPaid ?? 0).toLocaleString()}`} icon={CheckCircle} color="green" />
                  <AnimatedMetricCard label="ยอดค้างจ่าย" value={`฿${(stats?.totalDue ?? 0).toLocaleString()}`} icon={AlertCircle} color="gold" />
                  <AnimatedMetricCard label="สลิปหลักฐาน" value={stats?.totalProof ?? 0} icon={FileText} color="violet" />
                </div>

                {/* Quick Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                  {[
                    { label: "เพิ่มบัญชี", sub: "จัดการบัญชีธนาคาร", icon: Building2, color: "#38F1FF", action: () => { setEditAccount(null); setShowAccountForm(true); } },
                    { label: "ชำระเงิน", sub: "เพิ่มรายการ/สลิป", icon: ArrowLeftRight, action: () => setPage("payment"), color: "#FFD66B" },
                    { label: "ทีมงาน", sub: "จัดการ agent", icon: Users, action: () => setPage("agents"), color: "#8B5CFF" },
                    { label: "Export", sub: "ดาวน์โหลดข้อมูล", icon: Download, action: handleExport, color: "#2EF2B1" },
                  ].map((qa, i) => (
                    <button key={i} onClick={qa.action} style={{ textAlign: "left", display: "grid", gap: 4, minHeight: 100, borderRadius: 22, padding: 14, cursor: "pointer", transition: "all .18s", background: "linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.025)), radial-gradient(circle at 20% 0%, rgba(56,241,255,.18), transparent 46%), rgba(4,12,29,.76)", border: "1px solid rgba(122,181,255,.17)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                      <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: `${qa.color}20`, border: `1px solid ${qa.color}40`, boxShadow: `0 0 18px ${qa.color}18` }}>
                        <qa.icon size={18} color={qa.color} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#F8FCFF" }}>{qa.label}</div>
                      <div style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 700, whiteSpace: "normal" }}>{qa.sub}</div>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Recent Accounts */}
              {(accountsQ.data?.length ?? 0) > 0 && (
                <GlassCard className="mt-3">
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>บัญชีล่าสุด</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {accountsQ.data?.slice(0, 3).map((acc: any) => (
                      <div key={acc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 16, background: "rgba(5,8,22,.42)", border: "1px solid rgba(122,181,255,.12)" }}>
                        <BankLogo bankCode={acc.bankCode} size={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.name}</div>
                          <div style={{ fontSize: 12, color: "#9FB2CE" }}>{acc.accountNumber}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "#ff9aaa" }}>฿{parseFloat(acc.amountDue ?? 0).toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: "#9FB2CE" }}>ค้างจ่าย</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* ACCOUNTS PAGE */}
          {page === "accounts" && (
            <div className="animate-fade-up">
              <GlassCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.04em" }}>บัญชีธนาคาร</div>
                    <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 4 }}>จัดการบัญชีทั้งหมด</div>
                  </div>
                  <button onClick={() => { setEditAccount(null); setShowAccountForm(true); }} className="btn-primary" style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Plus size={14} /> เพิ่มบัญชี
                  </button>
                </div>

                {/* Toolbar */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px", gap: 10, marginBottom: 14 }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9FB2CE" }} />
                    <input value={accountSearch} onChange={e => setAccountSearch(e.target.value)} placeholder="ค้นหา ธนาคาร / เลขบัญชี / ชื่อ" style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: 16, fontSize: 13, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)", border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none" }} />
                  </div>
                  <select value={bankFilter} onChange={e => setBankFilter(e.target.value)} style={{ padding: "11px 14px", borderRadius: 16, fontSize: 13, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)", border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none", appearance: "none" }}>
                    <option value="all">ทุกธนาคาร</option>
                    {THAI_BANKS.map(b => <option key={b.code} value={b.code}>{b.shortName}</option>)}
                  </select>
                  <button onClick={refreshAll} style={{ padding: "11px 14px", borderRadius: 16, fontSize: 13, background: "rgba(56,241,255,.10)", border: "1px solid rgba(56,241,255,.24)", color: "#38F1FF", cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <RefreshCw size={13} /> รีเฟรช
                  </button>
                </div>

                {accountsQ.isLoading ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#9FB2CE" }}>กำลังโหลด...</div>
                ) : accountsQ.data?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "42px 18px", border: "1px dashed rgba(56,241,255,.28)", borderRadius: 24, color: "#9FB2CE", background: "rgba(5,8,22,.32)" }}>
                    <Building2 size={32} color="#38F1FF" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                    <div style={{ fontWeight: 800 }}>ยังไม่มีบัญชี</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>กดปุ่ม "เพิ่มบัญชี" เพื่อเริ่มต้น</div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                    {accountsQ.data?.map((acc: any) => (
                      <AccountCard key={acc.id} account={acc} onEdit={() => { setEditAccount(acc); setShowAccountForm(true); }} onDelete={() => {}} onRefresh={refreshAll} />
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* PAYMENT PAGE */}
          {page === "payment" && (
            <div className="animate-fade-up">
              <GlassCard>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.04em" }}>ชำระเงิน / รายจ่าย</div>
                    <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 4 }}>ติดตามรายการค้างจ่ายและการเบิกเงิน</div>
                  </div>
                  <button onClick={() => setShowExpenseForm(true)} className="btn-primary" style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Plus size={14} /> เพิ่มรายการ
                  </button>
                </div>

                {expensesQ.isLoading ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#9FB2CE" }}>กำลังโหลด...</div>
                ) : expensesQ.data?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "42px 18px", border: "1px dashed rgba(56,241,255,.28)", borderRadius: 24, color: "#9FB2CE", background: "rgba(5,8,22,.32)" }}>
                    <Receipt size={32} color="#FFD66B" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                    <div style={{ fontWeight: 800 }}>ยังไม่มีรายการ</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>กดปุ่ม "เพิ่มรายการ" เพื่อเริ่มต้น</div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {expensesQ.data?.map((exp: any) => (
                      <ExpenseCard key={exp.id} expense={exp} agents={agentsQ.data ?? []} onRefresh={refreshAll} />
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* AGENTS PAGE */}
          {page === "agents" && (
            <AgentsPage agents={agentsQ.data ?? []} onRefresh={refreshAll} expenses={expensesQ.data ?? []} />
          )}

          {/* DOCUMENTS PAGE */}
          {page === "documents" && (
            <DocumentsPage expenses={expensesQ.data ?? []} accounts={accountsQ.data ?? []} agents={agentsQ.data ?? []} onRefresh={refreshAll} />
          )}

          {/* SETTINGS PAGE */}
          {page === "settings" && (
            <div className="animate-fade-up">
              <GlassCard>
                <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>ตั้งค่า</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ padding: "14px", borderRadius: 18, background: "rgba(5,8,22,.42)", border: "1px solid rgba(122,181,255,.14)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>Export ข้อมูลทั้งหมด</div>
                      <div style={{ fontSize: 12, color: "#9FB2CE", marginTop: 4 }}>ดาวน์โหลดข้อมูลบัญชีและรายจ่ายในรูปแบบ JSON</div>
                    </div>
                    <button onClick={handleExport} className="btn-gold" style={{ padding: "10px 16px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13 }}>Export</button>
                  </div>
                  <div style={{ padding: "14px", borderRadius: 18, background: "rgba(5,8,22,.42)", border: "1px solid rgba(122,181,255,.14)" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>ธนาคารที่รองรับ</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {THAI_BANKS.map(b => (
                        <div key={b.code} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 12, background: "rgba(56,241,255,.06)", border: "1px solid rgba(56,241,255,.14)" }}>
                          <BankLogo bankCode={b.code} size={20} />
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{b.shortName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, padding: "0 8px 8px" }}>
        <div className="glass" style={{ borderRadius: 24, padding: "10px 8px", display: "flex", justifyContent: "space-around" }}>
          {menuItems.slice(0, 5).map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 14, background: "none", border: "none", cursor: "pointer", color: page === item.id ? iconColors[item.color as keyof typeof iconColors] : "#9FB2CE", transition: "all .18s" }}>
              <item.icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 800 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* FAB */}
      <button onClick={() => { setEditAccount(null); setShowAccountForm(true); }} className="fab-button" style={{
        position: "fixed", right: 16, bottom: 80, zIndex: 60,
        borderRadius: 999, padding: "16px 20px",
        background: "linear-gradient(135deg, rgba(56,241,255,.95), rgba(56,241,255,.85)), linear-gradient(145deg, rgba(37,99,255,.4), rgba(56,241,255,.2))",
        border: "1.5px solid rgba(56,241,255,.6)",
        boxShadow: "0 0 40px rgba(56,241,255,.5), 0 20px 60px rgba(56,241,255,.3), inset 0 1px 0 rgba(255,255,255,.3)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        fontWeight: 900, fontSize: 14, color: "#020812",
        transition: "all .25s cubic-bezier(.23,1,.32,1)",
        animation: "float 3s ease-in-out infinite",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.08)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(56,241,255,.7), 0 30px 80px rgba(56,241,255,.4), inset 0 1px 0 rgba(255,255,255,.4)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(56,241,255,.5), 0 20px 60px rgba(56,241,255,.3), inset 0 1px 0 rgba(255,255,255,.3)";
      }}>
        <Plus size={20} /> เพิ่ม
      </button>

      {/* Modals */}
      <AccountFormModal open={showAccountForm} onClose={() => { setShowAccountForm(false); setEditAccount(null); }} editData={editAccount} onSuccess={refreshAll} />
      <ExpenseFormModal open={showExpenseForm} onClose={() => setShowExpenseForm(false)} agents={agentsQ.data ?? []} onSuccess={refreshAll} />
    </div>
  );
}

// ===== EXPENSE CARD =====
function ExpenseCard({ expense, agents, onRefresh }: { expense: any; agents: any[]; onRefresh: () => void }) {
  const agent = agents.find((a: any) => a.id === expense.agentId);
  const updateMut = trpc.expenses.update.useMutation({ onSuccess: () => { toast.success("อัพเดตสำเร็จ"); onRefresh(); } });
  const deleteMut = trpc.expenses.delete.useMutation({ onSuccess: () => { toast.success("ลบรายการแล้ว"); onRefresh(); } });

  return (
    <div style={{ borderRadius: 22, padding: 14, border: "1px solid rgba(122,181,255,.18)", background: "linear-gradient(155deg, rgba(255,255,255,.08), rgba(255,255,255,.02)), rgba(5,8,22,.58)", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22, fontWeight: 1000, letterSpacing: "-.045em", color: expense.type === "due" ? "#ff9aaa" : "#89ffbf" }}>
              {expense.type === "due" ? "-" : "+"}฿{parseFloat(expense.amount).toLocaleString()}
            </span>
            <StatusBadge status={expense.status} />
            <span style={{ fontSize: 11, color: "#9FB2CE", background: "rgba(56,241,255,.08)", border: "1px solid rgba(56,241,255,.18)", borderRadius: 8, padding: "3px 8px" }}>
              {expense.type === "due" ? "ค้างจ่าย" : "เบิก/รับ"}
            </span>
          </div>
          {expense.description && <div style={{ fontSize: 13, color: "#AFC0D8", marginTop: 6 }}>{expense.description}</div>}
          {agent && <div style={{ fontSize: 12, color: "#8B5CFF", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Users size={11} /> {agent.name}</div>}
          <div style={{ fontSize: 11, color: "#6B7FA0", marginTop: 4 }}>{new Date(expense.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {expense.status === "pending" && (
            <NeonBtn icon={CheckCircle} onClick={() => updateMut.mutate({ id: expense.id, status: "paid", paidAt: new Date() })} color="green" title="ทำเครื่องหมายว่าจ่ายแล้ว" />
          )}
          <NeonBtn icon={Trash2} onClick={() => { if (confirm("ยืนยันลบรายการ?")) deleteMut.mutate({ id: expense.id }); }} color="red" title="ลบ" />
        </div>
      </div>
      {expense.slipUrl && (
        <div style={{ marginTop: 10 }}>
          <a href={expense.slipUrl} target="_blank" rel="noopener noreferrer">
            <img src={expense.slipUrl} alt="slip" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 14, border: "1px solid rgba(56,241,255,.18)" }} />
          </a>
        </div>
      )}
    </div>
  );
}

// ===== AGENTS PAGE =====
function AgentsPage({ agents, onRefresh, expenses }: { agents: any[]; onRefresh: () => void; expenses: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [lineId, setLineId] = useState("");
  const createMut = trpc.agents.create.useMutation({ onSuccess: () => { toast.success("เพิ่มทีมงานสำเร็จ"); onRefresh(); setShowForm(false); setName(""); setPhone(""); setLineId(""); } });
  const deleteMut = trpc.agents.delete.useMutation({ onSuccess: () => { toast.success("ลบทีมงานแล้ว"); onRefresh(); } });

  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 16, fontSize: 13, fontWeight: 600, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)", border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none" };

  return (
    <div className="animate-fade-up">
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>ทีมงาน</div>
            <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 4 }}>จัดการสมาชิกทีม</div>
          </div>
          <button onClick={() => setShowForm(p => !p)} className="btn-primary" style={{ padding: "10px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> เพิ่มทีมงาน
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: 16, padding: 14, borderRadius: 20, background: "rgba(5,8,22,.52)", border: "1px solid rgba(56,241,255,.22)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 800, marginBottom: 5, display: "block" }}>ชื่อ *</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อทีมงาน" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 800, marginBottom: 5, display: "block" }}>เบอร์โทร</label>
                <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0xx-xxx-xxxx" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#9FB2CE", fontWeight: 800, marginBottom: 5, display: "block" }}>LINE ID</label>
                <input style={inputStyle} value={lineId} onChange={e => setLineId(e.target.value)} placeholder="@lineid" />
              </div>
              <button onClick={() => { if (!name) { toast.error("กรุณากรอกชื่อ"); return; } createMut.mutate({ name, phone, lineId }); }} className="btn-primary" style={{ padding: "11px 16px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 13 }}>
                {createMut.isPending ? "..." : "บันทึก"}
              </button>
            </div>
          </div>
        )}

        {agents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "42px 18px", border: "1px dashed rgba(56,241,255,.28)", borderRadius: 24, color: "#9FB2CE" }}>
            <Users size={32} color="#8B5CFF" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div style={{ fontWeight: 800 }}>ยังไม่มีทีมงาน</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {agents.map((agent: any) => {
              const agentExpenses = expenses.filter((e: any) => e.agentId === agent.id);
              const totalDue = agentExpenses.filter((e: any) => e.status === "pending").reduce((s: number, e: any) => s + parseFloat(e.amount), 0);
              const totalPaid = agentExpenses.filter((e: any) => e.status === "paid").reduce((s: number, e: any) => s + parseFloat(e.amount), 0);
              return (
                <div key={agent.id} style={{ borderRadius: 22, padding: 14, border: "1px solid rgba(139,92,255,.22)", background: "linear-gradient(155deg, rgba(139,92,255,.10), rgba(37,99,255,.06)), rgba(5,8,22,.58)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.03em" }}>{agent.name}</div>
                      {agent.phone && <div style={{ fontSize: 12, color: "#9FB2CE", marginTop: 3 }}>{agent.phone}</div>}
                      {agent.lineId && <div style={{ fontSize: 12, color: "#8B5CFF", marginTop: 2 }}>LINE: {agent.lineId}</div>}
                    </div>
                    <NeonBtn icon={Trash2} onClick={() => { if (confirm(`ลบ "${agent.name}"?`)) deleteMut.mutate({ id: agent.id }); }} color="red" title="ลบ" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ borderRadius: 14, padding: 10, background: "rgba(46,242,177,.08)", border: "1px solid rgba(46,242,177,.18)" }}>
                      <div style={{ fontSize: 10, color: "#9FB2CE", fontWeight: 800 }}>จ่ายแล้ว</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#89ffbf", marginTop: 3 }}>฿{totalPaid.toLocaleString()}</div>
                    </div>
                    <div style={{ borderRadius: 14, padding: 10, background: "rgba(255,79,109,.08)", border: "1px solid rgba(255,79,109,.18)" }}>
                      <div style={{ fontSize: 10, color: "#9FB2CE", fontWeight: 800 }}>ค้างจ่าย</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#ff9aaa", marginTop: 3 }}>฿{totalDue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ===== DOCUMENTS PAGE =====
function DocumentsPage({ expenses, accounts, agents, onRefresh }: { expenses: any[]; accounts: any[]; agents: any[]; onRefresh: () => void }) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [search, setSearch] = useState("");

  const slipExpenses = expenses.filter((e: any) => e.slipUrl);
  const filtered = slipExpenses.filter((e: any) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch = !search || e.description?.toLowerCase().includes(search.toLowerCase()) || e.amount?.toString().includes(search);
    return matchStatus && matchSearch;
  });

  const totalSlips = slipExpenses.length;
  const paidSlips = slipExpenses.filter((e: any) => e.status === "paid").length;
  const pendingSlips = slipExpenses.filter((e: any) => e.status === "pending").length;

  return (
    <div className="animate-fade-up">
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.04em" }}>เอกสาร / สลิป</div>
            <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 4 }}>หลักฐานการชำระเงินทั้งหมด</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ borderRadius: 14, padding: "8px 14px", background: "rgba(56,241,255,.10)", border: "1px solid rgba(56,241,255,.22)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#38F1FF" }}>{totalSlips}</div>
              <div style={{ fontSize: 10, color: "#9FB2CE", fontWeight: 800 }}>สลิปทั้งหมด</div>
            </div>
            <div style={{ borderRadius: 14, padding: "8px 14px", background: "rgba(46,242,177,.10)", border: "1px solid rgba(46,242,177,.22)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#89ffbf" }}>{paidSlips}</div>
              <div style={{ fontSize: 10, color: "#9FB2CE", fontWeight: 800 }}>จ่ายแล้ว</div>
            </div>
            <div style={{ borderRadius: 14, padding: "8px 14px", background: "rgba(255,215,106,.10)", border: "1px solid rgba(255,215,106,.22)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFD66B" }}>{pendingSlips}</div>
              <div style={{ fontSize: 10, color: "#9FB2CE", fontWeight: 800 }}>รอดำเนินการ</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9FB2CE" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหารายการ..."
              style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: 16, fontSize: 13, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)", border: "1px solid rgba(89,184,255,.22)", color: "#F8FCFF", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "paid", "pending"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "11px 14px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 12, background: filter === f ? "rgba(56,241,255,.18)" : "rgba(56,241,255,.06)", border: `1px solid ${filter === f ? "rgba(56,241,255,.52)" : "rgba(56,241,255,.14)"}`, color: filter === f ? "#38F1FF" : "#9FB2CE" }}>
                {f === "all" ? "ทั้งหมด" : f === "paid" ? "จ่ายแล้ว" : "รอดำเนินการ"}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "42px 18px", border: "1px dashed rgba(56,241,255,.28)", borderRadius: 24, color: "#9FB2CE", background: "rgba(5,8,22,.32)" }}>
            <FileText size={32} color="#38F1FF" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div style={{ fontWeight: 800 }}>{slipExpenses.length === 0 ? "ยังไม่มีสลิป" : "ไม่พบรายการที่ค้นหา"}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>เพิ่มรายการชำระเงินพร้อมอัพโหลดสลิปในหน้า "ชำระเงิน"</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {filtered.map((exp: any) => {
              const agent = agents.find((a: any) => a.id === exp.agentId);
              return (
                <div key={exp.id} style={{ borderRadius: 22, overflow: "hidden", border: "1px solid rgba(122,181,255,.18)", background: "linear-gradient(155deg, rgba(255,255,255,.08), rgba(255,255,255,.02)), rgba(5,8,22,.58)" }}>
                  {/* Slip Image */}
                  <a href={exp.slipUrl} target="_blank" rel="noopener noreferrer">
                    <div style={{ position: "relative", height: 180, background: "rgba(2,8,22,.82)", overflow: "hidden" }}>
                      <img src={exp.slipUrl} alt="slip" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s ease" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                      />
                      <div style={{ position: "absolute", top: 8, right: 8 }}>
                        <StatusBadge status={exp.status} />
                      </div>
                    </div>
                  </a>
                  {/* Info */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: 1000, color: exp.type === "due" ? "#ff9aaa" : "#89ffbf", letterSpacing: "-.04em" }}>
                        {exp.type === "due" ? "-" : "+"}฿{parseFloat(exp.amount).toLocaleString()}
                      </span>
                      <span style={{ fontSize: 11, color: "#9FB2CE", background: "rgba(56,241,255,.08)", border: "1px solid rgba(56,241,255,.18)", borderRadius: 8, padding: "3px 8px" }}>
                        {exp.type === "due" ? "ค้างจ่าย" : "เบิก/รับ"}
                      </span>
                    </div>
                    {exp.description && <div style={{ fontSize: 12, color: "#AFC0D8", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</div>}
                    {agent && <div style={{ fontSize: 11, color: "#8B5CFF", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Users size={10} /> {agent.name}</div>}
                    <div style={{ fontSize: 11, color: "#6B7FA0", marginTop: 4 }}>{new Date(exp.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
>>>>>>> Stashed changes
