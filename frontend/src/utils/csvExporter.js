
/**
 * Convert data to CSV format and trigger download
 * @param {Array} data - Array of data objects to export
 * @param {String} filename - Name of the file to download
 */
export const downloadCSV = (data, filename = 'report.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  try {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};

/**
 * Generate a Power BI-compatible CSV file
 * This includes additional formatting to make sure Power BI recognizes data types correctly
 * @param {Array} data - Array of data objects to export
 * @param {Array} metrics - Selected metrics for context
 * @param {String} filename - Name of the file to download
 */
export const downloadPowerBICSV = (data, metrics, filename = 'power_bi_report.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export for Power BI');
    return;
  }
  
  try {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add rows with Power BI formatting
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        
        const metric = metrics.find(m => m.id === header);
        const metricType = metric ? getMetricType(metric.id) : 'string';
        
        let formattedValue = value;
        if (metricType === 'date' && value) {
          formattedValue = value;
        } else if (metricType === 'number' && !isNaN(Number(value))) {
          // Format numbers without quotes
          return value;
        }
        
        // Escape quotes and wrap in quotes
        const escaped = String(formattedValue).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting Power BI CSV:', error);
    return false;
  }
};

/**
 * Get the data type for a metric ID
 * @param {String} metricId - Metric ID
 * @returns {String} Data type ('string', 'number', or 'date')
 */
const getMetricType = (metricId) => {
  // Define types for each metric
  const metricTypes = {
    'master_o_id': 'string',
    'content_launch_date': 'date',
    'challenges': 'string',
    'completion_status': 'string',
    'completion_date': 'date',
    'completed_in_days': 'number',
    'attempts': 'number',
    'score': 'number',
    'max_score': 'number',
    'time_spent': 'number',
    'microskill_name': 'string',
    'login_status': 'string',
    'last_login_date': 'date'
  };
  
  return metricTypes[metricId] || 'string';
};

/**
 * Create a Power BI template object for export
 * @param {Array} metrics - Selected metrics
 * @returns {Object} Power BI template configuration
 */
export const createPowerBITemplate = (metrics) => {
  // Create a template object that defines the data model for Power BI
  const template = {
    version: '1.0',
    datasetName: 'Custom Report Dataset',
    tables: []
  };
  
  // Create main table
  const mainTable = {
    name: 'MetricsData',
    columns: metrics.map(metric => ({
      name: metric.name,
      dataType: getMetricType(metric.id)
    }))
  };
  
  template.tables.push(mainTable);
  
  // Add related tables for dimension data if needed
  const dimensionTables = [];
  
  metrics.forEach(metric => {
    if (['challenges', 'completion_status', 'microskill_name', 'login_status'].includes(metric.id)) {
      dimensionTables.push({
        name: `${metric.name}Dim`,
        columns: [
          { name: 'ID', dataType: 'string' },
          { name: 'Name', dataType: 'string' }
        ]
      });
    }
  });
  
  template.tables.push(...dimensionTables);
  
  return template;
};

/**
 * Download a Power BI template file (PBIT format simulation)
 * In reality, we'd need server-side processing to create a true PBIT file,
 * but we can create a JSON configuration that could be imported
 * @param {Array} metrics - Selected metrics
 * @param {String} reportName - Name of the report
 */
export const downloadPowerBITemplate = (metrics, reportName) => {
  const template = createPowerBITemplate(metrics);
  const filename = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
  
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};