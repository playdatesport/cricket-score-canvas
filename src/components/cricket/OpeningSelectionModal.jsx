import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const OpeningSelectionModal = ({ isOpen, battingPlayers, bowlingPlayers, onSelect }) => {
  const [batter1, setBatter1] = useState('');
  const [batter2, setBatter2] = useState('');
  const [bowler, setBowler] = useState('');

  const handleSubmit = () => {
    if (batter1 && batter2 && bowler && batter1 !== batter2) {
      onSelect(batter1, batter2, bowler);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Opening Players</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Striker</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {battingPlayers.filter(p => p).map(player => (
                <Button key={player} variant={batter1 === player ? 'default' : 'outline'} size="sm"
                  onClick={() => setBatter1(player)} disabled={batter2 === player}>
                  {player}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Non-Striker</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {battingPlayers.filter(p => p).map(player => (
                <Button key={player} variant={batter2 === player ? 'default' : 'outline'} size="sm"
                  onClick={() => setBatter2(player)} disabled={batter1 === player}>
                  {player}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Opening Bowler</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {bowlingPlayers.filter(p => p).map(player => (
                <Button key={player} variant={bowler === player ? 'default' : 'outline'} size="sm"
                  onClick={() => setBowler(player)}>
                  {player}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!batter1 || !batter2 || !bowler}>
            Start Innings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpeningSelectionModal;
