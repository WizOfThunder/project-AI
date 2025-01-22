import { memoize } from "./AILogic";
import { adjacencyList, DIRECTIONS, NODES } from "./constants";

export const createAdjacencyList = (nodes, connections) => {
  const list = nodes.map(() => []);
  connections.forEach(([from, to]) => {
    if (!list[from].includes(to)) list[from].push(to);
    if (!list[to].includes(from)) list[to].push(from);
  });
  return list;
};

export const isValidSquareStart = memoize((index, gridSize) => {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  return row >= 1 && row <= gridSize - 2 && col >= 1 && col <= gridSize - 2;
});


export const getSquareIndices = memoize((index, gridSize) => {
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
});

export const indicesAreValid = (indices, boardState, gridSize) => {
  return indices.some(i => isValidSquareStart(i, gridSize) && boardState[i] === null);
};  
