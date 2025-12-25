export type BallOutcome = 
  | 0 | 1 | 2 | 3 | 4 | 6 
  | 'W' // Wicket
  | 'WD' // Wide
  | 'NB' // No Ball
  | 'LB' // Leg Bye
  | 'B'; // Bye

export interface Ball {
  id: string;
  outcome: BallOutcome;
  runs: number;
  isExtra: boolean;
  isWicket: boolean;
  overNumber: number;
  ballNumber: number;
}

export interface Over {
  number: number;
  balls: Ball[];
  runs: number;
  wickets: number;
}

export interface Batter {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOnStrike: boolean;
  isOut: boolean;
}

export interface Bowler {
  id: string;
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface Team {
  name: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
}

export interface MatchDetails {
  matchType: string;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  venue: string;
  time: string;
  ballType: string;
  powerplay: string;
}

export interface MatchState {
  matchDetails: MatchDetails;
  battingTeam: Team;
  bowlingTeam: Team;
  batters: Batter[];
  currentBowler: Bowler;
  overs: Over[];
  currentOver: Ball[];
  isFirstInnings: boolean;
  matchStatus: 'not_started' | 'in_progress' | 'innings_break' | 'completed';
}
