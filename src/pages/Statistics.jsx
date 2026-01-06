import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Target, Zap } from 'lucide-react';

const Statistics = () => {
  const { matches, fetchMatches, isLoading: matchesLoading } = useMatchHistory();
  const { stats, calculateStats, isLoading: statsLoading } = usePlayerStats();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (matches.length > 0) {
      calculateStats(matches);
    }
  }, [matches, calculateStats]);

  const isLoading = matchesLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const totalRuns = matches.reduce((sum, m) => sum + (m.team1_score || 0) + (m.team2_score || 0), 0);

  const topScorers = [...stats].sort((a, b) => b.runs - a.runs).slice(0, 5);
  const bestStrikeRates = [...stats]
    .filter(p => p.balls >= 10)
    .sort((a, b) => parseFloat(b.strikeRate) - parseFloat(a.strikeRate))
    .slice(0, 5);
  const topWicketTakers = [...stats]
    .filter(p => p.wickets > 0)
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 5);
  const bestEconomy = [...stats]
    .filter(p => p.overs >= 2)
    .sort((a, b) => parseFloat(a.economy) - parseFloat(b.economy))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Statistics</h1>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{totalMatches}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{completedMatches}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{totalRuns}</div>
              <div className="text-xs text-muted-foreground">Total Runs</div>
            </CardContent>
          </Card>
        </div>

        {stats.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium mb-1">No Statistics Yet</h3>
              <p className="text-sm text-muted-foreground">
                Play some matches to see player statistics
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="batting" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="batting" className="flex-1">Batting</TabsTrigger>
              <TabsTrigger value="bowling" className="flex-1">Bowling</TabsTrigger>
            </TabsList>

            <TabsContent value="batting" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Top Scorers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topScorers.map((player, index) => (
                      <div key={player.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.runs}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Best Strike Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bestStrikeRates.map((player, index) => (
                      <div key={player.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.strikeRate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bowling" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    Top Wicket Takers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topWicketTakers.length > 0 ? topWicketTakers.map((player, index) => (
                      <div key={player.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.wickets}</span>
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground text-sm py-4">
                        No wickets taken yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Best Economy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bestEconomy.length > 0 ? bestEconomy.map((player, index) => (
                      <div key={player.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.economy}</span>
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground text-sm py-4">
                        Not enough bowling data
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Statistics;
