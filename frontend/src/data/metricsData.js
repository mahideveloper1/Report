
export const availableMetrics = [
  { id: 'master_o_id', name: 'Master-O ID', filters: ['Count', 'Distinct Count', 'Distinct Value'] },
  { id: 'content_launch_date', name: 'Content launch date', filters: ['Date range', 'Specific date'] },
  { id: 'challenges', name: 'Challenges', filters: ['Status'] },
  { id: 'completion_status', name: 'Completion Status', filters: ['Status Count', 'Status Percentage', 'Less than', 'Greater than', 'Range'] },
  { id: 'completion_date', name: 'Completion Date', filters: ['Date Range', 'Specific date'] },
  { id: 'completed_in_days', name: 'Completed In Days', filters: ['Count', 'Less than', 'Greater than'] },
  { id: 'attempts', name: 'Attempts', filters: ['Status'] },
  { id: 'score', name: 'Score', filters: ['Count', 'Average', 'Percentage'] },
  { id: 'max_score', name: 'Max Score', filters: ['Count'] },
  { id: 'time_spent', name: 'Time Spent', filters: ['Time value', 'Average'] },
  { id: 'microskill_name', name: 'Microskill Name', filters: ['Count', 'Distinct Count', 'Distinct Value'] },
  { id: 'login_status', name: 'Login Status', filters: ['Status', 'Count'] },
  { id: 'last_login_date', name: 'Last Login Date', filters: ['Date Range', 'Specific date'] }
];

// Data filtering options for each type of filter
export const filterOptions = {
  'Date range': {
    type: 'dateRange',
    startLabel: 'Start Date',
    endLabel: 'End Date'
  },
  'Specific date': {
    type: 'date',
    label: 'Select Date'
  },
  'Status': {
    type: 'select',
    options: ['Completed', 'In Progress', 'Not Started', 'Overdue']
  },
  'Status Count': {
    type: 'select',
    options: ['Completed', 'Partial', 'Not Started', 'Abandoned']
  },
  'Status Percentage': {
    type: 'select',
    options: ['Completed', 'Partial', 'Not Started', 'Abandoned']
  },
  'Less than': {
    type: 'number',
    label: 'Less than value'
  },
  'Greater than': {
    type: 'number',
    label: 'Greater than value'
  },
  'Range': {
    type: 'range',
    minLabel: 'Minimum value',
    maxLabel: 'Maximum value'
  },
  'Count': {
    type: 'toggle',
    label: 'Include count'
  },
  'Average': {
    type: 'toggle',
    label: 'Calculate average'
  },
  'Percentage': {
    type: 'toggle',
    label: 'Show as percentage'
  },
  'Time value': {
    type: 'select',
    options: ['Minutes', 'Hours', 'Days']
  },
  'Distinct Count': {
    type: 'toggle',
    label: 'Show distinct count'
  },
  'Distinct Value': {
    type: 'toggle',
    label: 'Show distinct values'
  }
};

// Chart type recommendations for different metrics
export const recommendedChartTypes = {
  'master_o_id': 'bar',
  'content_launch_date': 'line',
  'challenges': 'pie',
  'completion_status': 'pie',
  'completion_date': 'line',
  'completed_in_days': 'histogram',
  'attempts': 'bar',
  'score': 'histogram',
  'max_score': 'bar',
  'time_spent': 'histogram',
  'microskill_name': 'pie',
  'login_status': 'pie',
  'last_login_date': 'line'
};