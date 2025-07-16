/**
 * @param {number[][]} field - 2D elevation grid
 * @param {number} level     - contour value
 * @returns {Array<[{x:number,y:number},{x:number,y:number}]>} array of line segments
 */
export function generateSegments(field, level) {
  const h = field.length;
  const w = field[0].length;
  const segments = [];
  
  console.log(`🔍 generateSegments: field size ${w}×${h}, level=${level}`);
  
  // Safety check: limit processing for large grids
  const maxCells = 10000; // Limit to prevent stack overflow
  const totalCells = (h - 1) * (w - 1);
  
  if (totalCells > maxCells) {
    console.warn(`⚠️ generateSegments: Large grid detected (${totalCells} cells), limiting processing`);
    // For large grids, sample every nth cell
    const step = Math.ceil(Math.sqrt(totalCells / maxCells));
    console.log(`🔍 generateSegments: Using step=${step} for sampling`);
    
    for (let y = 0; y < h - 1; y += step) {
      for (let x = 0; x < w - 1; x += step) {
        const cellSegments = processCell(x, y, field, level);
        segments.push(...cellSegments);
      }
    }
  } else {
    // Process all cells for smaller grids
    for (let y = 0; y < h - 1; y++) {
      for (let x = 0; x < w - 1; x++) {
        const cellSegments = processCell(x, y, field, level);
        segments.push(...cellSegments);
      }
    }
  }
  
  console.log(`🔍 generateSegments: Generated ${segments.length} segments`);
  return segments;
}

/**
 * Process a single cell for marching squares
 */
function processCell(x, y, field, level) {
  // Get the four corners of this cell
  const a = field[y][x] >= level ? 1 : 0;
  const b = field[y][x + 1] >= level ? 1 : 0;
  const c = field[y + 1][x + 1] >= level ? 1 : 0;
  const d = field[y + 1][x] >= level ? 1 : 0;
  
  // Create a 4-bit code from the corners
  const code = (a << 3) | (b << 2) | (c << 1) | d;
  
  // Generate line segments based on the marching squares lookup table
  return getCellSegments(code, x, y, field, level);
}

/**
 * Get line segments for a single cell based on marching squares code
 */
function getCellSegments(code, x, y, field, level) {
  // Marching squares lookup table - maps cell codes to line segments
  // Each entry is an array of [startPoint, endPoint] pairs
  const lookup = {
    0: [],   // 0000 - no contour
    1: [[{x: x + 0.5, y: y + 1}, {x: x, y: y + 0.5}]],     // 0001
    2: [[{x: x + 1, y: y + 0.5}, {x: x + 0.5, y: y + 1}]], // 0010
    3: [[{x: x + 1, y: y + 0.5}, {x: x, y: y + 0.5}]],     // 0011
    4: [[{x: x + 0.5, y: y}, {x: x + 1, y: y + 0.5}]],     // 0100
    5: [[{x: x + 0.5, y: y}, {x: x, y: y + 0.5}],          // 0101
        [{x: x + 0.5, y: y + 1}, {x: x + 1, y: y + 0.5}]],
    6: [[{x: x + 0.5, y: y}, {x: x + 0.5, y: y + 1}]],     // 0110
    7: [[{x: x + 0.5, y: y}, {x: x, y: y + 0.5}]],         // 0111
    8: [[{x: x, y: y + 0.5}, {x: x + 0.5, y: y}]],         // 1000
    9: [[{x: x + 0.5, y: y + 1}, {x: x + 0.5, y: y}]],     // 1001
    10: [[{x: x, y: y + 0.5}, {x: x + 1, y: y + 0.5}],     // 1010
         [{x: x + 0.5, y: y}, {x: x + 0.5, y: y + 1}]],
    11: [[{x: x + 0.5, y: y}, {x: x + 1, y: y + 0.5}]],    // 1011
    12: [[{x: x, y: y + 0.5}, {x: x + 0.5, y: y + 1}]],    // 1100
    13: [[{x: x + 0.5, y: y + 1}, {x: x + 1, y: y + 0.5}]], // 1101
    14: [[{x: x, y: y + 0.5}, {x: x + 0.5, y: y}]],        // 1110
    15: []   // 1111 - no contour
  };
  
  return lookup[code] || [];
}

/** Convert one segment to an SVG path "d=" string */
export function segToPathD(segment) {
  const [p0, p1] = segment;
  return `M${p0.x} ${p0.y} L${p1.x} ${p1.y}`;
} 