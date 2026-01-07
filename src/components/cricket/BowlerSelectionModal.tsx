import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bowler } from '@/types/cricket';
import { Target, TrendingUp } from 'lucide-react';

interface BowlerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBowler: (bowlerName: string) => void;
  availableBowlers: string[];
  previousBowlers: Bowler[];
  lastBowler?: string;
  overNumber: number;
}

const BowlerSelectionModal: React.FC<BowlerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectBowler,
  availableBowlers,
  previousBowlers,
  lastBowler,
  overNumber,
}) => {
  const [selectedBowler, setSelectedBowler] = useState<string>('');

  const handleConfirm = () => {
    if (selectedBowler) {
      onSelectBowler(selectedBowler);
      setSelectedBowler('');
    }
  };

  // Filter out the last bowler (can't bowl consecutive overs)
  const eligibleBowlers = availableBowlers.filter(
    b => b.trim() && b !== lastBowler
  );

  // Get bowler stats if they've bowled before
  const getBowlerStats = (name: string) => {
    return previousBowlers.find(b => b.name === name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <Target className="w-5 h-5" />
            Over {overNumber} Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Over Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Select bowler for Over {overNumber + 1}</p>
            {lastBowler && (
              <p className="text-xs text-muted-foreground">
                {lastBowler} cannot bowl consecutive overs
              </p>
            )}
          </div>

          {/* Bowler Selection */}
          <div className="space-y-2">
            <Select value={selectedBowler} onValueChange={setSelectedBowler}>
              <SelectTrigger className="bg-background h-12">
                <SelectValue placeholder="Select next bowler" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50 max-h-64 overflow-y-auto">
                {eligibleBowlers.map((bowler, idx) => {
                  const stats = getBowlerStats(bowler);
                  return (
                    <SelectItem key={idx} value={bowler} className="py-3">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="font-medium">{bowler}</span>
                        {stats && (
                          <span className="text-xs text-muted-foreground">
                            {stats.overs}.{stats.balls} - {stats.runs}/{stats.wickets}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Previous Bowlers Stats */}
          {previousBowlers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Bowling Stats
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {previousBowlers.map((bowler) => (
                  <div 
                    key={bowler.id} 
                    className={`flex justify-between items-center p-2 rounded-lg text-sm ${
                      bowler.name === lastBowler ? 'bg-muted/30 opacity-50' : 'bg-muted/50'
                    }`}
                  >
                    <span className="font-medium text-foreground">
                      {bowler.name}
                      {bowler.name === lastBowler && (
                        <span className="text-xs text-destructive ml-2">(last over)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{bowler.overs}.{bowler.balls}</span>
                      <span>{bowler.runs}/{bowler.wickets}</span>
                      <span className="font-medium text-foreground">{bowler.economy.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleConfirm} 
            className="flex-1 h-12 gradient-primary"
            disabled={!selectedBowler}
          >
            Start Over {overNumber + 1}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BowlerSelectionModal;
