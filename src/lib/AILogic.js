import { adjacencyList, DIRECTIONS, GRID_SIZE, NODES } from "./constants";
import { getSquareIndices, isValidSquareStart } from "./gameLogic";

//#region Shared Configuration
const STRATEGY_CONFIG = {
  macan: {
    weights: {
      CAPTURE: 500,
      MOBILITY: 10,
      CENTRALITY: 5,
      STRATEGIC_POSITIONS: { 12: 50, 10: 30, 14: 30, 2: 20, 22: 20 },
      DANGER_PENALTY: -100,
      WIN_BONUS: 100000
    },
    evaluator: macanEvaluator,
    moveGenerator: getMacanMoves
  },
  uwong: {
    weights: {
      DEFENSE_CLUSTER: 200,
      MACAN_MOBILITY_PENALTY: -50,
      SURROUNDING_BONUS: 100,
      PIECE_CONSERVATION: 300,
      CENTRAL_CONTROL: 20,
      BLOCKING_BONUS: 150,
      DANGER_PENALTY: -500,
      WIN_BONUS: 100000
    },
    evaluator: uwongEvaluator,
    moveGenerator: getUwongMoves
  }
};

const CENTER_NODE = { x: 350, y: 250 };
const DEFENSIVE_CLUSTERS = [12, 7, 11, 16, 17];
const CENTRAL_NODES = [6, 7, 8, 11, 12, 13, 16, 17, 18];
//#endregion

//#region Core AI Functions
const createMinimax = (playerType) => memoize(
  (boardState, macanPosition, uwongPieces, isFirstTurn, depth, alpha, beta, isMaximizing) => {
    const { weights, evaluator, moveGenerator } = STRATEGY_CONFIG[playerType];
    const totalUwong = boardState.filter(p => p === 'uwong').length + uwongPieces;

    // Base cases
    if (checkWinCondition(playerType, totalUwong, macanPosition, boardState)) {
      return weights.WIN_BONUS * (isMaximizing ? 1 : -1);
    }
    if (depth === 0) return evaluator(boardState, macanPosition, uwongPieces);

    const moves = moveGenerator(boardState, macanPosition, uwongPieces, isFirstTurn);
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      const { newBoard, newMacanPos, newUwongPieces, newIsFirstTurn } = applyMove(
        move,
        boardState,
        macanPosition,
        uwongPieces,
        isFirstTurn,
        playerType
      );

      const evaluation = createMinimax(playerType)(
        newBoard,
        newMacanPos,
        newUwongPieces,
        newIsFirstTurn,
        depth - 1,
        alpha,
        beta,
        !isMaximizing
      );

      bestValue = isMaximizing
        ? Math.max(bestValue, evaluation)
        : Math.min(bestValue, evaluation);

      if (isMaximizing) {
        alpha = Math.max(alpha, evaluation);
      } else {
        beta = Math.min(beta, evaluation);
      }

      if (beta <= alpha) break;
    }

    return bestValue;
  }
);
//#endregion

//#region Evaluation Functions
function macanEvaluator(boardState, macanPosition, uwongPieces) {
  const { weights } = STRATEGY_CONFIG.macan;
  let score = 0;

  // Capture score
  const totalUwong = boardState.filter(p => p === 'uwong').length + uwongPieces;
  score += (21 - totalUwong) * weights.CAPTURE;

  // Mobility
  const mobility = getMacanMoves(boardState, macanPosition).length;
  score += mobility * weights.MOBILITY;

  // Position analysis
  if (macanPosition !== null) {
    const position = NODES[macanPosition];
    const distance = Math.hypot(position.x - CENTER_NODE.x, position.y - CENTER_NODE.y);
    score -= distance * weights.CENTRALITY;
    score += weights.STRATEGIC_POSITIONS[macanPosition] || 0;
    if (mobility === 0) score += weights.DANGER_PENALTY;
  }

  return score;
}

function uwongEvaluator(boardState, macanPosition, uwongPieces) {
  const { weights } = STRATEGY_CONFIG.uwong;
  let score = 0;

  // Conservation bonus
  const totalUwong = boardState.filter(p => p === 'uwong').length + uwongPieces;
  score += totalUwong >= 14 ? weights.PIECE_CONSERVATION : 0;

  // Macan mobility penalty
  if (macanPosition !== null) {
    const macanMobility = getMacanMoves(boardState, macanPosition).length;
    score += macanMobility * weights.MACAN_MOBILITY_PENALTY;
  }

  // Defensive positioning
  score += DEFENSIVE_CLUSTERS.filter(i => boardState[i] === 'uwong').length * weights.DEFENSE_CLUSTER;

  // Surrounding bonus
  if (macanPosition !== null) {
    const surrounding = adjacencyList[macanPosition].filter(i => boardState[i] === 'uwong').length;
    score += surrounding * weights.SURROUNDING_BONUS;
  }

  // Central control
  score += CENTRAL_NODES.filter(i => boardState[i] === 'uwong').length * weights.CENTRAL_CONTROL;

  return score;
}
//#endregion

//#region Move Handling
function applyMove(move, board, macanPos, uwongPieces, isFirstTurn, playerType) {
  const newBoard = [...board];
  let newMacanPos = macanPos;
  let newUwongPieces = uwongPieces;
  let newIsFirstTurn = isFirstTurn;

  if (playerType === 'macan') {
    if (macanPos === null) {
      newBoard[move.to] = 'macan';
      newMacanPos = move.to;
    } else {
      newBoard[macanPos] = null;
      newBoard[move.to] = 'macan';
      if (move.type === 'jump') {
        move.path.forEach(i => newBoard[i] = null);
      }
      newMacanPos = move.to;
    }
  } else {
    if (move.type === 'square') {
      move.indices.forEach(i => { if (newBoard[i] === null) newBoard[i] = 'uwong' });
      newUwongPieces -= 9;
      newIsFirstTurn = false;
    } else if (move.type === 'place') {
      newBoard[move.to] = 'uwong';
      newUwongPieces -= 1;
    } else if (move.type === 'move') {
      newBoard[move.from] = null;
      newBoard[move.to] = 'uwong';
    }
  }

  return { newBoard, newMacanPos, newUwongPieces, newIsFirstTurn };
}

function getMacanMoves(board, macanPos) {
  if (!macanPos) return board.map((_, i) => ({ type: 'place', to: i })).filter(m => !board[m.to]);

  const moves = [];
  
  // Regular moves
  adjacencyList[macanPos].forEach(i => {
    if (!board[i]) moves.push({ type: 'move', to: i, captured: 0 });
  });

  // Jump moves
  DIRECTIONS.forEach(dirFn => analyzeJumpPath(dirFn, macanPos, board, moves));

  return moves.sort((a, b) => b.captured - a.captured);
}

function getUwongMoves(board, uwongPieces, isFirstTurn) {
  if (isFirstTurn && uwongPieces >= 9) {
    return getInitialPlacementMoves(board);
  }
  return uwongPieces > 0 
    ? getPlacementMoves(board) 
    : getMovementMoves(board);
}
//#endregion

//#region Helper Functions
function analyzeJumpPath(dirFn, startPos, board, moves) {
  let current = startPos;
  const path = [];
  let captured = 0;

  while (true) {
    const next = dirFn(current);
    if (!next || next < 0) break;

    if (board[next] === 'uwong') {
      captured++;
      path.push(next);
      current = next;
    } else if (!board[next] && captured > 0) {
      if (captured % 2 === 1) {
        moves.push({ type: 'jump', to: next, captured, path: [...path] });
      }
      break;
    } else {
      break;
    }
  }
}

function getInitialPlacementMoves(board) {
  return board
    .map((_, i) => i)
    .filter(i => isValidSquareStart(i, GRID_SIZE))
    .map(i => ({
      type: 'square',
      indices: getSquareIndices(i, GRID_SIZE).filter(idx => !board[idx])
    }))
    .filter(m => m.indices.length > 0);
}

function getPlacementMoves(board) {
  return board
    .map((_, i) => ({ type: 'place', to: i }))
    .filter(m => !board[m.to]);
}

function getMovementMoves(board) {
  return board.flatMap((piece, i) => 
    piece === 'uwong' 
      ? adjacencyList[i]
          .filter(j => !board[j])
          .map(j => ({ type: 'move', from: i, to: j }))
      : []
  );
}

function checkWinCondition(player, totalUwong, macanPos, board) {
  if (player === 'macan') return totalUwong < 14;
  
  // Check if Macan is surrounded
  return macanPos !== null && 
    adjacencyList[macanPos].every(i => board[i] !== null) && 
    getMacanMoves(board, macanPos).length === 0;
}

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = args.map(a => 
      Array.isArray(a) ? a.join(',') : JSON.stringify(a)
    ).join('|');
    return cache.get(key) || cache.set(key, fn(...args)).get(key);
  };
};
//#endregion

// Exports
export const minimax = {
  macan: createMinimax('macan'),
  uwong: createMinimax('uwong')
};

export const aiMoves = {
  macan: getMacanMoves,
  uwong: getUwongMoves
};