import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight } from 'lucide-react';

interface InningsBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstInningsScore: number;
  firstInningsWickets: number;
  firstInningsOvers: string;
  battingTeamName: string;
  bowlingTeamName: string;
  target: number;
  onStartSecondInnings: () => void;
}

const InningsBreakModal: React.FC<InningsBreakModalProps> = ({
  isOpen,
  onClose,
  firstInningsScore,
  firstInningsWickets,
  firstInningsOvers,
  battingTeamName,
  bowlingTeamName,
  target,
  onStartSecondInnings,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Innings Break
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-center bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">First Innings</p>
            <p className="text-lg font-bold text-foreground">{battingTeamName}</p>
            <p className="text-3xl font-bold text-primary">
              {firstInningsScore}/{firstInningsWickets}
            </p>
            <p className="text-sm text-muted-foreground">({firstInningsOvers} overs)</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="text-center bg-primary/10 rounded-lg p-4 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Target for</p>
            <p className="text-lg font-bold text-foreground">{bowlingTeamName}</p>
            <p className="text-4xl font-bold text-primary">{target}</p>
            <p className="text-sm text-muted-foreground">runs to win</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onStartSecondInnings} className="w-full gap-2">
            Start Second Innings
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InningsBreakModal;
