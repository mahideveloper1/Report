// src/components/MetricSelector.jsx
// Component for selecting metrics for the report

import React from 'react';
import { Check, Filter } from 'lucide-react';
import { availableMetrics } from '../data/metricsData';

const MetricSelector = ({ 
  selectedMetrics, 
  toggleMetric, 
  onOpenFilter,
  filters
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Select Metrics</h2>
      <p className="text-gray-600 mb-4">Select the metrics you want to include in your custom report.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableMetrics.map((metric) => {
          const isSelected = selectedMetrics.some(m => m.id === metric.id);
          const hasFilter = filters && filters[metric.id];
          
          return (
            <div 
              key={metric.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => toggleMetric(metric)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 flex items-center justify-center rounded ${
                  isSelected ? 'bg-blue-500 text-white' : 'border border-gray-300'
                }`}>
                  {isSelected && <Check size={14} />}
                </div>
                <span className="font-medium">{metric.name}</span>
              </div>
              
              {isSelected && (
                <button
                  className={`p-1 rounded-full ${
                    hasFilter ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFilter(metric);
                  }}
                >
                  <Filter size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedMetrics.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {selectedMetrics.length} metric{selectedMetrics.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricSelector;