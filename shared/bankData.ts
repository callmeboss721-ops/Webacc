export interface BankInfo {
  code: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  svgIcon: string;
}

// Thai Bank logos - using authentic brand colors and symbolic SVG icons
export const THAI_BANKS: BankInfo[] = [
  {
    code: "KBANK",
    name: "ธนาคารกสิกรไทย",
    shortName: "กสิกร",
    color: "#1BA345",
    bgColor: "#1BA345",
    textColor: "#fff",
    // KBANK: Green with K-shaped symbol (3 vertical bars)
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1BA345"/>
      <path d="M12 10 L12 30 M12 20 L20 10 M12 20 L22 30" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M25 10 L25 30" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    code: "SCB",
    name: "ธนาคารไทยพาณิชย์",
    shortName: "SCB",
    color: "#4E2D8C",
    bgColor: "#4E2D8C",
    textColor: "#fff",
    // SCB: Purple with diamond/spade shape
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#4E2D8C"/>
      <path d="M20 8 L28 18 L20 28 L12 18 Z" fill="none" stroke="#FFD700" stroke-width="2.5"/>
      <path d="M20 11 L26 18 L20 25 L14 18 Z" fill="#FFD700"/>
    </svg>`,
  },
  {
    code: "KTB",
    name: "ธนาคารกรุงไทย",
    shortName: "กรุงไทย",
    color: "#00AEEF",
    bgColor: "#00AEEF",
    textColor: "#fff",
    // KTB: Blue with Nok (bird) symbol - phoenix-like shape
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#00AEEF"/>
      <path d="M20 10 C14 10 10 14 10 20 C10 26 14 30 20 30 C26 30 30 26 30 20 C30 14 26 10 20 10Z" fill="none" stroke="white" stroke-width="2"/>
      <path d="M13 17 C15 14 19 13 22 15 C25 17 26 21 24 24" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <circle cx="20" cy="20" r="3" fill="white"/>
    </svg>`,
  },
  {
    code: "BBL",
    name: "ธนาคารกรุงเทพ",
    shortName: "กรุงเทพ",
    color: "#1E3A8A",
    bgColor: "#1E3A8A",
    textColor: "#fff",
    // BBL: Dark blue with stylized B/building symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1E3A8A"/>
      <rect x="11" y="10" width="18" height="3" rx="1.5" fill="white"/>
      <rect x="13" y="15" width="3" height="15" rx="1.5" fill="white"/>
      <rect x="19" y="15" width="3" height="15" rx="1.5" fill="white"/>
      <rect x="11" y="27" width="18" height="3" rx="1.5" fill="white"/>
      <rect x="25" y="15" width="3" height="15" rx="1.5" fill="white"/>
    </svg>`,
  },
  {
    code: "TTB",
    name: "ธนาคารทหารไทยธนชาต",
    shortName: "TTB",
    color: "#FF6B00",
    bgColor: "#FFFFFF",
    textColor: "#FF6B00",
    // TTB: White bg with orange ttb text
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FFFFFF"/>
      <text x="20" y="25" text-anchor="middle" fill="#FF6B00" font-size="13" font-weight="900" font-family="Arial,sans-serif">ttb</text>
    </svg>`,
  },
  {
    code: "GSB",
    name: "ธนาคารออมสิน",
    shortName: "ออมสิน",
    color: "#E91E8C",
    bgColor: "#E91E8C",
    textColor: "#fff",
    // GSB: Pink with piggy bank / leaf symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#E91E8C"/>
      <path d="M20 9 C15 9 11 13 11 18 C11 22 13 25 17 27 L17 31 L23 31 L23 27 C27 25 29 22 29 18 C29 13 25 9 20 9Z" fill="white" opacity="0.9"/>
      <circle cx="24" cy="16" r="2" fill="#E91E8C"/>
      <path d="M29 18 L32 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    code: "BAY",
    name: "ธนาคารกรุงศรีอยุธยา",
    shortName: "กรุงศรี",
    color: "#FFC107",
    bgColor: "#FFC107",
    textColor: "#000",
    // BAY: Yellow/gold with lotus/flame symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FFC107"/>
      <path d="M20 8 C20 8 14 14 14 20 C14 24 16 27 20 28 C24 27 26 24 26 20 C26 14 20 8 20 8Z" fill="#1A1A1A" opacity="0.8"/>
      <path d="M20 12 C20 12 16 17 16 21 C16 24 17.5 26 20 27 C22.5 26 24 24 24 21 C24 17 20 12 20 12Z" fill="#FFC107"/>
    </svg>`,
  },
  {
    code: "BAAC",
    name: "ธนาคารเพื่อการเกษตรและสหกรณ์",
    shortName: "ธ.ก.ส.",
    color: "#2E7D32",
    bgColor: "#2E7D32",
    textColor: "#fff",
    // BAAC: Green with wheat/leaf symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#2E7D32"/>
      <path d="M20 30 L20 14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="16" cy="18" rx="4" ry="6" fill="white" transform="rotate(-20 16 18)"/>
      <ellipse cx="24" cy="18" rx="4" ry="6" fill="white" transform="rotate(20 24 18)"/>
      <ellipse cx="20" cy="14" rx="3" ry="5" fill="white"/>
    </svg>`,
  },
  {
    code: "CIMB",
    name: "ธนาคารซีไอเอ็มบี ไทย",
    shortName: "CIMB",
    color: "#C41E3A",
    bgColor: "#C41E3A",
    textColor: "#fff",
    // CIMB: Red with stylized C symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#C41E3A"/>
      <path d="M27 14 C24 11 19 11 16 13 C12 16 11 21 13 25 C15 29 20 31 25 29" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  {
    code: "UOB",
    name: "ธนาคารยูโอบี",
    shortName: "UOB",
    color: "#003087",
    bgColor: "#003087",
    textColor: "#fff",
    // UOB: Dark blue with diamond symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#003087"/>
      <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="none" stroke="white" stroke-width="2.5"/>
      <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="white"/>
    </svg>`,
  },
  {
    code: "TISCO",
    name: "ธนาคารทิสโก้",
    shortName: "TISCO",
    color: "#E31837",
    bgColor: "#E31837",
    textColor: "#fff",
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#E31837"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-size="9" font-weight="900" font-family="Arial,sans-serif">TISCO</text>
    </svg>`,
  },
  {
    code: "LHFG",
    name: "ธนาคารแลนด์แอนด์เฮ้าส์",
    shortName: "LH Bank",
    color: "#FF6600",
    bgColor: "#FF6600",
    textColor: "#fff",
    // LH: Orange with house symbol
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#FF6600"/>
      <path d="M20 10 L30 20 L27 20 L27 30 L13 30 L13 20 L10 20 Z" fill="white"/>
      <rect x="17" y="23" width="6" height="7" fill="#FF6600"/>
    </svg>`,
  },
  {
    code: "KIATNAKIN",
    name: "ธนาคารเกียรตินาคินภัทร",
    shortName: "KKP",
    color: "#1565C0",
    bgColor: "#1565C0",
    textColor: "#fff",
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1565C0"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-size="11" font-weight="900" font-family="Arial,sans-serif">KKP</text>
    </svg>`,
  },
  {
    code: "ICBC",
    name: "ธนาคารไอซีบีซี (ไทย)",
    shortName: "ICBC",
    color: "#CC0000",
    bgColor: "#CC0000",
    textColor: "#fff",
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#CC0000"/>
      <text x="20" y="25" text-anchor="middle" fill="#FFD700" font-size="10" font-weight="900" font-family="Arial,sans-serif">ICBC</text>
    </svg>`,
  },
  {
    code: "OTHER",
    name: "ธนาคารอื่น ๆ",
    shortName: "อื่น ๆ",
    color: "#607D8B",
    bgColor: "#37474F",
    textColor: "#fff",
    svgIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#37474F"/>
      <rect x="10" y="18" width="20" height="12" rx="2" fill="white" opacity="0.9"/>
      <path d="M8 18 L20 10 L32 18" fill="white" opacity="0.9"/>
      <rect x="16" y="22" width="4" height="8" rx="1" fill="#37474F"/>
      <rect x="22" y="22" width="4" height="5" rx="1" fill="#37474F"/>
    </svg>`,
  },
];

export function getBankByCode(code: string): BankInfo {
  return THAI_BANKS.find(b => b.code === code) ?? THAI_BANKS[THAI_BANKS.length - 1]!;
}
