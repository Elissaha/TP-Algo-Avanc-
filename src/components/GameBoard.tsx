import type { Board, Player } from '../game/type';

interface Props {
  board: Board;
  selectedPiece: number | null;
  handleCellClick: (i: number) => void;
  winner: Player | null;
  currentPlayer: Player;
  isAITurn: boolean;
  legalMovesForSelected: number[];
}

const POSITIONS = [
  { cx: 100, cy: 100 },
  { cx: 250, cy: 100 },
  { cx: 400, cy: 100 },
  { cx: 100, cy: 250 },
  { cx: 250, cy: 250 },
  { cx: 400, cy: 250 },
  { cx: 100, cy: 400 },
  { cx: 250, cy: 400 },
  { cx: 400, cy: 400 },
];

// Toutes les arêtes du Fanoron-telo (selon ADJACENCY_LIST sans doublons)
const EDGES: [number, number][] = [
  [0,1],[1,2],[3,4],[4,5],[6,7],[7,8],   // lignes horizontales
  [0,3],[3,6],[1,4],[4,7],[2,5],[5,8],   // lignes verticales
  [0,4],[4,8],[2,4],[4,6],               // diagonales
  [0,3],[1,4],[2,5],[3,6],[4,7],[5,8],   // déjà inclus mais ok
].filter((e, i, arr) =>
  arr.findIndex(a => (a[0]===e[0]&&a[1]===e[1])||(a[0]===e[1]&&a[1]===e[0])) === i
);

export default function GameBoard({
  board, selectedPiece, handleCellClick, winner,
  currentPlayer, isAITurn, legalMovesForSelected,
}: Props) {
  return (
    <div className="flex justify-center mt-6">
      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md drop-shadow-2xl"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Fond du plateau */}
        <rect x="40" y="40" width="420" height="420" rx="20"
          fill="#92400e" stroke="#78350f" strokeWidth="4" />

        {/* Texture bois subtile */}
        <defs>
          <filter id="wood">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blend"/>
            <feComposite in="blend" in2="SourceGraphic" operator="in"/>
          </filter>
          <radialGradient id="cellX" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#f5f5f5"/>
            <stop offset="100%" stopColor="#d4d4d4"/>
          </radialGradient>
          <radialGradient id="cellO" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1c1917"/>
            <stop offset="100%" stopColor="#0c0a09"/>
          </radialGradient>
          <radialGradient id="cellEmpty" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="100%" stopColor="#fde68a"/>
          </radialGradient>
        </defs>

        {/* Lignes du plateau */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={POSITIONS[a].cx} y1={POSITIONS[a].cy}
            x2={POSITIONS[b].cx} y2={POSITIONS[b].cy}
            stroke="#fde68a" strokeWidth="3" strokeLinecap="round"
            opacity="0.8"
          />
        ))}

        {/* Cases jouables (cibles légales surlignées) */}
        {legalMovesForSelected.map(i => (
          <circle
            key={`hint-${i}`}
            cx={POSITIONS[i].cx} cy={POSITIONS[i].cy}
            r="30"
            fill="rgba(250,204,21,0.35)"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        ))}

        {/* Pions */}
        {board.map((cell, i) => {
          const { cx, cy } = POSITIONS[i];
          const isSelected = selectedPiece === i;
          const isLegal = legalMovesForSelected.includes(i);
          const isEmpty = cell === null;
          const canInteract = !winner && !isAITurn;

          return (
            <g key={i} style={{ cursor: canInteract ? 'pointer' : 'default' }}
              onClick={() => handleCellClick(i)}>
              {/* Halo de sélection */}
              {isSelected && (
                <circle cx={cx} cy={cy} r="36"
                  fill="none" stroke="#fcd34d" strokeWidth="3"
                  strokeDasharray="6 3">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
                    dur="2s" repeatCount="indefinite"/>
                </circle>
              )}

              {/* Ombre du pion */}
              {!isEmpty && (
                <ellipse cx={cx + 3} cy={cy + 5} rx="22" ry="8"
                  fill="rgba(0,0,0,0.3)" />
              )}

              {/* Pion ou intersection vide */}
              <circle
                cx={cx} cy={cy} r={isEmpty ? 14 : 26}
                fill={
                  isEmpty
                    ? isLegal ? 'rgba(250,204,21,0.2)' : 'rgba(254,243,199,0.15)'
                    : cell === 'X' ? 'url(#cellX)' : 'url(#cellO)'
                }
                stroke={
                  isEmpty
                    ? isLegal ? '#fbbf24' : '#92400e'
                    : isSelected ? '#fcd34d' : cell === 'X' ? '#9ca3af' : '#44403c'
                }
                strokeWidth={isEmpty ? 2 : 3}
              />

              {/* Reflet sur pion */}
              {!isEmpty && (
                <ellipse
                  cx={cx - 7} cy={cy - 9} rx="7" ry="5"
                  fill={cell === 'X' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)'}
                />
              )}

              {/* Label du pion */}
              {!isEmpty && (
                <text
                  x={cx} y={cy + 6}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill={cell === 'X' ? '#1c1917' : '#fef3c7'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {cell}
                </text>
              )}
            </g>
          );
        })}

        {/* Indicateur "IA réfléchit" */}
        {isAITurn && !winner && (
          <g>
            <rect x="150" y="460" width="200" height="28" rx="14"
              fill="rgba(0,0,0,0.4)"/>
            <text x="250" y="479" textAnchor="middle"
              fontSize="13" fill="#fcd34d" fontFamily="system-ui">
              🤖 IA réfléchit…
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}