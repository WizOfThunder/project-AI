import { adjacencyList, DIRECTIONS, NODES } from "./constants";

export const createAdjacencyList = (nodes, connections) => {
  const list = nodes.map(() => []);
  connections.forEach(([from, to]) => {
    if (!list[from].includes(to)) list[from].push(to);
    if (!list[to].includes(from)) list[to].push(from);
  });
  return list;
};


export const isValidSquareStart = (index, gridSize) => {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  return row >= 1 && row <= gridSize - 2 && col >= 1 && col <= gridSize - 2;
};

export const getSquareIndices = (index, gridSize) => {
  const indices = [];
  const centerRow = Math.floor(index / gridSize);
  const centerCol = index % gridSize;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const row = centerRow + i;
      const col = centerCol + j;
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        indices.push(row * gridSize + col);
      }
    }
  }
  return indices;
};

export const indicesAreValid = (indices, boardState, gridSize) => {
  return indices.some(i => isValidSquareStart(i, gridSize) && boardState[i] === null);
};  



// AI logic
export const WEIGHTS = {
  CAPTURE: 100,         // Weight per captured Uwong piece
  MOBILITY: 10,         // Weight per possible move
  CENTRALITY: 5,        // Weight per unit distance from center
  STRATEGIC_POSITIONS: { // Strategic node bonuses
    12: 50,  // Center node
    10: 30,  // High-value nodes
    14: 30,
    2: 20,
    22: 20
  },
  DANGER_PENALTY: -100  // Penalty if surrounded
};

export const evaluateBoard = (boardState, macanPosition) => {
  let score = 0;
  
  // Base capture score
  const captured = 21 - boardState.filter(p => p === 'uwong').length;
  score += captured * WEIGHTS.CAPTURE;

  // Mobility score
  const moves = getPossibleMoves(boardState, macanPosition).length;
  score += moves * WEIGHTS.MOBILITY;

  if (macanPosition !== null) {
    // Centrality score (distance from center)
    const center = { x: 350, y: 250 };
    const position = NODES[macanPosition];
    const distance = Math.hypot(
      position.x - center.x,
      position.y - center.y
    );
    score -= distance * WEIGHTS.CENTRALITY;

    // Strategic position bonus
    score += WEIGHTS.STRATEGIC_POSITIONS[macanPosition] || 0;

    // Danger penalty (if no moves available)
    if (moves === 0) {
      score += WEIGHTS.DANGER_PENALTY;
    }
  } else {
    // Initial placement evaluation
    const emptyNodes = boardState
      .map((_, i) => i)
      .filter(i => boardState[i] === null);

    // Evaluate best initial position
    score = emptyNodes.reduce((max, index) => {
      const position = NODES[index];
      const distance = Math.hypot(
        position.x - center.x,
        position.y - center.y
      );
      const strategic = WEIGHTS.STRATEGIC_POSITIONS[index] || 0;
      const value = strategic - (distance * WEIGHTS.CENTRALITY);
      return Math.max(max, value);
    }, -Infinity);
  }

  return score;
};


export const getPossibleMoves = (boardState, macanPosition) => {
  if (macanPosition === null) {
    return boardState
      .map((_, index) => ({ type: 'place', to: index }))
      .filter(move => boardState[move.to] === null);
  }

  const moves = [];
  // Check regular moves
  adjacencyList[macanPosition].forEach(index => {
    if (boardState[index] === null) {
      moves.push({ type: 'move', to: index, captured: 0 });
    }
  });

  DIRECTIONS.forEach(dirFn => {
    let current = macanPosition;
    const path = [];
    let captured = 0;

    while (true) {
      const next = dirFn(current);
      if (next === undefined || next === null || next < 0) break;

      if (boardState[next] === 'uwong') {
        captured++;
        path.push(next);
        current = next;
      } else if (boardState[next] === null && captured > 0) {
        if (captured % 2 === 1) {
          moves.push({
            type: 'jump',
            to: next,
            captured: captured,
            path: [...path]
          });
        }
        break;
      } else {
        break;
      }
    }
  });

  return moves;
};

// Add memoization function for better performance
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.get(key) || cache.set(key, fn(...args)).get(key);
  };
};

// Minimax with Alpha-Beta pruning
export const minimax = memoize((boardState, macanPosition, depth, alpha, beta, maximizingPlayer) => {
  // Base cases
  const uwongCount = boardState.filter(p => p === 'uwong').length;
  if (uwongCount === 0) return Infinity; // Macan win
  if (depth === 0) return evaluateBoard(boardState, macanPosition);

  const possibleMoves = getPossibleMoves(boardState, macanPosition);
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of possibleMoves) {
      const newBoard = [...boardState];
      let newMacanPosition = macanPosition;
      
      if (macanPosition === null) {
        // Handle initial placement
        newBoard[move.to] = 'macan';
        newMacanPosition = move.to;
      } else {
        // Handle regular moves/jumps
        newBoard[macanPosition] = null;
        newBoard[move.to] = 'macan';
        newMacanPosition = move.to;
        
        if (move.type === 'jump') {
          move.path.forEach(i => newBoard[i] = null);
        }
      }

      const evaluation = minimax(newBoard, newMacanPosition, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    // Minimizing player (Uwong) - simplified random response for now
    let minEval = Infinity;
    // This part would need Uwong's possible moves implementation
    // For simplicity, we'll just return the current evaluation
    return evaluateBoard(boardState, macanPosition);
  }
});