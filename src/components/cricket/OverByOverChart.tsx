import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Over } from '@/types/cricket';

interface OverByOverChartProps {
  overs: Over[];
  currentOver?: { runs: number; balls: number };
}

const OverByOverChart: React.FC<OverByOverChartProps> = ({ overs, currentOver }) => {
  const data = overs.map((over, idx) => ({
    over: idx + 1,
    runs: over.runs,
    wickets: over.wickets,
  }));

  // Add current over if in progress
  if (currentOver && currentOver.balls > 0) {
    data.push({
      over: overs.length + 1,
      runs: currentOver.runs,
      wickets: 0,
    });
  }

  const getBarColor = (runs: number, wickets: number) => {
    if (wickets > 0) return 'hsl(var(--destructive))';
    if (runs >= 12) return 'hsl(var(--cricket-purple))';
    if (runs >= 8) return 'hsl(var(--success))';
    if (runs >= 5) return 'hsl(var(--primary))';
    return 'hsl(var(--muted-foreground))';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">Over {label}</p>
          <p className="text-sm text-primary">{data.runs} runs</p>
          {data.wickets > 0 && (
            <p className="text-sm text-destructive">{data.wickets} wicket(s)</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No overs bowled yet
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="over" 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="runs" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.runs, entry.wickets)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverByOverChart;
