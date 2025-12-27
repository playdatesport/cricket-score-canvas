import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayerMatchHistory } from '@/hooks/usePlayerStats';
import { TrendingUp, Target, Zap } from 'lucide-react';

interface PerformanceChartProps {
  selectedPlayer: string;
  onPlayerChange: (name: string) => void;
  allPlayerNames: string[];
  getPlayerHistory: (name: string) => PlayerMatchHistory | undefined;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  selectedPlayer,
  onPlayerChange,
  allPlayerNames,
  getPlayerHistory,
}) => {
  const playerHistory = selectedPlayer ? getPlayerHistory(selectedPlayer) : undefined;
  const chartData = playerHistory?.performances || [];

  if (allPlayerNames.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No player data available yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Play some matches to see performance trends</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Select Player</label>
        <Select value={selectedPlayer} onValueChange={onPlayerChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a player to view trends" />
          </SelectTrigger>
          <SelectContent>
            {allPlayerNames.map(name => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPlayer && chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Runs Trend */}
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3 bg-success/5 border-b border-border/50 flex items-center gap-2">
              <Target className="w-4 h-4 text-success" />
              <span className="font-semibold text-sm">Runs per Match</span>
            </div>
            <div className="p-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis 
                      dataKey="matchIndex" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `M${v}`}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelFormatter={(v) => `Match ${v}`}
                    />
                    <Bar 
                      dataKey="runs" 
                      fill="hsl(var(--success))" 
                      radius={[4, 4, 0, 0]}
                      name="Runs"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>Total: {chartData.reduce((s, p) => s + p.runs, 0)} runs</span>
                <span>Avg: {(chartData.reduce((s, p) => s + p.runs, 0) / chartData.length).toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Strike Rate Trend */}
          {chartData.some(p => p.strikeRate > 0) && (
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3 bg-primary/5 border-b border-border/50 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Strike Rate Trend</span>
              </div>
              <div className="p-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.filter(p => p.strikeRate > 0)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis 
                        dataKey="matchIndex" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `M${v}`}
                      />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelFormatter={(v) => `Match ${v}`}
                        formatter={(v: number) => [v.toFixed(1), 'SR']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="strikeRate" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        name="Strike Rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Wickets Trend */}
          {chartData.some(p => p.wickets > 0 || p.oversBowled > 0) && (
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="px-4 py-3 bg-destructive/5 border-b border-border/50 flex items-center gap-2">
                <Zap className="w-4 h-4 text-destructive" />
                <span className="font-semibold text-sm">Wickets per Match</span>
              </div>
              <div className="p-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.filter(p => p.oversBowled > 0)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis 
                        dataKey="matchIndex" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `M${v}`}
                      />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelFormatter={(v) => `Match ${v}`}
                      />
                      <Bar 
                        dataKey="wickets" 
                        fill="hsl(var(--destructive))" 
                        radius={[4, 4, 0, 0]}
                        name="Wickets"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                  <span>Total: {chartData.reduce((s, p) => s + p.wickets, 0)} wickets</span>
                  <span>Overs: {chartData.reduce((s, p) => s + p.oversBowled, 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : selectedPlayer ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border/50">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No match data for {selectedPlayer}</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border/50">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Select a player to view their performance trends</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
