// src/gameUtils.ts
import type { Board, Player, GamePhase, Move } from './type';
import { ADJACENCY_LIST } from './Constants';

export const getLegalMoves = (board: Board, player: Player, phase: GamePhase): Move[] => {
  const moves: Move[] = [];

  //   coup en phase de placement 
  if (phase === 'placement') {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        moves.push({ from: null, to: i });
      }
    }
  } 
  // coups en phase de mouvement 
  else {
    for (let fromIndex = 0; fromIndex < 9; fromIndex++) {
      // Trouver les pions appartenant au joueur
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
    newBoard[move.from] = null; // Libère l'ancienne case
  }
  newBoard[move.to] = player; // Occupe la nouvelle
  return newBoard;
};