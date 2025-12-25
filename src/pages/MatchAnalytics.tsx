import React from 'react';
import { Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { ArrowLeft, BarChart3, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverByOverChart from '@/components/cricket/OverByOverChart';
import WagonWheel from '@/components/cricket/WagonWheel';

const MatchAnalytics: React.FC = () => {
  const { matchState } = useMatch();
  const { battingTeam, overs, currentOver, batters, allBatters } = matchState;

  // Calculate current over runs for chart
  const currentOverRuns = currentOver.reduce((sum, ball) => sum + ball.runs, 0);

  // Get run rate progression
  const runRateData = overs.map((over, idx) => {
    const runsUpToOver = overs.slice(0, idx + 1).reduce((sum, o) => sum + o.runs, 0);
    return {
      over: idx + 1,
      runRate: runsUpToOver / (idx + 1),
    };
  });

  // Summary stats
  const totalFours = allBatters.reduce((sum, b) => sum + b.fours, 0);
  const totalSixes = allBatters.reduce((sum, b) => sum + b.sixes, 0);
  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
  const boundaryPercentage = battingTeam.score > 0 
    ? ((boundaryRuns / battingTeam.score) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Match Analytics</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-3 shadow-card text-center">
            <p className="text-2xl font-bold text-primary">{totalFours}</p>
            <p className="text-xs text-muted-foreground">Fours</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-card text-center">
            <p className="text-2xl font-bold text-cricket-purple">{totalSixes}</p>
            <p className="text-xs text-muted-foreground">Sixes</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-card text-center">
            <p className="text-2xl font-bold text-success">{boundaryRuns}</p>
            <p className="text-xs text-muted-foreground">Boundary Runs</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{boundaryPercentage}%</p>
            <p className="text-xs text-muted-foreground">From Boundaries</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overs" className="px-4">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="overs" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Run Flow
          </TabsTrigger>
          <TabsTrigger value="wagon" className="gap-2">
            <Target className="w-4 h-4" />
            Wagon Wheel
          </TabsTrigger>
        </TabsList>

        {/* Over by Over Chart */}
        <TabsContent value="overs" className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Runs Per Over
            </h3>
            <OverByOverChart 
              overs={overs} 
              currentOver={{ runs: currentOverRuns, balls: currentOver.length }}
            />
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-muted-foreground" />
                <span className="text-muted-foreground">{"< 5 runs"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-muted-foreground">5-7 runs</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-success" />
                <span className="text-muted-foreground">8-11 runs</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-cricket-purple" />
                <span className="text-muted-foreground">12+ runs</span>
              </div>
            </div>
          </div>

          {/* Scoring Phases */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold mb-3">Scoring Phases</h3>
            <div className="space-y-3">
              {/* Powerplay (1-6) */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-foreground">Powerplay</span>
                  <span className="text-xs text-muted-foreground ml-2">(1-6 overs)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">
                    {overs.slice(0, 6).reduce((sum, o) => sum + o.runs, 0)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{overs.slice(0, 6).filter(o => o.wickets > 0).reduce((sum, o) => sum + o.wickets, 0)}
                  </span>
                </div>
              </div>
              {/* Middle (7-15) */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-foreground">Middle Overs</span>
                  <span className="text-xs text-muted-foreground ml-2">(7-15)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">
                    {overs.slice(6, 15).reduce((sum, o) => sum + o.runs, 0)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{overs.slice(6, 15).filter(o => o.wickets > 0).reduce((sum, o) => sum + o.wickets, 0)}
                  </span>
                </div>
              </div>
              {/* Death (16-20) */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-foreground">Death Overs</span>
                  <span className="text-xs text-muted-foreground ml-2">(16-20)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">
                    {overs.slice(15, 20).reduce((sum, o) => sum + o.runs, 0)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{overs.slice(15, 20).filter(o => o.wickets > 0).reduce((sum, o) => sum + o.wickets, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Wagon Wheel */}
        <TabsContent value="wagon" className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Scoring Zones
            </h3>
            <WagonWheel shots={[]} batterName={batters.find(b => b.isOnStrike)?.name} />
          </div>

          {/* Top Scorers */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold mb-3">Top Scorers</h3>
            <div className="space-y-2">
              {[...allBatters]
                .sort((a, b) => b.runs - a.runs)
                .slice(0, 3)
                .map((batter, idx) => (
                  <div key={batter.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-warning text-warning-foreground' : 
                        idx === 1 ? 'bg-muted-foreground/20 text-foreground' : 
                        'bg-warning/30 text-foreground'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium text-foreground">{batter.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">{batter.runs}</span>
                      <span className="text-xs text-muted-foreground ml-1">({batter.balls})</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchAnalytics;
