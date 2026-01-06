import { Button } from '@/components/ui/button';

const ScoringControls = ({ onScore, onWicket, disabled }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map(runs => (
            <Button
              key={runs}
              variant={runs === 4 || runs === 6 ? 'default' : 'outline'}
              className="h-12 text-lg font-bold"
              onClick={() => onScore(runs)}
              disabled={disabled}
            >
              {runs}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="destructive" onClick={onWicket} disabled={disabled}>W</Button>
          <Button variant="outline" onClick={() => onScore('WD')} disabled={disabled}>WD</Button>
          <Button variant="outline" onClick={() => onScore('NB')} disabled={disabled}>NB</Button>
          <Button variant="outline" onClick={() => onScore('LB')} disabled={disabled}>LB</Button>
        </div>
      </div>
    </div>
  );
};

export default ScoringControls;
