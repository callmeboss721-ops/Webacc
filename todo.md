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
- [x] อัพเกรดโลโก้ธนาคารเป็น app-icon style (rounded square + สีพื้น brand จริงของแต่ละธนาคาร)
- [x] กสิกร: พื้นเขียว KBank + รวงข้าวขาว
- [x] SCB: พื้นม่วง + ใบโพธิ์ทอง
- [x] กรุงไทย: พื้นฟ้า + นกวายุภักษ์ขาว
- [x] กรุงเทพ: พื้นน้ำเงิน + ดอกบัวขาว
- [x] TTB: พื้นขาว + ตัว ttb สีฟ้า/ส้ม
- [x] ออมสิน: พื้นชมพู + ตราเสมาทอง
- [x] กรุงศรี: พื้นเหลือง + โลโก้ดำ
- [x] ธ.ก.ส.: พื้นเขียว + ใบไม้

## Mobile-First Redesign
- [x] ลบ desktop sidebar ออก ใช้ bottom nav บนทุก viewport
- [x] เพิ่ม mobile header แบบ sticky พร้อม logo + user menu
- [x] ขยาย touch target ปุ่มทุกตัว (อย่างน้อย 44x44px)
- [x] ปรับ padding/spacing ให้เหมาะกับมือถือ
- [x] ขยายฟอนต์ให้อ่านง่าย (input ขั้นต่ำ 16px กัน iOS zoom)
- [x] Safe-area inset สำหรับ notched devices

## Realistic Bank Logos (completed in v2 section above)
- [x] All major Thai banks completed with realistic brand colors and symbols

## AI Card Scanner (Auto-fill)
- [x] Backend: tRPC procedure `ai.scanCard` ใช้ invokeLLM vision อ่านข้อมูลจากภาพ
- [x] Return structured JSON: ชื่อ, เลขบัญชี, ธนาคาร, confidence
- [x] Frontend: ปุ่ม "สแกน" พร้อม Sparkles icon ในฟอร์มเพิ่มบัญชี
- [x] อัพโหลดภาพ → แสดง loading → กรอกข้อมูลอัตโนมัติลงฟอร์ม
- [x] รองรับทั้ง: บัตรเดบิต/เครดิต, สมุดบัญชีธนาคาร
- [x] Detect bank brand จากโลโก้บนบัตรอัตโนมัติ

## AI Scan Animation (Sci-fi loading)
- [x] เพิ่ม overlay scan animation เมื่อ AI กำลังประมวลผล
- [x] Scan-line วิ่งบนภาพ preview จากบน-ลงล่าง วนซ้ำ
- [x] Corner brackets ตัวล็อค focus 4 มุม
- [x] Status text เปลี่ยนตามขั้นตอน ("กำลังอัพโหลด" → "กำลังวิเคราะห์" → "กำลังอ่านข้อมูล")
- [x] Glow pulse animation รอบ container
- [x] Particle/grid overlay สไตล์ sci-fi


## UI Polish - Glass Depth Layering & Animations
- [x] Glass depth layering: foreground/mid/background ชั้นต่าง ๆ ของ glassmorphism (CSS classes ready)
- [x] Active KPI animation: เลขขยับ + glow pulse เบา ๆ บน dashboard KPI cards (AnimatedMetricCard component)
- [x] Floating action button: ปุ่มเพิ่มลอยจริง (ไม่ใช่ bottom nav) พร้อม shadow + hover effect + float animation
- [x] Compact table: CSS ready สำหรับ table ขนาดกะทัดรัด (No | เวลา | ฝาก | U | Profit | Sent)
- [x] Table row hover: highlight + ripple effect (CSS .compact-table tbody tr:hover)
- [x] Responsive table: scroll horizontal บน mobile (CSS ready)

## Glass Depth Integration
- [x] Glass depth layering integration: ใช้ depth prop ใน GlassCard components ทั้งหมด (dashboard, accounts, payment, agents, documents, settings)
- [x] Animated glow pulse รอบ preview container ระหว่างสแกน (scan-container-pulse keyframe)

## Remaining Tasks
- [x] Compact table implementation (ใช้ CSS ready ในหน้า payment) - แสดง No | เวลา | ฝาก | U | Profit | Sent | สถานะ
- [ ] Banking Skill creation (banking-dashboard-builder)
