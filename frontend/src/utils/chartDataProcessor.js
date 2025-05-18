
/**
 * Generate chart data for visualization
 * @param {Array} data - The dataset
 * @param {Object} metric - The metric object
 * @returns {Array} Processed chart data
 */
export const generateChartData = (data, metric) => {
  if (!data || data.length === 0) return [];
  
  switch(metric.id) {
    case 'completion_status':
    case 'challenges':
    case 'login_status':
    case 'microskill_name':
      //  for pie charts - count by category
      return generateCategoryData(data, metric.id);
    
    case 'score':
    case 'completed_in_days':
    case 'attempts':
    case 'time_spent':
      // for histograms/bar charts - distribute by ranges
      return generateHistogramData(data, metric.id);
      
    case 'content_launch_date':
    case 'completion_date':
    case 'last_login_date':
      // for line charts - count by month
      return generateTimeSeriesData(data, metric.id);
      
    default:
      return generateDefaultChartData(data, metric.id);
  }
};

/**
 * Generate category data for pie/bar charts
 * @param {Array} data - The dataset
 * @param {String} metricId - Metric ID
 * @returns {Array} Category data
 */
const generateCategoryData = (data, metricId) => {
  const counts = {};
  
  data.forEach(item => {
    const value = item[metricId] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });
  
  return Object.keys(counts).map(key => ({ 
    name: key, 
    value: counts[key],
    count: counts[key] 
  }));
};

/**
 * Generate histogram data for numerical metrics
 * @param {Array} data - The dataset
 * @param {String} metricId - Metric ID
 * @returns {Array} Histogram data
 */
const generateHistogramData = (data, metricId) => {
  const ranges = {};
  let maxValue = 0;
  
  data.forEach(item => {
    const value = Number(item[metricId]);
    if (!isNaN(value) && value > maxValue) maxValue = value;
  });
  
  // Create 5 ranges, but adjust based on data
  const rangeSize = Math.max(1, Math.ceil(maxValue / 5));
  const numRanges = Math.min(5, Math.ceil(maxValue / rangeSize));
  
  // Initialize ranges
  for (let i = 0; i < numRanges; i++) {
    const rangeName = `${i * rangeSize}-${(i + 1) * rangeSize}`;
    ranges[rangeName] = 0;
  }
  
  // Count values in each range
  data.forEach(item => {
    const value = Number(item[metricId]) || 0;
    const rangeIndex = Math.min(numRanges - 1, Math.floor(value / rangeSize));
    const rangeName = `${rangeIndex * rangeSize}-${(rangeIndex + 1) * rangeSize}`;
    ranges[rangeName] += 1;
  });
  
  return Object.keys(ranges).map(key => ({ 
    name: key, 
    count: ranges[key],
    value: ranges[key] 
  }));
};

/**
 * Generate time series data for date-based metrics
 * @param {Array} data - The dataset
 * @param {String} metricId - Metric ID
 * @returns {Array} Time series data
 */
const generateTimeSeriesData = (data, metricId) => {
  const dateCountsByMonth = {};
  
  data.forEach(item => {
    if (!item[metricId]) return;
    const date = new Date(item[metricId]);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    dateCountsByMonth[monthYear] = (dateCountsByMonth[monthYear] || 0) + 1;
  });
  
  // Sort months chronologically
  const sortedMonths = Object.keys(dateCountsByMonth).sort((a, b) => {
    const [aMonth, aYear] = a.split('/').map(Number);
    const [bMonth, bYear] = b.split('/').map(Number);
    if (aYear === bYear) {
      return aMonth - bMonth;
    }
    return aYear - bYear;
  });
  
  return sortedMonths.map(month => ({
    name: month,
    count: dateCountsByMonth[month],
    value: dateCountsByMonth[month] 
  }));
};

/**
 * Generate default chart data for any metric
 * @param {Array} data - The dataset
 * @param {String} metricId - Metric ID
 * @returns {Array} Default chart data
 */
const generateDefaultChartData = (data, metricId) => {
  const aggregated = {};
  
  data.forEach(item => {
    const value = item[metricId] || 'Unknown';
    aggregated[value] = (aggregated[value] || 0) + 1;
  });
  
  const entries = Object.entries(aggregated);
  if (entries.length > 10) {
    entries.sort((a, b) => b[1] - a[1]);
    
    const result = entries.slice(0, 9).map(([name, count]) => ({ name, count, value: count }));
    
    const othersCount = entries.slice(9).reduce((sum, [, count]) => sum + count, 0);
    if (othersCount > 0) {
      result.push({ name: 'Others', count: othersCount, value: othersCount });
    }
    
    return result;
  }
  
  return entries.map(([name, count]) => ({ name, count, value: count }));
};

/**
 * Determine the best chart type for a metric
 * @param {Object} metric - The metric object
 * @returns {String} Chart type ('bar', 'line', 'pie', or 'histogram')
 */
export const getChartTypeForMetric = (metric) => {
  switch(metric.id) {
    case 'challenges':
    case 'completion_status':
    case 'login_status':
    case 'microskill_name':
      return 'pie';
    case 'content_launch_date':
    case 'completion_date':
    case 'last_login_date':
      return 'line';
    case 'score':
    case 'completed_in_days':
    case 'attempts':
    case 'time_spent':
      return 'histogram';
    default:
      return 'bar';
  }
};

/**
 * Generate summary statistics for a dataset
 * @param {Array} data - The dataset
 * @param {Array} metrics - Selected metrics
 * @returns {Object} Summary statistics
 */
export const generateSummaryStats = (data, metrics) => {
  const stats = {};
  
  metrics.forEach(metric => {
    const values = data
      .map(item => item[metric.id])
      .filter(v => v !== undefined && v !== null);
    
    // Skip if no values
    if (values.length === 0) {
      stats[metric.id] = { count: 0 };
      return;
    }
    
    // Basic stats for all types
    stats[metric.id] = {
      count: values.length,
      distinctCount: new Set(values).size
    };
    
    const numericValues = values.map(Number).filter(v => !isNaN(v));
    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      const sorted = [...numericValues].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];
      
      stats[metric.id] = {
        ...stats[metric.id],
        min,
        max,
        avg,
        median,
        sum
      };
    }
  });
  
  return stats;
};