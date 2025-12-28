import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, User, Users } from 'lucide-react';
import { PRESET_PLAYER_AVATARS, PRESET_TEAM_LOGOS } from '@/hooks/useTeamAssets';
import { cn } from '@/lib/utils';

interface AvatarPickerProps {
  type: 'player' | 'team';
  currentUrl: string | null;
  name: string;
  onSelect: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  type,
  currentUrl,
  name,
  onSelect,
  onUpload,
  size = 'md',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = type === 'player' ? PRESET_PLAYER_AVATARS : PRESET_TEAM_LOGOS;
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await onUpload(file);
    setUploading(false);

    if (url) {
      onSelect(url);
      setOpen(false);
    }
  };

  const handlePresetSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={cn('relative group', className)}>
          <Avatar className={cn(sizeClasses[size], 'ring-2 ring-border hover:ring-primary transition-all')}>
            <AvatarImage src={currentUrl || undefined} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(name) || (type === 'player' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-foreground" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'player' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            {type === 'player' ? 'Choose Player Avatar' : 'Choose Team Logo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Custom Image'}
            </Button>
          </div>

          {/* Presets */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Or choose a preset:</p>
            <div className="grid grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.url)}
                  className={cn(
                    'p-1 rounded-lg border-2 transition-all hover:border-primary',
                    currentUrl === preset.url ? 'border-primary bg-primary/10' : 'border-transparent'
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={preset.url} alt={preset.id} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Current selection */}
          {currentUrl && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUrl} alt="Current" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Current {type === 'player' ? 'Avatar' : 'Logo'}</p>
                <p className="text-xs text-muted-foreground truncate max-w-48">{name}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarPicker;
