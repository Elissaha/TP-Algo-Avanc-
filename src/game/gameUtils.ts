import type { Board, Player, GamePhase, Move } from './type';
import { ADJACENCY_LIST } from './Constants';

export const getLegalMoves = (board: Board, player: Player, phase: GamePhase): Move[] => {
  const moves: Move[] = [];

  if (phase === 'placement') {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        moves.push({ from: null, to: i });
      }
    }
  } else {
    for (let fromIndex = 0; fromIndex < 9; fromIndex++) {
      if (board[fromIndex] === player) {
        const neighbors = ADJACENCY_LIST[fromIndex];
        for (const toIndex of neighbors) {
          if (board[toIndex] === null) {
            moves.push({ from: fromIndex, to: toIndex });
          }
        }
      }
    }
  }

  return moves;
};

export const simulateMove = (board: Board, move: Move, player: Player): Board => {
  const newBoard = [...board];
  if (move.from !== null) {
    newBoard[move.from] = null;
  }
  newBoard[move.to] = player;
  return newBoard;
};

export const isAdjacent = (from: number, to: number): boolean => {
  return ADJACENCY_LIST[from]?.includes(to) ?? false;
};