
import { useState, useEffect } from 'react';
import { generateDummyData, applyFilters } from '../utils/dummyDataGenerator';
import { generateSummaryStats } from '../utils/chartDataProcessor';

/**
 * Custom hook to manage report creation state
 */
export default function useReportState() {
  // Core states
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportName, setReportName] = useState('New Custom Report');
  const [dataCount, setDataCount] = useState(100);
  const [filters, setFilters] = useState({});
  const [summaryStats, setSummaryStats] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (reportData.length > 0) {
      const filtered = applyFilters(reportData, filters);
      setFilteredData(filtered);
      
      // Generate summary stats for filtered data
      const stats = generateSummaryStats(filtered, selectedMetrics);
      setSummaryStats(stats);
    }
  }, [reportData, filters, selectedMetrics]);
  
  /**
   * Toggle metric selection
   * @param {Object} metric - Metric to toggle
   */
  const toggleMetric = (metric) => {
    setSelectedMetrics(prevMetrics => {
      const exists = prevMetrics.some(m => m.id === metric.id);
      
      if (exists) {
        // Remove metric and its filters
        const updatedFilters = { ...filters };
        delete updatedFilters[metric.id];
        setFilters(updatedFilters);
        
        return prevMetrics.filter(m => m.id !== metric.id);
      } else {
        // Add metric
        return [...prevMetrics, metric];
      }
    });
  };
  
  /**
   * Generate report based on selected metrics
   */
  const generateReport = () => {
    if (selectedMetrics.length === 0) {
      setError('Please select at least one metric for your report');
      return false;
    }
    
    try {
      setError(null);
      const data = generateDummyData(selectedMetrics, dataCount);
      setReportData(data);
      setFilteredData(data);
      setReportGenerated(true);
      
      // Generate initial summary stats
      const stats = generateSummaryStats(data, selectedMetrics);
      setSummaryStats(stats);
      
      return true;
    } catch (err) {
      setError(`Error generating report: ${err.message}`);
      return false;
    }
  };
  
  /**
   * Update filters for a specific metric
   * @param {String} metricId - ID of the metric
   * @param {Object} filterSettings - Filter settings
   */
  const updateFilter = (metricId, filterSettings) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [metricId]: filterSettings
    }));
  };
  
  /**
   * Reset filters for a specific metric
   * @param {String} metricId - ID of the metric
   */
  const resetFilter = (metricId) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[metricId];
      return updatedFilters;
    });
  };
  
  /**
   * Reset all filters
   */
  const resetAllFilters = () => {
    setFilters({});
  };
  
  /**
   * Save report (mock implementation)
   * In a real app, this would save to a backend
   */
  const saveReport = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const reportToSave = {
        id: Date.now().toString(),
        name: reportName,
        metrics: selectedMetrics,
        filters,
        createdAt: new Date().toISOString()
      };
      
      
      const savedReports = JSON.parse(localStorage.getItem('customReports') || '[]');
      savedReports.push(reportToSave);
      localStorage.setItem('customReports', JSON.stringify(savedReports));
      
      setSaving(false);
      return true;
    } catch (err) {
      setSaving(false);
      setError(`Error saving report: ${err.message}`);
      return false;
    }
  };
  
  /**
   * Reset the report state
   */
  const resetReport = () => {
    setSelectedMetrics([]);
    setReportData([]);
    setFilteredData([]);
    setReportGenerated(false);
    setReportName('New Custom Report');
    setFilters({});
    setSummaryStats({});
    setError(null);
  };
  
  return {
    selectedMetrics,
    reportData,
    filteredData,
    reportGenerated,
    reportName,
    dataCount,
    filters,
    summaryStats,
    saving,
    error,
    setReportName,
    setDataCount,
    toggleMetric,
    generateReport,
    updateFilter,
    resetFilter,
    resetAllFilters,
    saveReport,
    resetReport
  };
}