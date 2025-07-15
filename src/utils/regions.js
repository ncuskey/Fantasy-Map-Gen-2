/**
 * @typedef {{ x: number; y: number }} Point
 * @typedef {Object} RegionOptions
 * @property {'voronoi'} [method='voronoi'] - Currently only 'voronoi' is supported
 */

/**
 * Assigns each cell in a width×height grid to the nearest town index.
 * @param {number} width - Width of the grid
 * @param {number} height - Height of the grid
 * @param {Point[]} towns - Array of settlement points
 * @param {RegionOptions} opts - Options (e.g. method)
 * @returns {number[][]} - 2D array [y][x] of region indices (0..towns.length-1)
 */
export function generateRegionMap(width, height, towns, opts) {
  const method = opts && opts.method ? opts.method : 'voronoi';
  if (method !== 'voronoi') throw new Error('Only voronoi method is supported');
  const map = Array.from({ length: height }, () => Array(width));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = Infinity;
      let minIdx = -1;
      for (let i = 0; i < towns.length; i++) {
        const dx = x - towns[i].x;
        const dy = y - towns[i].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < minDist) {
          minDist = d2;
          minIdx = i;
        }
      }
      map[y][x] = minIdx;
    }
  }
  return map;
}

/**
 * Computes the centroid of each region.
 * @param {number[][]} regionMap - Output of generateRegionMap
 * @returns {{ regionId: number; x: number; y: number }[]} - Centroid for each region
 */
export function computeRegionCentroids(regionMap) {
  const height = regionMap.length;
  const width = regionMap[0].length;
  const sums = {};
  const counts = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = regionMap[y][x];
      if (!(id in sums)) {
        sums[id] = { x: 0, y: 0 };
        counts[id] = 0;
      }
      sums[id].x += x;
      sums[id].y += y;
      counts[id]++;
    }
  }
  return Object.keys(sums).map(id => ({
    regionId: Number(id),
    x: sums[id].x / counts[id],
    y: sums[id].y / counts[id],
  }));
} 