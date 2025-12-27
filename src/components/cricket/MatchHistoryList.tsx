import React from 'react';
import { format } from 'date-fns';
import { Trash2, Play, Trophy, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedMatch } from '@/hooks/useMatchHistory';

interface MatchHistoryListProps {
  matches: SavedMatch[];
  loading: boolean;
  onLoadMatch: (matchId: string) => void;
  onDeleteMatch: (matchId: string) => void;
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({
  matches,
  loading,
  onLoadMatch,
  onDeleteMatch,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Trophy className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">No saved matches yet</p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Start a new match and it will be saved automatically
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => {
        const isCompleted = match.status === 'completed';
        const isInProgress = match.status === 'in_progress';
        
        return (
          <div
            key={match.id}
            className="bg-card rounded-xl border border-border/50 p-4 shadow-card hover-lift transition-all"
          >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-success/10 text-success'
                    : isInProgress
                    ? 'bg-warning/10 text-warning'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : match.status.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(match.updated_at), 'MMM d, yyyy')}
              </div>
            </div>

            {/* Teams & Scores */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground line-clamp-1">
                  {match.team1_name}
                </p>
                <p className="text-lg font-bold text-foreground">{match.team1_score}</p>
              </div>
              <div className="px-3 text-xs font-medium text-muted-foreground">vs</div>
              <div className="flex-1 text-right">
                <p className="font-semibold text-sm text-foreground line-clamp-1">
                  {match.team2_name}
                </p>
                <p className="text-lg font-bold text-foreground">{match.team2_score}</p>
              </div>
            </div>

            {/* Winner */}
            {match.winner && (
              <div className="flex items-center gap-2 mb-3 py-2 px-3 bg-success/5 rounded-lg border border-success/20">
                <Trophy className="w-4 h-4 text-success" />
                <span className="text-xs font-medium text-success">
                  {match.winner} won
                </span>
              </div>
            )}

            {/* Match Type */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Clock className="w-3 h-3" />
              {match.match_details.matchType} • {match.match_details.totalOvers} overs
              {match.match_details.venue && ` • ${match.match_details.venue}`}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-xs gap-1.5"
                onClick={() => onLoadMatch(match.id)}
              >
                <Play className="w-3.5 h-3.5" />
                {isCompleted ? 'View' : 'Resume'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDeleteMatch(match.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchHistoryList;
