import React from "react";
import { getBankByCode, THAI_BANKS } from "../../../shared/bankData";

interface BankLogoProps {
  bankCode: string;
  size?: number;
  className?: string;
  showName?: boolean;
}

// Authentic Thai Bank SVG logos with brand colors
const BANK_LOGOS: Record<string, React.ReactNode> = {
  // กสิกรไทย - Green K shape
  KBANK: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1BA345"/>
      <path d="M12 11h4v7.5l5.5-7.5h5L20 19.5 26.5 29h-5L16 21.5V29h-4V11z" fill="white"/>
    </svg>
  ),
  // ไทยพาณิชย์ - Purple diamond spade
  SCB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#4E2D8C"/>
      <path d="M20 8L27 17.5H22.5L28 26H21.5L20 29L18.5 26H12L17.5 17.5H13L20 8Z" fill="#FFD700"/>
    </svg>
  ),
  // กรุงไทย - Blue phoenix bird
  KTB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#00AEEF"/>
      <path d="M10 22C10 22 13 15 20 14C27 13 30 18 30 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M10 22C10 22 14 28 20 28C26 28 30 22 30 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="20" r="4" fill="white"/>
      <circle cx="20" cy="20" r="2" fill="#00AEEF"/>
    </svg>
  ),
  // กรุงเทพ - Dark blue building
  BBL: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1E3A8A"/>
      <path d="M10 30h20M12 30V18M28 30V18M10 18l10-8 10 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="17" y="23" width="6" height="7" rx="1" fill="white"/>
    </svg>
  ),
  // ทหารไทยธนชาต - White/orange ttb
  TTB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FFFFFF"/>
      <rect x="8" y="17" width="24" height="6" rx="3" fill="#FF6B00"/>
      <text x="20" y="24" textAnchor="middle" fill="white" fontSize="7" fontWeight="900" fontFamily="Arial,sans-serif">ttb</text>
    </svg>
  ),
  // ออมสิน - Pink piggy bank
  GSB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#E91E8C"/>
      <ellipse cx="19" cy="20" rx="8" ry="7" fill="white"/>
      <circle cx="23" cy="17" r="1.5" fill="#E91E8C"/>
      <path d="M27 20h3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 27v3h6v-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M14 17c0-3 2-5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  // กรุงศรีอยุธยา - Gold/yellow flame
  BAY: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FFC107"/>
      <path d="M20 9C20 9 13 16 13 22C13 26.4 16.1 30 20 30C23.9 30 27 26.4 27 22C27 16 20 9 20 9Z" fill="#1A1A1A" opacity="0.85"/>
      <path d="M20 14C20 14 16 19 16 22C16 24.2 17.8 26 20 26C22.2 26 24 24.2 24 22C24 19 20 14 20 14Z" fill="#FFC107"/>
    </svg>
  ),
  // ธ.ก.ส. - Green wheat/rice
  BAAC: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#2E7D32"/>
      <path d="M20 30V14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="15.5" cy="19" rx="3.5" ry="5.5" fill="white" transform="rotate(-15 15.5 19)"/>
      <ellipse cx="24.5" cy="19" rx="3.5" ry="5.5" fill="white" transform="rotate(15 24.5 19)"/>
      <ellipse cx="20" cy="15" rx="3" ry="5" fill="white"/>
    </svg>
  ),
  // CIMB - Red C arc
  CIMB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#C41E3A"/>
      <path d="M28 14C25 11 19 11 15.5 14C12 17 11 22 13 26C15 30 20 31.5 25 29.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  // UOB - Dark blue diamond
  UOB: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#003087"/>
      <path d="M20 9L31 20L20 31L9 20Z" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M20 13L27 20L20 27L13 20Z" fill="white"/>
    </svg>
  ),
  // TISCO - Red cross/plus
  TISCO: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#E31837"/>
      <rect x="11" y="17" width="18" height="6" rx="3" fill="white"/>
      <rect x="17" y="11" width="6" height="18" rx="3" fill="white"/>
    </svg>
  ),
  // LH Bank - Orange house
  LHFG: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FF6600"/>
      <path d="M10 20L20 11L30 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="13" y="20" width="14" height="10" rx="1.5" fill="white"/>
      <rect x="17" y="24" width="6" height="6" rx="1" fill="#FF6600"/>
    </svg>
  ),
  // KKP - Blue
  KIATNAKIN: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1565C0"/>
      <text x="20" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial,sans-serif">KKP</text>
    </svg>
  ),
  // ICBC - Red/Gold
  ICBC: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#CC0000"/>
      <text x="20" y="25" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">ICBC</text>
    </svg>
  ),
  // Other banks - Generic building
  OTHER: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#37474F"/>
      <path d="M10 30h20M12 30V20M28 30V20M10 20l10-8 10 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="16" y="23" width="3" height="4" rx="0.5" fill="white"/>
      <rect x="21" y="23" width="3" height="4" rx="0.5" fill="white"/>
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
          borderRadius: size * 0.25,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 8px ${bank.color}55`,
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

// Custom bank select with logo preview
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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-2xl text-sm font-bold text-left"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.018)), rgba(2,8,21,.82)",
          border: `1px solid ${selectedBank ? selectedBank.color + "55" : "rgba(89,184,255,.22)"}`,
          color: "#F8FCFF",
          outline: "none",
          cursor: "pointer",
          minHeight: 44,
        }}
      >
        {selectedBank ? (
          <>
            <BankLogo bankCode={value} size={28} />
            <span style={{ color: selectedBank.color }}>{selectedBank.shortName}</span>
            <span style={{ color: "#9FB2CE", fontSize: 12, marginLeft: 4 }}>- {selectedBank.name}</span>
          </>
        ) : (
          <span style={{ color: "#9FB2CE" }}>-- เลือกธนาคาร --</span>
        )}
        <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#9FB2CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
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
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          <div
            onClick={() => { onChange("", ""); setOpen(false); }}
            style={{ padding: "10px 14px", cursor: "pointer", color: "#9FB2CE", fontSize: 13 }}
            className="hover:bg-white/5"
          >
            -- เลือกธนาคาร --
          </div>
          {THAI_BANKS.map((bank) => (
            <div
              key={bank.code}
              onClick={() => { onChange(bank.code, bank.name); setOpen(false); }}
              style={{
                padding: "8px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: value === bank.code ? "rgba(89,184,255,.12)" : "transparent",
                transition: "background .15s",
              }}
              className="hover:bg-white/5"
            >
              <BankLogo bankCode={bank.code} size={28} />
              <div>
                <div style={{ color: bank.color, fontWeight: 700, fontSize: 13 }}>{bank.shortName}</div>
                <div style={{ color: "#9FB2CE", fontSize: 11 }}>{bank.name}</div>
              </div>
              {value === bank.code && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-7" stroke="#59B8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
