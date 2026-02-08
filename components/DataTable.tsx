import React from 'react';
import { AppSheetRow } from '../types';
import { AlertCircle, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

interface DataTableProps {
  data: AppSheetRow[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // Helper to format ISO date back to VN format
  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return '-';
    try {
      const [y, m, d] = isoDate.split('-');
      if (y && m && d) return `${d}/${m}/${y}`;
      return isoDate;
    } catch {
      return isoDate;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('đã') || s.includes('xong') || s.includes('hoàn thành')) {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> {status}</span>;
    }
    if (s.includes('chờ') || s.includes('đang') || s.includes('pending')) {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> {status}</span>;
    }
    if (s.includes('hủy') || s.includes('cancel')) {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"><XCircle className="w-3 h-3 mr-1"/> {status}</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{status || '-'}</span>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-600 pl-3">Chi tiết sản xuất</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-red-700 text-white font-medium shadow-md">
            <tr>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Tên đơn</th>
              <th className="px-6 py-4">Loại SP</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Trưởng ca</th>
              <th className="px-6 py-4">TT Giao</th>
              <th className="px-6 py-4 text-right">Input</th>
              <th className="px-6 py-4 text-right">Pass</th>
              <th className="px-6 py-4 text-right">% Pass</th>
              <th className="px-6 py-4 text-right">NG</th>
              <th className="px-6 py-4 text-right">% NG</th>
              <th className="px-6 py-4 text-right">Pending</th>
              <th className="px-6 py-4 text-right">% Pend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row, index) => {
                const input = row.SoLuongInput;
                const pass = row.Pass;
                const ng = row.HangNG;
                const pending = Math.max(0, input - pass - ng);

                const passRate = input > 0 ? (pass / input) * 100 : 0;
                const ngRate = input > 0 ? (ng / input) * 100 : 0;
                const pendingRate = input > 0 ? (pending / input) * 100 : 0;
                
                const isHighDefect = ngRate > 5;

                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{formatDisplayDate(row.Ngay)}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold max-w-xs truncate" title={row.TenDon}>
                        {row.TenDon || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.LoaiSP || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{row.KhachHang || '-'}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.TruongCa || '-'}</td>
                    <td className="px-6 py-4">
                        {getStatusBadge(row.TrangThaiGiao)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{input.toLocaleString()}</td>
                    
                    {/* Pass Stats */}
                    <td className="px-6 py-4 text-right text-emerald-600">{pass.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-600 font-medium">{passRate.toFixed(1)}%</td>

                    {/* NG Stats */}
                    <td className="px-6 py-4 text-right text-red-600 font-semibold">{ng.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        <span className={isHighDefect ? "text-white bg-red-600 px-2 py-0.5 rounded text-xs font-bold" : ""}>
                            {ngRate.toFixed(1)}%
                        </span>
                    </td>

                    {/* Pending Stats */}
                    <td className="px-6 py-4 text-right text-amber-600">{pending.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-600 font-medium">{pendingRate.toFixed(1)}%</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={13} className="px-6 py-12 text-center text-slate-400">
                  Không có dữ liệu hiển thị
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};