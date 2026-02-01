import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import HomeAlt from "./pages/HomeAlt";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PortfolioSetup from "./pages/PortfolioSetup";
import PortfolioPerformance from "./pages/PortfolioPerformance";
import PortfolioAnalytics from "./pages/PortfolioAnalytics";
import Settings from "./pages/Settings";
import Investors from "./pages/Investors";
import ProprietarySetup from "./pages/ProprietarySetup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BotSetup from "./pages/BotSetup";
import { Toaster } from "@/components/ui/sonner";
import RequireAuth from "./components/RequireAuth";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home-alt" element={<HomeAlt />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/proprietary-setup" element={<RequireAuth><ProprietarySetup /></RequireAuth>} />
        <Route path="/portfolio-setup" element={<RequireAuth><PortfolioSetup /></RequireAuth>} />
        <Route path="/portfolio-performance" element={<RequireAuth><PortfolioPerformance /></RequireAuth>} />
        <Route path="/portfolio-analytics" element={<RequireAuth><PortfolioAnalytics /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/bot-setup" element={<RequireAuth><BotSetup /></RequireAuth>} />
      </Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
);

export default App;