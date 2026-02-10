import React, { useEffect, useState, useMemo } from 'react';
import { fetchProductionData } from './services/appsheetService';
import { AppSheetRow, FilterState } from './types';
import { FilterBar } from './components/FilterBar';
import { KPICard } from './components/KPICard';
import { ProductionCharts } from './components/Charts';
import { DataTable } from './components/DataTable';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

const LOGO_URL = "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2F5e303b52.%E1%BA%A2nh.045235.jpg";

const App: React.FC = () => {
  const [rawData, setRawData] = useState<AppSheetRow[]>([]);
  const [filteredData, setFilteredData] = useState<AppSheetRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize filters with a default range of the last 7 days
  const [filters, setFilters] = useState<FilterState>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Subtract 7 days

    // Simple formatting to YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
      orderCode: '',
      orderName: '', 
      productType: [],
      customer: [],
      deliveryStatus: [],
      shiftLeader: []
    };
  });

  // Load data, optionally with server-side filters
  const loadData = async (useServerFilter = false) => {
    setLoading(true);
    try {
      const fetchOptions = useServerFilter ? {
        startDate: filters.startDate,
        endDate: filters.endDate
      } : {};

      const data = await fetchProductionData(fetchOptions);
      setRawData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - Pass 'true' to ensure we use the default 7-day filter initialized in state
  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Compute unique values for dropdowns
  const uniqueProductTypes = useMemo(() => {
    const types = new Set(rawData.map(row => row.LoaiSP).filter(Boolean));
    return Array.from(types).sort();
  }, [rawData]);

  const uniqueCustomers = useMemo(() => {
    const customers = new Set(rawData.map(row => row.KhachHang).filter(Boolean));
    return Array.from(customers).sort();
  }, [rawData]);

  const uniqueDeliveryStatus = useMemo(() => {
    const statuses = new Set(rawData.map(row => row.TrangThaiGiao).filter(Boolean));
    return Array.from(statuses).sort();
  }, [rawData]);

  const uniqueShiftLeaders = useMemo(() => {
    const leaders = new Set(rawData.map(row => row.TruongCa).filter(Boolean));
    return Array.from(leaders).sort();
  }, [rawData]);

  // Client-side Filter Logic
  useEffect(() => {
    let result = rawData;

    if (filters.startDate) {
      result = result.filter(row => row.Ngay >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter(row => row.Ngay <= filters.endDate);
    }
    if (filters.orderCode) {
      const search = filters.orderCode.toLowerCase();
      result = result.filter(row => 
        (row.DonHang || '').toLowerCase().includes(search)
      );
    }
    if (filters.orderName) {
      const search = filters.orderName.toLowerCase();
      result = result.filter(row => 
        (row.TenDon || '').toLowerCase().includes(search)
      );
    }
    if (filters.productType.length > 0) {
      result = result.filter(row => filters.productType.includes(row.LoaiSP));
    }
    if (filters.customer.length > 0) {
      result = result.filter(row => filters.customer.includes(row.KhachHang));
    }
    if (filters.deliveryStatus.length > 0) {
      result = result.filter(row => filters.deliveryStatus.includes(row.TrangThaiGiao));
    }
    if (filters.shiftLeader.length > 0) {
      result = result.filter(row => filters.shiftLeader.includes(row.TruongCa));
    }

    setFilteredData(result);
  }, [rawData, filters]);

  // Calculate Aggregates
  const stats = useMemo(() => {
    let totalInput = 0;
    let totalPass = 0;
    let totalNG = 0;
    let totalPending = 0;

    filteredData.forEach(row => {
      totalInput += row.SoLuongInput;
      totalPass += row.Pass;
      totalNG += row.HangNG;
      
      // Calculate Pending for this row (Input - Pass - NG)
      // Assuming non-negative pending
      const pending = Math.max(0, row.SoLuongInput - row.Pass - row.HangNG);
      totalPending += pending;
    });

    const passRate = totalInput > 0 ? (totalPass / totalInput) * 100 : 0;
    const ngRate = totalInput > 0 ? (totalNG / totalInput) * 100 : 0;
    const pendingRate = totalInput > 0 ? (totalPending / totalInput) * 100 : 0;
    
    return { totalInput, totalPass, totalNG, totalPending, passRate, ngRate, pendingRate };
  }, [filteredData]);

  const handleRefresh = () => {
    const hasDateFilter = !!(filters.startDate || filters.endDate);
    loadData(hasDateFilter);
  };

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden bg-slate-50">
      
      {/* Watermark Logo */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
        <img 
          src={LOGO_URL} 
          alt="Watermark" 
          className="w-1/2 object-contain grayscale"
        />
      </div>

      {/* Header */}
      <header className="bg-primary border-b-[3px] border-red-600 sticky top-0 z-10 shadow-2xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-red-700 rounded-lg p-1 flex items-center justify-center shadow-lg ring-2 ring-red-800">
                <img 
                    src={LOGO_URL} 
                    alt="Logo" 
                    className="h-full w-full object-contain rounded bg-white" 
                />
            </div>
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Dashboard Sản Xuất</h1>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <p className="text-xs text-red-400 font-bold tracking-widest uppercase">Real-time Monitoring</p>
                </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
            v1.6-BETA
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 relative z-1">
        
        {/* Intro / Welcome */}
        <div className="mb-8 border-l-4 border-red-600 pl-4 bg-white/50 py-2 rounded-r-lg">
          <h2 className="text-2xl font-bold text-slate-900">Tổng quan Hoạt động</h2>
          <p className="text-slate-500 mt-1">Theo dõi các chỉ số quan trọng theo thời gian thực.</p>
        </div>

        {/* Filters */}
        <FilterBar 
          filters={filters} 
          onFilterChange={setFilters} 
          onRefresh={handleRefresh}
          isLoading={loading}
          uniqueProductTypes={uniqueProductTypes}
          uniqueCustomers={uniqueCustomers}
          uniqueDeliveryStatus={uniqueDeliveryStatus}
          uniqueShiftLeaders={uniqueShiftLeaders}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <KPICard 
            title="Tổng Input" 
            value={stats.totalInput.toLocaleString()} 
            icon={Activity} 
            color="black" // Customized in component to have red accents
            subText="Tổng sản lượng đầu vào"
          />
          <KPICard 
            title="Pass (OK)" 
            value={stats.totalPass.toLocaleString()} 
            icon={CheckCircle} 
            color="green" 
            subText={`Tỷ lệ đạt: ${stats.passRate.toFixed(2)}%`}
          />
           <KPICard 
            title="Hàng NG" 
            value={stats.totalNG.toLocaleString()} 
            icon={XCircle} 
            color="red" 
            subText={`Tỷ lệ lỗi: ${stats.ngRate.toFixed(2)}%`}
          />
          <KPICard 
            title="Pending" 
            value={stats.totalPending.toLocaleString()} 
            icon={Clock} 
            color="yellow"
            subText={`Chưa xử lý: ${stats.pendingRate.toFixed(2)}%`} 
          />
        </div>

        {/* Visualizations */}
        <ProductionCharts data={filteredData} />

        {/* Data Table */}
        <DataTable data={filteredData} />

      </main>
    </div>
  );
};

export default App;