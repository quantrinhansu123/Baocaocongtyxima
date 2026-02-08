import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { AppSheetRow } from '../types';

interface ChartsProps {
  data: AppSheetRow[];
}

const COLORS = {
  Pass: '#10b981', // Emerald 500 (Green for success)
  NG: '#dc2626',   // Red 600 (Red for error/NG)
  Input: '#1f2937' // Gray 800 (Dark for neutral/input)
};

export const ProductionCharts: React.FC<ChartsProps> = ({ data }) => {
  // Aggregate data by Date for the Bar Chart
  const aggregatedByDate = React.useMemo(() => {
    const acc: Record<string, { date: string; Pass: number; NG: number; Input: number }> = {};
    
    data.forEach(row => {
      const date = row.Ngay || 'Unknown';
      if (!acc[date]) {
        acc[date] = { date, Pass: 0, NG: 0, Input: 0 };
      }
      acc[date].Pass += row.Pass;
      acc[date].NG += row.HangNG;
      acc[date].Input += row.SoLuongInput;
    });

    // Sort by date
    return Object.values(acc).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // Aggregate data by Product Type
  const aggregatedByProductType = React.useMemo(() => {
    const acc: Record<string, { name: string; Pass: number; NG: number; Input: number }> = {};
    
    data.forEach(row => {
      const type = row.LoaiSP || 'N/A';
      if (!acc[type]) {
        acc[type] = { name: type, Pass: 0, NG: 0, Input: 0 };
      }
      acc[type].Pass += row.Pass;
      acc[type].NG += row.HangNG;
      acc[type].Input += row.SoLuongInput;
    });

    // Sort by Input volume descending
    return Object.values(acc).sort((a, b) => b.Input - a.Input);
  }, [data]);

  // Aggregate totals for Pie Chart
  const pieData = React.useMemo(() => {
    const totalPass = data.reduce((sum, row) => sum + row.Pass, 0);
    const totalNG = data.reduce((sum, row) => sum + row.HangNG, 0);
    return [
      { name: 'Pass', value: totalPass },
      { name: 'NG', value: totalNG },
    ];
  }, [data]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Bar Chart - Date */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-red-600 pl-3">Sản xuất theo ngày</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregatedByDate} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Input" fill={COLORS.Input} radius={[4, 4, 0, 0]} name="Input" />
              <Bar dataKey="Pass" fill={COLORS.Pass} radius={[4, 4, 0, 0]} name="Pass (OK)" />
              <Bar dataKey="NG" fill={COLORS.NG} radius={[4, 4, 0, 0]} name="Hàng NG" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-red-600 pl-3">Tỷ lệ Chất lượng</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Pass' ? COLORS.Pass : COLORS.NG} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Product Type (New) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-3">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-red-600 pl-3">Thống kê theo Loại Sản Phẩm</h3>
        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregatedByProductType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Input" fill={COLORS.Input} radius={[4, 4, 0, 0]} name="Input" />
              <Bar dataKey="Pass" fill={COLORS.Pass} radius={[4, 4, 0, 0]} name="Pass (OK)" />
              <Bar dataKey="NG" fill={COLORS.NG} radius={[4, 4, 0, 0]} name="Hàng NG" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};