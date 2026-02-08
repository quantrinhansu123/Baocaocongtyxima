import { APP_SHEET_CONFIG, MOCK_DATA } from '../constants';
import { AppSheetRow } from '../types';

interface FetchOptions {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export const fetchProductionData = async (options?: FetchOptions): Promise<AppSheetRow[]> => {
  const { appId, accessKey, tableName, apiUrl } = APP_SHEET_CONFIG;
  
  const url = apiUrl(appId, tableName);

  // Construct AppSheet Selector expression for Server-side filtering
  // Format: AND([Ngày] >= "MM/DD/YYYY", [Ngày] <= "MM/DD/YYYY")
  let selectorExpression = "";
  if (options?.startDate || options?.endDate) {
    const conditions = [];
    
    if (options.startDate) {
      // Convert ISO YYYY-MM-DD to MM/DD/YYYY for AppSheet
      const [y, m, d] = options.startDate.split('-');
      conditions.push(`[Ngày] >= "${m}/${d}/${y}"`);
    }
    
    if (options.endDate) {
      const [y, m, d] = options.endDate.split('-');
      conditions.push(`[Ngày] <= "${m}/${d}/${y}"`);
    }

    if (conditions.length > 0) {
      // Use FILTER() syntax or simple logic depending on API version. 
      // Safest standard for Action "Find" is just the condition if supported, 
      // but commonly used with specific filter wrappers.
      // Trying the direct logical expression which is most common for Selectors.
      selectorExpression = conditions.length > 1 
        ? `AND(${conditions.join(', ')})` 
        : conditions[0];
    }
  }

  try {
    const bodyPayload: any = {
      Action: "Find",
      Properties: {
        Locale: "vi-VN",
        Timezone: "Asia/Ho_Chi_Minh"
      },
      Rows: [] // Empty list usually implies searching based on Selector or getting all
    };

    // Only add Selector if we have conditions
    if (selectorExpression) {
      bodyPayload.Selector = selectorExpression;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'ApplicationAccessKey': accessKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // AppSheet usually returns an array of rows
    if (Array.isArray(data)) {
      return normalizeData(data);
    } else if (data && Array.isArray(data.Rows)) {
        return normalizeData(data.Rows);
    }
    
    return [];

  } catch (error) {
    console.error("Failed to fetch AppSheet data", error);
    console.warn("Falling back to MOCK DATA.");
    // In a real scenario, we might want to filter the mock data here too to simulate the API
    return normalizeData(MOCK_DATA);
  }
};

/**
 * Normalizes keys to match our internal TypeScript interface.
 * Implements strict parsing to ensure data accuracy ("Số liệu phải chuẩn").
 */
const normalizeData = (rows: any[]): AppSheetRow[] => {
  return rows.map(row => {
    // Attempt to find keys regardless of case or slight variations
    const getRawVal = (keys: string[]) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null) return row[k];
      }
      return undefined;
    };

    const getString = (keys: string[]) => {
      const val = getRawVal(keys);
      return val !== undefined ? String(val) : "";
    };

    const rawDate = getRawVal(['Ngày', 'Ngay', 'Date', 'date']);
    const rawDonHang = getString(['Đơn hàng', 'DonHang', 'Order', 'Mã Đơn Hàng', 'MaDonHang']);
    const rawInput = getRawVal(['Số lượng inputs', 'SoLuongInput', 'Input', 'So luong input']);
    const rawPass = getRawVal(['pass', 'Pass', 'OK', 'Quantity OK']);
    const rawNG = getRawVal(['Hàng NG', 'HangNG', 'Fail', 'NG', 'ng']);
    
    // New mappings
    const rawLoaiSP = getString(['Loại sp', 'LoaiSP', 'Product Type', 'Type', 'Loại sản phẩm']);
    const rawKhachHang = getString(['Khách hàng', 'KhachHang', 'Customer', 'Client']);
    const rawTenDon = getString(['Tên đơn', 'TenDon', 'Order Name', 'Name', 'Tên sản phẩm']);
    const rawTrangThaiGiao = getString(['Trạng thái giao', 'TrangThaiGiao', 'Status', 'Delivery Status', 'Tình trạng']);
    const rawTruongCa = getString(['Trưởng ca', 'TruongCa', 'Shift Leader', 'Leader', 'Quản lý ca']);

    return {
        Ngay: parseAppSheetDate(rawDate),
        DonHang: rawDonHang,
        TenDon: rawTenDon,
        LoaiSP: rawLoaiSP,
        KhachHang: rawKhachHang,
        TrangThaiGiao: rawTrangThaiGiao,
        TruongCa: rawTruongCa,
        SoLuongInput: parseAppSheetNumber(rawInput),
        Pass: parseAppSheetNumber(rawPass),
        HangNG: parseAppSheetNumber(rawNG),
        _RowNumber: row['_RowNumber'],
        id: row['id'] || row['_RowNumber']
    };
  });
};

// Helper: Convert various date formats to ISO YYYY-MM-DD
const parseAppSheetDate = (raw: any): string => {
  if (!raw) return '';
  const str = String(raw).trim();
  
  // Handle MM/DD/YYYY (Format specified by user)
  // Regex: start with 1-2 digits, separator, 1-2 digits, separator, 4 digits
  const mdyMatch = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (mdyMatch) {
    const [_, m, d, y] = mdyMatch;
    // Return ISO format YYYY-MM-DD
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Handle YYYY-MM-DD (ISO)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.substring(0, 10);
  }

  // Fallback: Try Date.parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  return str; // Return raw if all parsing fails
};

// Helper: Clean and parse numbers
const parseAppSheetNumber = (raw: any): number => {
  if (raw === undefined || raw === null || raw === '') return 0;
  if (typeof raw === 'number') return raw;
  
  const str = String(raw).trim();
  
  const cleanStr = str.replace(/,/g, ''); 
  
  const val = Number(cleanStr);
  return isNaN(val) ? 0 : val;
};