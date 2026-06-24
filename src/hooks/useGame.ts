import { useState, useEffect, useCallback, useRef } from 'react';
import type { Board, Player, GamePhase, Move, GameMode, Difficulty, HistoryEntry } from '../game/type';
import { INITIAL_BOARD, WINNING_COMBINATIONS } from '../game/Constants';
import { getLegalMoves, simulateMove, isAdjacent } from '../game/gameUtils';
import { getBestMove } from '../ai/AlphaBeta';

const checkWin = (b: Board, p: Player) =>
  WINNING_COMBINATIONS.some(c => c.every(i => b[i] === p));

export function useGame() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [phase, setPhase] = useState<GamePhase>('placement');
  const [pionsPlaces, setPionsPlaces] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  const [gameMode, setGameMode] = useState<GameMode>('hvia');
  const [difficulty, setDifficulty] = useState<Difficulty>('difficile');

  // Historique pour Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);

  // Scores
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const aiDemoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToHistory = useCallback((entry: HistoryEntry) => {
    setHistory(h => [...h, entry]);
    setFuture([]);
  }, []);

  const resetGame = useCallback(() => {
    if (aiDemoRef.current) clearTimeout(aiDemoRef.current);
    setBoard(INITIAL_BOARD);
    setPhase('placement');
    setPionsPlaces(0);
    setCurrentPlayer('X');
    setSelectedPiece(null);
    setWinner(null);
    setHistory([]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [{ board, phase, pionsPlaces, currentPlayer, selectedPiece, winner }, ...f]);
    setBoard(prev.board);
    setPhase(prev.phase);
    setPionsPlaces(prev.pionsPlaces);
    setCurrentPlayer(prev.currentPlayer);
    setSelectedPiece(prev.selectedPiece);
    setWinner(prev.winner);
    setHistory(h => h.slice(0, -1));
  }, [history, board, phase, pionsPlaces, currentPlayer, selectedPiece, winner]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, { board, phase, pionsPlaces, currentPlayer, selectedPiece, winner }]);
    setBoard(next.board);
    setPhase(next.phase);
    setPionsPlaces(next.pionsPlaces);
    setCurrentPlayer(next.currentPlayer);
    setSelectedPiece(next.selectedPiece);
    setWinner(next.winner);
    setFuture(f => f.slice(1));
  }, [future, board, phase, pionsPlaces, currentPlayer, selectedPiece, winner]);

  // Détermine si c'est le tour de l'IA
  const isAITurn = useCallback(() => {
    if (winner) return false;
    if (gameMode === 'iavia') return true;
    if (gameMode === 'hvia' && currentPlayer === 'O') return true;
    return false;
  }, [gameMode, currentPlayer, winner]);

  const applyMove = useCallback((
    b: Board, move: Move, player: Player, pp: number, ph: GamePhase
  ) => {
    saveToHistory({ board: b, phase: ph, pionsPlaces: pp, currentPlayer: player, selectedPiece: null, winner: null });

    const newBoard = simulateMove(b, move, player);
    setBoard(newBoard);
    setSelectedPiece(null);

    if (checkWin(newBoard, player)) {
      setWinner(player);
      setScores(s => ({ ...s, [player]: s[player] + 1 }));
      return;
    }

    const next = ph === 'placement' ? pp + 1 : pp;
    if (ph === 'placement') setPionsPlaces(next);
    if (ph === 'placement' && next === 6) setPhase('mouvement');

    setCurrentPlayer(player === 'X' ? 'O' : 'X');
  }, [saveToHistory]);

  const handleCellClick = useCallback((index: number) => {
    if (winner) return;
    if (isAITurn()) return;

    if (phase === 'placement') {
      if (board[index]) return;
      applyMove(board, { from: null, to: index }, currentPlayer, pionsPlaces, phase);
      return;
    }

    // Phase mouvement
    if (selectedPiece === null) {
      if (board[index] === currentPlayer) setSelectedPiece(index);
      return;
    }

    if (selectedPiece === index) {
      setSelectedPiece(null);
      return;
    }

    // Re-sélection d'une autre pièce du même joueur
    if (board[index] === currentPlayer) {
      setSelectedPiece(index);
      return;
    }

    if (board[index] === null && isAdjacent(selectedPiece, index)) {
      applyMove(board, { from: selectedPiece, to: index }, currentPlayer, pionsPlaces, phase);
    } else {
      setSelectedPiece(null);
    }
  }, [winner, isAITurn, phase, board, currentPlayer, selectedPiece, pionsPlaces, applyMove]);

  // Tour IA (HvIA ou IA vs IA)
  useEffect(() => {
    if (!isAITurn()) return;

    const delay = gameMode === 'iavia' ? 800 : 600;
    const aiPlayer: Player = gameMode === 'iavia' ? currentPlayer : 'O';

    const timer = setTimeout(() => {
      const moves = getLegalMoves(board, aiPlayer, phase);
      if (!moves.length) {
        setCurrentPlayer(aiPlayer === 'X' ? 'O' : 'X');
        return;
      }

      const move = getBestMove(board, phase, pionsPlaces, difficulty, aiPlayer);
      if (!move) return;

      applyMove(board, move, aiPlayer, pionsPlaces, phase);
    }, delay);

    aiDemoRef.current = timer;
    return () => clearTimeout(timer);
  }, [currentPlayer, board, isAITurn, gameMode, difficulty, phase, pionsPlaces, applyMove]);

  // Noms des joueurs selon le mode
  const getPlayerName = (p: Player): string => {
    if (gameMode === 'hvh') return `Joueur ${p}`;
    if (gameMode === 'hvia') return p === 'X' ? 'Joueur' : `IA (${difficulty})`;
    return p === 'X' ? `IA X (${difficulty})` : `IA O (${difficulty})`;
  };

  const legalMovesForSelected = selectedPiece !== null && phase === 'mouvement'
    ? getLegalMoves(board, currentPlayer, phase)
        .filter(m => m.from === selectedPiece)
        .map(m => m.to)
    : [];

  return {
    board, phase, pionsPlaces, currentPlayer, selectedPiece,
    winner, gameMode, difficulty, scores,
    history, future,
    legalMovesForSelected,
    isAITurn: isAITurn(),
    setGameMode, setDifficulty,
    handleCellClick, resetGame, undo, redo,
    getPlayerName,
  };
}