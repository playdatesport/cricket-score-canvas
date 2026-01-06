import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationSettings = () => {
  const { permission, isSupported, requestPermission } = usePushNotifications();

  if (!isSupported) return null;

  const handleClick = async () => {
    if (permission === 'default') {
      await requestPermission();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="relative"
      title={permission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
    >
      {permission === 'granted' ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>
  );
};

export default NotificationSettings;
