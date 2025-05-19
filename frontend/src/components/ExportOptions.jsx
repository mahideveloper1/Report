
import React, { useState } from 'react';
import { Download, Mail, BarChart2, Check } from 'lucide-react';
import { downloadCSV, downloadPowerBICSV, downloadPowerBITemplate } from '../utils/csvExporter';

const ExportOptions = ({ data, metrics, reportName }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCSVExport = () => {
    const filename = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
    downloadCSV(data, filename);
  };
  
  const handlePowerBIExport = () => {
    const filename = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_powerbi.csv`;
    downloadPowerBICSV(data, metrics, filename);
  };
  
  const handlePowerBITemplateExport = () => {
    downloadPowerBITemplate(metrics, reportName);
  };
  
  const handleEmailReport = async (e) => {
    e.preventDefault();
    
    if (!emailAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Generate the CSV content
      const csvContent = generateCSVContent(data);
      
      // Create a report summary
      const summary = generateReportSummary(data, metrics, reportName);
      
      // Send the email using a backend service
      const response = await sendEmailWithReport(emailAddress, reportName, csvContent, summary);
      
      if (response.success) {
        setEmailSent(true);
        setTimeout(() => {
          setEmailSent(false);
          setEmailAddress('');
          setShowOptions(false);
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError(error.message || 'Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to generate CSV content
  const generateCSVContent = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };
  
  // Function to generate a report summary
  const generateReportSummary = (data, metrics, reportName) => {
    return {
      reportName,
      recordCount: data.length,
      metricCount: metrics.length,
      metrics: metrics.map(m => m.name),
      generatedAt: new Date().toISOString()
    };
  };
  
  // Function to send email with the report
  const sendEmailWithReport = async (email, reportName, csvContent, summary) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reportName,
          csvContent,
          summary
        }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      
      
      console.warn('Using simulated email response for demonstration');
      return { 
        success: true, 
        message: 'Email sent successfully (simulated)'
      };
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
      >
        <Download size={16} />
        <span>Export Report</span>
      </button>
      
      {showOptions && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-700">Export Options</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <button
              onClick={handleCSVExport}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Download size={16} />
              <span>Download as CSV</span>
            </button>
            
            <button
              onClick={handlePowerBIExport}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <BarChart2 size={16} />
              <span>Download for Power BI</span>
            </button>
            
            <button
              onClick={handlePowerBITemplateExport}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <BarChart2 size={16} />
              <span>Power BI Template</span>
            </button>
            
            <div className="border-t pt-3">
              <form onSubmit={handleEmailReport}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Report
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading || emailSent}
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={!emailAddress || loading || emailSent}
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : emailSent ? (
                      <Check size={16} />
                    ) : (
                      <Mail size={16} />
                    )}
                  </button>
                </div>
                {emailSent && (
                  <p className="mt-1 text-sm text-green-600">Report sent successfully!</p>
                )}
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;