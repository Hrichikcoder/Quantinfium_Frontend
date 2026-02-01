import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // --- BYPASS CHANGE: Comment out the check ---
  // const accessToken = typeof localStorage !== "undefined" ? localStorage.getItem("accessToken") : null;
  // if (!accessToken) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  // Always render the protected content
  return <>{children}</>;
};

export default RequireAuth;