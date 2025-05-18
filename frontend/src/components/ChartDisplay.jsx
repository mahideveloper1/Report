
import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { generateChartData, getChartTypeForMetric } from '../utils/chartDataProcessor';

// Chart colors
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#A4DE6C', '#D0ED57', '#FAACC5', '#F472B6'
];

const ChartDisplay = ({ data, metric, height = 300 }) => {
  const [chartType, setChartType] = useState(() => getChartTypeForMetric(metric));
  
  const chartData = generateChartData(data, metric);
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for this metric</p>
      </div>
    );
  }
  
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#0088FE" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  const getAvailableChartTypes = () => {
    switch (metric.id) {
      case 'challenges':
      case 'completion_status':
      case 'login_status':
      case 'microskill_name':
        return ['pie', 'bar'];
      case 'content_launch_date':
      case 'completion_date':
      case 'last_login_date':
        return ['line', 'bar'];
      case 'score':
      case 'completed_in_days':
      case 'attempts':
      case 'time_spent':
        return ['histogram', 'bar', 'line'];
      default:
        return ['bar', 'line', 'pie'];
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{metric.name}</h3>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500">Chart type:</label>
          <select
            className="text-sm border rounded px-2 py-1"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {getAvailableChartTypes().map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {renderChart()}
      
      <div className="mt-2 text-xs text-gray-500 text-right">
        Based on {data.length} records
      </div>
    </div>
  );
};

export default ChartDisplay;