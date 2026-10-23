import { useMemo, useState } from "react";
import { CreditCard, Lock, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatBaht } from "@/lib/twinMetrics";

const panelStyle = {
  borderRadius: 20,
  padding: 18,
  background: "rgba(9,16,34,.72)",
  border: "1px solid rgba(122,181,255,.18)",
};

function Header({ title, description }: { title: string; description: string }) {
  return <div style={{ marginBottom: 16 }}>
    <div style={{ color: "#38F1FF", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>FINANCE OPERATIONS</div>
    <h1 style={{ margin: "5px 0 4px", fontSize: 28 }}>{title}</h1>
    <p style={{ margin: 0, color: "#AFC0D8", fontSize: 13 }}>{description}</p>
  </div>;
}

/** No actual card issuer, limit or card API is connected to this project yet. */
export function VirtualCardPage() {
  return <div className="animate-fade-up">
    <Header title="Virtual Card" description="การเชื่อมต่อข้อมูลบัตรเสมือน" />
    <section style={{ ...panelStyle, textAlign: "center", padding: 32 }}>
      <CreditCard size={40} color="#E5C04A" style={{ margin: "0 auto 16px" }} />
      <strong style={{ display: "block", color: "#E5C04A", fontSize: 18 }}>NO SOURCE</strong>
      <p style={{ color: "#AFC0D8", fontSize: 13, lineHeight: 1.6, maxWidth: 460, margin: "12px auto" }}>
        ยังไม่มีแหล่งข้อมูลบัตรจริงจากผู้ให้บริการ จึงไม่แสดงเลขบัตร, CVV, วงเงิน หรือสถานะอายัดที่เป็นข้อมูลสมมติ
      </p>
      <span style={{ color: "#94A3B8", fontSize: 12 }}><Lock size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />การอายัดและปลดอายัดจะเปิดใช้งานเมื่อเชื่อมต่อ API จริงพร้อมการยืนยันสิทธิ์</span>
    </section>
  </div>;
}

type TypeFilter = "all" | "due" | "reimbursed";
type StatusFilter = "all" | "pending" | "paid" | "cancelled";
const statusText: Record<Exclude<StatusFilter, "all">, string> = {
  pending: "รอดำเนินการ",
  paid: "จ่ายแล้ว",
  cancelled: "ยกเลิก",
};

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const expensesQ = trpc.expenses.list.useQuery(undefined, { refetchInterval: 8000, retry: 1 });
  const summaryQ = trpc.dashboard.twinSummary.useQuery(undefined, { refetchInterval: 8000, retry: 1 });

  const filtered = useMemo(() => (expensesQ.data ?? []).filter(item => {
    const text = [item.description ?? "", item.category ?? "", String(item.id)].join(" ").toLocaleLowerCase("th-TH");
    return (type === "all" || item.type === type)
      && (status === "all" || item.status === status)
      && text.includes(search.trim().toLocaleLowerCase("th-TH"));
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  [expensesQ.data, search, type, status]);

  const pending = summaryQ.data?.pendingPayments;
  const monthOut = summaryQ.data?.monthOut ?? null;

  return <div className="animate-fade-up">
    <Header title="ธุรกรรม" description="รายการค่าใช้จ่ายที่บันทึกจริงใน CE Empire — ไม่รวมรายรับที่ยังไม่มีแหล่งข้อมูล" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))", gap: 10, marginBottom: 14 }}>
      {[
        { label: "รายรับ", value: "NO SOURCE", color: "#A8B0BF" },
        { label: "ยอดจ่ายเดือนนี้ (UTC)", value: summaryQ.isError ? "NO SOURCE" : formatBaht(monthOut), color: "#FFB5C1" },
        { label: "รายการค้างทั้งหมด", value: summaryQ.isError || pending == null ? "NO SOURCE" : String(pending), color: "#FFC857" },
      ].map(item => <div key={item.label} style={{ ...panelStyle, padding: 14 }}>
        <span style={{ display: "block", fontSize: 11, color: "#AFC0D8" }}>{item.label}</span>
        <strong style={{ color: item.color, marginTop: 7, display: "block", fontSize: 17, overflowWrap: "anywhere" }}>{item.value}</strong>
      </div>)}
    </div>
    <section style={panelStyle}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <label style={{ position: "relative", flex: "1 1 180px" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 14, color: "#7E94B5" }} />
          <input aria-label="ค้นหาธุรกรรม" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหารายการ / หมวดหมู่" style={{ width: "100%", minHeight: 44, padding: "0 12px 0 36px", borderRadius: 12, background: "#101A2D", color: "white", border: "1px solid #314158" }} />
        </label>
        <select aria-label="กรองประเภท" value={type} onChange={e => setType(e.target.value as TypeFilter)}
          style={{ minHeight: 44, borderRadius: 12, padding: "0 10px", background: "#101A2D", color: "white", border: "1px solid #314158" }}>
          <option value="all">ทุกประเภท</option><option value="due">ค้างจ่าย</option><option value="reimbursed">เบิก/คืนเงิน</option>
        </select>
        <select aria-label="กรองสถานะ" value={status} onChange={e => setStatus(e.target.value as StatusFilter)}
          style={{ minHeight: 44, borderRadius: 12, padding: "0 10px", background: "#101A2D", color: "white", border: "1px solid #314158" }}>
          <option value="all">ทุกสถานะ</option><option value="pending">รอดำเนินการ</option><option value="paid">จ่ายแล้ว</option><option value="cancelled">ยกเลิก</option>
        </select>
      </div>
      {expensesQ.isError ? <p role="alert" style={{ color: "#FFB5C1" }}>อ่านรายการไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล</p>
        : expensesQ.isLoading ? <p style={{ color: "#AFC0D8" }}>กำลังโหลดรายการ...</p>
        : filtered.length === 0 ? <p style={{ padding: 28, textAlign: "center", color: "#AFC0D8" }}>ยังไม่มีรายการที่ตรงกับตัวกรอง</p>
        : <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 550, borderCollapse: "collapse" }}>
            <thead><tr>{["รายการ", "วันที่", "ประเภท", "จำนวนเงิน", "สถานะ"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 7px", color: "#AFC0D8", fontSize: 11, borderBottom: "1px solid #314158" }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(item => <tr key={item.id}>
              <td style={{ padding: "13px 7px" }}><strong>{item.description || "รายการ #" + item.id}</strong><small style={{ display: "block", color: "#AFC0D8" }}>{item.category || "ไม่ระบุหมวดหมู่"}</small></td>
              <td style={{ padding: "13px 7px", fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString("th-TH")}</td>
              <td style={{ padding: "13px 7px", fontSize: 12 }}>{item.type === "due" ? "ค้างจ่าย" : "เบิก/คืนเงิน"}</td>
              <td style={{ padding: "13px 7px", fontFamily: "monospace", color: "#FFB5C1" }}>{formatBaht(item.amount)}</td>
              <td style={{ padding: "13px 7px" }}><span className={item.status === "paid" ? "badge-paid" : item.status === "cancelled" ? "badge-due" : "badge-pending"}>{statusText[item.status]}</span></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </section>
  </div>;
}
