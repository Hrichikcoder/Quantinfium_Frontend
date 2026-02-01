import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, Play, AlertTriangle, Sparkles, Settings2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBot?: (botConfig: any) => void;
  
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  type?: 'greeting' | 'refusal' | 'insight' | 'config';
  config?: any;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onCreateBot }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hi! I am Quant Bot, your personalized trading partner. 🤖",
      isUser: false,
      type: 'greeting'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userText,
      isUser: true
    }]);

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error("Server connection failed");
      }

      const data = await response.json();
      
      if (data.type === 'config' && data.configuration) {
        setIsLoading(false);
        onClose(); 
        navigate('/bot-setup', { state: { aiConfig: data.configuration } });
        return;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
        type: data.type,
        config: data.configuration
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Error: Is 'LLM_backend.py' running? \n\nCheck your terminal.",
        isUser: false,
        type: 'refusal'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunch = (config: any, editMode = false) => {
    if (onCreateBot && config) {
        onCreateBot({ ...config, editMode });
        
        if (!editMode) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: `✅ Done! I've launched the ${config.asset} bot.`,
                isUser: false,
                type: 'insight'
            }]);
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col font-sans overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-sm">Quant Bot</h3>
                <span className="text-[10px] text-gray-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded transition-colors"><X className="h-5 w-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                m.isUser 
                ? 'bg-gray-900 text-white rounded-2xl rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none'
              }`}>
              {m.type === 'refusal' && <AlertTriangle className="h-4 w-4 text-orange-500 mb-2" />}
              {m.type === 'insight' && !m.isUser && <Sparkles className="h-4 w-4 text-blue-500 mb-2" />}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              
              {!m.isUser && m.type === 'config' && m.config && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Ticket Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="text-gray-500">Strategy:</div><div className="font-bold text-purple-600">{m.config.strategy}</div>
                        <div className="text-gray-500">Asset:</div><div className="font-bold">{m.config.asset}</div>
                        <div className="text-gray-500">Action:</div><div className="font-bold uppercase">{m.config.action || 'BUY'}</div>
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs ml-4">
             <Loader2 className="h-3 w-3 animate-spin" /> Analyzing market data...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="E.g., 'Buy $50 ETH' or 'Price of PEPE?'" 
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;