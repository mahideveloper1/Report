
import React, { useState } from 'react';
import { BarChart2, ExternalLink, Info } from 'lucide-react';

const PowerBIIntegration = ({ metrics, reportData }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnectToPowerBI = async () => {
    setIsConnecting(true);
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to Power BI:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handlePublishToPowerBI = async () => {
   
    alert('Report published to Power BI dashboard!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart2 size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Power BI Integration</h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-gray-500"
          >
            <Info size={16} />
          </button>
        </div>
        
        {isConnected && (
          <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            Connected
          </span>
        )}
      </div>
      
      {showInfo && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Power BI integration allows you to send your custom report data directly to 
            Power BI for advanced analytics and visualization. Connect your Power BI 
            account to publish data and access your reports from the Power BI service.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {!isConnected ? (
          <button
            onClick={handleConnectToPowerBI}
            disabled={isConnecting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <BarChart2 size={16} />
                <span>Connect to Power BI</span>
              </>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handlePublishToPowerBI}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={reportData.length === 0}
            >
              <BarChart2 size={16} />
              <span>Publish to Power BI Dashboard</span>
            </button>
            
            <a
              href="https://app.powerbi.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              <span className="flex items-center justify-center space-x-1">
                <span>Open Power BI Dashboard</span>
                <ExternalLink size={12} />
              </span>
            </a>
          </>
        )}
      </div>
      
      {metrics.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Metrics</h3>
          <div className="flex flex-wrap gap-2">
            {metrics.map(metric => (
              <span 
                key={metric.id}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {metric.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerBIIntegration;