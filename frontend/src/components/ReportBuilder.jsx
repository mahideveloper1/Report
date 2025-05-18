// src/components/ReportBuilder.jsx
// Component for building and configuring reports

import React, { useState } from 'react';
import { Check, X, Settings } from 'lucide-react';
import MetricSelector from './MetricSelector';
import FilterModal from './FilterModal';

const ReportBuilder = ({ 
  selectedMetrics, 
  toggleMetric, 
  reportName,
  setReportName,
  dataCount,
  setDataCount,
  filters,
  updateFilter,
  resetFilter,
  resetAllFilters,
  generateReport,
  error
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentMetricForFilter, setCurrentMetricForFilter] = useState(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const handleOpenFilterModal = (metric) => {
    setCurrentMetricForFilter(metric);
    setFilterModalOpen(true);
  };
  
  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
    setCurrentMetricForFilter(null);
  };
  
  const handleApplyFilter = (metricId, filterSettings) => {
    updateFilter(metricId, filterSettings);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    generateReport();
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 mb-1">
                Report Name
              </label>
              <input
                id="report-name"
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter report name"
                required
              />
            </div>
            
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <Settings size={14} />
                <span>{showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}</span>
              </button>
            </div>
            
            {showAdvancedSettings && (
              <div className="p-4 bg-gray-50 rounded-md">
                <div>
                  <label htmlFor="data-count" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Records to Generate
                  </label>
                  <input
                    id="data-count"
                    type="number"
                    min="10"
                    max="1000"
                    value={dataCount}
                    onChange={(e) => setDataCount(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {Object.keys(filters).length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Applied Filters</h3>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Reset All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(filters).map(([metricId, filterSettings]) => {
                        const metric = selectedMetrics.find(m => m.id === metricId);
                        if (!metric) return null;
                        
                        return (
                          <div 
                            key={metricId}
                            className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md"
                          >
                            <span className="text-sm text-blue-800">{metric.name}</span>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleOpenFilterModal(metric)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => resetFilter(metricId)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={selectedMetrics.length === 0}
              >
                Generate Report
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <MetricSelector
        selectedMetrics={selectedMetrics}
        toggleMetric={toggleMetric}
        onOpenFilter={handleOpenFilterModal}
        filters={filters}
      />
      
      <FilterModal
        isOpen={filterModalOpen}
        onClose={handleCloseFilterModal}
        metric={currentMetricForFilter}
        currentFilter={currentMetricForFilter ? filters[currentMetricForFilter.id] : null}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  );
};

export default ReportBuilder;