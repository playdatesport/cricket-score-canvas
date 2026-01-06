import { Card, CardContent } from '@/components/ui/card';

const BatterStats = ({ batters }) => {
  if (!batters || batters.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground mb-2">Batters</div>
        {batters.map(batter => (
          <div key={batter.id} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              {batter.isOnStrike && <span className="text-primary text-xs">●</span>}
              <span className="text-sm font-medium">{batter.name}</span>
            </div>
            <div className="text-right">
              <span className="font-bold">{batter.runs}</span>
              <span className="text-xs text-muted-foreground ml-1">({batter.balls})</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BatterStats;
