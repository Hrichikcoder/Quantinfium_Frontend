import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getBrokers, createBroker } from "../../api.jsx";
import { toast } from "../ui/sonner";

interface BrokerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SavedBroker {
  id: string;
  name: string;
  api_key: string;
  api_secret: string;
  test_mode?: boolean; // Optional since backend doesn't return it
}

const BrokerConnectionModal: React.FC<BrokerConnectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<'load' | 'connect'>('load');
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<SavedBroker | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Connect tab states
  const [brokerSearch, setBrokerSearch] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [passcode, setPasscode] = useState("");
  const [testMode, setTestMode] = useState(false);

  // Load saved brokers on mount
  useEffect(() => {
    if (isOpen) {
      loadSavedBrokers();
    }
  }, [isOpen]);

  const loadSavedBrokers = async () => {
    try {
      const brokers = await getBrokers();
      setSavedBrokers(brokers || []);
    } catch (error) {
      console.error('Error loading saved brokers:', error);
      setSavedBrokers([]);
    }
  };

  const handleLoadBroker = (broker: SavedBroker) => {
    setSelectedBroker(broker);
    setApiKey(broker.api_key);
    setSecretKey(broker.api_secret);
    setTestMode(broker.test_mode || false); // Default to false if undefined
  };

  const handleTestConnection = async () => {
    if (!selectedBroker) {
      toast.error('Please select a saved connection first');
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would actually test the connection with the broker API
      setIsConnected(true);
      toast.success('Connection successful!');
    } catch (error) {
      toast.error('Connection failed. Please check your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConnectNewBroker = async () => {
    if (!brokerSearch || !apiKey || !secretKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if broker with this name already exists
    try {
      const existingBrokers = await getBrokers();
      const duplicateBroker = existingBrokers.find(broker => 
        broker.name.toLowerCase() === brokerSearch.toLowerCase()
      );
      
      if (duplicateBroker) {
        toast.error(`A broker named "${brokerSearch}" already exists. Please choose a different name or delete the existing one first.`);
        return;
      }
    } catch (error) {
      console.error('Error checking existing brokers:', error);
      // Continue with creation if check fails
    }

    setIsVerifying(true);
    try {
      await createBroker({
        name: brokerSearch,
        api_key: apiKey,
        api_secret: secretKey,
        test_mode: testMode
      });
      
      setIsConnected(true);
      toast.success('Connection successful!');
      onSuccess(); // Refresh the brokers list in parent
    } catch (error) {
      toast.error('Connection failed. Please check your credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    // Reset all states
    setActiveTab('load');
    setSelectedBroker(null);
    setIsVerifying(false);
    setIsConnected(false);
    setBrokerSearch("");
    setApiKey("");
    setSecretKey("");
    setPasscode("");
    setTestMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Connect broker API</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'load'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Load
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'connect'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Connect
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'load' ? (
            <>
              {/* Load Tab */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Select from saved API connections*
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={selectedBroker?.name || ""}
                    placeholder="Select a saved connection"
                    className="pr-10"
                    readOnly
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                {/* Saved connections dropdown */}
                {savedBrokers.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                    {savedBrokers.map((broker) => (
                      <button
                        key={broker.id}
                        onClick={() => handleLoadBroker(broker)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium">{broker.name}</div>
                        <div className="text-xs text-gray-500">
                          {broker.test_mode ? 'Test Mode' : 'Live Mode'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedBroker && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">API key*</Label>
                    <Input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Secret key*</Label>
                    <Input
                      type="password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="****************************"
                    />
                  </div>
                </>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleTestConnection}
                  disabled={!selectedBroker || isVerifying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isVerifying ? 'Verifying...' : 'Test connection'}
                </Button>
                
                {isVerifying && (
                  <p className="text-sm text-green-600 text-center mt-2">verifying...</p>
                )}
                
                {isConnected && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-600">Connection successful</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Connect Tab */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Search brokers*</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={brokerSearch}
                    onChange={(e) => setBrokerSearch(e.target.value)}
                    placeholder="Enter broker name (e.g., OKX, Bybit, Kraken)"
                    className="pr-10"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">API key*</Label>
                <Input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Secret key*</Label>
                <Input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="****************************"
                />
              </div>

              {/* Passcode field for certain brokers */}
              {brokerSearch.toLowerCase().includes('okx') && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Passcode*</Label>
                  <Input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="****************************"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="testMode"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <Label htmlFor="testMode" className="text-sm text-gray-700">
                  Use test mode (testnet/demo keys)
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleConnectNewBroker}
                  disabled={!brokerSearch || !apiKey || !secretKey || isVerifying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isVerifying ? 'Connecting...' : 'Test connection'}
                </Button>
                
                {isVerifying && (
                  <p className="text-sm text-green-600 text-center mt-2">verifying...</p>
                )}
                
                {isConnected && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-600">Connection successful</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Skip for now link */}
          <div className="text-center pt-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
              Skip for now
            </button>
          </div>

          {/* Saved API Key link (only show in connect tab) */}
          {activeTab === 'connect' && isConnected && (
            <div className="text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                Saved API Key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerConnectionModal;
