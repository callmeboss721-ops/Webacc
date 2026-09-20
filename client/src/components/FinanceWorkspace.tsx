import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Lock, Search, Snowflake, Unlock } from "lucide-react";
import { toast } from "sonner";

type CardStatus = "active" | "frozen";
type TransactionType = "income" | "expense";
type TransactionStatus = "สำเร็จ" | "รอดำเนินการ" | "ยกเลิก";

type FinanceTransaction = {
  id: number;
  title: string;
  merchant: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  account: string;
  status: TransactionStatus;
};

const transactions: FinanceTransaction[] = [
  { id: 1, title: "ค่าโฆษณา Meta", merchant: "Meta Platforms", category: "การตลาด", amount: 12800, type: "expense", date: "21 ก.ย. 2026", account: "CE Platinum", status: "สำเร็จ" },
  { id: 2, title: "รายรับจากลูกค้า", merchant: "Northstar Studio", category: "รายรับ", amount: 86000, type: "income", date: "20 ก.ย. 2026", account: "บัญชีธุรกิจ", status: "สำเร็จ" },
  { id: 3, title: "ค่า SaaS รายเดือน", merchant: "Linear", category: "ซอฟต์แวร์", amount: 4200, type: "expense", date: "19 ก.ย. 2026", account: "CE Platinum", status: "รอดำเนินการ" },
  { id: 4, title: "ค่าเดินทางทีม", merchant: "Grab Business", category: "ปฏิบัติการ", amount: 1850, type: "expense", date: "18 ก.ย. 2026", account: "บัญชีธุรกิจ", status: "ยกเลิก" },
];

const baht = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 2 });
const panelStyle = { borderRadius: 24, padding: 18, background: "linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.025)), rgba(9,16,34,.72)", border: "1px solid rgba(122,181,255,.18)", boxShadow: "0 22px 65px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.1)" };

function Header({ title, description }: { title: string; description: string }) {
  return <div style={{ marginBottom: 16 }}><div style={{ color: "#38F1FF", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>FINANCE OPERATIONS</div><h1 style={{ margin: "5px 0 4px", fontSize: 28, letterSpacing: "-.05em" }}>{title}</h1><p style={{ margin: 0, color: "#AFC0D8", fontSize: 13 }}>{description}</p></div>;
}

export function VirtualCardPage() {
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState<CardStatus>("active");
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(100000);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("100000");
  const spent = 34750;
  const usage = Math.min(100, (spent / limit) * 100);
  const number = revealed ? "4532 9812 4421 1198" : "•••• •••• •••• 1198";

  async function toggleFreeze() {
    if (busy) return;
    setBusy(true);
    const next = status === "active" ? "frozen" : "active";
    await new Promise((resolve) => setTimeout(resolve, 450));
    setStatus(next);
    setBusy(false);
    toast.success(next === "frozen" ? "อายัดบัตรชั่วคราวสำเร็จ" : "ปลดอายัดบัตรสำเร็จ");
  }

  function saveLimit() {
    const value = Number(draft);
    if (!Number.isInteger(value) || value < 1000 || value > 10000000) { toast.error("วงเงินต้องอยู่ระหว่าง 1,000 ถึง 10,000,000 บาท"); return; }
    setLimit(value); setEditing(false); toast.success("อัปเดตวงเงินสำเร็จ");
  }

  async function copyCard() {
    try { await navigator.clipboard.writeText("4532981244211198"); toast.success("คัดลอกหมายเลขบัตรแล้ว"); } catch { toast.error("ไม่สามารถคัดลอกหมายเลขบัตรได้"); }
  }

  return <div className="animate-fade-up"><Header title="Virtual Card" description="ควบคุมวงเงินและสถานะบัตรเสมือนของคุณ" /><div style={{ ...panelStyle, marginBottom: 14, color: "#C7F8FF", fontSize: 12 }}><Lock size={15} style={{ verticalAlign: "-3px", marginRight: 7 }} />ข้อมูลบัตรถูกปกป้องและจะแสดงแบบ masked เป็นค่าเริ่มต้น</div><div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(260px, .65fr)", gap: 14 }}><section style={{ ...panelStyle, opacity: status === "frozen" ? .72 : 1, background: "radial-gradient(circle at 85% 15%, rgba(247,201,107,.2), transparent 32%), linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.02)), #101A2D" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ color: "#F7C96B", fontWeight: 900, letterSpacing: ".12em", fontSize: 12 }}>CE PLATINUM</div><div style={{ color: status === "frozen" ? "#FF8DA0" : "#38F29B", fontSize: 12, marginTop: 5 }}>{status === "frozen" ? "บัตรถูกอายัด" : "ใช้งานอยู่"}</div></div><button type="button" role="switch" aria-checked={status === "frozen"} aria-label={status === "frozen" ? "ปลดอายัดบัตรเสมือน" : "อายัดบัตรเสมือนชั่วคราว"} disabled={busy} onClick={toggleFreeze} style={{ minHeight: 44, borderRadius: 14, padding: "0 12px", color: "#F8FCFF", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.16)" }}>{status === "frozen" ? <Unlock size={15} /> : <Snowflake size={15} />}<span style={{ marginLeft: 7 }}>{status === "frozen" ? "ปลดอายัด" : "อายัด"}</span></button></div><div style={{ margin: "42px 0 28px", fontSize: "clamp(24px, 5vw, 38px)", fontFamily: "monospace", letterSpacing: ".08em", color: "#F8FCFF" }}>{number}</div><div style={{ display: "flex", gap: 24, color: "#B7C6DE", fontSize: 12 }}><div>หมดอายุ<strong style={{ display: "block", color: "#fff", marginTop: 4 }}>09/29</strong></div><div>CVV<strong style={{ display: "block", color: "#fff", marginTop: 4 }}>{revealed ? "482" : "•••"}</strong></div><div>ผู้ถือบัตร<strong style={{ display: "block", color: "#fff", marginTop: 4 }}>NICHA K.</strong></div></div><div style={{ display: "flex", gap: 8, marginTop: 28 }}><button type="button" aria-label="แสดงหรือซ่อนข้อมูลบัตร" onClick={() => setRevealed(!revealed)} style={{ minHeight: 44, flex: 1, borderRadius: 13, color: "#C7F8FF", background: "rgba(56,241,255,.1)", border: "1px solid rgba(56,241,255,.24)" }}>{revealed ? <EyeOff size={15} /> : <Eye size={15} />}<span style={{ marginLeft: 7 }}>{revealed ? "ซ่อนข้อมูล" : "แสดงข้อมูล"}</span></button><button type="button" aria-label="คัดลอกหมายเลขบัตร" onClick={copyCard} style={{ minHeight: 44, flex: 1, borderRadius: 13, color: "#F7C96B", background: "rgba(247,201,107,.1)", border: "1px solid rgba(247,201,107,.24)" }}><Copy size={15} /><span style={{ marginLeft: 7 }}>คัดลอก</span></button></div></section><aside style={{ ...panelStyle }}><div style={{ color: "#AFC0D8", fontSize: 12 }}>วงเงินใช้จ่ายเดือนนี้</div><div style={{ fontSize: 28, fontWeight: 900, color: "#F7C96B", margin: "7px 0 2px" }}>{baht.format(limit)}</div><div style={{ color: "#AFC0D8", fontSize: 12 }}>ใช้ไป {baht.format(spent)}</div><div role="progressbar" aria-label="สัดส่วนยอดใช้จ่ายต่อวงเงิน" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(usage)} style={{ height: 9, borderRadius: 99, background: "rgba(255,255,255,.1)", margin: "18px 0 8px", overflow: "hidden" }}><div style={{ width: `${usage}%`, height: "100%", background: usage >= 90 ? "#FF5A73" : usage >= 70 ? "#FFC857" : "#00D8FF", borderRadius: 99 }} /></div><div style={{ display: "flex", justifyContent: "space-between", color: "#AFC0D8", fontSize: 11 }}><span>ใช้แล้ว {Math.round(usage)}%</span><span>คงเหลือ {baht.format(limit - spent)}</span></div>{editing ? <div style={{ marginTop: 18 }}><label htmlFor="virtual-card-limit" style={{ display: "block", fontSize: 12, marginBottom: 7 }}>วงเงินใหม่</label><input id="virtual-card-limit" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} style={{ width: "100%", minHeight: 44, borderRadius: 12, padding: "0 12px", color: "#fff", background: "rgba(0,0,0,.2)", border: "1px solid rgba(56,241,255,.3)" }} /><button type="button" onClick={saveLimit} style={{ width: "100%", minHeight: 44, marginTop: 8, borderRadius: 12, color: "#07111F", background: "#38F1FF", border: 0, fontWeight: 900 }}>บันทึกวงเงิน</button></div> : <button type="button" aria-label="แก้ไขวงเงิน Virtual Card" onClick={() => { setDraft(String(limit)); setEditing(true); }} style={{ width: "100%", minHeight: 44, marginTop: 18, borderRadius: 12, color: "#C7F8FF", background: "rgba(56,241,255,.1)", border: "1px solid rgba(56,241,255,.24)", fontWeight: 800 }}>ตั้งวงเงิน</button>}</aside></div></div>;
}

export function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | TransactionType>("all");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const filtered = useMemo(() => transactions.filter((item) => (type === "all" || item.type === type) && (status === "all" || item.status === status) && `${item.title} ${item.merchant} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [query, type, status]);
  return <div className="animate-fade-up"><Header title="ธุรกรรม" description="ค้นหาและติดตามกระแสเงินสดของ CE Empire" /><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>{[["รายรับ", "฿86,000.00", "#38F29B"], ["รายจ่าย", "฿18,850.00", "#FF8DA0"], ["รอดำเนินการ", "1 รายการ", "#FFC857"]].map(([label, value, color]) => <div key={label} style={{ ...panelStyle, padding: 14 }}><div style={{ color: "#AFC0D8", fontSize: 11 }}>{label}</div><strong style={{ display: "block", color, marginTop: 6, fontSize: 20 }}>{value}</strong></div>)}</div><section style={panelStyle}><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}><div style={{ position: "relative", flex: "1 1 220px" }}><Search size={16} style={{ position: "absolute", left: 12, top: 14, color: "#7E94B5" }} /><input aria-label="ค้นหาธุรกรรม" placeholder="ค้นหารายการหรือร้านค้า" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: "100%", minHeight: 44, borderRadius: 12, padding: "0 12px 0 36px", color: "#fff", background: "rgba(0,0,0,.2)", border: "1px solid rgba(122,181,255,.18)" }} /></div><select aria-label="กรองประเภท" value={type} onChange={(e) => setType(e.target.value as typeof type)} style={{ minHeight: 44, borderRadius: 12, padding: "0 10px", color: "#C7F8FF", background: "#101A2D", border: "1px solid rgba(122,181,255,.18)" }}><option value="all">ทุกประเภท</option><option value="income">รายรับ</option><option value="expense">รายจ่าย</option></select><select aria-label="กรองสถานะ" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} style={{ minHeight: 44, borderRadius: 12, padding: "0 10px", color: "#C7F8FF", background: "#101A2D", border: "1px solid rgba(122,181,255,.18)" }}><option value="all">ทุกสถานะ</option><option value="สำเร็จ">สำเร็จ</option><option value="รอดำเนินการ">รอดำเนินการ</option><option value="ยกเลิก">ยกเลิก</option></select></div>{filtered.length === 0 ? <div style={{ padding: 36, textAlign: "center", color: "#AFC0D8" }}>ไม่พบรายการที่ตรงกับตัวกรอง</div> : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}><thead><tr>{["รายการ", "บัญชี", "วันที่", "จำนวนเงิน", "สถานะ"].map((head) => <th key={head} scope="col" style={{ textAlign: "left", padding: "11px 8px", color: "#7E94B5", fontSize: 11, borderBottom: "1px solid rgba(122,181,255,.16)" }}>{head}</th>)}</tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td style={{ padding: "14px 8px" }}><strong>{item.title}</strong><span style={{ display: "block", color: "#7E94B5", fontSize: 11, marginTop: 3 }}>{item.merchant} · {item.category}</span></td><td style={{ color: "#B7C6DE", fontSize: 12 }}>{item.account}</td><td style={{ color: "#B7C6DE", fontSize: 12 }}>{item.date}</td><td style={{ color: item.type === "income" ? "#38F29B" : "#FFB5C1", fontWeight: 900 }}>{item.type === "income" ? "+" : "−"}{baht.format(item.amount)}</td><td><span className={item.status === "สำเร็จ" ? "badge-paid" : item.status === "ยกเลิก" ? "badge-due" : "badge-pending"}>{item.status}</span></td></tr>)}</tbody></table></div>}</section></div>;
}

export type { FinanceTransaction };
