import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  username: string;
  password: string;
  pin: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  isSuccessModalOpen: boolean;
  verificationCode: string;
  login: (email: string, passwordOrPin: string) => boolean;
  logout: () => void;
  signup: (user: User) => boolean;
  startVerification: (email: string) => void;
  verifyAccount: (code: string) => boolean;
  resendVerificationCode: () => void;
  closeVerification: () => void;
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
  handleSuccessLogin: () => void;
  syncAuthFromLocalStorage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- BYPASS CHANGE 1: Define a Dummy User ---
const MOCK_USER: User = {
  email: "bypass@quantbot.com",
  username: "DevUser",
  password: "",
  pin: "",
  isVerified: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- BYPASS CHANGE 2: Set default state to Logged In ---
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // --- BYPASS CHANGE 3: Disable local storage check (or keep it, it won't matter with defaults) ---
  useEffect(() => {
    // Optional: You can keep this or comment it out. 
    // Since we default to true, we don't strictly need to check tokens.
  }, []);

  const login = (email: string, passwordOrPin: string) => {
    // --- BYPASS CHANGE 4: Always succeed login ---
    console.log("BYPASS: Login called, forcing success.");
    setUser(MOCK_USER);
    setIsAuthenticated(true);
    return true; 
  };

  const logout = () => {
    // Optional: Decide if logout should actually log you out in this mode
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
  };

  const signup = (newUser: User) => {
    setUser({ ...newUser, isVerified: true });
    setIsAuthenticated(true); // Auto-login on signup
    return true;
  };

  const startVerification = (email: string) => {
    console.log("BYPASS: Verification skipped");
  };

  const verifyAccount = (code: string) => {
    return true;
  };

  // Keep the rest of the helper functions empty or default
  const resendVerificationCode = () => {};
  const closeVerification = () => setIsVerifying(false);
  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const handleSuccessLogin = () => setIsSuccessModalOpen(false);
  const syncAuthFromLocalStorage = () => setIsAuthenticated(true);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isVerifying, 
      isSuccessModalOpen,
      verificationCode,
      login, 
      logout, 
      signup, 
      startVerification, 
      verifyAccount, 
      resendVerificationCode,
      closeVerification,
      openSuccessModal,
      closeSuccessModal,
      handleSuccessLogin,
      syncAuthFromLocalStorage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};