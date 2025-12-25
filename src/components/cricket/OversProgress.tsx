import React from 'react';

interface OversProgressProps {
  overs: number;
  balls: number;
  totalOvers?: number;
}

const OversProgress: React.FC<OversProgressProps> = ({ overs, balls, totalOvers = 20 }) => {
  const totalBalls = overs * 6 + balls;
  const maxBalls = totalOvers * 6;
  const percentage = (totalBalls / maxBalls) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-primary transition-all duration-500 ease-out"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {overs}.{balls}
        </span>
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          OVS
        </span>
      </div>
    </div>
  );
};

export default OversProgress;
