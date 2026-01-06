import { Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

const Scorecard = () => {
  const { matchState } = useMatch();

  const formatOvers = (overs, balls) => `${overs}.${balls}`;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Scorecard</h1>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{matchState.battingTeam.name}</div>
                <div className="text-2xl font-bold">
                  {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {formatOvers(matchState.battingTeam.overs, matchState.battingTeam.balls)} ov
                </div>
                {matchState.battingTeam.target && (
                  <div className="text-sm text-primary font-medium">
                    Target: {matchState.battingTeam.target}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="batting" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="batting" className="flex-1">Batting</TabsTrigger>
            <TabsTrigger value="bowling" className="flex-1">Bowling</TabsTrigger>
          </TabsList>

          <TabsContent value="batting">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Batting</CardTitle>
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
                      {matchState.allBatters.map((batter) => (
                        <tr key={batter.id} className="border-b">
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              {!batter.isOut && matchState.batters.find(b => b.id === batter.id) && (
                                <span className="text-primary">●</span>
                              )}
                              <span>{batter.name}</span>
                            </div>
                            {batter.isOut && (
                              <div className="text-xs text-muted-foreground">
                                {batter.dismissalType}
                                {batter.caughtBy && ` c ${batter.caughtBy}`}
                              </div>
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
          </TabsContent>

          <TabsContent value="bowling">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bowling</CardTitle>
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
                      {matchState.allBowlers.map((bowler) => (
                        <tr key={bowler.id} className="border-b">
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              {bowler.id === matchState.currentBowler.id && (
                                <span className="text-primary">●</span>
                              )}
                              <span>{bowler.name}</span>
                            </div>
                          </td>
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
          </TabsContent>
        </Tabs>

        <Link to="/full-scorecard" className="block mt-4 text-center text-primary text-sm hover:underline">
          View Full Scorecard →
        </Link>
      </div>
    </div>
  );
};

export default Scorecard;
