import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchProvider } from "@/context/MatchContext";
import Index from "./pages/Index";
import Umpire from "./pages/Umpire";
import Scorecard from "./pages/Scorecard";
import FullScorecard from "./pages/FullScorecard";
import MatchSetup from "./pages/MatchSetup";
import MatchAnalytics from "./pages/MatchAnalytics";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import InstallPrompt from "./components/InstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MatchProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <InstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/umpire" element={<Umpire />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/full-scorecard" element={<FullScorecard />} />
            <Route path="/setup" element={<MatchSetup />} />
            <Route path="/analytics" element={<MatchAnalytics />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
