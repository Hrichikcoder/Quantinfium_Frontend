import React, { useState, useEffect } from "react";
import { useAuth } from "../components/molecules/AuthContext";
import { getBrokers, createBroker, removeBroker, getProfile, deleteAccount } from "../api.jsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Settings as SettingsIcon, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import BrokerConnectionModal from "../components/molecules/BrokerConnectionModal";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Broker {
  id: string;
  name: string;
  api_key: string;
  api_secret: string;
  test_mode?: boolean; // Optional since backend doesn't return it
  status: 'connected' | 'disconnected';
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState("");
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  // --- Profile API State ---
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const fetchProfile = async () => {
    setProfileLoading(true); setProfileError("");
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setProfileError(err?.error || err?.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Load user data and brokers
  useEffect(() => {
    loadBrokers();
    // Load user's full name from localStorage or API
    const savedFullName = localStorage.getItem('userFullName') || '';
    setFullName(savedFullName);
    fetchProfile();
  }, []);

  const loadBrokers = async () => {
    try {
      const brokersData = await getBrokers();
      
      // Filter out duplicate brokers (keep only the most recent one per name)
      // This is a temporary workaround until backend supports ID-based deletion
      if (Array.isArray(brokersData) && brokersData.length > 0) {
        const brokersByName = {};
        const filteredBrokers = [];
        
        // Group by name and keep only the most recent (highest ID) for each name
        brokersData.forEach((broker: any) => {
          const name = broker.name;
          if (!brokersByName[name] || broker.id > brokersByName[name].id) {
            brokersByName[name] = broker;
          }
        });
        
        // Convert back to array
        Object.values(brokersByName).forEach((broker: any) => {
          filteredBrokers.push(broker);
        });
        
        // Sort by ID descending (most recent first)
        filteredBrokers.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        
        console.log('loadBrokers: Original count:', brokersData.length);
        console.log('loadBrokers: Filtered count:', filteredBrokers.length);
        console.log('loadBrokers: Removed duplicates:', brokersData.length - filteredBrokers.length);
        
        setBrokers(filteredBrokers);
      } else {
        setBrokers([]);
      }
    } catch (error) {
      console.error('Error loading brokers:', error);
      setBrokers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFullName = () => {
    localStorage.setItem('userFullName', fullName);
    // Here you would typically save to your backend API
    console.log('Full name saved:', fullName);
  };

  const handleAddBroker = () => {
    setShowBrokerModal(true);
  };

  const handleBrokerModalSuccess = () => {
    loadBrokers(); // Refresh the brokers list
    setShowBrokerModal(false);
  };

  const handleEditBroker = (broker: Broker) => {
    setEditingBroker(broker);
  };

  const handleDeleteBroker = async (broker: Broker) => {
    if (window.confirm(`Are you sure you want to delete the broker "${broker.name}"? This will permanently remove it from the database.`)) {
      try {
        console.log('handleDeleteBroker: Deleting broker:', broker);
        console.log('handleDeleteBroker: Using broker ID:', broker.id);
        
        // Use broker ID instead of name to avoid MultipleObjectsReturned error
        await removeBroker(broker.id);
        
        console.log('handleDeleteBroker: Broker deleted successfully');
        await loadBrokers(); // Reload the list
      } catch (error: any) {
        console.error('handleDeleteBroker: Error deleting broker:', error);
        console.error('handleDeleteBroker: Error details:', {
          message: error?.message,
          response: error?.response,
          responseData: error?.response?.data,
          responseStatus: error?.response?.status
        });
        
        // Log comprehensive error information to console
        console.error("=".repeat(50));
        console.error("Broker Deletion Failed");
        console.error("=".repeat(50));
        console.error("Broker:", broker);
        console.error("Error:", error?.message || error);
        console.error("=".repeat(50));
        
        let errorMessage = 'Failed to delete broker. Please try again.';
        if (error?.message?.includes('MultipleObjectsReturned')) {
          errorMessage = 'Multiple brokers with the same name found. Please contact support to clean up duplicate entries.';
        } else if (error?.message?.includes('not found')) {
          errorMessage = 'Broker not found. It may have been already deleted.';
        } else if (error?.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data.detail || error.response.data.message || errorMessage;
        }
        
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleDeleteAccountApi = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    try {
      const data = await deleteAccount(deletePassword, deleteReason);
      setDeleteSuccess(data?.message || "Your account has been deleted.");
      logout(); // <-- this ensures all context/UI is updated immediately
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      }, 2000);
    } catch (error) {
      setDeleteError(error?.error || error?.message || "Failed to delete account. Try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  

  const maskApiKey = (key: string) => {
    if (!key) return "**********";
    return key.length > 8 ? "**********" : "**********";
  };

  const maskSecret = (secret: string) => {
    if (!secret) return "**********";
    return "**********";
  };

  // Generate user ID (you might want to get this from your backend)
  const userId = user?.email ? `2025${user.email.length}${user.email.charCodeAt(0)}` : "2025280612";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Data Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal data</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">ID</Label>
                  <p className="text-sm text-gray-900">{userId}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{user?.email || "No email available"}</p>
                </div>
                
                {/* <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-gray-700">Full name</Label>
                    <span className="text-xs text-gray-500">not entered</span>
                  </div>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div> */}
                
                {/* User Profile Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-gray-700">Profile info</Label>
                    <Button size="sm" variant="outline" onClick={fetchProfile} disabled={profileLoading}>
                      Refresh Profile
                    </Button>
                  </div>
                  {profileLoading && <div className="text-sm text-gray-500">Loading profile...</div>}
                  {profileError && <div className="text-destructive text-xs">{profileError}</div>}
                  {profile && (
                    <div className="grid gap-2 text-sm pl-1">
                      {profile.location && <div><b>Location:</b> {profile.location}</div>}
                      {profile.birth_date && <div><b>Birth date:</b> {profile.birth_date}</div>}
                      {profile.deletion_reason && <div><b>Deletion reason:</b> <span className="text-destructive">{profile.deletion_reason}</span></div>}
                      {profile.deleted_at && <div><b>Deleted at:</b> <span className="text-destructive">{profile.deleted_at}</span></div>}
                      {!profile.location && !profile.birth_date && !profile.deletion_reason && !profile.deleted_at && (
                        <div className="text-muted-foreground">No profile info found.</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <Label className="text-sm font-medium text-gray-700">KYC Details:</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline ml-2">
                    Verify now
                  </a>
                </div>

                {/* --- Delete Account Button & Dialog --- */}
                <div className="pt-8">
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </div>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-destructive">Delete Your Account</DialogTitle>
                      <DialogDescription>
                        <span className="font-semibold text-destructive">Warning:</span> This action is <b>permanent</b> and will delete all your data, stop all activity, and cannot be undone.<br />
                        Please enter your password to confirm. Optionally, tell us why you're leaving.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                      <Label htmlFor="delete-password">Password <span className="text-destructive">*</span></Label>
                      <Input
                        id="delete-password"
                        type="password"
                        autoFocus
                        required
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        disabled={deleteLoading}
                      />
                    </div>
                    <div className="py-2">
                      <Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
                      <Input
                        id="delete-reason"
                        type="text"
                        value={deleteReason}
                        onChange={e => setDeleteReason(e.target.value)}
                        disabled={deleteLoading}
                      />
                    </div>
                    {deleteError && <div className="text-destructive text-sm py-1">{deleteError}</div>}
                    {deleteSuccess && <div className="text-green-600 text-sm py-1">{deleteSuccess}</div>}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteAccountApi} disabled={deleteLoading || !deletePassword}>
                        {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Placeholder Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-lg border border-gray-300 h-64 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Placeholder</span>
            </div>
          </div>
        </div>

        {/* API Management Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">API Management</h2>
              <Button
                onClick={handleAddBroker}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading brokers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sr</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">API Broker</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Key</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Secret</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brokers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No brokers connected. Click "Add" to connect your first broker.
                        </td>
                      </tr>
                    ) : (
                      brokers.map((broker, index) => (
                        <tr key={broker.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{index + 1}.</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{broker.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{maskApiKey(broker.api_key)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{maskSecret(broker.api_secret)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 text-sm ${
                              broker.status === 'connected' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {broker.status === 'connected' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              {broker.status === 'connected' ? 'Connected' : 'Not connected'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditBroker(broker)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBroker(broker)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveFullName}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Broker Connection Modal */}
        <BrokerConnectionModal
          isOpen={showBrokerModal}
          onClose={() => setShowBrokerModal(false)}
          onSuccess={handleBrokerModalSuccess}
        />
      </div>
    </div>
  );
};

export default Settings;
