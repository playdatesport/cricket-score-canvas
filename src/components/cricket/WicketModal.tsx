import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DismissalType } from '@/types/cricket';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: WicketData) => void;
  outgoingBatter: string;
  availableBatters: string[];
  fielders: string[];
  currentBowler: string;
}

export interface WicketData {
  dismissalType: DismissalType;
  newBatter: string;
  dismissedBy: string;
  caughtBy?: string;
  runOutBy?: string;
}

const dismissalTypes: { value: DismissalType; label: string; needsFielder: boolean }[] = [
  { value: 'bowled', label: 'Bowled', needsFielder: false },
  { value: 'caught', label: 'Caught', needsFielder: true },
  { value: 'lbw', label: 'LBW', needsFielder: false },
  { value: 'run out', label: 'Run Out', needsFielder: true },
  { value: 'stumped', label: 'Stumped', needsFielder: true },
  { value: 'hit wicket', label: 'Hit Wicket', needsFielder: false },
  { value: 'retired hurt', label: 'Retired Hurt', needsFielder: false },
];

const WicketModal: React.FC<WicketModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  outgoingBatter,
  availableBatters,
  fielders,
  currentBowler,
}) => {
  const [dismissalType, setDismissalType] = useState<DismissalType>('bowled');
  const [newBatter, setNewBatter] = useState<string>('');
  const [fielder, setFielder] = useState<string>('');

  const selectedDismissal = dismissalTypes.find(d => d.value === dismissalType);
  const needsFielder = selectedDismissal?.needsFielder || false;

  const handleConfirm = () => {
    if (!newBatter) return;
    
    const data: WicketData = {
      dismissalType,
      newBatter,
      dismissedBy: currentBowler,
    };

    if (dismissalType === 'caught') {
      data.caughtBy = fielder;
    } else if (dismissalType === 'run out' || dismissalType === 'stumped') {
      data.runOutBy = fielder;
    }

    onConfirm(data);
    
    // Reset form
    setDismissalType('bowled');
    setNewBatter('');
    setFielder('');
  };

  const getDismissalDescription = () => {
    if (!newBatter) return '';
    
    switch (dismissalType) {
      case 'bowled':
        return `${outgoingBatter} b ${currentBowler}`;
      case 'caught':
        return `${outgoingBatter} c ${fielder || '___'} b ${currentBowler}`;
      case 'lbw':
        return `${outgoingBatter} lbw b ${currentBowler}`;
      case 'run out':
        return `${outgoingBatter} run out (${fielder || '___'})`;
      case 'stumped':
        return `${outgoingBatter} st ${fielder || '___'} b ${currentBowler}`;
      case 'hit wicket':
        return `${outgoingBatter} hit wicket b ${currentBowler}`;
      case 'retired hurt':
        return `${outgoingBatter} retired hurt`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            🏏 WICKET!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Outgoing Batter */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Outgoing Batter</p>
            <p className="font-semibold text-foreground">{outgoingBatter}</p>
          </div>

          {/* Dismissal Type */}
          <div className="space-y-2">
            <Label>How Out?</Label>
            <Select value={dismissalType} onValueChange={(v) => setDismissalType(v as DismissalType)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select dismissal type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {dismissalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fielder (if needed) */}
          {needsFielder && (
            <div className="space-y-2">
              <Label>
                {dismissalType === 'caught' ? 'Caught By' : 
                 dismissalType === 'run out' ? 'Run Out By' : 
                 'Wicketkeeper'}
              </Label>
              <Select value={fielder} onValueChange={setFielder}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select fielder" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50 max-h-48 overflow-y-auto">
                  {fielders.filter(f => f.trim()).map((f, idx) => (
                    <SelectItem key={idx} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* New Batter */}
          <div className="space-y-2">
            <Label>New Batter</Label>
            <Select value={newBatter} onValueChange={setNewBatter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select new batter" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50 max-h-48 overflow-y-auto">
                {availableBatters.filter(b => b.trim()).map((batter, idx) => (
                  <SelectItem key={idx} value={batter}>
                    {batter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dismissal Preview */}
          {newBatter && (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Dismissal</p>
              <p className="font-medium text-foreground">{getDismissalDescription()}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="flex-1 gradient-primary"
            disabled={!newBatter || (needsFielder && !fielder)}
          >
            Confirm Wicket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WicketModal;
