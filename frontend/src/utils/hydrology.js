/**
 * Computes the flow direction for each cell in a heightmap.
 * Each cell is assigned an integer 0–7 indicating the neighbor with the steepest decrease in elevation:
 * 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW. If no neighbor is lower, assigns -1.
 *
 * @param {number[][]} heightmap - 2D array of elevation values
 * @returns {number[][]} 2D array of direction indices (same shape as heightmap)
 */
export function computeFlowDirections(heightmap) {
  const h = heightmap.length;
  const w = heightmap[0].length;
  const dirs = [
    [0, -1],  // N
    [1, -1],  // NE
    [1, 0],   // E
    [1, 1],   // SE
    [0, 1],   // S
    [-1, 1],  // SW
    [-1, 0],  // W
    [-1, -1], // NW
  ];
  const flowDir = Array.from({ length: h }, () => Array(w).fill(-1));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minElev = heightmap[y][x];
      let minDir = -1;
      for (let d = 0; d < 8; d++) {
        const nx = x + dirs[d][0];
        const ny = y + dirs[d][1];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nElev = heightmap[ny][nx];
          if (nElev < minElev) {
            minElev = nElev;
            minDir = d;
          }
        }
      }
      flowDir[y][x] = minDir;
    }
  }
  return flowDir;
}

/**
 * Computes flow accumulation for each cell given flow directions.
 * Each cell starts with accumulation 1. In topographic order (highest elevation first),
 * each cell's accumulation is added to its downstream neighbor.
 *
 * @param {number[][]} flowDir - 2D array of flow direction indices
 * @param {number[][]} [heightmap] - Optional: 2D array of elevations for topographic sorting (if not provided, assumes flat)
 * @returns {number[][]} 2D array of accumulation counts
 */
export function computeFlowAccumulation(flowDir, heightmap) {
  const h = flowDir.length;
  const w = flowDir[0].length;
  const dirs = [
    [0, -1],  // N
    [1, -1],  // NE
    [1, 0],   // E
    [1, 1],   // SE
    [0, 1],   // S
    [-1, 1],  // SW
    [-1, 0],  // W
    [-1, -1], // NW
  ];
  const acc = Array.from({ length: h }, () => Array(w).fill(1));

  // Build list of all cells with their elevation for sorting
  let cells = [];
  if (heightmap) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells.push({ x, y, elev: heightmap[y][x] });
      }
    }
    // Sort descending by elevation
    cells.sort((a, b) => b.elev - a.elev);
  } else {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells.push({ x, y });
      }
    }
  }

  for (const cell of cells) {
    const { x, y } = cell;
    const dir = flowDir[y][x];
    if (dir >= 0) {
      const nx = x + dirs[dir][0];
      const ny = y + dirs[dir][1];
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        acc[ny][nx] += acc[y][x];
      }
    }
  }
  return acc;
}

/**
 * Extracts river polylines from flow accumulation and flow direction arrays.
 * For each cell with flowAcc >= threshold, walks downstream via flowDir to build a polyline.
 * Merges overlapping polylines where they share segments.
 *
 * @param {number[][]} flowAcc - 2D array of flow accumulation counts
 * @param {number[][]} flowDir - 2D array of flow direction indices
 * @param {number} threshold - Minimum accumulation to be considered a river
 * @returns {Array<Array<{x: number, y: number}>>} Array of river polylines (each a list of {x, y} points)
 */
export function extractRivers(flowAcc, flowDir, threshold) {
  const h = flowAcc.length;
  const w = flowAcc[0].length;
  const dirs = [
    [0, -1],  // N
    [1, -1],  // NE
    [1, 0],   // E
    [1, 1],   // SE
    [0, 1],   // S
    [-1, 1],  // SW
    [-1, 0],  // W
    [-1, -1], // NW
  ];
  // Track visited cells to avoid duplicate polylines
  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  const rivers = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (flowAcc[y][x] >= threshold && !visited[y][x]) {
        // Start a new river polyline
        const polyline = [];
        let cx = x, cy = y;
        while (
          cx >= 0 && cx < w && cy >= 0 && cy < h &&
          flowDir[cy][cx] !== -1 &&
          !visited[cy][cx]
        ) {
          polyline.push({ x: cx, y: cy });
          visited[cy][cx] = true;
          const dir = flowDir[cy][cx];
          cx += dirs[dir][0];
          cy += dirs[dir][1];
        }
        // Add last cell if not visited and within bounds
        if (
          cx >= 0 && cx < w && cy >= 0 && cy < h &&
          !visited[cy][cx]
        ) {
          polyline.push({ x: cx, y: cy });
          visited[cy][cx] = true;
        }
        if (polyline.length > 1) {
          rivers.push(polyline);
        }
      }
    }
  }

  // Merge overlapping polylines (simple approach: merge if they share any segment)
  // For performance, use a map from cell to polyline index
  const cellToRiver = new Map();
  rivers.forEach((poly, idx) => {
    for (const pt of poly) {
      cellToRiver.set(pt.y + ',' + pt.x, idx);
    }
  });
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < rivers.length; i++) {
      for (let j = i + 1; j < rivers.length; j++) {
        // Check for overlap
        const setA = new Set(rivers[i].map(pt => pt.y + ',' + pt.x));
        const setB = new Set(rivers[j].map(pt => pt.y + ',' + pt.x));
        const overlap = [...setA].some(key => setB.has(key));
        if (overlap) {
          // Merge j into i
          const mergedPoly = Array.from(new Set([...rivers[i], ...rivers[j]].map(pt => pt.y + ',' + pt.x)))
            .map(key => {
              const [y, x] = key.split(',').map(Number);
              return { x, y };
            });
          rivers[i] = mergedPoly;
          rivers.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }

  return rivers;
} 