import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { useTeamAssets } from '@/hooks/useTeamAssets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarPicker from '@/components/cricket/AvatarPicker';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const MatchSetup = () => {
  const navigate = useNavigate();
  const { setupMatch } = useMatch();
  const { saveTeamLogo, savePlayerAvatar } = useTeamAssets();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    matchType: 'T20',
    team1Name: '',
    team1ShortName: '',
    team1Players: Array(11).fill(''),
    team2Name: '',
    team2ShortName: '',
    team2Players: Array(11).fill(''),
    venue: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    tossWinner: 'team1',
    tossDecision: 'bat',
  });

  const [team1Logo, setTeam1Logo] = useState(null);
  const [team2Logo, setTeam2Logo] = useState(null);
  const [team1Avatars, setTeam1Avatars] = useState({});
  const [team2Avatars, setTeam2Avatars] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayerChange = (team, index, value) => {
    setFormData(prev => {
      const players = [...prev[`${team}Players`]];
      players[index] = value;
      return { ...prev, [`${team}Players`]: players };
    });
  };

  const handleAvatarChange = (team, playerIndex, avatarData) => {
    if (team === 'team1') {
      setTeam1Avatars(prev => ({ ...prev, [playerIndex]: avatarData }));
    } else {
      setTeam2Avatars(prev => ({ ...prev, [playerIndex]: avatarData }));
    }
  };

  const handleSubmit = () => {
    if (team1Logo) saveTeamLogo(formData.team1Name, team1Logo);
    if (team2Logo) saveTeamLogo(formData.team2Name, team2Logo);

    Object.entries(team1Avatars).forEach(([index, avatar]) => {
      const playerName = formData.team1Players[parseInt(index)];
      if (playerName && avatar) savePlayerAvatar(playerName, avatar);
    });

    Object.entries(team2Avatars).forEach(([index, avatar]) => {
      const playerName = formData.team2Players[parseInt(index)];
      if (playerName && avatar) savePlayerAvatar(playerName, avatar);
    });

    setupMatch({
      ...formData,
      team1Players: formData.team1Players.filter(p => p.trim()),
      team2Players: formData.team2Players.filter(p => p.trim()),
    });
    navigate('/umpire');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.matchType && formData.venue;
      case 2:
        return formData.team1Name && formData.team1ShortName && 
               formData.team1Players.filter(p => p.trim()).length >= 2;
      case 3:
        return formData.team2Name && formData.team2ShortName && 
               formData.team2Players.filter(p => p.trim()).length >= 2;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Match Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Match Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['T20', 'ODI', 'Test'].map(type => (
                    <Button
                      key={type}
                      variant={formData.matchType === type ? 'default' : 'outline'}
                      onClick={() => handleInputChange('matchType', type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="Enter venue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Team 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team1Name">Team Name</Label>
                  <Input
                    id="team1Name"
                    value={formData.team1Name}
                    onChange={(e) => handleInputChange('team1Name', e.target.value)}
                    placeholder="Team name"
                  />
                </div>
                <div>
                  <Label htmlFor="team1ShortName">Short Name</Label>
                  <Input
                    id="team1ShortName"
                    value={formData.team1ShortName}
                    onChange={(e) => handleInputChange('team1ShortName', e.target.value.toUpperCase().slice(0, 4))}
                    placeholder="ABC"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <Label>Players</Label>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {formData.team1Players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                      <Input
                        value={player}
                        onChange={(e) => handlePlayerChange('team1', index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1"
                      />
                      <AvatarPicker
                        currentAvatar={team1Avatars[index]}
                        onAvatarChange={(avatar) => handleAvatarChange('team1', index, avatar)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Team 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team2Name">Team Name</Label>
                  <Input
                    id="team2Name"
                    value={formData.team2Name}
                    onChange={(e) => handleInputChange('team2Name', e.target.value)}
                    placeholder="Team name"
                  />
                </div>
                <div>
                  <Label htmlFor="team2ShortName">Short Name</Label>
                  <Input
                    id="team2ShortName"
                    value={formData.team2ShortName}
                    onChange={(e) => handleInputChange('team2ShortName', e.target.value.toUpperCase().slice(0, 4))}
                    placeholder="XYZ"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <Label>Players</Label>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {formData.team2Players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                      <Input
                        value={player}
                        onChange={(e) => handlePlayerChange('team2', index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1"
                      />
                      <AvatarPicker
                        currentAvatar={team2Avatars[index]}
                        onAvatarChange={(avatar) => handleAvatarChange('team2', index, avatar)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Toss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Toss Winner</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={formData.tossWinner === 'team1' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('tossWinner', 'team1')}
                  >
                    {formData.team1Name || 'Team 1'}
                  </Button>
                  <Button
                    variant={formData.tossWinner === 'team2' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('tossWinner', 'team2')}
                  >
                    {formData.team2Name || 'Team 2'}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Elected to</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={formData.tossDecision === 'bat' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('tossDecision', 'bat')}
                  >
                    Bat
                  </Button>
                  <Button
                    variant={formData.tossDecision === 'bowl' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('tossDecision', 'bowl')}
                  >
                    Bowl
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <h3 className="font-medium mb-2">Match Summary</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{formData.matchType} at {formData.venue}</p>
                  <p>{formData.team1Name} vs {formData.team2Name}</p>
                  <p>
                    {formData.tossWinner === 'team1' ? formData.team1Name : formData.team2Name} won toss, elected to {formData.tossDecision}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="flex-1">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Start Match
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSetup;
