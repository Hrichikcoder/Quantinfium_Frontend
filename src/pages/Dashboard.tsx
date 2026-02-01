import React, { useState, useEffect } from "react";
import BotsDashboard from "./BotsDashboard";
import BotSetup from "./BotSetup";
import { useSearchParams, useLocation } from "react-router-dom";
import { listBasicDcaBots, deployDCABot, deployDCASmartBot } from "@/api.jsx";
import Chatbot from "@/components/Chatbot"; 
import { ArrowRight } from "lucide-react"; 

const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [showBotSetup, setShowBotSetup] = useState(false);
  const [deployedBots, setDeployedBots] = useState<any[]>([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [prefilledConfig, setPrefilledConfig] = useState<any>(null); 
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const forceEmptyState = searchParams.get("new") === "true";
  const modifyMode = searchParams.get("modify") === "true";

  // --- Load Bots ---
  const loadBotsFromBackend = async () => {
    try {
      setLoadingBots(true);
      const backendBots = await listBasicDcaBots();
      let botsArray = [];
      if (Array.isArray(backendBots)) {
        botsArray = backendBots;
      } else if (backendBots && typeof backendBots === 'object') {
        botsArray = backendBots.results || backendBots.bots || backendBots.data || [];
      }

      const transformedBots = botsArray.map((bot: any) => ({
        id: bot.id || Date.now(),
        name: bot.name || `Bot-${bot.id}`,
        pair: bot.asset || "BTC/USDT",
        strategy: (bot.bot_type === 'smart' ? 'Smart' : bot.bot_type === 'advanced' ? 'Advanced' : 'Basic'),
        totalValue: `$${bot.amount || 0}`,
        totalInvestment: `$${bot.amount || 0}`,
        realizedPnl: "$0.00",
        totalReturn: "0%",
        status: bot.status || "Active",
        statusColor: "bg-emerald-500",
        runtime: "0d 1h",
        account: "ByBit",
        paused: false,
        identifier: bot.identifier || bot.id, 
        createdAt: new Date().toISOString(),
      }));

      setDeployedBots(transformedBots);
    } catch (error) {
      console.error("Error loading bots:", error);
    } finally {
      setLoadingBots(false);
    }
  };

  useEffect(() => {
    loadBotsFromBackend();
    const interval = setInterval(loadBotsFromBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- AI Handler ---
  const handleAICreate = async (config: any) => {
      console.log("🤖 Dashboard received AI Config:", config);
      
      if (config.editMode) {
          // Switch to Setup Screen with Data
          setPrefilledConfig(config);
          setShowBotSetup(true);
          setSearchParams({}); 
      } else {
          // Immediate Deploy
          try {
            if (config.strategy === "Smart") {
                await deployDCASmartBot({ name: `AI-Smart-${config.asset}`, asset: config.asset, investment_amount: config.amount, risk_level: "Medium", status: "active" });
            } else {
                await deployDCABot({ name: `AI-DCA-${config.asset}`, pair: config.asset, amount: config.amount, frequency: "daily", action: "buy", status: "active" }, "Basic");
            }
            await loadBotsFromBackend();
          } catch(e) { console.error("Deploy failed", e); }
      }
  };

  const bots = (deployedBots.length > 0 && !forceEmptyState) || modifyMode ? deployedBots : [];

  // --- Empty State Render ---
  const renderEmptyState = () => (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-40">
        <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
            <h2 className="text-emerald-700 text-4xl font-bold text-center mb-16">Select an instrument to get started</h2>
            
            {/* Instrument Grid */}
            <div className="grid grid-cols-2 gap-8 mb-20">
                {/* First Row - Dollar Cost Average (Large) + 2 smaller cards */}
                <div className="row-span-2">
                    <div 
                        onClick={() => setShowBotSetup(true)}
                        className="h-full min-h-[550px] rounded-2xl p-10 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-emerald-400 via-green-600 to-emerald-950 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-5xl font-bold leading-tight drop-shadow-lg">
                                Dollar<br />Cost<br />Average
                            </h3>
                            <span className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                Most popular
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xl drop-shadow-md">Deploy now</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-1/4 left-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>

                {/* Trade or Invest */}
                <div>
                    <div 
                        onClick={() => {}}
                        className="h-64 rounded-2xl p-8 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-blue-400 via-indigo-600 to-indigo-950 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-3xl font-bold leading-tight drop-shadow-lg">
                                Trade or Invest
                            </h3>
                            <span className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                Check out
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg drop-shadow-md">Deploy now</span>
                        </div>
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-500/50 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>

                {/* Portfolio */}
                <div>
                    <div 
                        onClick={() => {}}
                        className="h-64 rounded-2xl p-8 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-purple-400 via-purple-700 to-purple-950 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-3xl font-bold leading-tight drop-shadow-lg">
                                Portfolio
                            </h3>
                            <span className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                Brand new
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg drop-shadow-md">Deploy now</span>
                        </div>
                        <div className="absolute -bottom-20 right-1/2 w-72 h-72 bg-purple-950/60 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-1/4 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* More Selection Section */}
            <div className="mb-8">
                <h3 className="text-emerald-700 text-2xl font-bold mb-6">More selection</h3>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Proprietary - Full Width */}
                <div 
                    onClick={() => {}}
                    className="h-56 rounded-2xl p-8 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                    style={{
                        background: 'linear-gradient(to right, #000000 0%, #1a0f0a 20%, #2d1810 35%, #4a2818 50%, #8b4513 70%, #cd7f5c 85%, #e89b7a 100%)'
                    }}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-4xl font-bold drop-shadow-lg">Proprietary</h3>
                            <span className="text-base opacity-90 mt-1 block">In-house</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                        <span className="font-semibold text-lg drop-shadow-md">Deploy now</span>
                    </div>
                    
                    {/* Blur effect in middle-left area */}
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-orange-900/40 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    {/* Additional depth layers */}
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-black/60 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent pointer-events-none"></div>
                    
                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>

                {/* Bottom Row - Investoaccumulator + Buy & HODL */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Investoaccumulator */}
                    <div 
                        onClick={() => {}}
                        className="h-56 rounded-2xl p-8 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-blue-400 via-blue-700 to-blue-950 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold drop-shadow-lg">Investoaccumulator</h3>
                                <span className="text-sm opacity-90 mt-1 block">New age</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg drop-shadow-md">Deploy now</span>
                        </div>
                        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-blue-950/80 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    {/* Buy & HODL */}
                    <div 
                        onClick={() => {}}
                        className="h-56 rounded-2xl p-8 text-white cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-gray-600 via-gray-400 to-gray-200 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold drop-shadow-lg">Buy & HODL</h3>
                                <span className="text-sm opacity-90 mt-1 block">Classic</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg drop-shadow-md">Deploy now</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-3/5 bg-gradient-to-t from-gray-600/60 to-transparent pointer-events-none"></div>
                        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* Chatbot (Floating for Empty State) */}
            <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} onCreateBot={handleAICreate} />
            
            {!isChatbotOpen && (
               <button
                 onClick={() => setIsChatbotOpen(true)}
                 className="fixed bottom-8 right-8 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
               </button>
            )}
        </div>
    </div>
  );

  return (
    <div>
      {showBotSetup || modifyMode || forceEmptyState ? (
        <BotSetup 
            onBack={() => { setShowBotSetup(false); setPrefilledConfig(null); }} 
            initialData={prefilledConfig}
        />
      ) : bots.length > 0 ? (
        <BotsDashboard bots={bots} onRefresh={loadBotsFromBackend} onAICreate={handleAICreate} />
      ) : (
        renderEmptyState()
      )}
    </div>
  );
};

export default Dashboard;