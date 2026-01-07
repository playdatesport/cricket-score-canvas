import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayerBattingStats, PlayerBowlingStats } from '@/hooks/usePlayerStats';
import { Target, Zap, TrendingUp, Award } from 'lucide-react';

interface PlayerComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  player1: string;
  player2: string;
  onPlayer1Change: (name: string) => void;
  onPlayer2Change: (name: string) => void;
  allPlayerNames: string[];
  battingStats: PlayerBattingStats[];
  bowlingStats: PlayerBowlingStats[];
}

const PlayerComparisonModal: React.FC<PlayerComparisonModalProps> = ({
  isOpen,
  onClose,
  player1,
  player2,
  onPlayer1Change,
  onPlayer2Change,
  allPlayerNames,
  battingStats,
  bowlingStats,
}) => {
  const p1Batting = battingStats.find(p => p.name === player1);
  const p2Batting = battingStats.find(p => p.name === player2);
  const p1Bowling = bowlingStats.find(p => p.name === player1);
  const p2Bowling = bowlingStats.find(p => p.name === player2);

  const ComparisonRow = ({ 
    label, 
    value1, 
    value2, 
    higherIsBetter = true,
    format = (v: number) => v.toString()
  }: { 
    label: string; 
    value1: number; 
    value2: number;
    higherIsBetter?: boolean;
    format?: (v: number) => string;
  }) => {
    const winner = higherIsBetter 
      ? (value1 > value2 ? 1 : value2 > value1 ? 2 : 0)
      : (value1 < value2 ? 1 : value2 < value1 ? 2 : 0);
    
    return (
      <div className="flex items-center py-2 border-b border-border/30 last:border-0">
        <div className={`flex-1 text-right pr-3 font-semibold ${winner === 1 ? 'text-success' : 'text-foreground'}`}>
          {format(value1)}
          {winner === 1 && <span className="ml-1 text-success">★</span>}
        </div>
        <div className="w-24 text-center text-xs text-muted-foreground font-medium px-2">
          {label}
        </div>
        <div className={`flex-1 text-left pl-3 font-semibold ${winner === 2 ? 'text-success' : 'text-foreground'}`}>
          {winner === 2 && <span className="mr-1 text-success">★</span>}
          {format(value2)}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Head to Head Comparison
          </DialogTitle>
        </DialogHeader>

        {/* Player Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Player 1</label>
            <Select value={player1} onValueChange={onPlayer1Change}>
              <SelectTrigger>
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {allPlayerNames.map(name => (
                  <SelectItem key={name} value={name} disabled={name === player2}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Player 2</label>
            <Select value={player2} onValueChange={onPlayer2Change}>
              <SelectTrigger>
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {allPlayerNames.map(name => (
                  <SelectItem key={name} value={name} disabled={name === player1}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {player1 && player2 ? (
          <div className="space-y-6">
            {/* Player Names Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/5 rounded-xl">
              <div className="text-center flex-1">
                <p className="font-bold text-foreground">{player1}</p>
              </div>
              <div className="w-24 text-center text-xs text-muted-foreground">VS</div>
              <div className="text-center flex-1">
                <p className="font-bold text-foreground">{player2}</p>
              </div>
            </div>

            {/* Batting Stats */}
            {(p1Batting || p2Batting) && (
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="px-4 py-2 bg-success/5 border-b border-border/50 flex items-center gap-2">
                  <Target className="w-4 h-4 text-success" />
                  <span className="font-semibold text-sm">Batting</span>
                </div>
                <div className="p-4">
                  <ComparisonRow 
                    label="Innings" 
                    value1={p1Batting?.innings || 0} 
                    value2={p2Batting?.innings || 0} 
                  />
                  <ComparisonRow 
                    label="Runs" 
                    value1={p1Batting?.runs || 0} 
                    value2={p2Batting?.runs || 0} 
                  />
                  <ComparisonRow 
                    label="Average" 
                    value1={p1Batting?.average || 0} 
                    value2={p2Batting?.average || 0}
                    format={v => v.toFixed(1)}
                  />
                  <ComparisonRow 
                    label="Strike Rate" 
                    value1={p1Batting?.strikeRate || 0} 
                    value2={p2Batting?.strikeRate || 0}
                    format={v => v.toFixed(1)}
                  />
                  <ComparisonRow 
                    label="High Score" 
                    value1={p1Batting?.highestScore || 0} 
                    value2={p2Batting?.highestScore || 0} 
                  />
                  <ComparisonRow 
                    label="Fours" 
                    value1={p1Batting?.fours || 0} 
                    value2={p2Batting?.fours || 0} 
                  />
                  <ComparisonRow 
                    label="Sixes" 
                    value1={p1Batting?.sixes || 0} 
                    value2={p2Batting?.sixes || 0} 
                  />
                </div>
              </div>
            )}

            {/* Bowling Stats */}
            {(p1Bowling || p2Bowling) && (
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="px-4 py-2 bg-destructive/5 border-b border-border/50 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-destructive" />
                  <span className="font-semibold text-sm">Bowling</span>
                </div>
                <div className="p-4">
                  <ComparisonRow 
                    label="Matches" 
                    value1={p1Bowling?.matches || 0} 
                    value2={p2Bowling?.matches || 0} 
                  />
                  <ComparisonRow 
                    label="Wickets" 
                    value1={p1Bowling?.wickets || 0} 
                    value2={p2Bowling?.wickets || 0} 
                  />
                  <ComparisonRow 
                    label="Economy" 
                    value1={p1Bowling?.economy || 0} 
                    value2={p2Bowling?.economy || 0}
                    higherIsBetter={false}
                    format={v => v.toFixed(2)}
                  />
                  <ComparisonRow 
                    label="Average" 
                    value1={p1Bowling?.average || 999} 
                    value2={p2Bowling?.average || 999}
                    higherIsBetter={false}
                    format={v => v === 999 ? '-' : v.toFixed(1)}
                  />
                  <ComparisonRow 
                    label="Overs" 
                    value1={p1Bowling?.overs || 0} 
                    value2={p2Bowling?.overs || 0}
                    format={v => v.toFixed(1)}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select two players to compare their statistics</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerComparisonModal;
