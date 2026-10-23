import { useMemo, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatBaht } from "@/lib/twinMetrics";

type PaymentType = "due" | "reimbursed";
type PaymentStatus = "pending" | "paid" | "cancelled";

const panelStyle = {
  borderRadius: 20,
  padding: 18,
  background: "rgba(9,16,34,.72)",
  border: "1px solid rgba(122,181,255,.18)",
};

function Header({ title, description }: { title: string; description: string }) {
  return <header style={{ marginBottom: 16 }}>
    <div style={{ color: "#00F0FF", fontSize: 11, fontWeight: 800, letterSpacing: ".15em" }}>CE EMPIRE FINANCE</div>
    <h1 style={{ margin: "6px 0", fontSize: 25, letterSpacing: "-.035em" }}>{title}</h1>
    <p style={{ color: "#A8B0BF", fontSize: 13 }}>{description}</p>
  </header>;
}

export function VirtualCardPage() {
  // The database does not contain card PAN, CVV, card controls or card spending.
  // Never simulate freeze/unfreeze or expose invented payment credentials.
  return <div className="animate-fade-up">
    <Header title="Virtual Card" description="ข้อมูลบัตรเสมือนจะปรากฏเมื่อเชื่อมต่อผู้ให้บริการบัตรจริง" />
    <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
      <CreditCard size={30} color="#E5C04A" aria-hidden="true" />
      <strong style={{ fontSize: 16, color: "#E5C04A" }}>NO SOURCE — ยังไม่ได้เชื่อมต่อข้อมูลบัตร</strong>
      <p style={{ margin: 0, color: "#A8B0BF", lineHeight: 1.7 }}>
        ยังไม่มีหมายเลขบัตร วงเงิน ยอดใช้จ่าย หรือ API สำหรับอายัด/ปลดอายัดบัตร
        จึงปิดการแสดงเลขบัตรจำลองและปุ่มควบคุมที่ไม่ได้เปลี่ยนสถานะจริง
      </p>
    </section>
  </div>;
}

export function TransactionsPage() {
  const expensesQ = trpc.expenses.list.useQuery(undefined, { refetchInterval: 8000, retry: 1 });
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | PaymentType>("all");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");
  const expenses = expensesQ.data ?? [];

  const filtered = useMemo(() => expenses.filter(item => {
    const searchText = [item.description, item.category, item.note, item.id].join(" ").toLowerCase();
    return (type === "all" || item.type === type)
      && (status === "all" || item.status === status)
      && searchText.includes(query.trim().toLowerCase());
  }), [expenses, query, type, status]);
  const statusLabels: Record<PaymentStatus, string> = {
    pending: "รอดำเนินการ", paid: "จ่ายแล้ว", cancelled: "ยกเลิก",
  };
  const typeLabels: Record<PaymentType, string> = { due: "ค้างจ่าย", reimbursed: "เบิก/คืนเงิน" };

  return <div className="animate-fade-up">
    <Header title="ธุรกรรม" description="รายการรายจ่าย/เบิกจากข้อมูลจริง (expenses.list) — ยังไม่มีสมุดบัญชีรายรับ" />
    <section style={panelStyle}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <label style={{ flex: "1 1 200px" }}>
          <span className="sr-only">ค้นหารายการ</span>
          <div style={{ position: "relative" }}><Search size={16} color="#A8B0BF" style={{ position: "absolute", top: 14, left: 12 }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหารายการ..." aria-label="ค้นหารายการ" style={{ width: "100%", minHeight: 44, borderRadius: 10, padding: "0 10px 0 36px", background: "#101118", color: "#fff", border: "1px solid rgba(255,255,255,.14)" }} /></div>
        </label>
        <label><span className="sr-only">กรองประเภท</span><select aria-label="กรองประเภท" value={type} onChange={e => setType(e.target.value as typeof type)} style={{ minHeight: 44, padding: 9, borderRadius: 10, color: "#fff", background: "#101118", border: "1px solid rgba(255,255,255,.14)" }}>
          <option value="all">ทุกประเภท</option><option value="due">ค้างจ่าย</option><option value="reimbursed">เบิก/คืนเงิน</option>
        </select></label>
        <label><span className="sr-only">กรองสถานะ</span><select aria-label="กรองสถานะ" value={status} onChange={e => setStatus(e.target.value as typeof status)} style={{ minHeight: 44, padding: 9, borderRadius: 10, color: "#fff", background: "#101118", border: "1px solid rgba(255,255,255,.14)" }}>
          <option value="all">ทุกสถานะ</option><option value="pending">รอดำเนินการ</option><option value="paid">จ่ายแล้ว</option><option value="cancelled">ยกเลิก</option>
        </select></label>
      </div>
      {expensesQ.isError ? <p role="alert" style={{ color: "#FF5B5B" }}>โหลดข้อมูลรายจ่ายไม่สำเร็จ กรุณาตรวจการเชื่อมต่อฐานข้อมูล</p>
        : expensesQ.isLoading ? <p style={{ color: "#A8B0BF" }}>กำลังโหลดข้อมูล...</p>
        : filtered.length === 0 ? <p style={{ color: "#A8B0BF" }}>ยังไม่มีรายการที่ตรงกับตัวกรอง</p>
        : <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500, fontVariantNumeric: "tabular-nums" }}>
            <thead><tr>{["รายการ", "ประเภท", "วันที่บันทึก", "จำนวนเงิน", "สถานะ"].map(heading => <th scope="col" key={heading} style={{ fontSize: 11, textAlign: "left", padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,.1)", color: "#A8B0BF" }}>{heading}</th>)}</tr></thead>
            <tbody>{filtered.map(item => <tr key={item.id}>
              <td style={{ padding: "13px 8px", borderBottom: "1px solid rgba(255,255,255,.06)" }}><strong>{item.description || "รายการ #" + item.id}</strong><small style={{ display: "block", color: "#A8B0BF" }}>{item.category || "ไม่ระบุหมวด"}</small></td>
              <td style={{ padding: 8, fontSize: 12 }}>{typeLabels[item.type]}</td>
              <td style={{ padding: 8, fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString("th-TH")}</td>
              <td style={{ padding: 8, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{formatBaht(item.amount)}</td>
              <td style={{ padding: 8 }}><span className={item.status === "paid" ? "badge-paid" : item.status === "cancelled" ? "badge-due" : "badge-pending"}>{statusLabels[item.status]}</span></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </section>
    <p style={{ marginTop: 10, fontSize: 11, color: "#6B7382" }}>ข้อมูลมาจาก expenses ตาม userId เท่านั้น • ไม่มีการสร้างรายการ/ยอดรับจำลอง</p>
  </div>;
}
