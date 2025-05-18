import React from 'react';
import ReportBuilder from './components/ReportBuilder';
import ReportViewer from './components/ReportViewer';
import useReportState from './hooks/useReportState';

function App() {
  const {
    selectedMetrics,
    reportData,
    filteredData,
    reportGenerated,
    reportName,
    dataCount,
    filters,
    summaryStats,
    error,
    setReportName,
    setDataCount,
    toggleMetric,
    generateReport,
    updateFilter,
    resetFilter,
    resetAllFilters,
    resetReport
  } = useReportState();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Custom Reports Builder</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reportGenerated ? (
          <ReportViewer
            reportName={reportName}
            selectedMetrics={selectedMetrics}
            data={filteredData}
            onBack={resetReport}
            summaryStats={summaryStats}
          />
        ) : (
          <ReportBuilder
            selectedMetrics={selectedMetrics}
            toggleMetric={toggleMetric}
            reportName={reportName}
            setReportName={setReportName}
            dataCount={dataCount}
            setDataCount={setDataCount}
            filters={filters}
            updateFilter={updateFilter}
            resetFilter={resetFilter}
            resetAllFilters={resetAllFilters}
            generateReport={generateReport}
            error={error}
          />
        )}
      </main>
      
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            Custom Reports Builder © 2025 | Integrated with Power BI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;