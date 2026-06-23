import  { useState, useEffect } from 'react';
import type { Board, Player, GamePhase } from './game/type';
import { ADJACENCY_LIST, WINNING_COMBINATIONS, INITIAL_BOARD } from './game/Constants';
import { getLegalMoves, simulateMove } from './game/gameUtils';
import { getBestMove } from './ai/AlphaBeta';

export default function FanoronTelo() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [phase, setPhase] = useState<GamePhase>('placement');
  const [pionsPlaces, setPionsPlaces] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X'); // 'X' est l'Humain et commence
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  
  // États de configuration du jeu
  const [isVsIA, setIsVsIA] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<'facile' | 'difficile'>('difficile');

  //  vérification de victoire
  const checkWin = (currentBoard: Board, player: Player): boolean => {
    return WINNING_COMBINATIONS.some(combination =>
      combination.every(index => currentBoard[index] === player)
    );
  };

  // gestion de tour ia ---
  useEffect(() => {
    if (!isVsIA || currentPlayer !== 'O' || winner) return;

    const timer = setTimeout(() => {
      const legalMoves = getLegalMoves(board, 'O', phase);

      if (legalMoves.length === 0) {
        // Si IA n'a aucun coup possible, elle passe son tour
        setCurrentPlayer('X');
        return;
      }

      let chosenMove = null;

      if (difficulty === 'facile') {
        // ia facile 
        const randomIndex = Math.floor(Math.random() * legalMoves.length);
        chosenMove = legalMoves[randomIndex];
      } else {
        //  Alpha-Beta ---
        chosenMove = getBestMove(board, phase, pionsPlaces);
      }

      // si aucun coup n'est retourné par l'Alpha-Beta
      if (!chosenMove) {
        chosenMove = legalMoves[0];
      }

      // Appliquer le coup choisi
      const newBoard = simulateMove(board, chosenMove, 'O');
      setBoard(newBoard);

      if (checkWin(newBoard, 'O')) {
        setWinner('O');
        return;
      }

      // Si nous sommes en phase de placement, mettre à jour le compteur
      if (phase === 'placement') {
        const nextCount = pionsPlaces + 1;
        setPionsPlaces(nextCount);
        if (nextCount === 6) {
          setPhase('mouvement');
        }
      }

      // Redonner la main au joueur humain
      setCurrentPlayer('X');
    }, 600); // temps de latence visuelle

    return () => clearTimeout(timer);
  }, [currentPlayer, phase, board, winner, isVsIA, pionsPlaces, difficulty]);


  // gestion de clics jouer humain ---
  const handleCellClick = (index: number): void => {
    if (winner) return;
    if (isVsIA && currentPlayer === 'O') return; // Bloquer les clics pendant le tour de l'ia

    // Phase 1 : Placement
    if (phase === 'placement') {
      if (board[index] !== null) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      if (checkWin(newBoard, currentPlayer)) {
        setWinner(currentPlayer);
        return;
      }

      const nextCount = pionsPlaces + 1;
      setPionsPlaces(nextCount);
      if (nextCount === 6) {
        setPhase('mouvement');
      }

      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    } 
    // Phase 2 : Mouvement ----
    else {
      if (selectedPiece === null) {
        if (board[index] === currentPlayer) {
          setSelectedPiece(index);
        }
      } else {
        const isAdjacent = ADJACENCY_LIST[selectedPiece].includes(index);
        
        if (board[index] === null && isAdjacent) {
          const newBoard = simulateMove(board, { from: selectedPiece, to: index }, currentPlayer);
          setBoard(newBoard);
          setSelectedPiece(null);

          if (checkWin(newBoard, currentPlayer)) {
            setWinner(currentPlayer);
            return;
          }

          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        } else {
          if (board[index] === currentPlayer) {
            setSelectedPiece(index);
          } else {
            setSelectedPiece(null);
          }
        }
      }
    }
  };

  const resetGame = (): void => {
    setBoard(INITIAL_BOARD);
    setPhase('placement');
    setPionsPlaces(0);
    setCurrentPlayer('X');
    setSelectedPiece(null);
    setWinner(null);
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', marginTop: '20px', color: '#333' }}>
      <h1>Fanoron-telo </h1>
      
    
      <div style={{ 
        backgroundColor: '#f1f3f5', 
        padding: '15px', 
        borderRadius: '8px', 
        maxWidth: '400px', 
        margin: '0 auto 20px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <label style={{ cursor: 'pointer', userSelect: 'none', fontWeight: 'bold' }}>
          <input 
            type="checkbox" 
            checked={isVsIA} 
            onChange={(e) => { setIsVsIA(e.target.checked); resetGame(); }} 
            style={{ marginRight: '8px' }}
          />
          Mode Humain vs IA
        </label>

        {isVsIA && (
          <div style={{ marginTop: '5px' }}>
            <span style={{ marginRight: '10px', fontSize: '14px' }}>Difficulté :</span>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as 'facile' | 'difficile')}
              style={{ padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              <option value="facile">Facile (Aléatoire)</option>
              <option value="difficile">Difficile (Alpha-Beta)</option>
            </select>
          </div>
        )}
      </div>

      {/* Affichage des  états */}
      {winner ? (
        <h2 style={{ color: winner === 'X' ? '#2b8a3e' : '#c92a2a' }}>
          {isVsIA && winner === 'O' ? '🤖 L\'IA a gagné !' : `🎉 Le Joueur ${winner} a gagné !`}
        </h2>
      ) : (
        <h3>
          Phase : <span style={{ color: '#e8590c' }}>{phase.toUpperCase()}</span> | {' '}
          Tour : <span style={{ color: currentPlayer === 'X' ? '#1c7ed6' : '#e03131' }}>
            {isVsIA && currentPlayer === 'O' ? `🤖 IA (${difficulty.toUpperCase()})...` : `Joueur ${currentPlayer}`}
          </span>
        </h3>
      )}

     
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 90px)',
        gap: '15px',
        justifyContent: 'center',
        margin: '25px auto',
        backgroundColor: '#e9ecef',
        padding: '20px',
        borderRadius: '16px',
        width: 'max-content',
        boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
      }}>
        {board.map((cell, index) => {
          let bgColor = '#fff';
          if (selectedPiece === index) bgColor = '#ffe066'; 

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={winner !== null || (isVsIA && currentPlayer === 'O')}
              style={{
                width: '90px',
                height: '90px',
                fontSize: '32px',
                fontWeight: 'bold',
                color: cell === 'X' ? '#1c7ed6' : '#e03131',
                backgroundColor: bgColor,
                border: '2px solid #495057',
                borderRadius: '12px',
                cursor: (isVsIA && currentPlayer === 'O') ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <button 
        onClick={resetGame} 
        style={{ 
          padding: '12px 28px', 
          fontSize: '16px', 
          fontWeight: 'bold', 
          backgroundColor: '#212529', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer' 
        }}
      >
        Nouvelle Partie 
      </button>
    </div>
  );
}