export type BallOutcome = 
  | 0 | 1 | 2 | 3 | 4 | 6 
  | 'W' // Wicket
  | 'WD' // Wide
  | 'NB' // No Ball
  | 'LB' // Leg Bye
  | 'B'; // Bye

export type DismissalType = 
  | 'bowled' | 'caught' | 'lbw' | 'run out' 
  | 'stumped' | 'hit wicket' | 'retired hurt';

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
  dismissalType?: DismissalType;
  dismissedBy?: string;
  caughtBy?: string;
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
  noBalls: number;
  wides: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overs: number;
  balls: number;
  batterName: string;
}

export interface Partnership {
  batter1: string;
  batter2: string;
  runs: number;
  balls: number;
}

export interface Team {
  name: string;
  shortName: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  players: string[];
}

export type MatchType = 'T20' | 'ODI' | 'Test';

export interface MatchDetails {
  matchType: MatchType;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  venue: string;
  date: string;
  time: string;
  ballType: 'White' | 'Red';
  totalOvers: number;
}

export interface MatchState {
  matchDetails: MatchDetails;
  battingTeam: Team;
  bowlingTeam: Team;
  batters: Batter[];
  allBatters: Batter[];
  currentBowler: Bowler;
  allBowlers: Bowler[];
  overs: Over[];
  currentOver: Ball[];
  isFirstInnings: boolean;
  matchStatus: 'setup' | 'not_started' | 'in_progress' | 'innings_break' | 'completed';
  fallOfWickets: FallOfWicket[];
  partnerships: Partnership[];
  currentPartnership: Partnership;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface MatchSetupData {
  matchType: MatchType;
  team1Name: string;
  team1ShortName: string;
  team1Players: string[];
  team2Name: string;
  team2ShortName: string;
  team2Players: string[];
  venue: string;
  date: string;
  time: string;
  tossWinner: 'team1' | 'team2';
  tossDecision: 'bat' | 'bowl';
}
