import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TeamLogoProps {
  teamName: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, logoUrl, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate consistent logo based on name if none provided
  const generatedUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(teamName)}&backgroundColor=0ea5e9`;

  return (
    <Avatar className={cn(sizeClasses[size], 'ring-2 ring-border/50', className)}>
      <AvatarImage src={logoUrl || generatedUrl} alt={teamName} />
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
        {getInitials(teamName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default TeamLogo;
