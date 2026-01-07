import React from 'react';
import { Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { ArrowLeft, Users, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FullScorecard: React.FC = () => {
  const { matchState } = useMatch();
  const { battingTeam, bowlingTeam, allBatters, allBowlers, fallOfWickets, currentPartnership, matchDetails } = matchState;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Full Scorecard</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Match Info */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h3 className="font-bold text-lg text-foreground">{battingTeam.name}</h3>
              <p className="text-3xl font-extrabold text-primary">
                {battingTeam.score}/{battingTeam.wickets}
              </p>
              <p className="text-sm text-muted-foreground">
                ({battingTeam.overs}.{battingTeam.balls} overs)
              </p>
            </div>
            <div className="px-4 text-center">
              <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                {matchDetails.matchType}
              </span>
            </div>
            <div className="text-center flex-1">
              <h3 className="font-bold text-lg text-foreground">{bowlingTeam.name}</h3>
              <p className="text-3xl font-extrabold text-muted-foreground">
                {bowlingTeam.score}/{bowlingTeam.wickets}
              </p>
              {bowlingTeam.target && (
                <p className="text-sm text-muted-foreground">Target: {bowlingTeam.target}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="batting" className="px-4">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="batting">Batting</TabsTrigger>
          <TabsTrigger value="bowling">Bowling</TabsTrigger>
          <TabsTrigger value="extras">Fall of Wickets</TabsTrigger>
        </TabsList>

        {/* Batting Tab */}
        <TabsContent value="batting" className="space-y-4">
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">{battingTeam.name} - Batting</h3>
              </div>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-2 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
              <div className="col-span-2">Batter</div>
              <div className="text-center">R</div>
              <div className="text-center">B</div>
              <div className="text-center">4s</div>
              <div className="text-center">6s</div>
              <div className="text-center">SR</div>
            </div>

            {/* Batters */}
            <div className="divide-y divide-border">
              {allBatters.length > 0 ? allBatters.map((batter) => {
                const strikeRate = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';
                return (
                  <div key={batter.id} className="grid grid-cols-7 gap-2 px-4 py-3 text-sm">
                    <div className="col-span-2">
                      <div className="font-medium text-foreground">
                        {batter.name}
                        {!batter.isOut && matchState.batters.some(b => b.id === batter.id) && (
                          <span className="text-success ml-1">*</span>
                        )}
                      </div>
                      {batter.isOut && (
                        <div className="text-xs text-muted-foreground">
                          {batter.dismissalType || 'out'} 
                          {batter.dismissedBy && ` b ${batter.dismissedBy}`}
                        </div>
                      )}
                      {!batter.isOut && !matchState.batters.some(b => b.id === batter.id) && (
                        <div className="text-xs text-muted-foreground">not out</div>
                      )}
                    </div>
                    <div className="text-center font-semibold text-foreground">{batter.runs}</div>
                    <div className="text-center text-muted-foreground">{batter.balls}</div>
                    <div className="text-center text-muted-foreground">{batter.fours}</div>
                    <div className="text-center text-muted-foreground">{batter.sixes}</div>
                    <div className="text-center text-muted-foreground">{strikeRate}</div>
                  </div>
                );
              }) : (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No batting data yet
                </div>
              )}
            </div>

            {/* Extras & Total */}
            <div className="border-t border-border">
              <div className="grid grid-cols-7 gap-2 px-4 py-3 text-sm bg-muted/30">
                <div className="col-span-2 font-medium">Extras</div>
                <div className="col-span-5 text-muted-foreground">0 (b 0, lb 0, w 0, nb 0)</div>
              </div>
              <div className="grid grid-cols-7 gap-2 px-4 py-3 text-sm font-semibold">
                <div className="col-span-2">Total</div>
                <div className="col-span-5">
                  {battingTeam.score}/{battingTeam.wickets} ({battingTeam.overs}.{battingTeam.balls} Ov)
                </div>
              </div>
            </div>
          </div>

          {/* Current Partnership */}
          {currentPartnership.batter1 && (
            <div className="bg-card rounded-xl p-4 shadow-card">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Current Partnership
              </h4>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">{currentPartnership.batter1}</span>
                  <span className="text-muted-foreground"> & </span>
                  <span className="font-medium">{currentPartnership.batter2}</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {currentPartnership.runs} ({currentPartnership.balls})
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Bowling Tab */}
        <TabsContent value="bowling" className="space-y-4">
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">{bowlingTeam.name} - Bowling</h3>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-2 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
              <div className="col-span-2">Bowler</div>
              <div className="text-center">O</div>
              <div className="text-center">M</div>
              <div className="text-center">R</div>
              <div className="text-center">W</div>
              <div className="text-center">Eco</div>
            </div>

            {/* Bowlers */}
            <div className="divide-y divide-border">
              {allBowlers.length > 0 ? allBowlers.map((bowler) => (
                <div key={bowler.id} className="grid grid-cols-7 gap-2 px-4 py-3 text-sm">
                  <div className="col-span-2">
                    <div className="font-medium text-foreground">
                      {bowler.name}
                      {matchState.currentBowler.id === bowler.id && (
                        <span className="text-primary ml-1">*</span>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground">
                    {bowler.overs}.{bowler.balls}
                  </div>
                  <div className="text-center text-muted-foreground">{bowler.maidens}</div>
                  <div className="text-center text-muted-foreground">{bowler.runs}</div>
                  <div className="text-center font-semibold text-foreground">{bowler.wickets}</div>
                  <div className="text-center text-muted-foreground">{bowler.economy.toFixed(2)}</div>
                </div>
              )) : (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No bowling data yet
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Fall of Wickets Tab */}
        <TabsContent value="extras" className="space-y-4">
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <h3 className="font-semibold">Fall of Wickets</h3>
            </div>

            {fallOfWickets.length > 0 ? (
              <div className="divide-y divide-border">
                {fallOfWickets.map((fow, idx) => (
                  <div key={idx} className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-foreground">{fow.batterName}</span>
                      <span className="text-muted-foreground"> - {fow.wicketNumber} wicket</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary">{fow.score}</span>
                      <span className="text-muted-foreground text-sm ml-1">
                        ({fow.overs}.{fow.balls})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground">
                No wickets fallen yet
              </div>
            )}
          </div>

          {/* Partnerships Summary */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <h3 className="font-semibold">Partnerships</h3>
            </div>

            {matchState.partnerships.length > 0 ? (
              <div className="divide-y divide-border">
                {matchState.partnerships.map((p, idx) => (
                  <div key={idx} className="px-4 py-3 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">{p.batter1}</span>
                      <span className="text-muted-foreground"> & </span>
                      <span className="font-medium">{p.batter2}</span>
                    </div>
                    <div className="font-bold text-primary">
                      {p.runs} ({p.balls})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground">
                Partnership data will appear here
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullScorecard;
