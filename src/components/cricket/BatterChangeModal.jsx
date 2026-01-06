import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const BatterChangeModal = ({ isOpen, onClose, currentBatters, availablePlayers, onChangeBatter }) => {
  const [outgoing, setOutgoing] = useState('');
  const [incoming, setIncoming] = useState('');

  const handleSubmit = () => {
    if (outgoing && incoming) {
      onChangeBatter(outgoing, incoming);
      setOutgoing('');
      setIncoming('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Batter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Retiring Batter</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {currentBatters.map(b => (
                <Button key={b.id} variant={outgoing === b.id ? 'default' : 'outline'} size="sm"
                  onClick={() => setOutgoing(b.id)}>
                  {b.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">New Batter</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {availablePlayers.map(player => (
                <Button key={player} variant={incoming === player ? 'default' : 'outline'} size="sm"
                  onClick={() => setIncoming(player)}>
                  {player}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!outgoing || !incoming}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatterChangeModal;
