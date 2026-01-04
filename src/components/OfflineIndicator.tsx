import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Show briefly that we're back online, then hide
      setTimeout(() => setShowBanner(false), 2000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOffline ? "bg-destructive" : "bg-green-600"
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2">
        {isOffline ? (
          <>
            <WifiOff className="w-4 h-4 text-destructive-foreground" />
            <span className="text-sm font-medium text-destructive-foreground">
              You're offline. Some features may be unavailable.
            </span>
          </>
        ) : (
          <span className="text-sm font-medium text-white">
            Back online!
          </span>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
