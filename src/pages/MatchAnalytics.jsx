import { Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverByOverChart from '@/components/cricket/OverByOverChart';
import WagonWheel from '@/components/cricket/WagonWheel';
import { ArrowLeft } from 'lucide-react';

const MatchAnalytics = () => {
  const { matchState } = useMatch();

  const totalFours = matchState.allBatters.reduce((sum, b) => sum + b.fours, 0);
  const totalSixes = matchState.allBatters.reduce((sum, b) => sum + b.sixes, 0);
  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
  const boundaryPercentage = matchState.battingTeam.score > 0 
    ? ((boundaryRuns / matchState.battingTeam.score) * 100).toFixed(1) 
    : '0.0';

  const overData = matchState.overs.map((over, index) => ({
    over: index + 1,
    runs: over.runs,
    wickets: over.wickets,
  }));

  if (matchState.currentOver.length > 0) {
    overData.push({
      over: matchState.battingTeam.overs + 1,
      runs: matchState.currentOver.reduce((sum, ball) => sum + ball.runs, 0),
      wickets: matchState.currentOver.filter(ball => ball.isWicket).length,
    });
  }

  const topBatters = [...matchState.allBatters]
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Match Analytics</h1>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{totalFours}</div>
              <div className="text-xs text-muted-foreground">Fours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{totalSixes}</div>
              <div className="text-xs text-muted-foreground">Sixes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{boundaryRuns}</div>
              <div className="text-xs text-muted-foreground">Boundary Runs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{boundaryPercentage}%</div>
              <div className="text-xs text-muted-foreground">From Boundaries</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="runflow" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="runflow" className="flex-1">Run Flow</TabsTrigger>
            <TabsTrigger value="wagon" className="flex-1">Wagon Wheel</TabsTrigger>
          </TabsList>

          <TabsContent value="runflow">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Over by Over</CardTitle>
              </CardHeader>
              <CardContent>
                {overData.length > 0 ? (
                  <OverByOverChart data={overData} />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No overs completed yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wagon">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Shot Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <WagonWheel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {topBatters.length > 0 && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topBatters.map((batter, index) => (
                  <div key={batter.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{batter.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{batter.runs}</span>
                      <span className="text-xs text-muted-foreground ml-1">({batter.balls})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchAnalytics;
