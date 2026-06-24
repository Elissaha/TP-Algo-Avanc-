export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GamePhase = 'placement' | 'mouvement';
export type GameMode = 'hvh' | 'hvia' | 'iavia';
export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface GameState {
  board: Board;
  phase: GamePhase;
  pionsPlaces: number;
  currentPlayer: Player;
  selectedPiece: number | null;
  winner: Player | null;
}

export interface Move {
  from: number | null;
  to: number;
}

export interface HistoryEntry {
  board: Board;
  phase: GamePhase;
  pionsPlaces: number;
  currentPlayer: Player;
  selectedPiece: number | null;
  winner: Player | null;
}