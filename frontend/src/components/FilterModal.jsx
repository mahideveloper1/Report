// src/components/FilterModal.jsx
// Modal for configuring filters for selected metrics

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { filterOptions } from '../data/metricsData';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  metric, 
  currentFilter, 
  onApplyFilter 
}) => {
  const [filterSettings, setFilterSettings] = useState({});
  
  // Initialize filter settings when modal opens or metric changes
  useEffect(() => {
    if (metric && isOpen) {
      setFilterSettings(currentFilter || {});
    }
  }, [isOpen, metric, currentFilter]);
  
  if (!isOpen || !metric) return null;
  
  const handleApply = () => {
    onApplyFilter(metric.id, filterSettings);
    onClose();
  };
  
  const handleReset = () => {
    setFilterSettings({});
  };
  
  const updateFilterSetting = (filterType, value) => {
    setFilterSettings(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Render filter controls based on available filters for this metric
  const renderFilterControls = () => {
    return (
      <div className="space-y-4">
        {metric.filters.map(filterType => {
          const option = filterOptions[filterType];
          if (!option) return null;
          
          switch (option.type) {
            case 'dateRange':
              return (
                <div key={filterType} className="space-y-2">
                  <label className="block text-sm font-medium">{filterType}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">{option.startLabel}</label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filterSettings.startDate || ''}
                        onChange={(e) => updateFilterSetting('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">{option.endLabel}</label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filterSettings.endDate || ''}
                        onChange={(e) => updateFilterSetting('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
              
            case 'date':
              return (
                <div key={filterType} className="space-y-2">
                  <label className="block text-sm font-medium">{filterType}</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filterSettings.date || ''}
                    onChange={(e) => updateFilterSetting('date', e.target.value)}
                  />
                </div>
              );
              
            case 'select':
              return (
                <div key={filterType} className="space-y-2">
                  <label className="block text-sm font-medium">{filterType}</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filterSettings.value || ''}
                    onChange={(e) => updateFilterSetting('value', e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {option.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
              
            case 'number':
              return (
                <div key={filterType} className="space-y-2">
                  <label className="block text-sm font-medium">{filterType}</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filterSettings.value || ''}
                    onChange={(e) => updateFilterSetting('value', e.target.value)}
                    placeholder={option.label}
                  />
                </div>
              );
              
            case 'range':
              return (
                <div key={filterType} className="space-y-2">
                  <label className="block text-sm font-medium">{filterType}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">{option.minLabel}</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filterSettings.min || ''}
                        onChange={(e) => updateFilterSetting('min', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">{option.maxLabel}</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filterSettings.max || ''}
                        onChange={(e) => updateFilterSetting('max', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
              
            case 'toggle':
              return (
                <div key={filterType} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`toggle-${filterType}`}
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={filterSettings.enabled || false}
                    onChange={(e) => updateFilterSetting('enabled', e.target.checked)}
                  />
                  <label htmlFor={`toggle-${filterType}`} className="text-sm font-medium">
                    {option.label}
                  </label>
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filter: {metric.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          {renderFilterControls()}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;