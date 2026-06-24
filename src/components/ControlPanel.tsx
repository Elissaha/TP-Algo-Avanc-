interface Props {
  resetGame: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  winner: boolean;
}

export default function ControlPanel({ resetGame, undo, redo, canUndo, canRedo, winner }: Props) {
  return (
    <div className="flex items-center gap-3 mt-5">
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Annuler (Undo)"
        className="
          flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
          bg-white/10 hover:bg-white/20 text-amber-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all active:scale-95
        "
      >
        ↩ Annuler
      </button>

      <button
        onClick={resetGame}
        className="
          px-5 py-2 rounded-xl text-sm font-bold
          bg-amber-600 hover:bg-amber-500 text-white
          shadow-lg shadow-amber-900/40
          transition-all active:scale-95
        "
      >
        {winner ? '🎮 Rejouer' : '↺ Recommencer'}
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        title="Rétablir (Redo)"
        className="
          flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
          bg-white/10 hover:bg-white/20 text-amber-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all active:scale-95
        "
      >
        Rétablir ↪
      </button>
    </div>
  );
}