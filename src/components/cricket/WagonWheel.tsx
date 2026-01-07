import React, { useMemo } from 'react';

interface Shot {
  id: string;
  runs: number;
  angle: number; // 0-360 degrees, 0 = straight ahead
  distance: number; // 0-1, how far the shot went
  isBoundary: boolean;
  isSix: boolean;
}

interface WagonWheelProps {
  shots: Shot[];
  batterName?: string;
}

const WagonWheel: React.FC<WagonWheelProps> = ({ shots, batterName }) => {
  const size = 280;
  const center = size / 2;
  const maxRadius = (size / 2) - 30;

  // Generate random shots for demo if none provided
  const displayShots = useMemo(() => {
    if (shots.length > 0) return shots;
    
    // Generate sample shots based on common cricket scoring patterns
    const sampleShots: Shot[] = [];
    const commonAngles = [
      { angle: 45, weight: 3 },   // Cover drive
      { angle: 315, weight: 3 },  // Square cut
      { angle: 0, weight: 2 },    // Straight drive
      { angle: 90, weight: 2 },   // Pull shot
      { angle: 270, weight: 2 },  // On drive
      { angle: 135, weight: 1 },  // Leg glance
      { angle: 225, weight: 1 },  // Sweep
    ];

    for (let i = 0; i < 15; i++) {
      const weightedAngle = commonAngles[Math.floor(Math.random() * commonAngles.length)];
      const angleVariation = (Math.random() - 0.5) * 30;
      const runs = [1, 1, 2, 2, 3, 4, 4, 6][Math.floor(Math.random() * 8)];
      const distance = runs >= 4 ? 0.85 + Math.random() * 0.15 : 0.3 + Math.random() * 0.5;
      
      sampleShots.push({
        id: `shot-${i}`,
        runs,
        angle: weightedAngle.angle + angleVariation,
        distance,
        isBoundary: runs === 4,
        isSix: runs === 6,
      });
    }
    return sampleShots;
  }, [shots]);

  const getShotColor = (shot: Shot) => {
    if (shot.isSix) return 'hsl(var(--cricket-purple))';
    if (shot.isBoundary) return 'hsl(var(--success))';
    if (shot.runs >= 2) return 'hsl(var(--primary))';
    return 'hsl(var(--muted-foreground))';
  };

  const getCoordinates = (angle: number, distance: number) => {
    // Convert angle to radians, adjusting so 0 degrees is straight ahead (top)
    const radians = ((angle - 90) * Math.PI) / 180;
    const r = distance * maxRadius;
    return {
      x: center + r * Math.cos(radians),
      y: center + r * Math.sin(radians),
    };
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Field circles */}
        <circle cx={center} cy={center} r={maxRadius} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={center} cy={center} r={maxRadius * 0.66} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={center} cy={center} r={maxRadius * 0.33} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Boundary ring */}
        <circle cx={center} cy={center} r={maxRadius} fill="none" stroke="hsl(var(--success))" strokeWidth="2" opacity="0.3" />
        
        {/* Pitch representation */}
        <rect 
          x={center - 4} 
          y={center - 20} 
          width={8} 
          height={40} 
          fill="hsl(var(--warning))" 
          opacity="0.3" 
          rx="2"
        />
        
        {/* Batter position */}
        <circle cx={center} cy={center} r={6} fill="hsl(var(--primary))" />
        
        {/* Direction labels */}
        <text x={center} y={15} textAnchor="middle" className="fill-muted-foreground text-xs">Long Off</text>
        <text x={center} y={size - 5} textAnchor="middle" className="fill-muted-foreground text-xs">Long On</text>
        <text x={15} y={center + 4} textAnchor="start" className="fill-muted-foreground text-xs">Third Man</text>
        <text x={size - 15} y={center + 4} textAnchor="end" className="fill-muted-foreground text-xs">Fine Leg</text>
        
        {/* Shot lines */}
        {displayShots.map((shot) => {
          const end = getCoordinates(shot.angle, shot.distance);
          return (
            <g key={shot.id}>
              <line
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke={getShotColor(shot)}
                strokeWidth={shot.isSix ? 3 : shot.isBoundary ? 2.5 : 1.5}
                opacity={0.7}
              />
              <circle
                cx={end.x}
                cy={end.y}
                r={shot.isSix ? 6 : shot.isBoundary ? 5 : 3}
                fill={getShotColor(shot)}
              />
              {(shot.isBoundary || shot.isSix) && (
                <text
                  x={end.x}
                  y={end.y + 4}
                  textAnchor="middle"
                  className="fill-success-foreground text-xs font-bold"
                  style={{ fontSize: '10px' }}
                >
                  {shot.runs}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">Singles</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">2-3 Runs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Fours</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-cricket-purple" />
          <span className="text-muted-foreground">Sixes</span>
        </div>
      </div>

      {batterName && (
        <p className="text-sm font-medium text-foreground mt-2">{batterName}'s Scoring Zones</p>
      )}
    </div>
  );
};

export default WagonWheel;
