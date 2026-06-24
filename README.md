# Fanoron-telo avec IA — Hackathon Algorithmique Avancée

[![ISPM](https://img.shields.io/badge/Institut-ISPM-green?style=flat-square)](https://www.ispm-edu.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev)

---

## Section 1 — En-tête Institutionnel et Identification

**Institut :** Institut Supérieur Polytechnique de Madagascar (ISPM) (https://www.ispm-edu.com)

**Matière :** Algorithmique Avancée — Travaux Pratiques (5h, Documents autorisés)

**Thème :** Fanoron-telo avec Intelligence Artificielle (algorithme Alpha-Beta)

**Groupe de projet :** DEV TEAM
RAMANANTENASOA Elissaha numéro:42
RASOARIJAONA Volatiana Zoé numéro:43
RABEARISOA Heriniaina Liantsoa numéro:44
RAVALISON Fanevampifaliana Josia numéro:56
RANARISON Haingoniaiko Lucka numéro:60

---

## Section 2 — Description du Projet

Le **Fanoron-telo** est un jeu de société traditionnel malgache joué sur un plateau de 3×3 intersections connectées. Ce projet implémente une version numérique complète du jeu avec une IA adversaire basée sur l'algorithme **Alpha-Beta** (variante optimisée du MiniMax).

### Fonctionnalités implémentées

| Priorité | Fonctionnalité                                | Statut |
| -------- | --------------------------------------------- | ------ |
| P1       | Mode Humain vs Humain (local)                 | ✅     |
| P1       | Mode Humain vs IA                             | ✅     |
| P1       | Niveau Facile (aléatoire)                     | ✅     |
| P1       | Niveau Moyen (Alpha-Beta depth 4)             | ✅     |
| P1       | Gestion robuste des règles (Phase 1 & 2)      | ✅     |
| P2       | Mode IA vs IA (démo)                          | ✅     |
| P2       | IA Difficile (Alpha-Beta optimisé depth 8–12) | ✅     |
| P2       | Table de transposition (mémoïsation)          | ✅     |
| P2       | Tri des coups (move ordering)                 | ✅     |
| P3       | Undo / Redo                                   | ✅     |
| P3       | Tableau des scores                            | ✅     |
| P3       | Surlignage des mouvements légaux              | ✅     |
| P3       | Design responsive & plateau SVG authentique   | ✅     |

---

## Section 3 — Architecture Technique

```
src/
├── ai/
│   └── AlphaBeta.ts        # Algorithme Alpha-Beta + évaluation heuristique
├── components/
│   ├── GameBoard.tsx        # Plateau SVG avec lignes et pions
│   ├── GameSettings.tsx     # Sélection mode et difficulté
│   ├── GameStatus.tsx       # Scores et statut du tour
│   └── ControlPanel.tsx     # Undo / Redo / Rejouer
├── game/
│   ├── Constants.ts         # ADJACENCY_LIST, WINNING_COMBINATIONS
│   ├── gameUtils.ts         # getLegalMoves, simulateMove, isAdjacent
│   └── type.ts              # Types TypeScript
├── hooks/
│   └── useGame.ts           # Logique centralisée + Undo/Redo stack
└── App.tsx                  # Composant racine
```

### Algorithme Alpha-Beta

L'IA utilise une recherche **Alpha-Beta** avec les optimisations suivantes :

- **Table de transposition** : mémoïsation des états déjà évalués
- **Move ordering** : tri des coups par score heuristique avant la recherche
- **Profondeur adaptative** : depth 4–6 en phase placement, 6–12 en phase mouvement
- **Heuristique d'évaluation** : valorisation du centre, analyse des lignes presque complètes, blocage immédiat

---

## Section 4 — Installation et Démarrage

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/Elissaha/TP-Algo-Avanc-.git
cd TP-Algo-Avanc-
npm install
```

### Développement local

```bash
npm run dev
# → http://localhost:5173
```

### Build de production

```bash
npm run build
npm run preview
```

---

## Section 5 — Déploiement en ligne

L'application est déployée et accessible à l'adresse suivante :

**🔗 [https://fanoron-telo.vercel.app](https://fanoron-telo.vercel.app)**

### Procédure de déploiement (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Ou via GitHub : connecter le dépôt à [vercel.com](https://vercel.com), le déploiement est automatique à chaque push sur `main`.

---

## Section 6 — Analyse de l'IA et Choix Algorithmiques

### Pourquoi Alpha-Beta ?

Le MiniMax pur explore tous les nœuds de l'arbre de jeu. Pour le Fanoron-telo, le facteur de branchement en phase mouvement peut atteindre ~12 coups. L'élagage Alpha-Beta élimine les branches inutiles, réduisant la complexité de **O(b^d)** à **O(b^(d/2))** dans le cas idéal — permettant d'atteindre une profondeur deux fois supérieure dans le même temps.

### Heuristique d'évaluation

```
score = +10000 si IA gagne
      = -10000 si humain gagne
      + 30 si IA occupe le centre (case 4)
      - 30 si humain occupe le centre
      + 100 par ligne avec 2 pions IA + 1 case vide
      - 100 par ligne avec 2 pions humain + 1 case vide
      + 10 / - 10 pour les lignes avec 1 pion
```

### Gestion des phases

La profondeur est ajustée dynamiquement :

- **Placement** : depth max 8 (espace de recherche plus contraint)
- **Mouvement** : depth max 12 (plus de combinaisons, IA plus forte)

---

_Hackathon ISPM · Algorithmique Avancée · Fanoron-telo IA_
