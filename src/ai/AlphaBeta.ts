import type { Board, Player, GamePhase, Move } from '../game/type';
import { WINNING_COMBINATIONS } from '../game/Constants';
import { getLegalMoves, simulateMove } from '../game/gameUtils';


 // Vérification  de victoire
 
const checkWinCondition = (board: Board, player: Player): boolean => {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => board[index] === player)
  );
};


const evaluateBoard = (board: Board): number => {
  if (checkWinCondition(board, 'O')) return 10000;
  if (checkWinCondition(board, 'X')) return -10000;

  let score = 0;

  // Valorisation stratégique du centre 
  if (board[4] === 'O') score += 30;
  if (board[4] === 'X') score -= 30;

  // Analyse des lignes et combinaisons potentielles
  for (const line of WINNING_COMBINATIONS) {
    let oCount = 0;
    let xCount = 0;
    let emptyCount = 0;

    for (const pos of line) {
      if (board[pos] === 'O') oCount++;
      else if (board[pos] === 'X') xCount++;
      else emptyCount++;
    }

    // IA proche de gagner ou menant la ligne
    if (oCount === 2 && emptyCount === 1) score += 100;
    if (oCount === 1 && emptyCount === 2) score += 10;

    // Humain proche de gagner  ou menant la ligne
    if (xCount === 2 && emptyCount === 1) score -= 100;
    if (xCount === 1 && emptyCount === 2) score -= 10;
  }

  return score;
};

//  réinitialisée à chaque coup
const transpositionTable = new Map<string, number>();

function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  phase: GamePhase,
  pionsPlaces: number
): number {
  // Clé de transposition unique pour le cache
  const cacheKey = `${board.join('')}_${phase}_${isMaximizing}_${pionsPlaces}`;
  if (transpositionTable.has(cacheKey)) {
    return transpositionTable.get(cacheKey)!;
  }

  const score = evaluateBoard(board);

  // Conditions d'arrêt d
  if (score === 10000) return score - depth; //  le chemin le plus court
  if (score === -10000) return score + depth; //  retarder la défaite

  //  profondeur variable selon la phase
  const MAX_DEPTH = phase === 'placement' ? 8 : 12;
  if (depth >= MAX_DEPTH) {
    return score;
  }

  //  gestion de phase simulée
  let currentSimulatedPhase = phase;
  if (phase === 'placement' && pionsPlaces >= 6) {
    currentSimulatedPhase = 'mouvement';
  }

  const activePlayer: Player = isMaximizing ? 'O' : 'X';
  const moves = getLegalMoves(board, activePlayer, currentSimulatedPhase);

  if (moves.length === 0) return 0; // match nul ou blocage 

  // Tri des coups 
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
        nextBoard,
        depth + 1,
        alpha,
        beta,
        false,
        currentSimulatedPhase, 
        phase === 'placement' ? pionsPlaces + 1 : pionsPlaces
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Coupure Beta
    }
    result = maxEval;
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const nextBoard = simulateMove(board, move, 'X');
      const evaluation = alphaBeta(
        nextBoard,
        depth + 1,
        alpha,
        beta,
        true,
        currentSimulatedPhase, 
        phase === 'placement' ? pionsPlaces + 1 : pionsPlaces
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Coupure Alpha
    }
    result = minEval;
  }

  // Enregistrement du résultat calculé dans la table de transposition
  transpositionTable.set(cacheKey, result);
  return result;
}


 // Fonction principale de prise de décision de l'IA 

export const getBestMove = (board: Board, phase: GamePhase, pionsPlaces: number): Move | null => {

  transpositionTable.clear();

  const moves = getLegalMoves(board, 'O', phase);
  if (moves.length === 0) return null;


  for (const move of moves) {
    const nextBoard = simulateMove(board, move, 'O');
    if (checkWinCondition(nextBoard, 'O')) {
      return move;
    }
  }
  
  const immediateHumanMoves = getLegalMoves(board, 'X', phase);
  const winningHumanMoves = immediateHumanMoves.filter(hMove => 
    checkWinCondition(simulateMove(board, hMove, 'X'), 'X')
  );


  if (winningHumanMoves.length > 0) {
    // Si on est en phase de placement, l'ia doiut placer son pion sur la case visée par l'humain
    if (phase === 'placement') {
      const targetCell = winningHumanMoves[0].to;
      const blockingMove = moves.find(m => m.to === targetCell);
      if (blockingMove) return blockingMove;
    } 
    // phase mouvement, on cherche le coup qui bloque la trajectoire
    else {
      // On laisse Alpha-Beta gérer la priorité 
    }
  }

  // Lancement de la recherche principale Alpha-Beta 
  let bestMove: Move | null = null;
  let bestValue = -Infinity;

  for (const move of moves) {
    const nextBoard = simulateMove(board, move, 'O');
    const moveValue = alphaBeta(
      nextBoard,
      0,
      -Infinity,
      Infinity,
      false,
      phase,
      phase === 'placement' ? pionsPlaces + 1 : pionsPlaces
    );

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }


  return bestMove || moves[0];
};