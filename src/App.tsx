import { useGame } from './hooks/useGame';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import GameSettings from './components/GameSettings';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const {
    board, phase, pionsPlaces, currentPlayer, selectedPiece,
    winner, gameMode, difficulty, scores,
    history, future, legalMovesForSelected, isAITurn,
    setGameMode, setDifficulty,
    handleCellClick, resetGame, undo, redo,
    getPlayerName,
  } = useGame();

  return (
    <div
      className="min-h-screen flex flex-col items-center pb-10 px-4"
      style={{
        background: 'radial-gradient(ellipse at top, #d16931 0%, #c47449 50%, #af633d 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* En-tête */}
      <header className="text-center mt-8 mb-2">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          Fanoron-telo
        </h1>
        <p className="text-amber-400/60 text-xs mt-1 tracking-widest uppercase">
          Jeu traditionnel malgache · IA Alpha-Beta
        </p>
      </header>

      {/* Paramètres */}
      <GameSettings
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
      />

      {/* Statut + scores */}
      <GameStatus
        winner={winner}
        currentPlayer={currentPlayer}
        gameMode={gameMode}
        difficulty={difficulty}
        phase={phase}
        pionsPlaces={pionsPlaces}
        scores={scores}
        getPlayerName={getPlayerName}
        isAITurn={isAITurn}
      />

      {/* Plateau */}
      <div className="w-full max-w-md">
        <GameBoard
          board={board}
          selectedPiece={selectedPiece}
          handleCellClick={handleCellClick}
          winner={winner}
          currentPlayer={currentPlayer}
          isAITurn={isAITurn}
          legalMovesForSelected={legalMovesForSelected}
        />
      </div>

      {/* Contrôles */}
      <ControlPanel
        resetGame={resetGame}
        undo={undo}
        redo={redo}
        canUndo={history.length > 0 && !isAITurn}
        canRedo={future.length > 0 && !isAITurn}
        winner={!!winner}
      />

      {/* Aide règles */}
      <details className="w-full max-w-md mt-6 bg-black/20 rounded-xl border border-amber-400/10">
        <summary className="px-4 py-3 text-amber-300/70 text-sm cursor-pointer select-none hover:text-amber-300 transition">
           Règles du jeu
        </summary>
        <div className="px-4 pb-4 text-amber-200/60 text-xs space-y-2">
          <p><strong className="text-amber-300">Phase 1 — Placement :</strong> Chaque joueur pose à tour de rôle un pion sur une intersection libre. Si un joueur aligne 3 pions (ligne, colonne ou diagonale), il gagne immédiatement.</p>
          <p><strong className="text-amber-300">Phase 2 — Mouvement :</strong> Après 6 pions posés (sans gagnant), chaque joueur déplace un de ses pions vers une intersection adjacente libre. Le premier à aligner 3 pions gagne.</p>
          <p className="text-amber-400/40">Les pions se déplacent uniquement le long des lignes tracées sur le plateau.</p>
        </div>
      </details>
    </div>
  );
}