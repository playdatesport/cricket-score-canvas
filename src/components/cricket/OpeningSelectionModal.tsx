import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Target, ArrowRight } from 'lucide-react';

interface OpeningSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (striker: string, nonStriker: string, bowler: string) => void;
  battingTeamPlayers: string[];
  bowlingTeamPlayers: string[];
  battingTeamName: string;
  bowlingTeamName: string;
}

const OpeningSelectionModal: React.FC<OpeningSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  battingTeamPlayers,
  bowlingTeamPlayers,
  battingTeamName,
  bowlingTeamName,
}) => {
  const [step, setStep] = useState<'striker' | 'nonStriker' | 'bowler'>('striker');
  const [striker, setStriker] = useState<string>('');
  const [nonStriker, setNonStriker] = useState<string>('');
  const [bowler, setBowler] = useState<string>('');

  const handlePlayerSelect = (player: string) => {
    if (step === 'striker') {
      setStriker(player);
      setStep('nonStriker');
    } else if (step === 'nonStriker') {
      setNonStriker(player);
      setStep('bowler');
    } else if (step === 'bowler') {
      setBowler(player);
    }
  };

  const handleConfirm = () => {
    if (striker && nonStriker && bowler) {
      onConfirm(striker, nonStriker, bowler);
      // Reset state
      setStep('striker');
      setStriker('');
      setNonStriker('');
      setBowler('');
    }
  };

  const handleBack = () => {
    if (step === 'nonStriker') {
      setStep('striker');
      setStriker('');
    } else if (step === 'bowler') {
      setStep('nonStriker');
      setNonStriker('');
    }
  };

  const getAvailableBatters = () => {
    const validPlayers = battingTeamPlayers.filter(p => p.trim());
    if (step === 'nonStriker') {
      return validPlayers.filter(p => p !== striker);
    }
    return validPlayers;
  };

  const getAvailableBowlers = () => {
    return bowlingTeamPlayers.filter(p => p.trim());
  };

  const getStepTitle = () => {
    switch (step) {
      case 'striker':
        return 'Select Opening Striker';
      case 'nonStriker':
        return 'Select Non-Striker';
      case 'bowler':
        return 'Select Opening Bowler';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'striker':
        return `Choose the batter who will face the first ball for ${battingTeamName}`;
      case 'nonStriker':
        return `Choose the batter at the non-striker end for ${battingTeamName}`;
      case 'bowler':
        return `Choose the bowler for the first over for ${bowlingTeamName}`;
    }
  };

  const currentPlayers = step === 'bowler' ? getAvailableBowlers() : getAvailableBatters();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'bowler' ? (
              <Target className="w-5 h-5 text-primary" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div className={`w-3 h-3 rounded-full ${step === 'striker' ? 'bg-primary' : striker ? 'bg-primary/50' : 'bg-muted'}`} />
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`w-3 h-3 rounded-full ${step === 'nonStriker' ? 'bg-primary' : nonStriker ? 'bg-primary/50' : 'bg-muted'}`} />
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`w-3 h-3 rounded-full ${step === 'bowler' ? 'bg-primary' : bowler ? 'bg-primary/50' : 'bg-muted'}`} />
        </div>

        {/* Selected so far */}
        {(striker || nonStriker) && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            {striker && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Striker:</span>
                <span className="font-medium">{striker}</span>
              </div>
            )}
            {nonStriker && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Non-Striker:</span>
                <span className="font-medium">{nonStriker}</span>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {currentPlayers.map((player, index) => (
              <button
                key={`${player}-${index}`}
                onClick={() => handlePlayerSelect(player)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  (step === 'bowler' && bowler === player)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-foreground">{player}</span>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2">
          {step !== 'striker' && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step === 'bowler' && bowler && (
            <Button onClick={handleConfirm} className="flex-1">
              Start Match
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpeningSelectionModal;
