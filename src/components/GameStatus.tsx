import type { Player, GamePhase, GameMode, Difficulty } from '../game/type';

interface Props {
  winner: Player | null;
  currentPlayer: Player;
  gameMode: GameMode;
  difficulty: Difficulty;
  phase: GamePhase;
  pionsPlaces: number;
  scores: { X: number; O: number };
  getPlayerName: (p: Player) => string;
  isAITurn: boolean;
}

export default function GameStatus({
  winner, currentPlayer, gameMode, difficulty,
  phase, pionsPlaces, scores, getPlayerName, isAITurn,
}: Props) {
  const phaseLabel = phase === 'placement'
    ? `Placement (${pionsPlaces}/6 pions posés)`
    : 'Mouvement';

  const playerLabel = getPlayerName(currentPlayer);
  const playerColor = currentPlayer === 'X'
    ? 'text-amber-100 bg-amber-800/40'
    : 'text-stone-100 bg-stone-700/40';

  return (
    <div className="w-full max-w-md mt-4 space-y-3">
      {/* Scores */}
      <div className="flex justify-between items-center bg-black/20 rounded-xl px-4 py-2">
        <div className="text-center">
          <div className="text-xs text-amber-300/70 uppercase tracking-wider">
            {getPlayerName('X')}
          </div>
          <div className="text-3xl font-bold text-amber-100">{scores.X}</div>
        </div>
        <div className="text-amber-400/50 text-xl font-light">vs</div>
        <div className="text-center">
          <div className="text-xs text-amber-300/70 uppercase tracking-wider">
            {getPlayerName('O')}
          </div>
          <div className="text-3xl font-bold text-amber-100">{scores.O}</div>
        </div>
      </div>

      {/* Statut courant */}
      {winner ? (
        <div className="text-center bg-amber-500/20 border border-amber-400/40 rounded-xl py-3 px-4">
          <div className="text-2xl font-bold text-amber-300">
            🏆 {getPlayerName(winner)} gagne !
          </div>
        </div>
      ) : (
        <div className={`flex items-center justify-between rounded-xl px-4 py-2 ${playerColor}`}>
          <span className="text-sm opacity-70">{phaseLabel}</span>
          <span className="text-sm font-semibold">
            {isAITurn ? 'IA réfléchit…' : `▶ ${playerLabel}`}
          </span>
        </div>
      )}
    </div>
  );
}