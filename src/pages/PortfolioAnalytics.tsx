import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, Plus, RotateCcw, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PortfolioAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [showModifyAllocation, setShowModifyAllocation] = useState(false);
  const [assets, setAssets] = useState([
    { id: 1, symbol: "BTC-USDT", icon: "🟠", targetWeight: 25, amount: 2500, units: 0.00134 },
    { id: 2, symbol: "ETH-USDT", icon: "💎", targetWeight: 25, amount: 2500, units: 0.0134 },
    { id: 3, symbol: "SAAPL", icon: "🍎", targetWeight: 25, amount: 2500, units: 120 },
    { id: 4, symbol: "SHOOD", icon: "🌿", targetWeight: 25, amount: 2500, units: 100 }
  ]);

  const [newAsset, setNewAsset] = useState("");
  const [totalCapital] = useState(10000);
  const [totalPnL] = useState(7);

  const activities = [
    { action: "Profits reinvested", date: "20-06-2025" },
    { action: "Rebalanced to targets", date: "20-05-2025" },
    { action: "Portfolio created", date: "01-01-2025" }
  ];

  const handleAddAsset = () => {
    if (newAsset.trim()) {
      const newId = Math.max(...assets.map(a => a.id)) + 1;
      setAssets([...assets, { 
        id: newId, 
        symbol: newAsset, 
        icon: "🆕", 
        targetWeight: 25, 
        amount: 2500, 
        units: 0 
      }]);
      setNewAsset("");
    }
  };

  const handleEqualWeight = () => {
    const equalWeight = 100 / assets.length;
    setAssets(assets.map(asset => ({
      ...asset,
      targetWeight: equalWeight,
      amount: (totalCapital * equalWeight / 100)
    })));
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving allocations...");
    setShowModifyAllocation(false);
  };

  const handleReset = () => {
    // Reset logic here
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
              <button
                onClick={() => navigate("/portfolio-performance")}
                className="mr-4 p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Comparison</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500">01-01-2025 to 01-09-2025</span>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-64 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-green-500"></div>
                      <span className="text-sm">Benchmark</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-blue-500"></div>
                      <span className="text-sm">Portfolio</span>
                    </div>
                  </div>
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Performance Chart</p>
                  <p className="text-xs text-gray-400">Portfolio vs Benchmark</p>
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
              <span className="text-sm text-gray-500">Total Capital: {totalCapital.toLocaleString()} USD</span>
            </div>
            <Button
              onClick={() => setShowModifyAllocation(!showModifyAllocation)}
              className="text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50"
            >
              +Modify allocation
            </Button>
          </div>

          {/* Currently Allocated Assets */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Currently allocated assets</h3>
              <span className="text-sm text-gray-500">Total: {totalWeight.toFixed(1)}%</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.targetWeight}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${asset.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Asset Allocations & Weightage (Modify Mode) */}
          {showModifyAllocation && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">Asset allocations & weightage</h3>
                  <span className="text-sm text-gray-500">Total: {totalWeight.toFixed(1)}%</span>
                  <span className="text-sm text-blue-600">Total Profit & Loss {totalPnL}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleAddAsset}
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
                                  setAssets(newAssets);
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
                              setAssets(newAssets);
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
                              setAssets(newAssets);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
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
                    {/* New Asset Row */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assets.length + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🆕</span>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter symbol"
                              value={newAsset}
                              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={(e) => setNewAsset(e.target.value)}
                            />
                            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value="25"
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value="2500"
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            BUY
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            SELL
                          </Button>
                        </div>
                      </td>
                    </tr>
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
                {activities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
