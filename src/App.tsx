import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchProvider } from "./context/MatchContext";
import Index from "./pages/Index";
import Umpire from "./pages/Umpire";
import MatchSetup from "./pages/MatchSetup";
import FullScorecard from "./pages/FullScorecard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/setup" element={<MatchSetup />} />
            <Route path="/umpire" element={<Umpire />} />
            <Route path="/scorecard" element={<FullScorecard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
