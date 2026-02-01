import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, RotateCcw } from "lucide-react";

const PortfolioSetup: React.FC = () => {
    const navigate = useNavigate();
    const [portfolioType, setPortfolioType] = useState<"single" | "multi">("single");
    const [portfolioDetails, setPortfolioDetails] = useState({
        name: "BestPortfolio2025",
        capital: "10.000",
        currency: "USD (United States Dollar)",
        category: "Crypto"
    });
    const [assets, setAssets] = useState([
        { id: 1, symbol: "BTC-USDT", icon: "🟠", weight: 25, amount: 2500, units: 5 },
        { id: 2, symbol: "ETH-USDT", icon: "💎", weight: 25, amount: 2500, units: 12 },
        { id: 3, symbol: "SAAPL", icon: "🍎", weight: 25, amount: 2500, units: 120 },
        { id: 4, symbol: "SHOOD", icon: "🌿", weight: 25, amount: 2500, units: 1000 }
    ]);
    const [portfolioBehavior, setPortfolioBehavior] = useState({
        rebalance: { enabled: false, type: "Equal", frequency: "Monthly", threshold: "5%" },
        profitTaking: { enabled: false, threshold: "10" },
        reinvestProfits: { enabled: false }
    });
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    const instruments = [
        { title: "Trade or Invest", description: "Description & some performance data" },
        { title: "Portfolio or Rebalancer", description: "Description & some perform" },
        { title: "Buy & Hold", description: "Description & some perform" },
        { title: "Investoaccumulator", description: "Description & some performance data" },
        { title: "Proprietary", description: "Coming soon* in 2026", comingSoon: true },
        { title: "Arbitrage", description: "Coming soon* in 2026", comingSoon: true }
    ];

    const handleAddAsset = () => {
        const newId = Math.max(...assets.map(a => a.id)) + 1;
        setAssets([...assets, { id: newId, symbol: "NEW-ASSET", icon: "🆕", weight: 0, amount: 0, units: 0 }]);
    };

    const handleEqualWeight = () => {
        const equalWeight = 100 / assets.length;
        setAssets(assets.map(asset => ({
            ...asset,
            weight: equalWeight,
            amount: (parseFloat(portfolioDetails.capital) * equalWeight / 100)
        })));
    };

    const handleReset = () => {
        setAssets([]);
    };

    const handleDeleteAsset = (id: number) => {
        setAssets(assets.filter(asset => asset.id !== id));
    };

    const totalWeight = assets.reduce((sum, asset) => sum + asset.weight, 0);
    const totalAllocatedAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const remainingCash = parseFloat(portfolioDetails.capital) - totalAllocatedAmount;

    return (
        <div>
            <div className="max-w-7xl mx-auto pl-8 md:pl-20 py-8">
                {/* Back Button */}
                <button
                    className="flex items-center text-gray-600 hover:text-green-600 mb-6"
                    onClick={() => navigate("/dashboard")}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Instrument Selection Section */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8 lg:ml-2">
                    {/* Currently Selected */}
                    <div className="lg:w-1/3 lg:ml-10 lg:mr-6">
                        <h3 className="font-sm text-3xl text-gray-800 mb-4">Currently selected</h3>
                        <div className="text-white rounded-lg p-4 h-48 flex flex-col justify-between" style={{ backgroundColor: "#a020f0" }}>
                            <h4 className="text-4xl font-semibold">Portfolio</h4>
                            <p className="text-lg opacity-90 text-center">Description & some performance data</p>
                        </div>
                    </div>

                    {/* All Instruments */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-3xl font-medium text-gray-500">All instruments</h3>
                            <button
                                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {instruments.map((instrument, index) => (
                                <div
                                    key={index}
                                    className="text-white rounded-lg p-2 h-24 flex flex-col justify-between relative"
                                    style={{ backgroundColor: "#7f7f7f" }}
                                >
                                    <h4 className="text-2xl font-medium text-white">{instrument.title}</h4>
                                    <p className="text-sm text-gray-300">{instrument.description}</p>
                                    {instrument.comingSoon && (
                                        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                            Coming soon
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Portfolio Setup Progress */}
                <div className="bg-white rounded-lg p-8 mb-8">
                    <div className="w-full h-0.5 bg-gray-200 mb-6"></div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-black">Setting up spot portfolio</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Portfolio type</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setPortfolioType("single")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${portfolioType === "single"
                                        ? "bg-green-600 text-white"
                                        : "text-blue-600 hover:text-blue-800"
                                        }`}
                                >
                                    Single Asset
                                </button>
                                <button
                                    onClick={() => setPortfolioType("multi")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${portfolioType === "multi"
                                        ? "bg-green-600 text-white"
                                        : "text-blue-600 hover:text-blue-800"
                                        }`}
                                >
                                    Multi-Asset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content with Side Navigation */}
                    <div className="flex">
                        {/* Left Side Navigation */}
                        <div className="w-64 flex-shrink-0">
                            <div className="flex flex-col justify-between h-[800px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                                    <span className="text-gray-700 font-medium">Portfolio details</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                                    <span className="text-gray-700 font-medium">Asset details</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                                    <span className="text-gray-700 font-medium">Options</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="flex-1">
                            {/* Portfolio Details Section */}
                            <div className="mb-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="mb-4">
                                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                                            Connect API or Wallet/Exchange here
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Portfolio name*
                                            </label>
                                            <input
                                                type="text"
                                                value={portfolioDetails.name}
                                                onChange={(e) => setPortfolioDetails({ ...portfolioDetails, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Total allocated capital*
                                            </label>
                                            <input
                                                type="text"
                                                value={portfolioDetails.capital}
                                                onChange={(e) => setPortfolioDetails({ ...portfolioDetails, capital: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Base currency*
                                            </label>
                                            <select
                                                value={portfolioDetails.currency}
                                                onChange={(e) => setPortfolioDetails({ ...portfolioDetails, currency: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="USD (United States Dollar)">USD (United States Dollar)</option>
                                                <option value="EUR (Euro)">EUR (Euro)</option>
                                                <option value="GBP (British Pound)">GBP (British Pound)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Asset category*
                                            </label>
                                            <select
                                                value={portfolioDetails.category}
                                                onChange={(e) => setPortfolioDetails({ ...portfolioDetails, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Crypto">Crypto</option>
                                                <option value="Stocks">Stocks</option>
                                                <option value="Bonds">Bonds</option>
                                                <option value="Commodities">Commodities</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Asset Allocations & Weightage Section */}
                            <div className="mb-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Asset allocations & weightage</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Total: {totalWeight.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleAddAsset}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                                            >
                                                + Add Asset
                                            </button>
                                            <button
                                                onClick={handleEqualWeight}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                            >
                                                Equal weight
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end mb-4">
                                        <span className="text-sm text-gray-600">Cash available: {remainingCash.toFixed(3)}</span>
                                    </div>
                                    <div className="h-1 mb-2 bg-green-700 w-200"></div>

                                    {/* Assets Table */}
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol/Asset</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Weight (%)</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {assets.map((asset, index) => (
                                                    <tr key={asset.id}>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{asset.icon}</span>
                                                                <span className="text-sm font-medium text-gray-900">{asset.symbol}</span>
                                                                <Search className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={asset.weight}
                                                                onChange={(e) => {
                                                                    const newWeight = parseFloat(e.target.value) || 0;
                                                                    const newAmount = (parseFloat(portfolioDetails.capital) * newWeight / 100);
                                                                    setAssets(assets.map(a =>
                                                                        a.id === asset.id
                                                                            ? { ...a, weight: newWeight, amount: newAmount }
                                                                            : a
                                                                    ));
                                                                }}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={asset.amount}
                                                                onChange={(e) => {
                                                                    const newAmount = parseFloat(e.target.value) || 0;
                                                                    const newWeight = (newAmount / parseFloat(portfolioDetails.capital)) * 100;
                                                                    setAssets(assets.map(a =>
                                                                        a.id === asset.id
                                                                            ? { ...a, amount: newAmount, weight: newWeight }
                                                                            : a
                                                                    ));
                                                                }}
                                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={asset.units}
                                                                onChange={(e) => {
                                                                    const newUnits = parseFloat(e.target.value) || 0;
                                                                    setAssets(assets.map(a =>
                                                                        a.id === asset.id
                                                                            ? { ...a, units: newUnits }
                                                                            : a
                                                                    ));
                                                                }}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleDeleteAsset(asset.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Behavior Section */}
                            <div>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Portfolio behavior</h3>

                                    <div className="space-y-6">
                                        {/* Rebalance portfolio */}
                                        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(4, minmax(0, 190px))", display: "grid" }}>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-gray-700 font-medium">Rebalance portfolio</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPortfolioBehavior({
                                                            ...portfolioBehavior,
                                                            rebalance: { ...portfolioBehavior.rebalance, enabled: !portfolioBehavior.rebalance.enabled }
                                                        })}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${portfolioBehavior.rebalance.enabled ? 'bg-green-600' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${portfolioBehavior.rebalance.enabled ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                    <span className="text-sm text-gray-600">
                                                        {portfolioBehavior.rebalance.enabled ? 'On' : 'Off'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500">Type*</span>
                                                </div>
                                                <select
                                                    value={portfolioBehavior.rebalance.type}
                                                    onChange={(e) => setPortfolioBehavior({
                                                        ...portfolioBehavior,
                                                        rebalance: { ...portfolioBehavior.rebalance, type: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                >
                                                    <option value="Equal">Equal</option>
                                                    <option value="Weighted">Weighted</option>
                                                    <option value="Custom">Custom</option>
                                                </select>
                                            </div>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500">Frequency*</span>
                                                </div>
                                                <select
                                                    value={portfolioBehavior.rebalance.frequency}
                                                    onChange={(e) => setPortfolioBehavior({
                                                        ...portfolioBehavior,
                                                        rebalance: { ...portfolioBehavior.rebalance, frequency: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                >
                                                    <option value="Daily">Daily</option>
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Monthly">Monthly</option>
                                                    <option value="Quarterly">Quarterly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500">Threshold*</span>
                                                </div>
                                                <select
                                                    value={portfolioBehavior.rebalance.threshold}
                                                    onChange={(e) => setPortfolioBehavior({
                                                        ...portfolioBehavior,
                                                        rebalance: { ...portfolioBehavior.rebalance, threshold: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                >
                                                    <option value="1%">1%</option>
                                                    <option value="3%">3%</option>
                                                    <option value="5%">5%</option>
                                                    <option value="10%">10%</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Profit Taking */}
                                        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(2, minmax(0, 190px))", display: "grid" }}>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-gray-700 font-medium">Profit Taking</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPortfolioBehavior({
                                                            ...portfolioBehavior,
                                                            profitTaking: { ...portfolioBehavior.profitTaking, enabled: !portfolioBehavior.profitTaking.enabled }
                                                        })}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${portfolioBehavior.profitTaking.enabled ? 'bg-green-600' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${portfolioBehavior.profitTaking.enabled ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                    <span className="text-sm text-gray-600">
                                                        {portfolioBehavior.profitTaking.enabled ? 'On' : 'Off'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500">Take profit at* (Threshold gain in %)</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={portfolioBehavior.profitTaking.threshold}
                                                    onChange={(e) => setPortfolioBehavior({
                                                        ...portfolioBehavior,
                                                        profitTaking: { ...portfolioBehavior.profitTaking, threshold: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                />
                                            </div>
                                        </div>

                                        {/* Re-invest profits */}
                                        <div className="grid grid-cols-1 gap-8">
                                            <div>
                                                <div className="mb-3">
                                                    <span className="text-gray-700 font-medium">Re-invest profits</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPortfolioBehavior({
                                                            ...portfolioBehavior,
                                                            reinvestProfits: { ...portfolioBehavior.reinvestProfits, enabled: !portfolioBehavior.reinvestProfits.enabled }
                                                        })}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${portfolioBehavior.reinvestProfits.enabled ? 'bg-green-600' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${portfolioBehavior.reinvestProfits.enabled ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                    <span className="text-sm text-gray-600">
                                                        {portfolioBehavior.reinvestProfits.enabled ? 'On' : 'Off'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Deploy Button */}
                     <div className="flex justify-center mt-8">
                         <button
                             onClick={() => setShowSummaryModal(true)}
                             className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
                         >
                             Deploy Portfolio
                         </button>
                     </div>
                 </div>
             </div>

             {/* Summary Modal */}
             {showSummaryModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                     <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
                         {/* Modal Header */}
                         <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-4">
                                 <h2 className="text-2xl font-bold text-black">Summary</h2>
                                 <button
                                     onClick={() => setShowSummaryModal(false)}
                                     className="text-blue-600 hover:text-blue-800 font-medium ml-36"
                                 >
                                     Edit
                                 </button>
                             </div>
                             <button
                                 onClick={() => setShowSummaryModal(false)}
                                 className="text-gray-400 hover:text-gray-600"
                             >
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                             </button>
                         </div>

                         {/* Summary Content */}
                         <div className="space-y-4 mb-8">
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Name</span>
                                 <span className="font-bold text-black text-left">{portfolioDetails.name}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Type</span>
                                 <span className="font-bold text-black text-left">{portfolioType === "single" ? "Single Asset" : "Multi-Asset"}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Total capital</span>
                                 <span className="font-bold text-black">{portfolioDetails.capital} {portfolioDetails.currency.split(' ')[0]}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Total assets</span>
                                 <span className="font-bold text-black">{assets.length}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Rebalancing</span>
                                 <span className="font-bold text-black">{portfolioBehavior.rebalance.enabled ? 'On' : 'Off'}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Profit taking</span>
                                 <span className="font-bold text-black">{portfolioBehavior.profitTaking.enabled ? 'On' : 'Off'}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-teal-600">Reinvest</span>
                                 <span className="font-bold text-black">{portfolioBehavior.reinvestProfits.enabled ? 'On' : 'Off'}</span>
                             </div>
                         </div>

                         {/* Modal Actions */}
                         <div>
                            <button
                                onClick={() => {
                                    // Handle portfolio deployment
                                    console.log('Deploying portfolio...');
                                    setShowSummaryModal(false);
                                    
                                    // Store portfolio data in localStorage
                                    const portfolioData = {
                                        name: portfolioDetails.name,
                                        capital: portfolioDetails.capital,
                                        currency: portfolioDetails.currency,
                                        category: portfolioDetails.category,
                                        assets: assets,
                                        behavior: portfolioBehavior,
                                        createdAt: new Date().toISOString(),
                                        status: 'Active'
                                    };
                                    
                                    const existingPortfolios = JSON.parse(localStorage.getItem('deployedPortfolios') || '[]');
                                    existingPortfolios.push(portfolioData);
                                    localStorage.setItem('deployedPortfolios', JSON.stringify(existingPortfolios));
                                    
                                    // Navigate to portfolio performance dashboard
                                    navigate('/portfolio-performance');
                                }}
                                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                                Deploy Portfolio
                            </button>
                         </div>
                     </div>
                 </div>
             )}
         </div>
     );
 };

export default PortfolioSetup;
