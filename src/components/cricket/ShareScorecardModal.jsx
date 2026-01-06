import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ShareScorecardModal = ({ isOpen, onClose, matchState }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Scorecard</DialogTitle>
        </DialogHeader>
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="font-bold text-lg">{matchState.battingTeam.name}</div>
          <div className="text-3xl font-bold">{matchState.battingTeam.score}/{matchState.battingTeam.wickets}</div>
          <div className="text-sm text-muted-foreground">({matchState.battingTeam.overs}.{matchState.battingTeam.balls} overs)</div>
        </div>
        <Button onClick={onClose} className="w-full">Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareScorecardModal;
