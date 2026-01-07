import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";

const NotificationSettings = () => {
  const { isSupported, permission, requestPermission } = usePushNotifications();

  if (!isSupported) return null;

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notifications enabled! You'll receive match alerts.");
    } else {
      toast.error("Notification permission denied. Enable in browser settings.");
    }
  };

  if (permission === "granted") {
    return (
      <Button variant="ghost" size="icon" className="text-primary" disabled>
        <Bell className="w-5 h-5" />
      </Button>
    );
  }

  if (permission === "denied") {
    return (
      <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
        <BellOff className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleEnableNotifications}
      title="Enable notifications"
    >
      <Bell className="w-5 h-5" />
    </Button>
  );
};

export default NotificationSettings;
