export interface AppSheetRow {
  _RowNumber?: number;
  id?: string;
  // Mapped properties based on user request (assuming probable column names)
  // Adjust these keys if your actual AppSheet column names differ
  Ngay: string; // Date
  DonHang: string; // Order ID/Code
  TenDon: string; // Order Name
  SoLuongInput: number; // Input Quantity
  Pass: number; // Pass Quantity
  HangNG: number; // NG Quantity
  LoaiSP: string; // Product Type
  KhachHang: string; // Customer
  TrangThaiGiao: string; // Delivery Status (New)
  TruongCa: string; // Shift Leader (New)
  [key: string]: any; // Allow other columns
}

export interface ProductionStat {
  date: string;
  totalInput: number;
  totalPass: number;
  totalNG: number;
  ngRate: number;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  orderCode: string;
  orderName: string;
  productType: string[]; // Changed to array for multi-select
  customer: string[];    // Changed to array for multi-select
  deliveryStatus: string[]; // New filter, array for multi-select
  shiftLeader: string[]; // New filter for Shift Leader
}

export interface KPI {
  label: string;
  value: number | string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'red' | 'yellow';
}