// src/components/ReportViewer.jsx
// Component for viewing generated reports with charts

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ChartDisplay from './ChartDisplay';
import ExportOptions from './ExportOptions';
import PowerBIIntegration from './PowerBIIntegration';
import { generateSummaryStats } from '../utils/chartDataProcessor';

const ReportViewer = ({ 
  reportName, 
  selectedMetrics, 
  data,
  onBack,
  summaryStats
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No data available for this report.</p>
        <button
          onClick={onBack}
          className="mt-4 flex items-center space-x-1 mx-auto text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} />
          <span>Back to Report Builder</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="mb-2 flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} />
              <span>Back to Report Builder</span>
            </button>
            <h1 className="text-2xl font-bold">{reportName}</h1>
            <p className="text-gray-500 mt-1">
              {data.length} records · {selectedMetrics.length} metrics
            </p>
          </div>
          
          <div className="flex space-x-4">
            <ExportOptions 
              data={data} 
              metrics={selectedMetrics}
              reportName={reportName}
            />
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedMetrics.map(metric => {
            const stats = summaryStats[metric.id] || {};
            return (
              <div key={metric.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">{metric.name}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Count:</span>{' '}
                    <span className="font-medium">{stats.count || 0}</span>
                  </p>
                  
                  {stats.distinctCount !== undefined && (
                    <p>
                      <span className="text-gray-500">Distinct Values:</span>{' '}
                      <span className="font-medium">{stats.distinctCount}</span>
                    </p>
                  )}
                  
                  {stats.min !== undefined && (
                    <p>
                      <span className="text-gray-500">Min:</span>{' '}
                      <span className="font-medium">{stats.min}</span>
                    </p>
                  )}
                  
                  {stats.max !== undefined && (
                    <p>
                      <span className="text-gray-500">Max:</span>{' '}
                      <span className="font-medium">{stats.max}</span>
                    </p>
                  )}
                  
                  {stats.avg !== undefined && (
                    <p>
                      <span className="text-gray-500">Average:</span>{' '}
                      <span className="font-medium">{stats.avg.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedMetrics.map(metric => (
          <ChartDisplay 
            key={metric.id}
            data={data}
            metric={metric}
          />
        ))}
      </div>
      
      {/* Power BI Integration */}
      <PowerBIIntegration 
        metrics={selectedMetrics}
        reportData={data}
      />
    </div>
  );
};

export default ReportViewer;