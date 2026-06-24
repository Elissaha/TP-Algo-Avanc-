import type { Board, Player, GamePhase, Move } from '../game/type';
import { WINNING_COMBINATIONS } from '../game/Constants';
import { getLegalMoves, simulateMove } from '../game/gameUtils';

const checkWinCondition = (board: Board, player: Player): boolean => {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => board[index] === player)
  );
};

const evaluateBoard = (board: Board): number => {
  if (checkWinCondition(board, 'O')) return 10000;
  if (checkWinCondition(board, 'X')) return -10000;

  let score = 0;

  if (board[4] === 'O') score += 30;
  if (board[4] === 'X') score -= 30;

  for (const line of WINNING_COMBINATIONS) {
    let oCount = 0;
    let xCount = 0;
    let emptyCount = 0;

    for (const pos of line) {
      if (board[pos] === 'O') oCount++;
      else if (board[pos] === 'X') xCount++;
      else emptyCount++;
    }

    if (oCount === 2 && emptyCount === 1) score += 100;
    if (oCount === 1 && emptyCount === 2) score += 10;
    if (xCount === 2 && emptyCount === 1) score -= 100;
    if (xCount === 1 && emptyCount === 2) score -= 10;
  }

  return score;
};

const transpositionTable = new Map<string, number>();

function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  phase: GamePhase,
  pionsPlaces: number,
  maxDepth: number
): number {
  const cacheKey = `${board.join('')}_${phase}_${isMaximizing}_${pionsPlaces}`;
  if (transpositionTable.has(cacheKey)) {
    return transpositionTable.get(cacheKey)!;
  }

  const score = evaluateBoard(board);

  if (score >= 10000) return score - depth;
  if (score <= -10000) return score + depth;

  if (depth >= maxDepth) return score;

  let currentSimulatedPhase = phase;
  if (phase === 'placement' && pionsPlaces >= 6) {
    currentSimulatedPhase = 'mouvement';
  }

  const activePlayer: Player = isMaximizing ? 'O' : 'X';
  const moves = getLegalMoves(board, activePlayer, currentSimulatedPhase);

  if (moves.length === 0) return 0;

  const orderedMoves = [...moves].sort((a, b) => {
    const boardA = simulateMove(board, a, activePlayer);
    const boardB = simulateMove(board, b, activePlayer);
    return isMaximizing
      ? evaluateBoard(boardB) - evaluateBoard(boardA)
      : evaluateBoard(boardA) - evaluateBoard(boardB);
  });

  let result = 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const nextBoard = simulateMove(board, move, 'O');
      const evaluation = alphaBeta(
        nextBoard, depth + 1, alpha, beta, false,
        currentSimulatedPhase,
        phase === 'placement' ? pionsPlaces + 1 : pionsPlaces,
        maxDepth
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    result = maxEval;
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const nextBoard = simulateMove(board, move, 'X');
      const evaluation = alphaBeta(
        nextBoard, depth + 1, alpha, beta, true,
        currentSimulatedPhase,
        phase === 'placement' ? pionsPlaces + 1 : pionsPlaces,
        maxDepth
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    result = minEval;
  }

  transpositionTable.set(cacheKey, result);
  return result;
}

export const getBestMove = (
  board: Board,
  phase: GamePhase,
  pionsPlaces: number,
  difficulty: 'facile' | 'moyen' | 'difficile' = 'difficile',
  player: Player = 'O'
): Move | null => {
  transpositionTable.clear();

  const opponent: Player = player === 'O' ? 'X' : 'O';
  const moves = getLegalMoves(board, player, phase);
  if (moves.length === 0) return null;

  // Mode facile : aléatoire pur
  if (difficulty === 'facile') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Mode moyen : 50% aléatoire, 50% alpha-beta depth 4
  if (difficulty === 'moyen' && Math.random() < 0.5) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const maxDepth = difficulty === 'moyen'
    ? (phase === 'placement' ? 4 : 6)
    : (phase === 'placement' ? 8 : 12);

  // Victoire immédiate
  for (const move of moves) {
    const nextBoard = simulateMove(board, move, player);
    if (WINNING_COMBINATIONS.some(c => c.every(i => nextBoard[i] === player))) {
      return move;
    }
  }

  // Blocage immédiat de l'adversaire
  const opponentMoves = getLegalMoves(board, opponent, phase);
  for (const hMove of opponentMoves) {
    const nextBoard = simulateMove(board, hMove, opponent);
    if (WINNING_COMBINATIONS.some(c => c.every(i => nextBoard[i] === opponent))) {
      if (phase === 'placement') {
        const block = moves.find(m => m.to === hMove.to);
        if (block) return block;
      }
    }
  }

  // Alpha-Beta principal
  let bestMove: Move | null = null;
  let bestValue = player === 'O' ? -Infinity : Infinity;

  for (const move of moves) {
    const nextBoard = simulateMove(board, move, player);
    const moveValue = alphaBeta(
      nextBoard, 0, -Infinity, Infinity,
      player !== 'O', // si le joueur courant est O, le prochain nœud est minimisant
      phase,
      phase === 'placement' ? pionsPlaces + 1 : pionsPlaces,
      maxDepth
    );

    if (player === 'O' ? moveValue > bestValue : moveValue < bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove || moves[0];
};