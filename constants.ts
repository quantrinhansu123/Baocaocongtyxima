export const APP_SHEET_CONFIG = {
  appId: '9664c7b9-d2da-4ca0-a32f-e0011ca47144',
  accessKey: 'V2-phqlX-WYQ36-If1qU-agfBo-Tmt2k-azwGa-lQjoP-gwMOr',
  tableName: 'Bảng theo dõi sản xuất',
  apiUrl: (appId: string, tableName: string) => 
    `https://api.appsheet.com/api/v2/apps/${appId}/tables/${encodeURIComponent(tableName)}/Action`
};

// Fallback data in case API call fails (CORS issues are common with AppSheet direct browser calls)
// Using exact column names as specified by the user to ensure mapping logic is robust
// Dates updated to MM/DD/YYYY format as per user requirement
export const MOCK_DATA = [
  { "Ngày": '10/25/2023', "Đơn hàng": 'PO-2023-001', "Tên đơn": "Áo thun cổ tròn", "Loại sp": "Áo Thun", "Khách hàng": "Adidas", "Số lượng inputs": 500, "pass": 480, "Hàng NG": 20, "Trạng thái giao": "Đã giao" },
  { "Ngày": '10/25/2023', "Đơn hàng": 'PO-2023-002', "Tên đơn": "Jean Slimfit", "Loại sp": "Quần Jean", "Khách hàng": "Nike", "Số lượng inputs": 300, "pass": 290, "Hàng NG": 10, "Trạng thái giao": "Đang xử lý" },
  { "Ngày": '10/26/2023', "Đơn hàng": 'PO-2023-001', "Tên đơn": "Áo thun cổ tròn", "Loại sp": "Áo Thun", "Khách hàng": "Adidas", "Số lượng inputs": 200, "pass": 195, "Hàng NG": 5, "Trạng thái giao": "Đã giao" },
  { "Ngày": '10/26/2023', "Đơn hàng": 'PO-2023-003', "Tên đơn": "Jacket dù 2 lớp", "Loại sp": "Áo Khoác", "Khách hàng": "Puma", "Số lượng inputs": 600, "pass": 550, "Hàng NG": 50, "Trạng thái giao": "Chờ giao" },
  { "Ngày": '10/27/2023', "Đơn hàng": 'PO-2023-002', "Tên đơn": "Jean Slimfit", "Loại sp": "Quần Jean", "Khách hàng": "Nike", "Số lượng inputs": 400, "pass": 380, "Hàng NG": 20, "Trạng thái giao": "Đang xử lý" },
  { "Ngày": '10/27/2023', "Đơn hàng": 'PO-2023-004', "Tên đơn": "Váy xếp ly", "Loại sp": "Váy", "Khách hàng": "Zara", "Số lượng inputs": 1000, "pass": 950, "Hàng NG": 50, "Trạng thái giao": "Hủy" },
];