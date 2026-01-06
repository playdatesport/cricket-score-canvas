import { Card, CardContent } from '@/components/ui/card';

const CurrentOver = ({ balls }) => {
  const getBallDisplay = (ball) => {
    if (ball.isWicket) return { text: 'W', className: 'bg-destructive text-destructive-foreground' };
    if (ball.outcome === 'WD') return { text: 'WD', className: 'bg-yellow-500 text-white' };
    if (ball.outcome === 'NB') return { text: 'NB', className: 'bg-yellow-500 text-white' };
    if (ball.outcome === 4) return { text: '4', className: 'bg-blue-500 text-white' };
    if (ball.outcome === 6) return { text: '6', className: 'bg-primary text-primary-foreground' };
    return { text: ball.runs.toString(), className: 'bg-muted' };
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground mb-2">This Over</div>
        <div className="flex gap-2 flex-wrap">
          {balls.length === 0 ? (
            <span className="text-muted-foreground text-sm">No balls yet</span>
          ) : (
            balls.map((ball, index) => {
              const { text, className } = getBallDisplay(ball);
              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${className}`}
                >
                  {text}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentOver;
