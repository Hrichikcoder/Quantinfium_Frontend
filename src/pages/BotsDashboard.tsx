import React, { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, Play, Pause, Pencil, Trash2, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner"; 
import Chatbot from "@/components/Chatbot"; // ✅ FIXED: Default import
import { listBasicDcaBots, deleteBasicDcaBot } from "@/api"; 

// --- UI COMPONENTS ---

const MiniChart: React.FC<{ isPositive: boolean }> = ({ isPositive }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="15" x2="75" y2="15" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2,2" />
    <path
      d={isPositive ? "M5 20 L20 18 L35 12 L50 8 L65 5 L75 3" : "M5 5 L20 8 L35 12 L50 18 L65 22 L75 25"}
      stroke={isPositive ? "#10B981" : "#EF4444"}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const RedesignedBotCard: React.FC<{
  bot: any;
  onPauseResume: (botId: number) => void;
  onDelete: (botId: number) => void;
  onEdit: (botId: number) => void;
}> = ({ bot, onPauseResume, onDelete, onEdit }) => {
  // Determine if PnL is positive based on string (e.g., "-$50") or number
  const pnlString = String(bot.realizedPnl || "");
  const isPositive = !pnlString.includes("-");

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-6 relative hover:shadow-md transition-all duration-200 group">
      
      {/* Status Indicator & Settings */}
      <div className="absolute top-6 right-6 flex flex-col items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className={`w-1.5 h-8 rounded-full ${bot.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-400'}`}></div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-start pr-12">
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Bot Name</div>
          <h3 className="text-xl font-bold text-gray-900 truncate max-w-[180px]" title={bot.name}>{bot.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`flex h-2 w-2 rounded-full ${bot.status === 'Active' ? 'bg-green-500' : 'bg-yellow-400'}`} />
            <span className="text-sm font-medium text-gray-600">{bot.status}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Asset</div>
          <div className="text-lg font-bold text-slate-800">{bot.pair || bot.asset || "BTC/USDT"}</div>
          <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
            {bot.strategy || "DCA Basic"}
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Total Value</div>
            <div className="text-lg font-bold text-slate-800">{bot.totalValue || "$0.00"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Realized PnL</div>
            <div className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
              {bot.realizedPnl || "$0.00"}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-end">
          <div className="text-right mb-2">
            <div className="text-xs text-gray-500 mb-0.5">Total Investment</div>
            <div className="text-lg font-bold text-slate-800">{bot.totalInvestment || "$0.00"}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 w-full flex items-center justify-center h-12">
            <MiniChart isPositive={isPositive} />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Actions Footer */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button 
          onClick={() => onPauseResume(bot.id)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors group/btn"
        >
          {bot.status === 'Paused' ? (
            <Play className="h-5 w-5 text-green-600 mb-1 group-hover/btn:scale-110 transition-transform" />
          ) : (
            <Pause className="h-5 w-5 text-orange-500 mb-1 group-hover/btn:scale-110 transition-transform" />
          )}
          <span className="text-[10px] font-bold text-gray-500 uppercase">{bot.status === 'Paused' ? 'Resume' : 'Pause'}</span>
        </button>

        <button 
          onClick={() => onEdit(bot.id)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors group/btn"
        >
          <Pencil className="h-5 w-5 text-blue-600 mb-1 group-hover/btn:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-gray-500 uppercase">Edit</span>
        </button>

        <button 
          onClick={() => onDelete(bot.id)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-red-50 transition-colors group/btn"
        >
          <Trash2 className="h-5 w-5 text-red-500 mb-1 group-hover/btn:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-gray-500 uppercase">Delete</span>
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const BotsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // 1. Fetch Bots (REAL DATA)
  const fetchBots = async () => {
    try {
      if (bots.length === 0) setLoading(true);
      const data = await listBasicDcaBots();
      setBots(data);
    } catch (error) {
      console.error("Failed to fetch bots", error);
      // Optional: Only show toast if it's a hard error, to avoid spamming while coding
      // toast.error("Could not load bots. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
    const interval = setInterval(fetchBots, 5000); 
    return () => clearInterval(interval);
  }, []);

  // 2. Actions
  const handleDelete = async (botId: number) => {
    if (!window.confirm("Are you sure you want to delete this bot?")) return;
    try {
        const bot = bots.find(b => b.id === botId);
        await deleteBasicDcaBot(botId, bot?.bot_type || 'basic');
        setBots(prev => prev.filter(b => b.id !== botId));
        toast.success("Bot deleted successfully");
    } catch (err) {
        toast.error("Failed to delete bot");
    }
  };

  const handlePauseResume = async (botId: number) => {
     // Placeholder for API call to pause/resume
     setBots(prev => prev.map(b => {
         if (b.id === botId) {
             const newStatus = b.status === 'Active' ? 'Paused' : 'Active';
             toast.success(`Bot ${newStatus === 'Active' ? 'Resumed' : 'Paused'}`);
             return { ...b, status: newStatus };
         }
         return b;
     }));
  };

  const handleEdit = (botId: number) => {
    toast.info("Edit functionality coming soon");
  };

  // 3. Filtering
  const filteredBots = bots.filter(bot => 
    bot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.pair?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
        
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Overview of your active trading bots</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard?new=true')}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm gap-2"
              >
                <Plus className="h-4 w-4" />
                New Bot
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search by name or asset..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Grid Layout */}
          {loading && bots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 text-sm">Loading your bots from LLM Backend...</p>
            </div>
          ) : filteredBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBots.map((bot) => (
                <RedesignedBotCard
                  key={bot.id}
                  bot={bot}
                  onPauseResume={handlePauseResume}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No bots active</h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                No active bots found on the local backend.
              </p>
              <button 
                onClick={() => navigate('/dashboard?new=true')}
                className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Create your first bot
              </button>
            </div>
          )}
        </div>

        {/* --- CHATBOT (Connected to LLM Backend) --- */}
        <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        
        {!isChatbotOpen && (
           <button
             onClick={() => setIsChatbotOpen(true)}
             className="fixed bottom-6 right-6 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
           </button>
        )}
    </div>
  );
};

export default BotsDashboard;