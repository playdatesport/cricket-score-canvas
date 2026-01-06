import { Card, CardContent } from '@/components/ui/card';

const BowlerStats = ({ bowler }) => {
  if (!bowler || !bowler.name) return null;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground mb-2">Bowler</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{bowler.name}</span>
          <div className="text-right text-sm">
            <span>{bowler.overs}.{bowler.balls % 6}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BowlerStats;
