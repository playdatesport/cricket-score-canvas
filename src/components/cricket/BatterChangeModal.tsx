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
import { User, UserMinus, ArrowRight } from 'lucide-react';

interface BatterChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (outgoingBatterId: string, newBatterName: string, reason: 'retired_hurt' | 'substitution') => void;
  currentBatters: { id: string; name: string; isOnStrike: boolean; runs: number; balls: number }[];
  availableBatters: string[];
  battingTeamName: string;
}

const BatterChangeModal: React.FC<BatterChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentBatters,
  availableBatters,
  battingTeamName,
}) => {
  const [step, setStep] = useState<'selectBatter' | 'selectReason' | 'selectReplacement'>('selectBatter');
  const [selectedBatter, setSelectedBatter] = useState<{ id: string; name: string } | null>(null);
  const [reason, setReason] = useState<'retired_hurt' | 'substitution' | null>(null);
  const [replacement, setReplacement] = useState<string>('');

  const handleBatterSelect = (batter: { id: string; name: string }) => {
    setSelectedBatter(batter);
    setStep('selectReason');
  };

  const handleReasonSelect = (selectedReason: 'retired_hurt' | 'substitution') => {
    setReason(selectedReason);
    setStep('selectReplacement');
  };

  const handleReplacementSelect = (newBatter: string) => {
    setReplacement(newBatter);
  };

  const handleConfirm = () => {
    if (selectedBatter && replacement && reason) {
      onConfirm(selectedBatter.id, replacement, reason);
      resetState();
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 'selectReason') {
      setStep('selectBatter');
      setSelectedBatter(null);
    } else if (step === 'selectReplacement') {
      setStep('selectReason');
      setReason(null);
      setReplacement('');
    }
  };

  const resetState = () => {
    setStep('selectBatter');
    setSelectedBatter(null);
    setReason(null);
    setReplacement('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getStepTitle = () => {
    switch (step) {
      case 'selectBatter':
        return 'Select Batter to Replace';
      case 'selectReason':
        return 'Select Reason';
      case 'selectReplacement':
        return 'Select Replacement Batter';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'selectBatter':
        return `Choose which batter from ${battingTeamName} is leaving the crease`;
      case 'selectReason':
        return `Why is ${selectedBatter?.name} leaving?`;
      case 'selectReplacement':
        return `Choose the new batter to replace ${selectedBatter?.name}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-primary" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div className={`w-3 h-3 rounded-full ${step === 'selectBatter' ? 'bg-primary' : selectedBatter ? 'bg-primary/50' : 'bg-muted'}`} />
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`w-3 h-3 rounded-full ${step === 'selectReason' ? 'bg-primary' : reason ? 'bg-primary/50' : 'bg-muted'}`} />
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`w-3 h-3 rounded-full ${step === 'selectReplacement' ? 'bg-primary' : replacement ? 'bg-primary/50' : 'bg-muted'}`} />
        </div>

        {/* Selection summary */}
        {(selectedBatter || reason) && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            {selectedBatter && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outgoing:</span>
                <span className="font-medium">{selectedBatter.name}</span>
              </div>
            )}
            {reason && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason:</span>
                <span className="font-medium capitalize">{reason.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {step === 'selectBatter' && currentBatters.map((batter) => (
              <button
                key={batter.id}
                onClick={() => handleBatterSelect({ id: batter.id, name: batter.name })}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-foreground">{batter.name}</span>
                    {batter.isOnStrike && (
                      <span className="ml-2 text-xs text-primary">*</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {batter.runs} ({batter.balls})
                </span>
              </button>
            ))}

            {step === 'selectReason' && (
              <>
                <button
                  onClick={() => handleReasonSelect('retired_hurt')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-lg">🤕</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Retired Hurt</div>
                    <div className="text-sm text-muted-foreground">Batter is injured and cannot continue</div>
                  </div>
                </button>
                <button
                  onClick={() => handleReasonSelect('substitution')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-lg">🔄</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Substitution</div>
                    <div className="text-sm text-muted-foreground">Tactical substitution of the batter</div>
                  </div>
                </button>
              </>
            )}

            {step === 'selectReplacement' && availableBatters.map((player, index) => (
              <button
                key={`${player}-${index}`}
                onClick={() => handleReplacementSelect(player)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  replacement === player
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

            {step === 'selectReplacement' && availableBatters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No available batters remaining
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={step === 'selectBatter' ? handleClose : handleBack} className="flex-1">
            {step === 'selectBatter' ? 'Cancel' : 'Back'}
          </Button>
          {step === 'selectReplacement' && replacement && (
            <Button onClick={handleConfirm} className="flex-1">
              Confirm Change
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatterChangeModal;
