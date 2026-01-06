import { Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

const FullScorecard = () => {
  const { matchState } = useMatch();

  const formatOvers = (overs, balls) => `${overs}.${balls}`;

  const renderBattingCard = (batters, teamName) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{teamName} - Batting</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Batter</th>
                <th className="text-right p-2">R</th>
                <th className="text-right p-2">B</th>
                <th className="text-right p-2">4s</th>
                <th className="text-right p-2">6s</th>
                <th className="text-right p-2">SR</th>
              </tr>
            </thead>
            <tbody>
              {batters.map((batter) => (
                <tr key={batter.id} className="border-b">
                  <td className="p-2">
                    <span>{batter.name}</span>
                    {batter.isOut && (
                      <div className="text-xs text-muted-foreground">{batter.dismissalType}</div>
                    )}
                  </td>
                  <td className="text-right p-2 font-medium">{batter.runs}</td>
                  <td className="text-right p-2 text-muted-foreground">{batter.balls}</td>
                  <td className="text-right p-2">{batter.fours}</td>
                  <td className="text-right p-2">{batter.sixes}</td>
                  <td className="text-right p-2">
                    {batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderBowlingCard = (bowlers, teamName) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{teamName} - Bowling</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2">Bowler</th>
                <th className="text-right p-2">O</th>
                <th className="text-right p-2">M</th>
                <th className="text-right p-2">R</th>
                <th className="text-right p-2">W</th>
                <th className="text-right p-2">Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlers.map((bowler) => (
                <tr key={bowler.id} className="border-b">
                  <td className="p-2">{bowler.name}</td>
                  <td className="text-right p-2">{bowler.overs}.{bowler.balls % 6}</td>
                  <td className="text-right p-2">{bowler.maidens}</td>
                  <td className="text-right p-2">{bowler.runs}</td>
                  <td className="text-right p-2 font-medium">{bowler.wickets}</td>
                  <td className="text-right p-2">
                    {bowler.overs > 0 ? (bowler.runs / (bowler.overs + bowler.balls / 6)).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderFallOfWickets = (fows, teamName) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{teamName} - Fall of Wickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-xs">
          {fows.map((fow, index) => (
            <div key={index} className="bg-muted px-2 py-1 rounded">
              {fow.score}/{fow.wicketNumber} ({fow.batterName}, {fow.overs}.{fow.balls})
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Full Scorecard</h1>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="text-center mb-2">
              <span className="text-sm text-muted-foreground">{matchState.matchDetails.matchType}</span>
              <span className="mx-2">•</span>
              <span className="text-sm text-muted-foreground">{matchState.matchDetails.venue}</span>
            </div>
            {matchState.matchResult && (
              <div className="text-center font-medium text-primary">
                {matchState.matchResult.resultText}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="innings1" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="innings1" className="flex-1">
              {matchState.firstInningsData?.battingTeam.name || matchState.bowlingTeam.name}
            </TabsTrigger>
            <TabsTrigger value="innings2" className="flex-1">
              {matchState.battingTeam.name}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="innings1" className="space-y-4">
            {matchState.firstInningsData ? (
              <>
                <div className="text-center py-2">
                  <span className="text-2xl font-bold">
                    {matchState.firstInningsData.battingTeam.score}/{matchState.firstInningsData.battingTeam.wickets}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    ({formatOvers(matchState.firstInningsData.battingTeam.overs, matchState.firstInningsData.battingTeam.balls)} ov)
                  </span>
                </div>
                {renderBattingCard(matchState.firstInningsData.allBatters, matchState.firstInningsData.battingTeam.name)}
                {renderBowlingCard(matchState.firstInningsData.allBowlers, matchState.firstInningsData.bowlingTeam.name)}
                {matchState.firstInningsData.fallOfWickets.length > 0 && 
                  renderFallOfWickets(matchState.firstInningsData.fallOfWickets, matchState.firstInningsData.battingTeam.name)}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                First innings not yet completed
              </div>
            )}
          </TabsContent>

          <TabsContent value="innings2" className="space-y-4">
            <div className="text-center py-2">
              <span className="text-2xl font-bold">
                {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
              </span>
              <span className="text-muted-foreground ml-2">
                ({formatOvers(matchState.battingTeam.overs, matchState.battingTeam.balls)} ov)
              </span>
              {matchState.battingTeam.target && (
                <div className="text-sm text-primary">Target: {matchState.battingTeam.target}</div>
              )}
            </div>
            {renderBattingCard(matchState.allBatters, matchState.battingTeam.name)}
            {renderBowlingCard(matchState.allBowlers, matchState.bowlingTeam.name)}
            {matchState.fallOfWickets.length > 0 && 
              renderFallOfWickets(matchState.fallOfWickets, matchState.battingTeam.name)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullScorecard;
