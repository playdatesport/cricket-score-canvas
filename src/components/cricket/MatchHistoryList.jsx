import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const MatchHistoryList = ({ matches, onLoadMatch, onDeleteMatch }) => {
  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted-foreground">
          No match history yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map(match => (
        <Card key={match.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onLoadMatch(match)}>
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">{match.team1_name} vs {match.team2_name}</div>
                <div className="text-xs text-muted-foreground">
                  {match.team1_score || 0} - {match.team2_score || 0}
                </div>
                <div className={`text-xs mt-1 ${match.status === 'completed' ? 'text-primary' : 'text-orange-500'}`}>
                  {match.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDeleteMatch(match.id); }}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchHistoryList;
