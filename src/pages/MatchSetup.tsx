import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MatchSetupData, MatchType } from '@/types/cricket';
import { Trophy, MapPin, Users, Clock, Coins } from 'lucide-react';

const MatchSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setupMatch } = useMatch();
  
  const [formData, setFormData] = useState<MatchSetupData>({
    matchType: 'T20',
    team1Name: '',
    team1ShortName: '',
    team1Players: Array(11).fill(''),
    team2Name: '',
    team2ShortName: '',
    team2Players: Array(11).fill(''),
    venue: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    tossWinner: 'team1',
    tossDecision: 'bat',
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof MatchSetupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayerChange = (team: 'team1Players' | 'team2Players', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [team]: prev[team].map((p, i) => i === index ? value : p),
    }));
  };

  const handleSubmit = () => {
    setupMatch(formData);
    navigate('/umpire');
  };

  const matchTypes: MatchType[] = ['T20', 'ODI', 'Test'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-4 py-6 text-primary-foreground">
        <h1 className="text-2xl font-bold text-center">Match Setup</h1>
        <p className="text-center text-primary-foreground/80 text-sm mt-1">
          Configure your match details
        </p>
        {/* Progress Steps */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                s === step 
                  ? 'bg-background text-primary' 
                  : s < step 
                    ? 'bg-primary-foreground/30 text-primary-foreground' 
                    : 'bg-primary-foreground/10 text-primary-foreground/50'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {/* Step 1: Match Details */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Match Type</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {matchTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleInputChange('matchType', type)}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      formData.matchType === type
                        ? 'gradient-primary text-primary-foreground shadow-button'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Venue & Time</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="venue">Venue Name</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Wankhede Stadium"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team 1 */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Team 1 Details</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="team1Name">Team Name</Label>
                    <Input
                      id="team1Name"
                      placeholder="e.g., Mumbai Indians"
                      value={formData.team1Name}
                      onChange={(e) => handleInputChange('team1Name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team1Short">Short Name</Label>
                    <Input
                      id="team1Short"
                      placeholder="e.g., MI"
                      maxLength={3}
                      value={formData.team1ShortName}
                      onChange={(e) => handleInputChange('team1ShortName', e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Players (11)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-64 overflow-y-auto">
                    {formData.team1Players.map((player, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5">{idx + 1}.</span>
                        <Input
                          placeholder={`Player ${idx + 1}`}
                          value={player}
                          onChange={(e) => handlePlayerChange('team1Players', idx, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Team 2 */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Team 2 Details</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="team2Name">Team Name</Label>
                    <Input
                      id="team2Name"
                      placeholder="e.g., Delhi Capitals"
                      value={formData.team2Name}
                      onChange={(e) => handleInputChange('team2Name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team2Short">Short Name</Label>
                    <Input
                      id="team2Short"
                      placeholder="e.g., DC"
                      maxLength={3}
                      value={formData.team2ShortName}
                      onChange={(e) => handleInputChange('team2ShortName', e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Players (11)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-64 overflow-y-auto">
                    {formData.team2Players.map((player, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5">{idx + 1}.</span>
                        <Input
                          placeholder={`Player ${idx + 1}`}
                          value={player}
                          onChange={(e) => handlePlayerChange('team2Players', idx, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Toss */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Toss Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Who won the toss?</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => handleInputChange('tossWinner', 'team1')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all text-center ${
                        formData.tossWinner === 'team1'
                          ? 'gradient-primary text-primary-foreground shadow-button'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {formData.team1Name || 'Team 1'}
                    </button>
                    <button
                      onClick={() => handleInputChange('tossWinner', 'team2')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all text-center ${
                        formData.tossWinner === 'team2'
                          ? 'gradient-primary text-primary-foreground shadow-button'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {formData.team2Name || 'Team 2'}
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Elected to?</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => handleInputChange('tossDecision', 'bat')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        formData.tossDecision === 'bat'
                          ? 'gradient-primary text-primary-foreground shadow-button'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      🏏 Bat
                    </button>
                    <button
                      onClick={() => handleInputChange('tossDecision', 'bowl')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        formData.tossDecision === 'bowl'
                          ? 'gradient-primary text-primary-foreground shadow-button'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      🎯 Bowl
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Summary */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="font-semibold mb-3">Match Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Match Type:</span>
                  <span className="font-medium">{formData.matchType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span className="font-medium">{formData.venue || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teams:</span>
                  <span className="font-medium">
                    {formData.team1ShortName || 'T1'} vs {formData.team2ShortName || 'T2'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toss:</span>
                  <span className="font-medium">
                    {formData.tossWinner === 'team1' ? formData.team1Name : formData.team2Name} elected to {formData.tossDecision}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 gradient-primary"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 gradient-primary"
            >
              Start Match
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSetup;
