import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const WicketModal = ({ isOpen, onClose, batters, availableBatters, onRecordWicket }) => {
  const [dismissalType, setDismissalType] = useState('bowled');
  const [dismissedBatter, setDismissedBatter] = useState('');
  const [newBatter, setNewBatter] = useState('');
  const [caughtBy, setCaughtBy] = useState('');

  const dismissalTypes = ['bowled', 'caught', 'lbw', 'run out', 'stumped', 'hit wicket'];

  const handleSubmit = () => {
    if (dismissedBatter && newBatter) {
      onRecordWicket(dismissalType, dismissedBatter, newBatter, caughtBy || undefined);
      onClose();
      setDismissalType('bowled');
      setDismissedBatter('');
      setNewBatter('');
      setCaughtBy('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Wicket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Dismissal Type</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {dismissalTypes.map(type => (
                <Button key={type} variant={dismissalType === type ? 'default' : 'outline'} size="sm"
                  onClick={() => setDismissalType(type)}>
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Who got out?</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {batters.filter(b => !b.isOut).map(batter => (
                <Button key={batter.id} variant={dismissedBatter === batter.id ? 'default' : 'outline'} size="sm"
                  onClick={() => setDismissedBatter(batter.id)}>
                  {batter.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">New Batter</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {availableBatters.map(player => (
                <Button key={player} variant={newBatter === player ? 'default' : 'outline'} size="sm"
                  onClick={() => setNewBatter(player)}>
                  {player}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!dismissedBatter || !newBatter}>
            Confirm Wicket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WicketModal;
