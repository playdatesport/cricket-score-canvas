import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, TrendingUp, Zap, Users, Award, BarChart3, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import PerformanceChart from '@/components/cricket/PerformanceChart';
import PlayerComparisonModal from '@/components/cricket/PlayerComparisonModal';

const Statistics: React.FC = () => {
  const { matches, loading } = useMatchHistory();
  const { 
    topScorers, 
    topWicketTakers, 
    bestStrikeRates, 
    bestEconomy,
    battingStats,
    bowlingStats,
    allPlayerNames,
    getPlayerHistory,
  } = usePlayerStats(matches);

  const [selectedChartPlayer, setSelectedChartPlayer] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [comparePlayer1, setComparePlayer1] = useState('');
  const [comparePlayer2, setComparePlayer2] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const totalRuns = matches.reduce((sum, m) => sum + (m.team1_score || 0) + (m.team2_score || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Comparison Modal */}
      <PlayerComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        player1={comparePlayer1}
        player2={comparePlayer2}
        onPlayer1Change={setComparePlayer1}
        onPlayer2Change={setComparePlayer2}
        allPlayerNames={allPlayerNames}
        battingStats={battingStats}
        bowlingStats={bowlingStats}
      />

      {/* Header */}
      <div className="gradient-primary text-primary-foreground">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Statistics</h1>
                <p className="text-xs opacity-80">Player leaderboards & trends</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              onClick={() => {
                if (allPlayerNames.length >= 2) {
                  setComparePlayer1(allPlayerNames[0] || '');
                  setComparePlayer2(allPlayerNames[1] || '');
                }
                setShowComparison(true);
              }}
              disabled={allPlayerNames.length < 2}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{matches.length}</p>
              <p className="text-[10px] opacity-70">Total Matches</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{completedMatches}</p>
              <p className="text-[10px] opacity-70">Completed</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{totalRuns}</p>
              <p className="text-[10px] opacity-70">Total Runs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Statistics Yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Play some matches to see player statistics and leaderboards
            </p>
            <Link to="/setup">
              <Button className="gradient-primary">Start a Match</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="batting" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="batting" className="gap-1.5 text-xs sm:text-sm">
                <Target className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Batting</span>
              </TabsTrigger>
              <TabsTrigger value="bowling" className="gap-1.5 text-xs sm:text-sm">
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Bowling</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-1.5 text-xs sm:text-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="batting" className="space-y-6">
              {/* Top Scorers */}
              <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
                <div className="px-4 py-3 bg-success/5 border-b border-border/50 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-success" />
                  <h3 className="font-semibold text-sm text-foreground">Top Scorers</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {topScorers.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">No batting data yet</p>
                  ) : (
                    topScorers.map((player, idx) => (
                      <div key={player.name} className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-warning/20 text-warning' :
                          idx === 1 ? 'bg-muted text-muted-foreground' :
                          idx === 2 ? 'bg-orange-500/20 text-orange-500' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.innings} inn • HS: {player.highestScore} • SR: {player.strikeRate.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">{player.runs}</p>
                          <p className="text-[10px] text-muted-foreground">runs</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Best Strike Rates */}
              <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
                <div className="px-4 py-3 bg-primary/5 border-b border-border/50 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Best Strike Rates</h3>
                  <span className="text-[10px] text-muted-foreground">(min 10 balls)</span>
                </div>
                <div className="divide-y divide-border/50">
                  {bestStrikeRates.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">Not enough data yet</p>
                  ) : (
                    bestStrikeRates.slice(0, 5).map((player, idx) => (
                      <div key={player.name} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.runs} runs • {player.balls} balls • {player.sixes} 6s
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{player.strikeRate.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">SR</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bowling" className="space-y-6">
              {/* Top Wicket Takers */}
              <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
                <div className="px-4 py-3 bg-destructive/5 border-b border-border/50 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-destructive" />
                  <h3 className="font-semibold text-sm text-foreground">Top Wicket Takers</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {topWicketTakers.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">No bowling data yet</p>
                  ) : (
                    topWicketTakers.map((player, idx) => (
                      <div key={player.name} className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-warning/20 text-warning' :
                          idx === 1 ? 'bg-muted text-muted-foreground' :
                          idx === 2 ? 'bg-orange-500/20 text-orange-500' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.matches} matches • Best: {player.bestFigures} • Econ: {player.economy.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">{player.wickets}</p>
                          <p className="text-[10px] text-muted-foreground">wickets</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Best Economy */}
              <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
                <div className="px-4 py-3 bg-success/5 border-b border-border/50 flex items-center gap-2">
                  <Target className="w-4 h-4 text-success" />
                  <h3 className="font-semibold text-sm text-foreground">Best Economy Rates</h3>
                  <span className="text-[10px] text-muted-foreground">(min 2 overs)</span>
                </div>
                <div className="divide-y divide-border/50">
                  {bestEconomy.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">Not enough data yet</p>
                  ) : (
                    bestEconomy.slice(0, 5).map((player, idx) => (
                      <div key={player.name} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center text-xs font-bold text-success">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.overs} overs • {player.wickets} wkts • {player.runs} runs
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-success">{player.economy.toFixed(2)}</p>
                          <p className="text-[10px] text-muted-foreground">econ</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <PerformanceChart
                selectedPlayer={selectedChartPlayer}
                onPlayerChange={setSelectedChartPlayer}
                allPlayerNames={allPlayerNames}
                getPlayerHistory={getPlayerHistory}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Statistics;
