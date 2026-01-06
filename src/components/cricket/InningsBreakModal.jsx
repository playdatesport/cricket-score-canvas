import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InningsBreakModal = ({ isOpen, firstInningsScore, firstInningsWickets, battingTeam, onStartSecondInnings }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Innings Complete</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <div className="text-lg font-medium">{battingTeam}</div>
          <div className="text-4xl font-bold">{firstInningsScore}/{firstInningsWickets}</div>
          <p className="text-muted-foreground mt-2">Target: {firstInningsScore + 1}</p>
        </div>
        <Button onClick={onStartSecondInnings} className="w-full">Start Second Innings</Button>
      </DialogContent>
    </Dialog>
  );
};

export default InningsBreakModal;
