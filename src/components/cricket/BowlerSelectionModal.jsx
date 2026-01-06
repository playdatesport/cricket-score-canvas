import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const BowlerSelectionModal = ({ isOpen, onClose, players, currentBowler, onSelectBowler }) => {
  const [selected, setSelected] = useState('');

  const handleSubmit = () => {
    if (selected) {
      onSelectBowler(selected);
      onClose();
      setSelected('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Bowler</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {players.filter(p => p && p !== currentBowler).map(player => (
            <Button key={player} variant={selected === player ? 'default' : 'outline'} size="sm"
              onClick={() => setSelected(player)}>
              {player}
            </Button>
          ))}
        </div>
        <Button onClick={handleSubmit} className="w-full mt-4" disabled={!selected}>
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BowlerSelectionModal;
