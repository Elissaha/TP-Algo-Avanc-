import type { Board } from './type';

// Index de la grille 3x3 :
// 0  1  2
// 3  4  5
// 6  7  8

export const ADJACENCY_LIST: Record<number, number[]> = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 5, 4],
  3: [0, 6, 4],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 8, 4],
  6: [3, 7, 4],
  7: [6, 8, 4],
  8: [7, 5, 4],
};

export const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const INITIAL_BOARD: Board = Array(9).fill(null);

// Coordonnées SVG pour afficher les lignes du plateau Fanoron-telo
// Grille normalisée 0-100 en x et y
export const CELL_POSITIONS: [number, number][] = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2],
];