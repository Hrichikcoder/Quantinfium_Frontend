import React, { createContext, useContext, useState, useEffect } from "react";

interface EnvironmentContextType {
  environmentType: "basic" | "professional";
  setEnvironmentType: (type: "basic" | "professional") => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  isProfessional: boolean;
  isBasic: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environmentType, setEnvironmentTypeState] = useState<"basic" | "professional">(() => {
    const saved = localStorage.getItem('userEnvironmentType');
    return (saved as "basic" | "professional") || "professional";
  });
  
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem('userTheme');
    return (saved as "light" | "dark" | "system") || "light";
  });

  const setEnvironmentType = (type: "basic" | "professional") => {
    setEnvironmentTypeState(type);
    localStorage.setItem('userEnvironmentType', type);
    
    // Apply environment-specific logic
    if (type === "professional") {
      console.log("Professional environment activated");
      // You can add professional-specific features here
      // For example: enable advanced trading features, show more detailed analytics, etc.
    } else {
      console.log("Basic environment activated");
      // You can add basic-specific features here
      // For example: hide advanced features, show simplified interface, etc.
    }
  };

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem('userTheme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeValue: "light" | "dark" | "system") => {
    const root = document.documentElement;
    
    if (themeValue === "system") {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      // Use user preference
      root.classList.toggle('dark', themeValue === "dark");
    }
  };

  // Apply theme on mount and when system preference changes
  useEffect(() => {
    applyTheme(theme);
    
    // Listen for system theme changes when using "system" theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(theme);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value: EnvironmentContextType = {
    environmentType,
    setEnvironmentType,
    theme,
    setTheme,
    isProfessional: environmentType === "professional",
    isBasic: environmentType === "basic",
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};
