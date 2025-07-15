/**
 * Generates a boolean sea mask from a heightmap.
 * @param {number[][]} heightmap - 2D array of elevation values
 * @param {number} [seaLevel=0.2] - Elevation threshold for sea
 * @returns {boolean[][]} 2D array: true if cell is below seaLevel, else false
 */
export function generateSeaMask(heightmap, seaLevel = 0.2) {
  const h = heightmap.length;
  const w = heightmap[0].length;
  const mask = Array.from({ length: h }, () => Array(w));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      mask[y][x] = heightmap[y][x] < seaLevel;
    }
  }
  return mask;
}

/**
 * Smooths a boolean mask by majority in 3x3 neighborhood.
 * @param {boolean[][]} mask - 2D boolean array to smooth
 * @param {number} [iterations=1] - Number of smoothing passes
 * @param {number} [neighborThreshold=5] - Minimum true neighbors (including self) to set output true
 * @returns {boolean[][]} New smoothed mask
 */
export function smoothSeaMask(mask, iterations = 1, neighborThreshold = 5) {
  let h = mask.length;
  let w = mask[0].length;
  let curr = mask.map(row => row.slice());
  for (let iter = 0; iter < iterations; iter++) {
    const next = Array.from({ length: h }, () => Array(w));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < h && nx >= 0 && nx < w && curr[ny][nx]) {
              count++;
            }
          }
        }
        next[y][x] = count >= neighborThreshold;
      }
    }
    curr = next;
  }
  return curr;
} 