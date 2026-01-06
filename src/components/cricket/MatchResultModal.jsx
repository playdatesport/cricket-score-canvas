import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const MatchResultModal = ({ isOpen, onClose, result, onNewMatch, onViewScorecard }) => {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Match Complete</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <div className="text-2xl font-bold mb-2">{result.winner}</div>
          <div className="text-muted-foreground">{result.resultText}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onViewScorecard}>View Scorecard</Button>
          <Button onClick={onNewMatch}>New Match</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchResultModal;
