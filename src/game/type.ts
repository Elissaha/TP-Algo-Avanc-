
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[]; // Un tableau de 9 éléments

export type GamePhase = 'placement' | 'mouvement';

export interface GameState {
  board: Board;
  phase: GamePhase;
  pionsPlaces: number;
  currentPlayer: Player;
  selectedPiece: number | null; // Index de 0 à 8
  winner: Player | null;
}
export interface Move {
  from: number | null; // null en phase 1 (placement)
  to: number;
}