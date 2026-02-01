import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../molecules/AuthContext";
import { useEnvironment } from "../molecules/EnvironmentContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut, X } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface NavbarProps {
  onSignUpClick: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  navBtn: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSignUpClick, mobileNavOpen, setMobileNavOpen, navBtn }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { environmentType, setEnvironmentType, theme, setTheme } = useEnvironment();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleMenuClick = (menuItem: string) => {
    switch (menuItem) {
      case 'API Management':
        navigate('/settings');
        break;
      case 'Settings':
        navigate('/settings');
        break;
      case 'Language':
        // Handle language settings
        console.log('Language settings clicked');
        break;
      case 'Notifications':
        // Handle notification settings
        console.log('Notification settings clicked');
        break;
      case 'Account history & data':
        // Handle account history
        console.log('Account history clicked');
        break;
      default:
        break;
    }
  };

  // Get user's name from email (first part before @)
  const getUserName = () => {
    if (!user?.email) return "User";
    const namePart = user.email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" className="font-black text-xl sm:text-2xl text-black tracking-tight">Qi.</Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-4">
          {/* <Link to="/" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Home</Link> */}
          <Link to="/investors" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">For Investors</Link>

          <a href="#" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Backtester</a>
          <a href="#" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">QI Dashboard</a>
          <Link to="/dashboard" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">My Bots Dashboard</Link>
          <Link to="/portfolio-performance" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Portfolio Performance</Link>
          <Link to="/contact" className="text-black font-medium text-sm xl:text-base hover:text-green-600 hover:bg-green-50 px-2 xl:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Contact</Link>
        </nav>

        {/* Tablet Nav - Smaller text, fewer items, scrollable */}
        <nav className="hidden md:flex lg:hidden flex-1 items-center justify-center gap-2 min-w-0 overflow-x-auto">
          {/* <Link to="/" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Home</Link> */}
          <Link to="/investors" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">For Investors</Link>

          <a href="#" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Backtester</a>
          <a href="#" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">QI Dashboard</a>
          <Link to="/dashboard" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">My Bots</Link>
          <Link to="/portfolio-performance" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Portfolio</Link>
          <Link to="/contact" className="text-black font-medium text-[10px] sm:text-xs hover:text-green-600 hover:bg-green-50 px-1.5 sm:px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0">Contact</Link>
        </nav>
        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 flex-shrink-0"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Profile/Signup Button - Desktop and Tablet */}
        <div className="hidden md:block ml-2 lg:ml-4 flex-shrink-0">
          {isAuthenticated ? (
            <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-qi-green transition-colors">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-[#19d94b] text-black text-xs sm:text-sm font-semibold">
                      {user?.email ? getInitials(user.email) : <User className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 max-h-[75vh] overflow-y-auto rounded-2xl shadow-2xl border border-border bg-background"
                sideOffset={12}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
                  <h2 className="text-lg font-semibold text-foreground truncate max-w-[70%]">{user?.email}</h2>
                  <button
                    className="p-1 hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-muted"
                    onClick={() => setProfileMenuOpen(false)}
                    aria-label="Close profile menu"
                    tabIndex={0}
                  >
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
                {/* Content */}
                <div className="p-4 space-y-6">
                  {/* Environment Type */}
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium text-foreground">Environment type</Label>
                    <RadioGroup value={environmentType} onValueChange={setEnvironmentType} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic" className="text-sm text-foreground">Basic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="text-sm text-foreground">Professional</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Theme */}
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium text-foreground">Theme</Label>
                    <RadioGroup value={theme} onValueChange={setTheme} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="text-sm text-foreground">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="text-sm text-foreground">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="text-sm text-foreground">System</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Menu Items */}
                  <div className="space-y-1">
                    {['API Management', 'Settings', 'Language', 'Notifications', 'Account history & data'].map((item, index) => (
                      <div key={item}>
                        <button
                          onClick={() => handleMenuClick(item)}
                          className="w-full text-left py-2 px-1 text-[15px] text-foreground hover:text-black dark:hover:text-white hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-qi-green"
                        >
                          {item}
                        </button>
                        {index < 4 && (
                          <hr className="border-border mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Footer (logout) */}
                <div className="sticky bottom-0 bg-background p-4 border-t border-border z-10 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 text-sm text-red-600 border border-red-200 rounded-full shadow-md hover:bg-red-50 hover:border-red-300 dark:border-red-400 dark:hover:bg-red-800 dark:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={onSignUpClick} className={`${navBtn} px-3 md:px-4 lg:px-5 text-xs sm:text-sm md:text-base whitespace-nowrap`}>
              Sign up or Login
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-2 mt-2 px-4 pb-4">
            {/* <Link to="/" className="text-black font-medium text-base py-2 hover:underline">Home</Link> */}
            <Link to="/investors" className="text-black font-medium text-base py-2 hover:underline">For Investors</Link>

            <a href="#" className="text-black font-medium text-base py-2 hover:underline">Backtester</a>
            <a href="#" className="text-black font-medium text-base py-2 hover:underline">QI Dashboard</a>
            <Link to="/dashboard" className="text-black font-medium text-base py-2 hover:underline">My Bots Dashboard</Link>
            <Link to="/portfolio-performance" className="text-black font-medium text-base py-2 hover:underline">Portfolio Performance</Link>
            <Link to="/contact" className="text-black font-medium text-base py-2 hover:underline">Contact</Link>
            {isAuthenticated ? (
              <div className="mt-4 space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-[#19d94b] text-black text-xs font-semibold">
                      {user?.email ? getInitials(user.email) : <User className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">Welcome!</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                </div>

                {/* Environment Type */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Environment type</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mobile-basic"
                        name="mobile-environment"
                        value="basic"
                        checked={environmentType === "basic"}
                        onChange={() => setEnvironmentType("basic")}
                        className="text-green-600"
                      />
                      <label htmlFor="mobile-basic" className="text-sm text-gray-700">Basic</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mobile-professional"
                        name="mobile-environment"
                        value="professional"
                        checked={environmentType === "professional"}
                        onChange={() => setEnvironmentType("professional")}
                        className="text-green-600"
                      />
                      <label htmlFor="mobile-professional" className="text-sm text-gray-700">Professional</label>
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Theme</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mobile-light"
                        name="mobile-theme"
                        value="light"
                        checked={theme === "light"}
                        onChange={() => setTheme("light")}
                        className="text-green-600"
                      />
                      <label htmlFor="mobile-light" className="text-sm text-gray-700">Light</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mobile-dark"
                        name="mobile-theme"
                        value="dark"
                        checked={theme === "dark"}
                        onChange={() => setTheme("dark")}
                        className="text-green-600"
                      />
                      <label htmlFor="mobile-dark" className="text-sm text-gray-700">Dark</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mobile-system"
                        name="mobile-theme"
                        value="system"
                        checked={theme === "system"}
                        onChange={() => setTheme("system")}
                        className="text-green-600"
                      />
                      <label htmlFor="mobile-system" className="text-sm text-gray-700">System</label>
                    </div>
                  </div>
                </div>

                {/* Settings Menu Items */}
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700 mb-2">Settings</div>
                  {["API Management", "Settings", "Language", "Notifications", "Account history & data"].map((item, index) => (
                    <div key={item}>
                      <button
                        onClick={() => handleMenuClick(item)}
                        className="w-full text-left py-2 px-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                      >
                        {item}
                      </button>
                      {index < 4 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 hover:border-red-300 transition-colors mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={onSignUpClick} className={navBtn + " mt-2 w-full"}>
                Sign up or Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 