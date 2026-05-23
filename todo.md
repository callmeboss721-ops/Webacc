# CE Empire Banking System - TODO

## Database & Backend
- [x] สร้าง schema: accounts, expenses, agents, slip_images
- [x] Migration SQL และ apply
- [x] API: CRUD accounts (เพิ่ม/แก้ไข/ลบ/ค้นหา)
- [x] API: CRUD expenses/payments
- [x] API: CRUD agents (ทีมงาน)
- [x] API: Upload slip image to cloud storage
- [x] API: Export data (JSON)
- [x] API: Dashboard summary stats

## Frontend - Layout & Theme
- [x] Dark cyberpunk theme (ฟ้า-ทอง-ม่วง) ใน index.css
- [x] Sidebar neon icons + mobile nav tabs
- [x] Bottom navigation bar สำหรับมือถือ
- [x] Floating action button
- [x] Google Fonts: Orbitron + Prompt + Noto Sans Thai

## Frontend - Pages
- [x] Dashboard: สรุปยอด real-time + Quick Actions
- [x] หน้าบัญชี: การ์ดบัญชีพร้อมโลโก้ธนาคารไทย
- [x] หน้าชำระเงิน/รายจ่าย: ระบบ agent ledger
- [x] หน้าทีมงาน (agents)
- [x] หน้าเอกสาร/สลิป
- [x] หน้าตั้งค่า

## Thai Bank Logos & Icons
- [x] โลโก้ธนาคารไทยทุกธนาคาร (SVG inline): KBANK, SCB, KTB, BBL, TTB, GSB, BAY, BAAC, CIMB, UOB, TISCO, LHFG
- [x] Neon icons สำหรับทุกเมนู
- [x] Bank dropdown พร้อมโลโก้

## Features
- [x] Copy ข้อมูลบัญชีด้วยคลิกเดียว + toast (เลขบัญชี, ชื่อ, PIN, ทั้งหมด)
- [x] Search/Filter บัญชีตาม ชื่อ/เลขบัญชี/ธนาคาร
- [x] Upload สลิป + preview รูป
- [x] Export ข้อมูล JSON
- [x] Responsive design + mobile bottom nav
- [x] Toast notifications (sonner)
- [x] Status badges (paid/pending/cancelled)
- [x] PIN show/hide toggle

## Authentication
- [x] Login screen พร้อม CE Empire branding + bank logos preview
- [x] Auth check ก่อนแสดงแอป
- [x] Loading state ขณะตรวจสอบ auth
- [x] DocumentsPage component (slip gallery)
- [x] BankSelect custom dropdown พร้อมโลโก้
- [x] BankLogo SVG อัพเกรดให้สมจริงขึ้น

## Testing
- [x] Vitest tests: auth.logout, auth.me, bankData validation (6 tests passed)

## UI Polish - Bank Icons v2
- [ ] อัพเกรดโลโก้ธนาคารเป็น app-icon style (rounded square + สีพื้น brand จริงของแต่ละธนาคาร)
- [ ] กสิกร: พื้นเขียว KBank + ตัว K สีขาว
- [ ] SCB: พื้นม่วง + ใบโพธิ์ทอง
- [ ] กรุงไทย: พื้นฟ้า + นกวายุภักษ์ขาว
- [ ] กรุงเทพ: พื้นน้ำเงิน + ดอกบัวขาว
- [ ] TTB: พื้นขาว + ตัว ttb สีฟ้า/ส้ม
- [ ] ออมสิน: พื้นชมพู + ตราเสมาทอง
- [ ] กรุงศรี: พื้นเหลือง + โลโก้ดำ
- [ ] ธ.ก.ส.: พื้นเขียว + ใบไม้

## Mobile-First Redesign
- [ ] ลบ desktop sidebar ออก ใช้ bottom nav บนทุก viewport
- [ ] เพิ่ม mobile header แบบ sticky พร้อม logo + user menu
- [ ] ขยาย touch target ปุ่มทุกตัว (อย่างน้อย 44x44px)
- [ ] ปรับ padding/spacing ให้เหมาะกับมือถือ
- [ ] ขยายฟอนต์ให้อ่านง่าย
- [ ] Bottom sheet สำหรับฟอร์ม account/expense แทน modal กลางจอ

## Realistic Bank Logos
- [ ] KBank (กสิกร): พื้นเขียว #138F2D + ตัว K สีขาว
- [ ] SCB (ไทยพาณิชย์): พื้นม่วง #4E2A84 + ใบโพธิ์ทอง
- [ ] KTB (กรุงไทย): พื้นฟ้า #00A9E0 + นกวายุภักษ์ขาว
- [ ] BBL (กรุงเทพ): พื้นน้ำเงิน #1E4598 + ดอกบัวขาว
- [ ] TTB: พื้นขาว + ตัว ttb สีฟ้า/ส้ม
- [ ] GSB (ออมสิน): พื้นชมพู #DC0067 + ตราเสมาทอง
- [ ] BAY (กรุงศรี): พื้นเหลือง #FEC10E + โลโก้ดำ
- [ ] BAAC (ธ.ก.ส.): พื้นเขียว + ใบไม้

## AI Card Scanner (Auto-fill)
- [ ] Backend: tRPC procedure `accounts.scanCard` ใช้ invokeLLM vision อ่านข้อมูลจากภาพ
- [ ] Return structured JSON: ชื่อ, นามสกุล, เลขบัตร/บัญชี, ธนาคาร, วันหมดอายุ
- [ ] Frontend: ปุ่ม "📷 สแกนบัตร" ในฟอร์มเพิ่มบัญชี
- [ ] อัพโหลดภาพ → แสดง loading → กรอกข้อมูลอัตโนมัติลงฟอร์ม
- [ ] รองรับทั้ง: บัตรเดบิต/เครดิต, บัตรประชาชน, สมุดบัญชีธนาคาร
- [ ] Detect bank brand จากโลโก้บนบัตรอัตโนมัติ
