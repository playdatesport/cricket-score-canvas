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
import { User, UserMinus, ArrowRight, Star, AlertTriangle, Heart } from 'lucide-react';

interface RetiredHurtBatter {
  id: string;
  name: string;
  runs: number;
  balls: number;
}

interface BatterChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (outgoingBatterId: string, newBatterName: string, reason: 'retired_hurt' | 'substitution' | 'impact_player') => void;
  onReturnRetiredHurt?: (batterId: string, outgoingBatterId: string) => void;
  currentBatters: { id: string; name: string; isOnStrike: boolean; runs: number; balls: number }[];
  availableBatters: string[];
  battingTeamName: string;
  retiredHurtBatters?: RetiredHurtBatter[];
  currentOvers: number;
  isImpactPlayerUsed?: boolean;
}

const BatterChangeModal: React.FC<BatterChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onReturnRetiredHurt,
  currentBatters,
  availableBatters,
  battingTeamName,
  retiredHurtBatters = [],
  currentOvers,
  isImpactPlayerUsed = false,
}) => {
  const [step, setStep] = useState<'selectAction' | 'selectBatter' | 'selectReason' | 'selectReplacement' | 'selectReturnBatter' | 'selectRetiredHurt'>('selectAction');
  const [selectedBatter, setSelectedBatter] = useState<{ id: string; name: string } | null>(null);
  const [reason, setReason] = useState<'retired_hurt' | 'substitution' | 'impact_player' | null>(null);
  const [replacement, setReplacement] = useState<string>('');
  const [selectedRetiredHurt, setSelectedRetiredHurt] = useState<string>('');

  // Impact player can only be used before 14th over (or customizable)
  const impactPlayerDeadline = 14;
  const canUseImpactPlayer = !isImpactPlayerUsed && currentOvers < impactPlayerDeadline;

  const handleActionSelect = (action: 'change' | 'returnRetired') => {
    if (action === 'change') {
      setStep('selectBatter');
    } else {
      setStep('selectRetiredHurt');
    }
  };

  const handleBatterSelect = (batter: { id: string; name: string }) => {
    setSelectedBatter(batter);
    setStep('selectReason');
  };

  const handleReasonSelect = (selectedReason: 'retired_hurt' | 'substitution' | 'impact_player') => {
    setReason(selectedReason);
    setStep('selectReplacement');
  };

  const handleReplacementSelect = (newBatter: string) => {
    setReplacement(newBatter);
  };

  const handleRetiredHurtSelect = (batterId: string) => {
    setSelectedRetiredHurt(batterId);
    setStep('selectReturnBatter');
  };

  const handleReturnBatterSelect = (batter: { id: string; name: string }) => {
    setSelectedBatter(batter);
  };

  const handleConfirm = () => {
    if (step === 'selectReplacement' && selectedBatter && replacement && reason) {
      onConfirm(selectedBatter.id, replacement, reason);
      resetState();
      onClose();
    } else if (step === 'selectReturnBatter' && selectedRetiredHurt && selectedBatter && onReturnRetiredHurt) {
      onReturnRetiredHurt(selectedRetiredHurt, selectedBatter.id);
      resetState();
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 'selectBatter' || step === 'selectRetiredHurt') {
      setStep('selectAction');
      setSelectedBatter(null);
      setSelectedRetiredHurt('');
    } else if (step === 'selectReason') {
      setStep('selectBatter');
      setReason(null);
    } else if (step === 'selectReplacement') {
      setStep('selectReason');
      setReason(null);
      setReplacement('');
    } else if (step === 'selectReturnBatter') {
      setStep('selectRetiredHurt');
      setSelectedBatter(null);
    }
  };

  const resetState = () => {
    setStep('selectAction');
    setSelectedBatter(null);
    setReason(null);
    setReplacement('');
    setSelectedRetiredHurt('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getStepTitle = () => {
    switch (step) {
      case 'selectAction':
        return 'Batter Change Options';
      case 'selectBatter':
        return 'Select Batter to Replace';
      case 'selectReason':
        return 'Select Reason';
      case 'selectReplacement':
        return 'Select Replacement Batter';
      case 'selectRetiredHurt':
        return 'Select Retired Hurt Batter';
      case 'selectReturnBatter':
        return 'Replace Which Batter?';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'selectAction':
        return `Choose an action for ${battingTeamName}`;
      case 'selectBatter':
        return `Choose which batter is leaving the crease`;
      case 'selectReason':
        return `Why is ${selectedBatter?.name} leaving?`;
      case 'selectReplacement':
        return `Choose the new batter to replace ${selectedBatter?.name}`;
      case 'selectRetiredHurt':
        return 'Select the retired hurt batter who wants to return';
      case 'selectReturnBatter':
        return 'Which current batter will they replace?';
    }
  };

  const getProgressSteps = () => {
    if (step === 'selectRetiredHurt' || step === 'selectReturnBatter') {
      return ['Action', 'Retired', 'Replace'];
    }
    return ['Action', 'Batter', 'Reason', 'New'];
  };

  const getCurrentStepIndex = () => {
    if (step === 'selectAction') return 0;
    if (step === 'selectBatter') return 1;
    if (step === 'selectReason') return 2;
    if (step === 'selectReplacement') return 3;
    if (step === 'selectRetiredHurt') return 1;
    if (step === 'selectReturnBatter') return 2;
    return 0;
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
        <div className="flex items-center justify-center gap-1 py-2">
          {getProgressSteps().map((label, idx) => (
            <React.Fragment key={label}>
              {idx > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              <div className={`px-2 py-1 rounded text-xs ${
                getCurrentStepIndex() === idx 
                  ? 'bg-primary text-primary-foreground' 
                  : getCurrentStepIndex() > idx 
                    ? 'bg-primary/30 text-primary' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {label}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Selection summary */}
        {(selectedBatter || reason || selectedRetiredHurt) && step !== 'selectAction' && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            {selectedRetiredHurt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returning:</span>
                <span className="font-medium">{retiredHurtBatters.find(b => b.id === selectedRetiredHurt)?.name}</span>
              </div>
            )}
            {selectedBatter && !selectedRetiredHurt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outgoing:</span>
                <span className="font-medium">{selectedBatter.name}</span>
              </div>
            )}
            {selectedBatter && selectedRetiredHurt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Replacing:</span>
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
            {step === 'selectAction' && (
              <>
                <button
                  onClick={() => handleActionSelect('change')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <UserMinus className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Change Batter</div>
                    <div className="text-sm text-muted-foreground">Retire hurt, substitution, or impact player</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleActionSelect('returnRetired')}
                  disabled={retiredHurtBatters.length === 0}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                    retiredHurtBatters.length === 0 
                      ? 'border-border/50 bg-muted/30 opacity-50 cursor-not-allowed' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Return Retired Hurt Batter</div>
                    <div className="text-sm text-muted-foreground">
                      {retiredHurtBatters.length === 0 
                        ? 'No retired hurt batters available' 
                        : `${retiredHurtBatters.length} batter${retiredHurtBatters.length > 1 ? 's' : ''} can return`
                      }
                    </div>
                  </div>
                </button>
              </>
            )}

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
                    <div className="text-sm text-muted-foreground">Batter is injured, can return later if recovered</div>
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
                    <div className="text-sm text-muted-foreground">Tactical substitution (cannot return)</div>
                  </div>
                </button>
                <button
                  onClick={() => handleReasonSelect('impact_player')}
                  disabled={!canUseImpactPlayer}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                    !canUseImpactPlayer 
                      ? 'border-border/50 bg-muted/30 opacity-50 cursor-not-allowed' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Impact Player</span>
                      {isImpactPlayerUsed && (
                        <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">Used</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {!canUseImpactPlayer 
                        ? isImpactPlayerUsed 
                          ? 'Already used this innings' 
                          : `Only available before over ${impactPlayerDeadline}`
                        : `Substitute with impact player (before over ${impactPlayerDeadline})`
                      }
                    </div>
                  </div>
                  {!canUseImpactPlayer && (
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  )}
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  reason === 'impact_player' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-primary/20 text-primary'
                }`}>
                  {reason === 'impact_player' ? <Star className="w-4 h-4" /> : index + 1}
                </div>
                <span className="font-medium text-foreground">{player}</span>
              </button>
            ))}

            {step === 'selectReplacement' && availableBatters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No available batters remaining
              </div>
            )}

            {step === 'selectRetiredHurt' && retiredHurtBatters.map((batter) => (
              <button
                key={batter.id}
                onClick={() => handleRetiredHurtSelect(batter.id)}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                  selectedRetiredHurt === batter.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-medium text-foreground">{batter.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {batter.runs} ({batter.balls})
                </span>
              </button>
            ))}

            {step === 'selectReturnBatter' && currentBatters.map((batter) => (
              <button
                key={batter.id}
                onClick={() => handleReturnBatterSelect({ id: batter.id, name: batter.name })}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                  selectedBatter?.id === batter.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
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
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={step === 'selectAction' ? handleClose : handleBack} className="flex-1">
            {step === 'selectAction' ? 'Cancel' : 'Back'}
          </Button>
          {((step === 'selectReplacement' && replacement) || (step === 'selectReturnBatter' && selectedBatter)) && (
            <Button onClick={handleConfirm} className="flex-1">
              Confirm
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatterChangeModal;
