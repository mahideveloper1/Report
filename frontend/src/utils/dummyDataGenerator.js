
/**
 * Generate dummy data based on selected metrics
 * @param {Array} selectedMetrics - Array of selected metric objects
 * @param {Number} count - Number of records to generate
 * @returns {Array} Array of data objects
 */
export const generateDummyData = (selectedMetrics, count = 100) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const item = {
      id: `user-${i + 1}`
    };
    
    selectedMetrics.forEach(metric => {
      switch(metric.id) {
        case 'master_o_id':
          item[metric.id] = `MOD-${Math.floor(1000 + Math.random() * 9000)}`;
          break;
        case 'content_launch_date':
          // Random date in the last year
          const launchDate = new Date();
          launchDate.setDate(launchDate.getDate() - Math.floor(Math.random() * 365));
          item[metric.id] = launchDate.toISOString().split('T')[0];
          break;
        case 'challenges':
          item[metric.id] = ['Completed', 'In Progress', 'Not Started', 'Overdue'][Math.floor(Math.random() * 4)];
          break;
        case 'completion_status':
          item[metric.id] = ['Completed', 'Partial', 'Not Started', 'Abandoned'][Math.floor(Math.random() * 4)];
          break;
        case 'completion_date':
          if (Math.random() > 0.3) { // 70% chance to have completion date
            const complDate = new Date();
            complDate.setDate(complDate.getDate() - Math.floor(Math.random() * 180));
            item[metric.id] = complDate.toISOString().split('T')[0];
          } else {
            item[metric.id] = null;
          }
          break;
        case 'completed_in_days':
          item[metric.id] = Math.floor(Math.random() * 60);
          break;
        case 'attempts':
          item[metric.id] = Math.floor(1 + Math.random() * 5);
          break;
        case 'score':
          item[metric.id] = Math.floor(Math.random() * 100);
          break;
        case 'max_score':
          item[metric.id] = 100;
          break;
        case 'time_spent':
          item[metric.id] = Math.floor(Math.random() * 240); // Time in minutes
          break;
        case 'microskill_name':
          item[metric.id] = ['Data Analysis', 'Communication', 'Critical Thinking', 'Problem Solving', 'Leadership'][Math.floor(Math.random() * 5)];
          break;
        case 'login_status':
          item[metric.id] = Math.random() > 0.2 ? 'Active' : 'Inactive';
          break;
        case 'last_login_date':
          const loginDate = new Date();
          loginDate.setDate(loginDate.getDate() - Math.floor(Math.random() * 30));
          item[metric.id] = loginDate.toISOString().split('T')[0];
          break;
        default:
          item[metric.id] = `Value for ${metric.name}`;
      }
    });
    
    data.push(item);
  }
  
  return data;
};

/**
 * Apply filters to data
 * @param {Array} data - The dataset
 * @param {Object} filters - Object with metric IDs as keys and filter settings as values
 * @returns {Array} Filtered data
 */
export const applyFilters = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }
  
  return data.filter(item => {
    // Check each filter
    for (const metricId in filters) {
      const filterSettings = filters[metricId];
      const value = item[metricId];
      
      // Skip if item doesn't have this property
      if (value === undefined) continue;
      
      // Date range filter
      if (filterSettings.type === 'dateRange') {
        const date = new Date(value);
        const startDate = filterSettings.startDate ? new Date(filterSettings.startDate) : null;
        const endDate = filterSettings.endDate ? new Date(filterSettings.endDate) : null;
        
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
      }
      
      // Specific date filter
      else if (filterSettings.type === 'date') {
        if (filterSettings.date && value !== filterSettings.date) return false;
      }
      
      // Status filter
      else if (filterSettings.type === 'status') {
        if (filterSettings.status && value !== filterSettings.status) return false;
      }
      
      // Numeric filters
      else if (filterSettings.type === 'lessThan') {
        if (parseFloat(value) >= parseFloat(filterSettings.value)) return false;
      }
      else if (filterSettings.type === 'greaterThan') {
        if (parseFloat(value) <= parseFloat(filterSettings.value)) return false;
      }
      else if (filterSettings.type === 'range') {
        const numValue = parseFloat(value);
        if (filterSettings.min !== undefined && numValue < parseFloat(filterSettings.min)) return false;
        if (filterSettings.max !== undefined && numValue > parseFloat(filterSettings.max)) return false;
      }
    }
    
    return true;
  });
};