import seedrandom from 'seedrandom';

/**
 * @typedef {{ x: number; y: number }} Point
 * @typedef {Object} RoadOptions
 * @property {boolean} [useMST=true] - Whether to start from a minimum spanning tree
 * @property {number} [extraEdgeProbability=0.1] - Chance to add extra edges beyond the MST
 * @property {number} [jitter=1] - Max pixel jitter applied to intermediate points for a hand-drawn feel
 * @property {number} [seed] - Optional seed for deterministic road layouts
 */

/**
 * Generates a road network connecting settlement points.
 *
 * @param {Point[]} towns - List of settlement coordinates
 * @param {RoadOptions} [options] - Road generation settings
 * @returns {Array<{ path: Point[] }>} Array of road polylines
 */
export function generateRoads(towns, options = {}) {
  const {
    useMST = true,
    extraEdgeProbability = 0.1,
    jitter = 1,
    seed,
  } = options;
  if (!towns || towns.length < 2) return [];
  const n = towns.length;
  const rng = seed !== undefined ? seedrandom(seed.toString()) : Math.random;
  const rand = () => rng();

  // Helper: Euclidean distance
  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Build all possible edges
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({ a: i, b: j, d: dist(towns[i], towns[j]) });
    }
  }

  // Kruskal's MST
  let mstEdges = [];
  if (useMST) {
    // Disjoint set
    const parent = Array(n).fill(0).map((_, i) => i);
    function find(u) { return parent[u] === u ? u : parent[u] = find(parent[u]); }
    function unite(u, v) { parent[find(u)] = find(v); }
    const sorted = edges.slice().sort((e1, e2) => e1.d - e2.d);
    for (const e of sorted) {
      if (find(e.a) !== find(e.b)) {
        mstEdges.push(e);
        unite(e.a, e.b);
        if (mstEdges.length === n - 1) break;
      }
    }
  }

  // Add extra edges
  const mstSet = new Set(mstEdges.map(e => `${e.a},${e.b}`));
  let extraEdges = [];
  for (const e of edges) {
    if (mstSet.has(`${e.a},${e.b}`) || mstSet.has(`${e.b},${e.a}`)) continue;
    if (rand() < extraEdgeProbability) {
      extraEdges.push(e);
    }
  }

  // Helper: subdivide and jitter a segment
  function subdivideAndJitter(a, b, jitter, steps = 8) {
    const path = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let x = a.x * (1 - t) + b.x * t;
      let y = a.y * (1 - t) + b.y * t;
      if (i !== 0 && i !== steps && jitter > 0) {
        x += (rand() * 2 - 1) * jitter;
        y += (rand() * 2 - 1) * jitter;
      }
      path.push({ x, y });
    }
    return path;
  }

  // Build road polylines
  const allEdges = [...mstEdges, ...extraEdges];
  const roads = allEdges.map(e => ({
    path: subdivideAndJitter(towns[e.a], towns[e.b], jitter)
  }));
  return roads;
} 