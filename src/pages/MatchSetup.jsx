import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { useTeamAssets } from '@/hooks/useTeamAssets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AvatarPicker from '@/components/cricket/AvatarPicker';
import { ArrowLeft, ArrowRight, Check, Home, Trophy, Users, Calendar, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
      <div key={step} className="flex items-center flex-1">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
          step < currentStep && "bg-primary text-primary-foreground",
          step === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
          step > currentStep && "bg-muted text-muted-foreground"
        )}>
          {step < currentStep ? <Check className="w-4 h-4" /> : step}
        </div>
        {step < totalSteps && (
          <div className={cn(
            "flex-1 h-1 mx-2 rounded-full transition-all",
            step < currentStep ? "bg-primary" : "bg-muted"
          )} />
        )}
      </div>
    ))}
  </div>
);

const stepInfo = [
  { icon: Calendar, title: 'Match Details', description: 'Set up the basics' },
  { icon: Users, title: 'Team 1', description: 'Add first team' },
  { icon: Users, title: 'Team 2', description: 'Add second team' },
  { icon: Coins, title: 'Toss', description: 'Who bats first?' },
];

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

  const CurrentStepIcon = stepInfo[step - 1].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Link to="/" className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">New Match</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="p-4 pb-8 max-w-md mx-auto">
        <StepIndicator currentStep={step} totalSteps={4} />

        {/* Step Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CurrentStepIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{stepInfo[step - 1].title}</h2>
            <p className="text-sm text-muted-foreground">{stepInfo[step - 1].description}</p>
          </div>
        </div>

        {step === 1 && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Match Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['T20', 'ODI', 'Test'].map(type => (
                    <Button
                      key={type}
                      variant={formData.matchType === type ? 'default' : 'outline'}
                      onClick={() => handleInputChange('matchType', type)}
                      className={cn(
                        "h-12 rounded-xl font-semibold",
                        formData.matchType === type && "shadow-button"
                      )}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="venue" className="text-sm font-medium mb-2 block">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="Where's the match?"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium mb-2 block">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm font-medium mb-2 block">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(step === 2 || step === 3) && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Team Name</Label>
                  <Input
                    value={step === 2 ? formData.team1Name : formData.team2Name}
                    onChange={(e) => handleInputChange(step === 2 ? 'team1Name' : 'team2Name', e.target.value)}
                    placeholder="Team name"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Short Name</Label>
                  <Input
                    value={step === 2 ? formData.team1ShortName : formData.team2ShortName}
                    onChange={(e) => handleInputChange(
                      step === 2 ? 'team1ShortName' : 'team2ShortName', 
                      e.target.value.toUpperCase().slice(0, 4)
                    )}
                    placeholder="ABC"
                    maxLength={4}
                    className="h-12 rounded-xl text-center font-semibold"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Players (min 2)</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(step === 2 ? formData.team1Players : formData.team2Players).map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5 text-center font-medium">
                        {index + 1}
                      </span>
                      <Input
                        value={player}
                        onChange={(e) => handlePlayerChange(step === 2 ? 'team1' : 'team2', index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1 h-11 rounded-xl"
                      />
                      <AvatarPicker
                        currentAvatar={step === 2 ? team1Avatars[index] : team2Avatars[index]}
                        onAvatarChange={(avatar) => handleAvatarChange(step === 2 ? 'team1' : 'team2', index, avatar)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Who won the toss?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={formData.tossWinner === 'team1' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('tossWinner', 'team1')}
                      className={cn(
                        "h-14 rounded-xl font-semibold",
                        formData.tossWinner === 'team1' && "shadow-button"
                      )}
                    >
                      {formData.team1Name || 'Team 1'}
                    </Button>
                    <Button
                      variant={formData.tossWinner === 'team2' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('tossWinner', 'team2')}
                      className={cn(
                        "h-14 rounded-xl font-semibold",
                        formData.tossWinner === 'team2' && "shadow-button"
                      )}
                    >
                      {formData.team2Name || 'Team 2'}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Elected to</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={formData.tossDecision === 'bat' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('tossDecision', 'bat')}
                      className={cn(
                        "h-14 rounded-xl font-semibold",
                        formData.tossDecision === 'bat' && "shadow-button"
                      )}
                    >
                      🏏 Bat
                    </Button>
                    <Button
                      variant={formData.tossDecision === 'bowl' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('tossDecision', 'bowl')}
                      className={cn(
                        "h-14 rounded-xl font-semibold",
                        formData.tossDecision === 'bowl' && "shadow-button"
                      )}
                    >
                      ⚾ Bowl
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Match Summary</h3>
                </div>
                <div className="text-sm space-y-1.5 text-muted-foreground">
                  <p className="font-medium text-foreground">{formData.team1Name} vs {formData.team2Name}</p>
                  <p>{formData.matchType} at {formData.venue}</p>
                  <p>
                    {formData.tossWinner === 'team1' ? formData.team1Name : formData.team2Name} won toss, elected to {formData.tossDecision}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(s => s - 1)} 
              className="flex-1 h-12 rounded-xl font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button 
              onClick={() => setStep(s => s + 1)} 
              disabled={!canProceed()} 
              className="flex-1 h-12 rounded-xl font-semibold shadow-button"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="flex-1 h-12 rounded-xl font-semibold gradient-primary shadow-button"
            >
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
