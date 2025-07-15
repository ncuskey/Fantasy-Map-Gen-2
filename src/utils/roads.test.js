import { describe, it, expect } from 'vitest';
import { generateRoads } from './roads.js';

/**
 * Vitest suite for generateRoads
 */
describe('generateRoads', () => {
  const towns = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  const baseOpts = { useMST: true, extraEdgeProbability: 0.5, jitter: 2, seed: 123 };

  it('produces identical output for same towns and options (determinism)', () => {
    const a = generateRoads(towns, baseOpts);
    const b = generateRoads(towns, baseOpts);
    expect(a).toEqual(b);
  });

  it('every town appears in at least one path (connectivity)', () => {
    const roads = generateRoads(towns, baseOpts);
    const seen = new Set();
    for (const road of roads) {
      for (const pt of [road.path[0], road.path[road.path.length - 1]]) {
        seen.add(`${pt.x},${pt.y}`);
      }
    }
    for (const t of towns) {
      expect(seen.has(`${t.x},${t.y}`)).toBe(true);
    }
  });

  it('MST yields exactly towns.length - 1 edges', () => {
    const roads = generateRoads(towns, { ...baseOpts, extraEdgeProbability: 0 });
    expect(roads.length).toBe(towns.length - 1);
  });

  it('extra edges count matches extraEdgeProbability', () => {
    // With 4 towns, 6 possible edges, 3 in MST, so 3 possible extra
    const trials = 100;
    let totalExtra = 0;
    for (let i = 0; i < trials; i++) {
      const roads = generateRoads(towns, { ...baseOpts, seed: i, extraEdgeProbability: 0.5 });
      totalExtra += roads.length - (towns.length - 1);
    }
    const avgExtra = totalExtra / trials;
    // Should be close to 3 * 0.5 = 1.5
    expect(avgExtra).toBeGreaterThan(1.0);
    expect(avgExtra).toBeLessThan(2.0);
  });

  it('jitter does not exceed bounds', () => {
    const roads = generateRoads(towns, { ...baseOpts, jitter: 2 });
    for (const road of roads) {
      const a = road.path[0];
      const b = road.path[road.path.length - 1];
      for (let i = 1; i < road.path.length - 1; i++) {
        const pt = road.path[i];
        // Compute expected straight-line position
        const t = i / (road.path.length - 1);
        const ex = a.x * (1 - t) + b.x * t;
        const ey = a.y * (1 - t) + b.y * t;
        const dx = pt.x - ex;
        const dy = pt.y - ey;
        expect(Math.abs(dx)).toBeLessThanOrEqual(2);
        expect(Math.abs(dy)).toBeLessThanOrEqual(2);
      }
    }
  });
}); 