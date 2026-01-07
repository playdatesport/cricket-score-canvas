import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchProvider } from "./context/MatchContext";
import InstallPrompt from "./components/InstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";

// Eagerly loaded routes (critical path)
import Index from "./pages/Index";
import Umpire from "./pages/Umpire";
import MatchSetup from "./pages/MatchSetup";
import NotFound from "./pages/NotFound";

// Lazy loaded routes (less frequently used)
const FullScorecard = lazy(() => import("./pages/FullScorecard"));
const MatchAnalytics = lazy(() => import("./pages/MatchAnalytics"));
const Statistics = lazy(() => import("./pages/Statistics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/20" />
      <div className="h-4 w-24 bg-muted rounded" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/setup" element={<MatchSetup />} />
              <Route path="/umpire" element={<Umpire />} />
              <Route path="/scorecard" element={<FullScorecard />} />
              <Route path="/analytics" element={<MatchAnalytics />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <InstallPrompt />
          <OfflineIndicator />
        </BrowserRouter>
      </MatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
