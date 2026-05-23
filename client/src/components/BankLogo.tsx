import React from "react";
import { getBankByCode, THAI_BANKS } from "../../../shared/bankData";

interface BankLogoProps {
  bankCode: string;
  size?: number;
  className?: string;
  showName?: boolean;
}

/**
 * Authentic Thai Bank Logos - app-icon style (rounded square with brand colors)
 * Designed to closely resemble each bank's official logo and brand identity.
 */
const BANK_LOGOS: Record<string, React.ReactNode> = {
  // ===== กสิกรไทย (KBank) - พื้นเขียว + รวงข้าวขาว =====
  KBANK: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0FA94A"/>
          <stop offset="1" stopColor="#0B7A35"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#kb-bg)"/>
      {/* Rice ear (รวงข้าว) - simplified */}
      <g fill="#FFFFFF">
        <ellipse cx="20" cy="13" rx="2.2" ry="3.5"/>
        <ellipse cx="15.5" cy="16" rx="2" ry="3.2" transform="rotate(-22 15.5 16)"/>
        <ellipse cx="24.5" cy="16" rx="2" ry="3.2" transform="rotate(22 24.5 16)"/>
        <ellipse cx="13" cy="21" rx="1.8" ry="3" transform="rotate(-30 13 21)"/>
        <ellipse cx="27" cy="21" rx="1.8" ry="3" transform="rotate(30 27 21)"/>
        <ellipse cx="17" cy="22" rx="1.8" ry="3.2" transform="rotate(-12 17 22)"/>
        <ellipse cx="23" cy="22" rx="1.8" ry="3.2" transform="rotate(12 23 22)"/>
        <rect x="19.2" y="22" width="1.6" height="10" rx="0.8"/>
      </g>
    </svg>
  ),

  // ===== ไทยพาณิชย์ (SCB) - พื้นม่วง + ใบโพธิ์ทอง =====
  SCB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5F2D9C"/>
          <stop offset="1" stopColor="#3D1B6B"/>
        </linearGradient>
        <linearGradient id="scb-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE07A"/>
          <stop offset="1" stopColor="#E5A720"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#scb-bg)"/>
      {/* ใบโพธิ์ - bodhi leaf shape */}
      <path d="M20 8C16 8 13 13 13 18C13 23 15 28 20 30C25 28 27 23 27 18C27 13 24 8 20 8Z" fill="url(#scb-leaf)"/>
      <path d="M20 30L20 16" stroke="#3D1B6B" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M20 18L17 21M20 21L17.5 24M20 18L23 21M20 21L22.5 24" stroke="#3D1B6B" strokeWidth="0.5" strokeLinecap="round"/>
    </svg>
  ),

  // ===== กรุงไทย (KTB) - พื้นฟ้าครีม + นกวายุภักษ์ =====
  KTB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ktb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00B7E8"/>
          <stop offset="1" stopColor="#0096C7"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#ktb-bg)"/>
      {/* Phoenix bird (นกวายุภักษ์) - simplified swirl */}
      <g fill="#FFFFFF">
        {/* Body */}
        <ellipse cx="20" cy="22" rx="6" ry="5"/>
        {/* Head */}
        <circle cx="24" cy="17" r="2.5"/>
        {/* Beak */}
        <path d="M26.5 17L29 15.5L26.5 18Z"/>
        {/* Wing - upper */}
        <path d="M14 17C12 13 14 11 17 11C18.5 11 20 12 20 14C20 16 17 17 14 17Z"/>
        {/* Wing - lower swirl */}
        <path d="M11 22C9 25 11 28 14 28C15.5 28 17 27 17 25C17 23 14 22 11 22Z"/>
        {/* Tail feathers */}
        <path d="M14 25C12 27 11 29 12 30L15 28L14 25Z"/>
        <path d="M16 27C15 29 14 31 15 31L17 30L16 27Z"/>
      </g>
      {/* Eye */}
      <circle cx="24.5" cy="17" r="0.6" fill="#0096C7"/>
    </svg>
  ),

  // ===== กรุงเทพ (BBL) - พื้นน้ำเงิน + ดอกบัวขาว =====
  BBL: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bbl-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E4DAE"/>
          <stop offset="1" stopColor="#102D6E"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#bbl-bg)"/>
      {/* Lotus flower (ดอกบัว) */}
      <g fill="#FFFFFF">
        {/* Center petal (vertical) */}
        <path d="M20 8C17.5 12 17.5 18 20 22C22.5 18 22.5 12 20 8Z"/>
        {/* Side petals */}
        <path d="M20 11C16 13 13 17 13 22C16.5 22 19.5 19 20 16C20 14 20 12 20 11Z"/>
        <path d="M20 11C24 13 27 17 27 22C23.5 22 20.5 19 20 16C20 14 20 12 20 11Z"/>
        {/* Outer petals */}
        <path d="M11 22C12 26 16 28 20 28C20 24 17 21 14 21C12 21 11 22 11 22Z" opacity="0.85"/>
        <path d="M29 22C28 26 24 28 20 28C20 24 23 21 26 21C28 21 29 22 29 22Z" opacity="0.85"/>
        {/* Base */}
        <ellipse cx="20" cy="29" rx="6" ry="1.2" opacity="0.7"/>
      </g>
    </svg>
  ),

  // ===== ทหารไทยธนชาต (TTB) - พื้นขาว + ttb น้ำเงิน-ส้ม =====
  TTB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill="#FFFFFF"/>
      <rect width="40" height="40" rx="9" fill="none" stroke="#E5E5E5" strokeWidth="0.5"/>
      {/* ttb logotype */}
      <text x="20" y="26" textAnchor="middle" fontFamily="'Inter', Arial, sans-serif" fontSize="18" fontWeight="900" letterSpacing="-1">
        <tspan fill="#1A2D6D">tt</tspan><tspan fill="#F58220">b</tspan>
      </text>
      {/* Orange dot accent */}
      <circle cx="29" cy="14" r="2" fill="#F58220"/>
    </svg>
  ),

  // ===== ออมสิน (GSB) - พื้นชมพู + ตราเสมาทอง =====
  GSB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gsb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ED1B7C"/>
          <stop offset="1" stopColor="#B40E5A"/>
        </linearGradient>
        <linearGradient id="gsb-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE48A"/>
          <stop offset="1" stopColor="#C99528"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#gsb-bg)"/>
      {/* Gold coin/seal */}
      <circle cx="20" cy="20" r="10" fill="url(#gsb-coin)"/>
      <circle cx="20" cy="20" r="10" fill="none" stroke="#FFF" strokeWidth="0.6" opacity="0.6"/>
      {/* Stylized "ออ" letter / piggy bank symbol */}
      <path d="M16 16C14 17 14 20 16 21C17 22 19 22 20 21M24 16C26 17 26 20 24 21C23 22 21 22 20 21" stroke="#7A2014" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="20" cy="23" rx="5" ry="2" fill="#7A2014" opacity="0.3"/>
      <text x="20" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="900" fill="#7A2014">GSB</text>
    </svg>
  ),

  // ===== กรุงศรีอยุธยา (BAY/Krungsri) - พื้นเหลือง + โลโก้ดำ =====
  BAY: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bay-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD400"/>
          <stop offset="1" stopColor="#E6B800"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#bay-bg)"/>
      {/* Krungsri stylized arch / krung sri logo */}
      <g>
        <path d="M10 28V14C10 12 11 11 13 11H27C29 11 30 12 30 14V28" stroke="#1A1A1A" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 28V19C14 18 14.5 17.5 15.5 17.5H17C18 17.5 18.5 18 18.5 19V28" stroke="#1A1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M21.5 28V19C21.5 18 22 17.5 23 17.5H24.5C25.5 17.5 26 18 26 19V28" stroke="#1A1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  ),

  // ===== ธ.ก.ส. (BAAC) - พื้นเขียว + รวงข้าว/หนังสือ =====
  BAAC: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="baac-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF"/>
          <stop offset="1" stopColor="#F0F0F0"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#baac-bg)"/>
      <rect width="40" height="40" rx="9" fill="none" stroke="#D80F1F" strokeWidth="0.8"/>
      {/* Green circular outer */}
      <circle cx="20" cy="20" r="13" fill="none" stroke="#2DA84F" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="13" fill="none" stroke="#D80F1F" strokeWidth="0.8" strokeDasharray="2 1"/>
      {/* Wheat / leaves inside */}
      <g fill="#2DA84F">
        <ellipse cx="16" cy="20" rx="2" ry="4.5" transform="rotate(-20 16 20)"/>
        <ellipse cx="24" cy="20" rx="2" ry="4.5" transform="rotate(20 24 20)"/>
        <ellipse cx="20" cy="16" rx="1.8" ry="4" />
      </g>
      {/* Book/wave at bottom */}
      <path d="M11 25C14 27 18 27 20 25C22 23 26 23 29 25" stroke="#D80F1F" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // ===== CIMB Thai - พื้นแดง + ตัว C =====
  CIMB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cimb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8102E"/>
          <stop offset="1" stopColor="#8B0A1F"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#cimb-bg)"/>
      <text x="20" y="27" textAnchor="middle" fontFamily="'Inter', Arial, sans-serif" fontSize="13" fontWeight="900" fill="#FFFFFF" letterSpacing="-0.5">CIMB</text>
    </svg>
  ),

  // ===== UOB - พื้นน้ำเงิน + ตัว UOB ขาวแดง =====
  UOB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="uob-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#003F87"/>
          <stop offset="1" stopColor="#002654"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#uob-bg)"/>
      {/* UOB diamond/quadrilateral logo - simplified */}
      <path d="M20 9L31 20L20 31L9 20Z" fill="#FFFFFF"/>
      <path d="M20 13L27 20L20 27L13 20Z" fill="#C8102E"/>
      <text x="20" y="22.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="900" fill="#FFFFFF">UOB</text>
    </svg>
  ),

  // ===== ทิสโก้ (TISCO) - พื้นน้ำเงินเข้ม + ตัว T =====
  TISCO: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tisco-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#003D78"/>
          <stop offset="1" stopColor="#002247"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#tisco-bg)"/>
      <text x="20" y="26" textAnchor="middle" fontFamily="'Inter', Arial, sans-serif" fontSize="11" fontWeight="900" fill="#FFFFFF" letterSpacing="-0.3">TISCO</text>
      <circle cx="13" cy="13" r="1.8" fill="#E31837"/>
    </svg>
  ),

  // ===== LH Bank (LHFG) - พื้นส้ม + ตัว LH =====
  LHFG: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lh-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F47B20"/>
          <stop offset="1" stopColor="#C95B0A"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#lh-bg)"/>
      {/* LH stylized house */}
      <path d="M10 22L20 12L30 22" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 21V29H26V21" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="20" y="32" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" fontWeight="900" fill="#FFFFFF">LHB</text>
    </svg>
  ),

  // ===== เกียรตินาคิน (KKP) - พื้นน้ำเงิน + ตัวอักษร =====
  KIATNAKIN: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kkp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F4C81"/>
          <stop offset="1" stopColor="#072E4F"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#kkp-bg)"/>
      <text x="20" y="26" textAnchor="middle" fontFamily="'Inter', Arial, sans-serif" fontSize="12" fontWeight="900" fill="#FFFFFF" letterSpacing="-0.5">KKP</text>
      <rect x="11" y="29" width="18" height="1.5" rx="0.75" fill="#FCB813"/>
    </svg>
  ),

  // ===== ICBC - พื้นแดง + ICBC ทอง =====
  ICBC: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="icbc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D60012"/>
          <stop offset="1" stopColor="#9B000C"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#icbc-bg)"/>
      {/* ICBC circle/coin symbol */}
      <circle cx="20" cy="17" r="6" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
      <rect x="17" y="13.5" width="6" height="7" fill="#FFD700"/>
      <rect x="14.5" y="16" width="11" height="2" fill="#D60012"/>
      <text x="20" y="31" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="900" fill="#FFD700">ICBC</text>
    </svg>
  ),

  // ===== Generic / Other =====
  OTHER: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="other-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B5067"/>
          <stop offset="1" stopColor="#1E2A38"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="url(#other-bg)"/>
      <path d="M10 30h20M12 30V18M28 30V18M10 18l10-8 10 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="17" y="22" width="6" height="8" rx="1" fill="white"/>
    </svg>
  ),
};

export function BankLogo({ bankCode, size = 40, className = "", showName = false }: BankLogoProps) {
  const bank = getBankByCode(bankCode);
  const logo = BANK_LOGOS[bankCode] ?? BANK_LOGOS["OTHER"];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: size * 0.225,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 2px 8px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06) inset, 0 0 14px ${bank.color}33`,
        }}
        title={bank.name}
      >
        {logo}
      </div>
      {showName && (
        <span className="text-sm font-bold" style={{ color: bank.color }}>
          {bank.shortName}
        </span>
      )}
    </div>
  );
}

// Custom bank select with logo preview - mobile optimized
export function BankSelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (code: string, name: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedBank = value ? getBankByCode(value) : null;

  return (
    <div className={`relative ${className}`} style={{ userSelect: "none" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-2xl text-sm font-bold text-left"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)",
          border: `1px solid ${selectedBank ? selectedBank.color + "55" : "rgba(89,184,255,.22)"}`,
          color: "#F8FCFF",
          outline: "none",
          cursor: "pointer",
          minHeight: 48,
        }}
      >
        {selectedBank ? (
          <>
            <BankLogo bankCode={value} size={32} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: selectedBank.color, fontSize: 13, lineHeight: 1.2 }}>{selectedBank.shortName}</div>
              <div style={{ color: "#9FB2CE", fontSize: 10.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedBank.name}</div>
            </div>
          </>
        ) : (
          <span style={{ color: "#9FB2CE" }}>-- เลือกธนาคาร --</span>
        )}
        <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#9FB2CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "rgba(6,14,34,.97)",
            border: "1px solid rgba(89,184,255,.25)",
            borderRadius: 16,
            padding: "6px 0",
            boxShadow: "0 8px 32px rgba(0,0,0,.6)",
            maxHeight: 360,
            overflowY: "auto",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            onClick={() => { onChange("", ""); setOpen(false); }}
            style={{ padding: "12px 14px", cursor: "pointer", color: "#9FB2CE", fontSize: 13 }}
          >
            -- เลือกธนาคาร --
          </div>
          {THAI_BANKS.map((bank) => (
            <div
              key={bank.code}
              onClick={() => { onChange(bank.code, bank.name); setOpen(false); }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: value === bank.code ? "rgba(89,184,255,.12)" : "transparent",
                transition: "background .15s",
                minHeight: 56,
              }}
            >
              <BankLogo bankCode={bank.code} size={36} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: bank.color, fontWeight: 800, fontSize: 13 }}>{bank.shortName}</div>
                <div style={{ color: "#9FB2CE", fontSize: 11 }}>{bank.name}</div>
              </div>
              {value === bank.code && (
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-7" stroke="#59B8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
