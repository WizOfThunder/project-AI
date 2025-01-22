import { adjacencyList, DIRECTIONS, NODES } from "./constants";
import { getSquareIndices, isValidSquareStart } from "./gameLogic";

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
  const center = { x: 350, y: 250 }; // Defined for all cases
  let score = 0;
  
  // Base capture score
  const captured = 21 - boardState.filter(p => p === 'uwong').length;
  score += captured * WEIGHTS.CAPTURE;

  // Mobility score
  const moves = getMacanMoves(boardState, macanPosition).length;
  score += moves * WEIGHTS.MOBILITY;

  if (macanPosition !== null) {
    // Centrality score
    const position = NODES[macanPosition];
    const distance = Math.hypot(
      position.x - center.x,
      position.y - center.y
    );
    score -= distance * WEIGHTS.CENTRALITY;

    // Strategic position bonus
    score += WEIGHTS.STRATEGIC_POSITIONS[macanPosition] || 0;

    // Danger penalty
    if (moves === 0) score += WEIGHTS.DANGER_PENALTY;
  } else {
    // Initial placement evaluation
    const emptyNodes = boardState
      .map((_, i) => i)
      .filter(i => boardState[i] === null);

    score = emptyNodes.reduce((max, index) => {
      const position = NODES[index];
      const distance = Math.hypot(
        position.x - center.x, // ✅ Now properly defined
        position.y - center.y
      );
      const strategic = WEIGHTS.STRATEGIC_POSITIONS[index] || 0;
      const value = strategic - (distance * WEIGHTS.CENTRALITY);
      return Math.max(max, value);
    }, -Infinity);
  }

  return score;
};


export const getMacanMoves = (boardState, macanPosition) => {
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

export const getUwongMoves = (boardState, uwongPiecesRemaining, isFirstUwongTurn) => {
  const moves = [];
  
  // Phase 1: Initial 3x3 placement
  if (isFirstUwongTurn && uwongPiecesRemaining >= 9) {
    const validStarts = boardState
      .map((_, i) => i)
      .filter(i => isValidSquareStart(i, GRID_SIZE));

    validStarts.forEach(i => {
      const indices = getSquareIndices(i, GRID_SIZE);
      if (indices.some(idx => boardState[idx] === null)) {
        moves.push({ type: 'square', indices });
      }
    });
    return moves;
  }

  // Phase 2/3 combined logic
  if (uwongPiecesRemaining > 0) {
    // Single placement
    boardState.forEach((_, i) => {
      if (boardState[i] === null) moves.push({ type: 'place', to: i });
    });
  } else {
    // Movement
    boardState.forEach((piece, i) => {
      if (piece === 'uwong') {
        adjacencyList[i].forEach(neighbor => {
          if (boardState[neighbor] === null) {
            moves.push({ type: 'move', from: i, to: neighbor });
          }
        });
      }
    });
  }

  return moves;
};


// Add memoization function for better performance
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = args.map(arg => {
      if (Array.isArray(arg)) return arg.join(',');
      return JSON.stringify(arg);
    }).join('|');
    return cache.get(key) || cache.set(key, fn(...args)).get(key);
  };
};


// Minimax with Alpha-Beta pruning
export const minimax = memoize((
  boardState,
  macanPosition,
  uwongPiecesRemaining,
  isFirstUwongTurn,
  depth,
  alpha,
  beta,
  maximizingPlayer
) => {
  // Base cases
  const uwongCount = boardState.filter(p => p === 'uwong').length;
  // console.log(maximizingPlayer, depth);
  const totalUwong = uwongCount + uwongPiecesRemaining;
  if (totalUwong < 14) return Infinity; // Macan win
  if (depth === 0) return evaluateBoard(boardState, macanPosition);
    
  if (maximizingPlayer) {
    const possibleMoves = getMacanMoves(boardState, macanPosition);
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
      const evaluation = minimax(newBoard, newMacanPosition, uwongPiecesRemaining, isFirstUwongTurn, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const moves = getUwongMoves(boardState, uwongPiecesRemaining, isFirstUwongTurn);
    for (const move of moves) {
      let newBoard = [...boardState];
      let newUwongPieces = uwongPiecesRemaining;
      let newIsFirstTurn = isFirstUwongTurn;

      if (move.type === 'square') {
        newBoard = newBoard.map((val, idx) => 
          move.indices.includes(idx) ? 'uwong' : val
        );
        newUwongPieces -= 9;
        newIsFirstTurn = false;
      } else if (move.type === 'place') {
        newBoard[move.to] = 'uwong';
        newUwongPieces -= 1;
      } else if (move.type === 'move') {
        newBoard[move.from] = null;
        newBoard[move.to] = 'uwong';
      }
      
      const evaluation = minimax(
        newBoard,
        macanPosition,
        newUwongPieces,
        newIsFirstTurn,
        depth - 1,
        alpha,
        beta,
        true
      );

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }

    return minEval;
  }
});