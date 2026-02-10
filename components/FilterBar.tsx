import React, { useState, useEffect, useRef } from 'react';
import { FilterState } from '../types';
import { Search, Calendar, RefreshCw, Users, Tag, FileText, Hash, Truck, ChevronDown, Check, UserCheck, Menu, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onRefresh: () => void;
  isLoading: boolean;
  uniqueProductTypes: string[];
  uniqueCustomers: string[];
  uniqueDeliveryStatus: string[];
  uniqueShiftLeaders: string[];
}

/**
 * Reusable Multi-Select Dropdown Component
 */
const MultiSelectDropdown = ({ 
  label, 
  icon: Icon, 
  options, 
  selectedValues, 
  onChange 
}: { 
  label: string; 
  icon: any; 
  options: string[]; 
  selectedValues: string[]; 
  onChange: (values: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(newSelected);
  };

  const selectedCount = selectedValues.length;
  const displayText = selectedCount === 0 
    ? `Tất cả ${label}` 
    : selectedCount === options.length 
      ? `Tất cả ${label}`
      : `${selectedCount} ${label} đã chọn`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full pl-3 pr-3 py-2 border rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 ${
          isOpen ? 'border-red-500 ring-2 ring-red-500' : 'border-slate-300'
        } ${selectedCount > 0 ? 'bg-red-50 text-red-700 font-medium' : 'bg-white text-slate-600'}`}
      >
        <div className="flex items-center gap-2 truncate">
          <Icon className={`h-4 w-4 ${selectedCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
          <span className="truncate max-w-[120px]">{displayText}</span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full min-w-[200px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm select-none transition-colors ${
                      isSelected ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-red-600 border-red-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleToggleOption(option)}
                    />
                    <span className="truncate">{option || '(Trống)'}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs">Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  isLoading,
  uniqueProductTypes,
  uniqueCustomers,
  uniqueDeliveryStatus,
  uniqueShiftLeaders
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleStringChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleArrayChange = (key: keyof FilterState, value: string[]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col gap-3">
      {/* Mobile Header with Toggle Button */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="text-base font-semibold text-slate-800">Bộ lọc</h3>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Date Filters - Always Visible */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="date"
            className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 block w-full outline-none transition-shadow"
            value={filters.startDate}
            onChange={(e) => handleStringChange('startDate', e.target.value)}
            placeholder="Từ ngày"
          />
        </div>
        <span className="text-slate-400 shrink-0">-</span>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="date"
            className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 block w-full outline-none transition-shadow"
            value={filters.endDate}
            onChange={(e) => handleStringChange('endDate', e.target.value)}
            placeholder="Đến ngày"
          />
        </div>
        {/* Refresh Button - Mobile */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 active:bg-red-800 shadow-md transition-all shrink-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Grid - Collapsible on Mobile */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden lg:grid'}`}>
        
        {/* 1. Product Type Multi-Select */}
        <MultiSelectDropdown 
          label="Loại SP" 
          icon={Tag}
          options={uniqueProductTypes}
          selectedValues={filters.productType}
          onChange={(values) => handleArrayChange('productType', values)}
        />

        {/* 2. Customer Multi-Select */}
        <MultiSelectDropdown 
          label="Khách hàng" 
          icon={Users}
          options={uniqueCustomers}
          selectedValues={filters.customer}
          onChange={(values) => handleArrayChange('customer', values)}
        />

        {/* 3. Shift Leader Multi-Select */}
        <MultiSelectDropdown 
          label="Trưởng ca" 
          icon={UserCheck}
          options={uniqueShiftLeaders}
          selectedValues={filters.shiftLeader}
          onChange={(values) => handleArrayChange('shiftLeader', values)}
        />

        {/* 4. Delivery Status Multi-Select */}
        <MultiSelectDropdown 
          label="Trạng thái" 
          icon={Truck}
          options={uniqueDeliveryStatus}
          selectedValues={filters.deliveryStatus}
          onChange={(values) => handleArrayChange('deliveryStatus', values)}
        />

        {/* 5. Order Code Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 block w-full outline-none transition-shadow"
            placeholder="Mã Đơn..."
            value={filters.orderCode}
            onChange={(e) => handleStringChange('orderCode', e.target.value)}
          />
        </div>

        {/* 6. Order Name Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 block w-full outline-none transition-shadow"
            placeholder="Tên đơn..."
            value={filters.orderName}
            onChange={(e) => handleStringChange('orderName', e.target.value)}
          />
        </div>
      </div>

      {/* Refresh Button - Desktop */}
      <div className="hidden lg:flex justify-end">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 active:bg-red-800 shadow-md transition-all min-w-[100px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
};