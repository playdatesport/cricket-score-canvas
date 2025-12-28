import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  playerName: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isOnStrike?: boolean;
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  playerName, 
  avatarUrl, 
  size = 'sm', 
  isOnStrike = false,
  className 
}) => {
  const sizeClasses = {
    xs: 'h-5 w-5',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate consistent avatar based on name if none provided
  const generatedUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(playerName)}&backgroundColor=0ea5e9,3b82f6,6366f1`;

  return (
    <div className={cn('relative', className)}>
      <Avatar className={cn(
        sizeClasses[size], 
        'ring-1 ring-border/50',
        isOnStrike && 'ring-2 ring-primary'
      )}>
        <AvatarImage src={avatarUrl || generatedUrl} alt={playerName} />
        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
          {getInitials(playerName) || <User className="w-3 h-3" />}
        </AvatarFallback>
      </Avatar>
      {isOnStrike && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary ring-1 ring-background animate-pulse" />
      )}
    </div>
  );
};

export default PlayerAvatar;
