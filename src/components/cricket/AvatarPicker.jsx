import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const AvatarPicker = ({ currentAvatar, onAvatarChange }) => {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <User className="w-4 h-4" />
    </Button>
  );
};

export default AvatarPicker;
