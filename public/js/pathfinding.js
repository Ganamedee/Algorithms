let pathfindingStop = false;
let pathDelay = 50;

const pathSpeedInput = document.getElementById("pathfinding-speed");
pathSpeedInput.addEventListener("input", () => {
  pathDelay = 500 - parseInt(pathSpeedInput.value);
});

const astarCanvas = document.getElementById("astar-canvas");
const dijkstraCanvas = document.getElementById("dijkstra-canvas");
const astarCtx = astarCanvas.getContext("2d");
const dijkstraCtx = dijkstraCanvas.getContext("2d");

const gridRows = 20;
const gridCols = 20;
let astarGrid = [];
let dijkstraGrid = [];

function resizePathCanvas(canvas) {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth - 40;
  canvas.height = 400;
}

function generateGrid(ctx, useSharedLayout = false, sharedWalls = null) {
  let grid = [];
  const cellWidth = ctx.canvas.width / gridCols;
  const cellHeight = ctx.canvas.height / gridRows;

  // Generate the base grid
  for (let r = 0; r < gridRows; r++) {
    let row = [];
    for (let c = 0; c < gridCols; c++) {
      row.push({
        r,
        c,
        isWall:
          useSharedLayout && sharedWalls
            ? sharedWalls[r][c]
            : Math.random() < 0.2,
        f: Infinity,
        g: Infinity,
        h: 0,
        parent: null,
        x: c * cellWidth,
        y: r * cellHeight,
        width: cellWidth,
        height: cellHeight,
      });
    }
    grid.push(row);
  }

  // Clear start and end points
  grid[0][0].isWall = false;
  grid[gridRows - 1][gridCols - 1].isWall = false;

  // Ensure path exists using flood fill
  if (!useSharedLayout) {
    let isReachable = checkPathExists(grid);
    while (!isReachable) {
      // Clear some walls if path is not possible
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          if (grid[r][c].isWall && Math.random() < 0.3) {
            grid[r][c].isWall = false;
          }
        }
      }
      isReachable = checkPathExists(grid);
    }
  }

  return grid;
}

function checkPathExists(grid) {
  let visited = Array(gridRows)
    .fill()
    .map(() => Array(gridCols).fill(false));
  let queue = [{ r: 0, c: 0 }];
  visited[0][0] = true;

  while (queue.length > 0) {
    let { r, c } = queue.shift();
    if (r === gridRows - 1 && c === gridCols - 1) return true;

    let neighbors = getNeighbors(grid, grid[r][c]);
    for (let neighbor of neighbors) {
      if (!neighbor.isWall && !visited[neighbor.r][neighbor.c]) {
        visited[neighbor.r][neighbor.c] = true;
        queue.push({ r: neighbor.r, c: neighbor.c });
      }
    }
  }
  return false;
}

function drawGrid(ctx, grid, path = [], visited = []) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      let cell = grid[r][c];

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        cell.x,
        cell.y,
        cell.x,
        cell.y + cell.height
      );

      if (cell.isWall) {
        gradient.addColorStop(0, "#444");
        gradient.addColorStop(1, "#222");
      } else if (r === 0 && c === 0) {
        gradient.addColorStop(0, "#00ff00");
        gradient.addColorStop(1, "#008000");
      } else if (r === gridRows - 1 && c === gridCols - 1) {
        gradient.addColorStop(0, "#ff0000");
        gradient.addColorStop(1, "#8b0000");
      } else if (path.find((p) => p.r === r && p.c === c)) {
        gradient.addColorStop(0, "#ffd700");
        gradient.addColorStop(1, "#daa520");
      } else if (visited.find((v) => v.r === r && v.c === c)) {
        gradient.addColorStop(0, "#4169e1");
        gradient.addColorStop(1, "#0000cd");
      } else {
        gradient.addColorStop(0, "#2a5298");
        gradient.addColorStop(1, "#1e3c72");
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 5;
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    }
  }
}

function heuristic(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

async function runAStar() {
  let openSet = [];
  let closedSet = [];
  let start = astarGrid[0][0];
  let end = astarGrid[gridRows - 1][gridCols - 1];

  start.g = 0;
  start.f = heuristic(start, end);
  openSet.push(start);

  while (openSet.length > 0) {
    if (pathfindingStop) return;

    let current = openSet.reduce((prev, curr) =>
      prev.f < curr.f ? prev : curr
    );

    if (current === end) {
      let path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = temp.parent;
      }
      drawGrid(astarCtx, astarGrid, path.reverse(), closedSet);
      return;
    }

    openSet = openSet.filter((n) => n !== current);
    closedSet.push(current);

    let neighbors = getNeighbors(astarGrid, current);
    for (let neighbor of neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      let tentativeG = current.g + 1;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }

      neighbor.parent = current;
      neighbor.g = tentativeG;
      neighbor.f = neighbor.g + heuristic(neighbor, end);
    }

    drawGrid(astarCtx, astarGrid, [], closedSet);
    await sleep(pathDelay);
  }
}

async function runDijkstra() {
  let openSet = [];
  let closedSet = [];
  let start = dijkstraGrid[0][0];
  let end = dijkstraGrid[gridRows - 1][gridCols - 1];

  start.g = 0;
  openSet.push(start);

  while (openSet.length > 0) {
    if (pathfindingStop) return;

    let current = openSet.reduce((prev, curr) =>
      prev.g < curr.g ? prev : curr
    );

    if (current === end) {
      let path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = temp.parent;
      }
      drawGrid(dijkstraCtx, dijkstraGrid, path.reverse(), closedSet);
      return;
    }

    openSet = openSet.filter((n) => n !== current);
    closedSet.push(current);

    let neighbors = getNeighbors(dijkstraGrid, current);
    for (let neighbor of neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      let tentativeG = current.g + 1;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }

      neighbor.parent = current;
      neighbor.g = tentativeG;
    }

    drawGrid(dijkstraCtx, dijkstraGrid, [], closedSet);
    await sleep(pathDelay);
  }
}

function getNeighbors(grid, cell) {
  const neighbors = [];
  const { r, c } = cell;

  if (r > 0) neighbors.push(grid[r - 1][c]);
  if (r < gridRows - 1) neighbors.push(grid[r + 1][c]);
  if (c > 0) neighbors.push(grid[r][c - 1]);
  if (c < gridCols - 1) neighbors.push(grid[r][c + 1]);

  return neighbors;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetPathfinding() {
  pathfindingStop = false;
  resizePathCanvas(astarCanvas);
  resizePathCanvas(dijkstraCanvas);

  // Generate the initial grid and ensure it has a valid path
  astarGrid = generateGrid(astarCtx);

  // Use the same wall layout for Dijkstra's grid
  let sharedWalls = astarGrid.map((row) => row.map((cell) => cell.isWall));
  dijkstraGrid = generateGrid(dijkstraCtx, true, sharedWalls);

  drawGrid(astarCtx, astarGrid);
  drawGrid(dijkstraCtx, dijkstraGrid);
}

function runPathfindingComparison() {
  resetPathfinding();
  runAStar();
  runDijkstra();
}

// Initialize and add event listeners
window.addEventListener("resize", resetPathfinding);
document
  .getElementById("reset-pathfinding")
  .addEventListener("click", resetPathfinding);
document.getElementById("stop-pathfinding").addEventListener("click", () => {
  pathfindingStop = true;
});

document.getElementById("start-pathfinding").addEventListener("click", () => {
  pathfindingStop = false;
  runPathfindingComparison();
});

// Initial setup
resetPathfinding();
