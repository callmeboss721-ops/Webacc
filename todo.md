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
