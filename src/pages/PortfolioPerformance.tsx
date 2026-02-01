import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, LayoutGrid, List, Plus, TrendingUp, TrendingDown, ArrowUp, ArrowDown, RotateCcw, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PortfolioPerformance: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "past" | "combined">("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("YTD");
  const [showModifyAllocation, setShowModifyAllocation] = useState(false);
  // Load assets from localStorage or use default
  const loadAssetsFromStorage = () => {
    try {
      const savedAssets = localStorage.getItem('portfolioAssets');
      if (savedAssets) {
        return JSON.parse(savedAssets);
      }
    } catch (error) {
      console.error('Error loading assets from localStorage:', error);
    }
    // Default assets if no saved data
    return [
      { id: 1, symbol: "BTC-USDT", icon: "🟠", targetWeight: 25, amount: 2500, units: 0.00134 },
      { id: 2, symbol: "ETH-USDT", icon: "💎", targetWeight: 25, amount: 2500, units: 0.0134 },
      { id: 3, symbol: "SAAPL", icon: "🍎", targetWeight: 25, amount: 2500, units: 120 },
      { id: 4, symbol: "SHOOD", icon: "🌿", targetWeight: 25, amount: 2500, units: 100 }
    ];
  };

  const [assets, setAssets] = useState(loadAssetsFromStorage);
  const [newAsset, setNewAsset] = useState("");
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    symbol: "",
    targetWeight: 25,
    amount: 2500,
    units: 0
  });

  // Save assets to localStorage
  const saveAssetsToStorage = (newAssets: any[]) => {
    try {
      localStorage.setItem('portfolioAssets', JSON.stringify(newAssets));
    } catch (error) {
      console.error('Error saving assets to localStorage:', error);
    }
  };

  // Custom setAssets function that also saves to localStorage
  const updateAssets = (newAssets: any[]) => {
    setAssets(newAssets);
    saveAssetsToStorage(newAssets);
  };

  // Mock data for portfolio performance
  const portfolioData = {
    name: "Best Portfolio 2025",
    totalNetReturns: 7.71,
    cagr: 11.1,
    maxDrawdown: -2.5,
    sharpeRatio: 1.97,
    volatility: 1.2,
    totalReturns: 2.5,
    totalReturnsAmount: 2500,
    totalCapital: 10000
  };

  const timeframes = ["1D", "1W", "1M", "3M", "6M", "YTD", "1YR", "MAX"];

  const metrics = [
    {
      title: "Total net returns (%)",
      value: `+ ${portfolioData.totalNetReturns}`,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "CAGR",
      value: `+${portfolioData.cagr}`,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Max drawdowns (%)",
      value: `${portfolioData.maxDrawdown}`,
      color: "text-red-600",
      trend: "down"
    },
    {
      title: "Sharpe ratio",
      value: `Good ${portfolioData.sharpeRatio}`,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Volatility",
      value: `Low (${portfolioData.volatility})`,
      color: "text-blue-600",
      trend: "neutral"
    }
  ];

  const equityCurveData = [
    { date: "01-01-2025", value: 10000 },
    { date: "01-03-2025", value: 10250 },
    { date: "01-05-2025", value: 10500 },
    { date: "01-07-2025", value: 10750 },
    { date: "01-08-2025", value: 10600 },
    { date: "01-09-2025", value: 10750 }
  ];

  const handleAddAsset = () => {
    if (newAssetData.symbol.trim()) {
      const newId = Math.max(...assets.map(a => a.id)) + 1;
      updateAssets([...assets, { 
        id: newId, 
        symbol: newAssetData.symbol, 
        icon: "🆕", 
        targetWeight: newAssetData.targetWeight, 
        amount: newAssetData.amount, 
        units: newAssetData.units 
      }]);
      setNewAsset("");
      setIsAddingAsset(false);
      setNewAssetData({
        symbol: "",
        targetWeight: 25,
        amount: 2500,
        units: 0
      });
    }
  };

  const handleStartAddAsset = () => {
    setNewAsset("");
    setIsAddingAsset(true);
    setNewAssetData({
      symbol: "",
      targetWeight: 25,
      amount: 2500,
      units: 0
    });
  };

  const handleEqualWeight = () => {
    const equalWeight = 100 / assets.length;
    updateAssets(assets.map(asset => ({
      ...asset,
      targetWeight: equalWeight,
      amount: (portfolioData.totalCapital * equalWeight / 100)
    })));
  };

  const handleSave = () => {
    console.log("Saving allocations...");
    
    // Validate all existing assets have required fields
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (!asset.symbol.trim()) {
        alert(`Please enter a symbol name for asset #${i + 1} before saving.`);
        return; // Don't save if any asset is missing symbol name
      }
      if (asset.targetWeight <= 0) {
        alert(`Please enter a valid target weight for asset #${i + 1} (${asset.symbol}) before saving.`);
        return; // Don't save if any asset has invalid weight
      }
      if (asset.amount <= 0) {
        alert(`Please enter a valid amount for asset #${i + 1} (${asset.symbol}) before saving.`);
        return; // Don't save if any asset has invalid amount
      }
    }
    
    // If there's a pending new asset, validate it has a symbol name
    if (isAddingAsset) {
      if (!newAssetData.symbol.trim()) {
        alert("Please enter a symbol name for the new asset before saving.");
        return; // Don't save if no symbol name
      }
      if (newAssetData.targetWeight <= 0) {
        alert("Please enter a valid target weight for the new asset before saving.");
        return; // Don't save if invalid weight
      }
      if (newAssetData.amount <= 0) {
        alert("Please enter a valid amount for the new asset before saving.");
        return; // Don't save if invalid amount
      }
      
      // Add the new asset to the assets array
      const newId = Math.max(...assets.map(a => a.id)) + 1;
      updateAssets([...assets, { 
        id: newId, 
        symbol: newAssetData.symbol, 
        icon: "🆕", 
        targetWeight: newAssetData.targetWeight, 
        amount: newAssetData.amount, 
        units: newAssetData.units 
      }]);
    }
    
    // Hide the modify allocation mode and reset states
    setShowModifyAllocation(false);
    setIsAddingAsset(false);
    setNewAsset("");
    setNewAssetData({
      symbol: "",
      targetWeight: 25,
      amount: 2500,
      units: 0
    });
  };

  const handleReset = () => {
    console.log("Resetting allocations...");
  };

  const totalWeight = assets.reduce((sum, asset) => sum + asset.targetWeight, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">My Dashboard</h1>
              <div className="ml-4 text-sm text-gray-500">
                Portfolio Bot &gt; {portfolioData.name}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/portfolio-setup")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add new bot
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bot Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "all"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All bots (0)
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "past"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Past bots ()
              </button>
              <button
                onClick={() => setActiveTab("combined")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "combined"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Combined Performance
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bots..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter className="w-5 h-5" />
              </button>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-green-100 text-green-700" : "text-gray-400"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-green-100 text-green-700" : "text-gray-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Metrics</h2>
              <p className="text-sm text-green-600">Risk & return</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Metric
            </button>
          </div>

          {/* Top Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Capital invested ($)</h3>
              <p className="text-2xl font-bold text-gray-900">10.000</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current value ($)</h3>
              <p className="text-2xl font-bold text-gray-900">10.771</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Cash balance ($)</h3>
              <p className="text-2xl font-bold text-gray-900">1000</p>
            </div>
          </div>

          {/* Performance Metrics with Navigation */}
          <div className="relative">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50">
              <ArrowUp className="w-4 h-4 text-blue-600 rotate-[-90deg]" />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50">
              <ArrowDown className="w-4 h-4 text-blue-600 rotate-90" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                  {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                  {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                </div>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Equity Curve Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Equity curve</h2>
              <p className="text-sm text-gray-500">
                Total returns: {portfolioData.totalReturns}% ({portfolioData.totalReturnsAmount})
              </p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex space-x-2 mb-6">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedTimeframe === timeframe
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          {/* Chart Area */}
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-64 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Equity Curve Chart</p>
                  <p className="text-xs text-gray-400">Performance over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Allocations & Positions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-900">Allocations & positions</h2>
              <span className="text-sm text-gray-500">Total Capital: {portfolioData.totalCapital.toLocaleString()} USD</span>
            </div>
            {!showModifyAllocation && (
              <button 
                onClick={() => {
                  setShowModifyAllocation(true);
                  setIsAddingAsset(false);
                  setNewAsset("");
                  setNewAssetData({
                    symbol: "",
                    targetWeight: 25,
                    amount: 2500,
                    units: 0
                  });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                +Modify allocation
              </button>
            )}
          </div>

          {/* Currently Allocated Assets - Always Read-Only */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Currently allocated assets</h3>
                <span className="text-sm text-gray-500">Total: {totalWeight.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol/Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Weight (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset, index) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{asset.icon}</span>
                          <span>{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.targetWeight}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${asset.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.units}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              </div>

          {/* Editable Table - Only shown when modify allocation is clicked */}
              {showModifyAllocation && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">Asset allocations & weightage</h3>
                  <span className="text-sm text-gray-500">Total: {totalWeight.toFixed(1)}%</span>
                  <span className="text-sm text-blue-600">Total Profit & Loss 7%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleStartAddAsset}
                    className="text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50"
                  >
                    + Add Asset
                  </Button>
                  <Button
                    onClick={handleEqualWeight}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Equal weight
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol/Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Weight (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset, index) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{asset.icon}</span>
                            <div className="relative">
                              <input
                                type="text"
                                value={asset.symbol}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                  const newAssets = [...assets];
                                  newAssets[index].symbol = e.target.value;
                                  updateAssets(newAssets);
                                }}
                              />
                              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={asset.targetWeight}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const newAssets = [...assets];
                              newAssets[index].targetWeight = parseFloat(e.target.value) || 0;
                              updateAssets(newAssets);
                            }}
                          />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={asset.amount}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const newAssets = [...assets];
                              newAssets[index].amount = parseFloat(e.target.value) || 0;
                              updateAssets(newAssets);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={asset.units}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              const newAssets = [...assets];
                              newAssets[index].units = parseFloat(e.target.value) || 0;
                              updateAssets(newAssets);
                            }}
                          />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                const newAssets = assets.filter((_, i) => i !== index);
                                updateAssets(newAssets);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete asset"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              BUY
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              SELL
                            </Button>
                          </div>
                      </td>
                    </tr>
                  ))}
                    {/* New Asset Row - Only show when adding new asset */}
                    {isAddingAsset && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assets.length + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🆕</span>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter symbol"
                              value={newAssetData.symbol}
                              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={(e) => setNewAssetData({...newAssetData, symbol: e.target.value})}
                            />
                            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value={newAssetData.targetWeight}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => setNewAssetData({...newAssetData, targetWeight: parseFloat(e.target.value) || 0})}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value={newAssetData.amount}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => setNewAssetData({...newAssetData, amount: parseFloat(e.target.value) || 0})}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={newAssetData.units}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setNewAssetData({...newAssetData, units: parseFloat(e.target.value) || 0})}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setNewAsset("");
                                setIsAddingAsset(false);
                                setNewAssetData({
                                  symbol: "",
                                  targetWeight: 25,
                                  amount: 2500,
                                  units: 0
                                });
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Cancel adding asset"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            BUY
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            SELL
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>

        {/* Current Activity Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Current activity</h2>
            <p className="text-sm text-gray-500">Rebalances & other actions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Profits reinvested</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20-06-2025</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rebalanced to targets</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20-05-2025</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Portfolio created</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01-01-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
