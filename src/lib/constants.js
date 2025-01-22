import { createAdjacencyList } from "./gameLogic";

export const NODES = [
  { x: 150, y: 50 }, { x: 250, y: 50 }, { x: 350, y: 50 }, { x: 450, y: 50 }, { x: 550, y: 50 },
  { x: 150, y: 150 }, { x: 250, y: 150 }, { x: 350, y: 150 }, { x: 450, y: 150 }, { x: 550, y: 150 },
  { x: 150, y: 250 }, { x: 250, y: 250 }, { x: 350, y: 250 }, { x: 450, y: 250 }, { x: 550, y: 250 },
  { x: 150, y: 350 }, { x: 250, y: 350 }, { x: 350, y: 350 }, { x: 450, y: 350 }, { x: 550, y: 350 },
  { x: 150, y: 450 }, { x: 250, y: 450 }, { x: 350, y: 450 }, { x: 450, y: 450 }, { x: 550, y: 450 },
  { x: 75, y: 200 }, { x: 75, y: 250 }, { x: 75, y: 300 },
  { x: 0, y: 150 }, { x: 0, y: 250 }, { x: 0, y: 350 },
  { x: 625, y: 200 }, { x: 625, y: 250 }, { x: 625, y: 300 },
  { x: 700, y: 150 }, { x: 700, y: 250 }, { x: 700, y: 350 },
];

export const CONNECTIONS = [
  // Horizontal
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8], [8, 9],
  [10, 11], [11, 12], [12, 13], [13, 14],
  [15, 16], [16, 17], [17, 18], [18, 19],
  [20, 21], [21, 22], [22, 23], [23, 24],
  // Vertical
  [0, 5], [5, 10], [10, 15], [15, 20],
  [1, 6], [6, 11], [11, 16], [16, 21],
  [2, 7], [7, 12], [12, 17], [17, 22],
  [3, 8], [8, 13], [13, 18], [18, 23],
  [4, 9], [9, 14], [14, 19], [19, 24],
  // Diagonal down-right
  [0, 6], [6, 12], [12, 18], [18, 24],
  [16, 20], [12, 16], [8, 12], [4, 8],
  // Diagonal down-left
  [2, 6], [2, 8],
  [6, 10], [8, 14],
  [10, 16], [14, 18],
  [16, 22], [18, 22],
  // Left triangle
  [10, 25], [10, 26], [10, 27],
  [25, 28], [26, 29], [27, 30],
  [25, 26], [26, 27],
  [28, 29], [29, 30],
  // Right triangle
  [14, 31], [14, 32], [14, 33],
  [31, 34], [32, 35], [33, 36],
  [31, 32], [32, 33],
  [34, 35], [35, 36]
];

export const adjacencyList = createAdjacencyList(NODES, CONNECTIONS);

export const DIRECTIONS = [
  // Horizontal right
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 100 && NODES[n].y === NODES[node].y
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 75 && NODES[n].y === NODES[node].y
  ),
  // Horizontal left
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 100 && NODES[n].y === NODES[node].y
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 75 && NODES[n].y === NODES[node].y
  ),
  // Vertical down
  node => adjacencyList[node].find(n =>
    NODES[n].y === NODES[node].y + 100 && NODES[n].x === NODES[node].x
  ) || adjacencyList[node].find(n =>
    NODES[n].y === NODES[node].y + 50 && NODES[n].x === NODES[node].x
  ),
  // Vertical up
  node => adjacencyList[node].find(n =>
    NODES[n].y === NODES[node].y - 100 && NODES[n].x === NODES[node].x
  ) || adjacencyList[node].find(n =>
    NODES[n].y === NODES[node].y - 50 && NODES[n].x === NODES[node].x
  ),
  // Diagonal down-right
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 100 && NODES[n].y === NODES[node].y + 100
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 75 && NODES[n].y === NODES[node].y + 50
  ),
  // Diagonal up-left
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 100 && NODES[n].y === NODES[node].y - 100
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 75 && NODES[n].y === NODES[node].y - 50
  ),
  // Diagonal down-left
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 100 && NODES[n].y === NODES[node].y + 100
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x - 75 && NODES[n].y === NODES[node].y + 50
  ),
  // Diagonal up-right
  node => adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 100 && NODES[n].y === NODES[node].y - 100
  ) || adjacencyList[node].find(n =>
    NODES[n].x === NODES[node].x + 75 && NODES[n].y === NODES[node].y - 50
  ),
  node => {
    if (node === 1) return 0; // Explicit connection from node 1 to 0
    if (node === 5) return 0; // Connection from node 5 to 0
    if (node === 6) return 0; // Connection from node 6 to 0
    return undefined;
  }

];

export const GRID_SIZE = 5;
export const SAVE_KEY = 'MACANAN_SAVE';

export const INITIAL_STATE = {
    board: Array(NODES.length).fill(null),
    macanPos: null,
    uwongPieces: 21,
    turn: 'uwong',
    isFirst: true
  };