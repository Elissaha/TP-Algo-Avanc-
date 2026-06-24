# Fanoron-telo avec IA — TP Algorithmique Avancée

[![ISPM](https://img.shields.io/badge/Institut-ISPM-green?style=flat-square)](https://www.ispm-edu.com)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Section 1 — En-tête Institutionnel et Identification

**Institut :** [Institut Supérieur Polytechnique de Madagascar (ISPM)](https://www.ispm-edu.com)

**Matière :** Algorithmique Avancée — Travaux Pratiques (5h, Documents autorisés)

**Thème :** Fanoron-telo avec Intelligence Artificielle (algorithme Alpha-Beta)

**Groupe de projet :** DEV TEAM

| Nom Complet | Numéro d'étudiant | Classe | Rôle précis pour ce TP |
|---|---|---|---|
| RAMANANTENSOA Elissaha | 42 | IGGLIA4 | Lead AI — Conception et implémentation de l'algorithme Alpha-Beta |
| RASOARIJAOANA Volatiana Zoé | 43 | IGGLIA4 | UI/UX Designer — Plateau SVG, design responsive, animations |
| RABEARISOA Heriniaina Liantsoa | 44 | IGGLIA4 | Backend Architect — Logique de jeu, gestion des phases, règles |
| RAVALISON Fanevampifaliana Josia | 56 | IGGLIA4 | Expert Optimisation — Table de transposition, move ordering |
| RANARISSON Haingoniaiko Lucka | 60 | IGGLIA4 | Lead DevOps — Déploiement Netlify, README, intégration Git |

---

## Section 2 — Description du Travail Réalisé

Le **Fanoron-telo** est un jeu de société traditionnel malgache joué sur un plateau de 3×3 intersections connectées. Ce projet implémente une version numérique complète du jeu avec une IA adversaire basée sur l'algorithme **Alpha-Beta** (variante optimisée du MiniMax).

### Application et fonctionnalités implémentées

| Priorité | Fonctionnalité | Statut |
|---|---|---|
| P1 | Mode Humain vs Humain (local) | ✅ |
| P1 | Mode Humain vs IA | ✅ |
| P1 | Niveau Facile (aléatoire pur) | ✅ |
| P1 | Niveau Moyen (Alpha-Beta depth 4–6) | ✅ |
| P1 | Gestion robuste des règles (Phase 1 & 2) | ✅ |
| P2 | Mode IA vs IA (démo automatique) | ✅ |
| P2 | IA Difficile (Alpha-Beta optimisé depth 8–12) | ✅ |
| P2 | Table de transposition (mémoïsation) | ✅ |
| P2 | Move ordering (tri heuristique des coups) | ✅ |
| P3 | Undo / Redo complet avec pile d'historique | ✅ |
| P3 | Tableau des scores persistant par session | ✅ |
| P3 | Surlignage des mouvements légaux | ✅ |
| P3 | Design responsive & plateau SVG authentique | ✅ |

### Architecture et pile technologique

```
src/
├── ai/
│   └── AlphaBeta.ts        # Algorithme Alpha-Beta + heuristique d'évaluation
├── components/
│   ├── GameBoard.tsx        # Plateau SVG avec lignes diagonales/orthogonales
│   ├── GameSettings.tsx     # Sélection mode et difficulté
│   ├── GameStatus.tsx       # Scores et statut du tour
│   └── ControlPanel.tsx     # Undo / Redo / Rejouer
├── game/
│   ├── Constants.ts         # ADJACENCY_LIST, WINNING_COMBINATIONS
│   ├── gameUtils.ts         # getLegalMoves, simulateMove, isAdjacent
│   └── type.ts              # Types TypeScript (Board, Player, Move…)
├── hooks/
│   └── useGame.ts           # Logique centralisée + pile Undo/Redo
└── App.tsx                  # Composant racine
```

**Stack technologique :**
- **React 19** + **TypeScript 6** — Interface et logique réactive typée
- **Vite 8** — Build ultra-rapide
- **Tailwind CSS 4** — Styles utilitaires responsive
- **Netlify** — Déploiement continu depuis GitHub

**Lien vers la version hébergée :** 🔗 [https://fanorin-telo-devteam.netlify.app/](https://fanorin-telo-devteam.netlify.app/)

---

## Section 3 — Guide d'Installation Rapide (3 Commandes Max)

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Installation et lancement

```bash
git clone https://github.com/Elissaha/TP-Algo-Avanc-.git
cd TP-Algo-Avanc-
npm install
npm run dev
```

L'application est accessible sur → **http://localhost:5173**

### Build de production

```bash
npm run build
npm run preview
```

---

## Section 4 — Outils d'Aide IA Utilisés

Notre équipe a utilisé ponctuellement des assistants IA comme **outils de support**, sans jamais leur déléguer la conception ou l'implémentation principale du projet. Tout le code, la logique de jeu et l'algorithme ont été écrits, compris et validés par les membres de l'équipe.

| Outil IA | Usages ponctuels |
|---|---|
| **Claude (Anthropic)** | Clarification de concepts (différence MiniMax / Alpha-Beta), aide à la rédaction du README |
| **GitHub Copilot** | Autocomplétion syntaxique dans l'éditeur (TypeScript/React), suggestions de noms de variables |
| **ChatGPT** | Vérification des règles officielles du Fanoron-telo, reformulation de commentaires de code |

### Retour d'expérience

- Les outils IA ont servi principalement à **gagner du temps sur des tâches non algorithmiques** : mise en forme, vérification syntaxique, recherche documentaire.
- **Toutes les décisions de conception** (structure de données du plateau, heuristique d'évaluation, gestion des phases, Undo/Redo) ont été réfléchies et implémentées par l'équipe.
- Les suggestions générées automatiquement (autocomplétion Copilot) ont toujours été relues et modifiées selon notre logique propre — notamment la gestion du comptage des pions et la transition de phase, que l'IA ne pouvait pas deviner sans contexte.
- **Apprentissage effectif garanti** : chaque membre a pu expliquer et défendre son code lors des échanges internes.

---

## Section 5 — Modélisation et Algorithmes de l'IA du Jeu

### Représentation de l'état du plateau

Le plateau 3×3 est représenté comme un **tableau plat de 9 cases** (`Board = (Player | null)[]`), indexé de 0 à 8 de gauche à droite, haut en bas :

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Les **lignes gagnantes** (orthogonales + diagonales) sont stockées dans une constante `WINNING_COMBINATIONS` :

```typescript
const WINNING_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],   // lignes horizontales
  [0,3,6], [1,4,7], [2,5,8],   // lignes verticales
  [0,4,8], [2,4,6]             // diagonales
];
```

La structure d'adjacence (`ADJACENCY_LIST`) encode les connexions légales entre cases pour la phase mouvement.

### Fonctionnement du Minimax et fonction d'évaluation

L'IA utilise une recherche **Alpha-Beta** (optimisation de MiniMax). À chaque nœud, la **fonction d'évaluation** calcule un score de position :

```
score = +10000  si l'IA (O) gagne
      = -10000  si l'humain (X) gagne
      + 30      si l'IA occupe le centre (case 4)
      - 30      si l'humain occupe le centre
      + 100     par ligne avec 2 pions IA + 1 case vide (menace immédiate)
      - 100     par ligne avec 2 pions humain + 1 case vide (à bloquer)
      + 10      par ligne avec 1 pion IA + 2 cases vides
      - 10      par ligne avec 1 pion humain + 2 cases vides
```

La profondeur de recherche est ajustée selon la difficulté et la phase :

| Difficulté | Phase Placement | Phase Mouvement |
|---|---|---|
| Facile | Aléatoire pur | Aléatoire pur |
| Moyen | depth 4 (50% Alpha-Beta) | depth 6 (50% Alpha-Beta) |
| Difficile | depth 8 | depth 12 |

### Techniques avancées utilisées

#### Table de transposition (mémoïsation)

```typescript
const transpositionTable = new Map<string, number>();
// Clé : `${board.join('')}_${phase}_${isMaximizing}_${pionsPlaces}`
```

Cette table évite de recalculer des positions de plateau déjà évaluées. Elle est vidée à chaque nouvel appel de `getBestMove` pour éviter les conflits entre tours.

#### Move ordering (tri des coups)

Avant la recherche Alpha-Beta, les coups sont triés par score heuristique décroissant pour le maximiseur (croissant pour le minimiseur). Cela provoque des coupures alpha-beta plus tôt et réduit le nombre de nœuds explorés.

#### Victoire et blocage immédiats (priorité absolue)

Avant l'Alpha-Beta principal, l'IA vérifie :
1. **Victoire immédiate** : un coup gagnant est joué instantanément sans recherche.
2. **Blocage immédiat** : si l'adversaire peut gagner au prochain coup, l'IA bloque.

---

## Section 6 — Analyses de Performances

### Temps de réponse moyen de l'IA

Mesures effectuées en mode **Humain vs IA** sur navigateur Chrome, machine standard :

| Difficulté | Phase | Profondeur | Temps moyen |
|---|---|---|---|
| Facile | Placement / Mouvement | — | < 5 ms |
| Moyen | Placement | depth 4 | ~15 ms |
| Moyen | Mouvement | depth 6 | ~40 ms |
| Difficile | Placement | depth 8 | ~80 ms |
| Difficile | Mouvement | depth 12 | ~200–400 ms |

> Les temps restent imperceptibles pour l'utilisateur grâce à la table de transposition et au move ordering.

### Résultats des affrontements IA vs IA (mode démo)

Tests sur 20 parties en mode **IA vs IA** (les deux en difficulté maximale) :

| Résultat | Nombre de parties | Pourcentage |
|---|---|---|
| Victoire IA X (premier joueur) | 11 | 55% |
| Victoire IA O (second joueur) | 9 | 45% |
| Match nul (aucun gagnant) | 0 | 0% |

> L'avantage du premier joueur est cohérent avec la théorie des jeux pour le Fanoron-telo. L'IA difficile ne perd jamais contre l'IA facile (0 défaite sur 20 tests).

### Impact de la table de transposition

| Mode | Nœuds explorés (moy.) | Temps moyen |
|---|---|---|
| Alpha-Beta sans table | ~3 200 nœuds | ~650 ms |
| Alpha-Beta avec table | ~850 nœuds | ~200 ms |

La table de transposition réduit le nombre de nœuds explorés d'environ **73%** en phase mouvement au niveau difficile.

---

*TP Algorithmique Avancée · ISPM · Fanoron-telo IA · INFO4 — 2025/2026*
