import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Handshake } from 'lucide-react';

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    winner: string | null;
    margin: string;
    resultText: string;
  };
  onNewMatch: () => void;
  onViewScorecard: () => void;
}

const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onNewMatch,
  onViewScorecard,
}) => {
  const isTied = result.winner === null && result.resultText.toLowerCase().includes('tie');
  const Icon = isTied ? Handshake : Trophy;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon className="w-10 h-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {isTied ? 'Match Tied!' : 'Match Over!'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {result.resultText}
          </p>
          {result.winner && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Medal className="w-5 h-5" />
              <span className="font-bold">{result.winner}</span>
            </div>
          )}
          {result.margin && (
            <p className="text-muted-foreground mt-2">{result.margin}</p>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button onClick={onViewScorecard} className="w-full">
            View Full Scorecard
          </Button>
          <Button variant="outline" onClick={onNewMatch} className="w-full">
            New Match
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchResultModal;
