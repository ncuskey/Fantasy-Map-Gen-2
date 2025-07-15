import seedrandom from 'seedrandom';

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} SettlementOptions
 * @property {number} count - Number of settlements to generate
 * @property {number} minDistance - Minimum distance between settlements
 * @property {number} seaLevel - Elevation threshold below which is water
 * @property {number} mountainLevel - Elevation threshold above which is too high
 * @property {Record<string, number>} [biomeWeights] - Optional biome weights
 * @property {number} [seed] - Optional seed for deterministic placement
 */

/**
 * Generates settlement points using Poisson-disc sampling with elevation and biome constraints.
 *
 * @param {number[][]} heightmap - 2D array of elevation values
 * @param {string[][]} biomeMap - 2D array of biome names
 * @param {SettlementOptions} options - Placement options
 * @returns {Point[]} Array of settlement points
 */
export function generateSettlements(heightmap, biomeMap, options) {
  const {
    count,
    minDistance,
    seaLevel,
    mountainLevel,
    biomeWeights = null,
    seed,
  } = options;
  const h = heightmap.length;
  const w = heightmap[0].length;
  const rng = seed !== undefined ? seedrandom(seed.toString()) : Math.random;
  // Helper for random float [0,1)
  const rand = () => rng();

  // Build candidate grid: only valid cells
  let candidates = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const elev = heightmap[y][x];
      if (elev >= seaLevel && elev < mountainLevel) {
        let weight = 1;
        if (biomeWeights && biomeMap) {
          weight = biomeWeights[biomeMap[y][x]] ?? 1;
        }
        if (weight > 0) {
          candidates.push({ x, y, weight });
        }
      }
    }
  }
  if (candidates.length === 0) return [];

  // Weighted reservoir sampling for candidate order
  function weightedShuffle(arr) {
    // Assign a random key, scaled by weight
    return arr.map(obj => ({ ...obj, key: Math.pow(rand(), 1 / obj.weight) }))
      .sort((a, b) => b.key - a.key);
  }
  const shuffled = biomeWeights ? weightedShuffle(candidates) : candidates.slice().sort(() => rand() - 0.5);

  // Poisson-disc sampling (grid-based, but simple for small maps)
  const result = [];
  for (let i = 0; i < shuffled.length && result.length < count; i++) {
    const { x, y } = shuffled[i];
    let ok = true;
    for (const pt of result) {
      const dx = pt.x - x;
      const dy = pt.y - y;
      if (dx * dx + dy * dy < minDistance * minDistance) {
        ok = false;
        break;
      }
    }
    if (ok) result.push({ x, y });
  }
  // If not enough, just return what we have (never more than count)
  return result;
} 