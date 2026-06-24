import type { GameMode, Difficulty } from '../game/type';

interface Props {
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  resetGame: () => void;
}

const MODES: { value: GameMode; label: string; icon: string }[] = [
  { value: 'hvh',   label: 'Humain vs Humain', icon: '👥' },
  { value: 'hvia',  label: 'Humain vs IA',     icon: '🤖' },
  { value: 'iavia', label: 'IA vs IA (Démo)',  icon: '🎬' },
];

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'facile',    label: 'Facile',    color: 'bg-green-600 hover:bg-green-500' },
  { value: 'moyen',     label: 'Moyen',     color: 'bg-yellow-600 hover:bg-yellow-500' },
  { value: 'difficile', label: 'Difficile', color: 'bg-red-700 hover:bg-red-600' },
];

export default function GameSettings({
  gameMode, setGameMode, difficulty, setDifficulty, resetGame,
}: Props) {
  const showDifficulty = gameMode !== 'hvh';

  return (
    <div className="w-full max-w-md mt-4 bg-black/20 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-4 space-y-3">
      {/* Mode de jeu */}
      <div>
        <p className="text-xs text-amber-300/60 uppercase tracking-wider mb-2">Mode de jeu</p>
        <div className="flex flex-col gap-1.5">
          {MODES.map(m => (
            <button
              key={m.value}
              onClick={() => { setGameMode(m.value); resetGame(); }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${gameMode === m.value
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                  : 'bg-white/5 text-amber-200 hover:bg-white/10'}
              `}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Niveau de difficulté */}
      {showDifficulty && (
        <div>
          <p className="text-xs text-amber-300/60 uppercase tracking-wider mb-2">Niveau IA</p>
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => { setDifficulty(d.value); resetGame(); }}
                className={`
                  flex-1 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${difficulty === d.value
                    ? `${d.color} text-white ring-2 ring-white/30`
                    : 'bg-white/5 text-amber-200/60 hover:bg-white/10'}
                `}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}