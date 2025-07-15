import { describe, it, expect } from 'vitest';
import { generateSettlements } from './settlements.js';

/**
 * Vitest suite for generateSettlements
 */
describe('generateSettlements', () => {
  // 5x5 grid, center is high, corners are water, rest is land
  const heightmap = [
    [0.1, 0.3, 0.3, 0.3, 0.1],
    [0.3, 0.5, 0.7, 0.5, 0.3],
    [0.3, 0.7, 0.9, 0.7, 0.3],
    [0.3, 0.5, 0.7, 0.5, 0.3],
    [0.1, 0.3, 0.3, 0.3, 0.1],
  ];
  const biomeMap = [
    ['o','g','g','g','o'],
    ['g','f','f','f','g'],
    ['g','f','m','f','g'],
    ['g','f','f','f','g'],
    ['o','g','g','g','o'],
  ];
  const options = {
    count: 4,
    minDistance: 2,
    seaLevel: 0.2,
    mountainLevel: 0.8,
    seed: 42,
    biomeWeights: { g: 1, f: 2, m: 0, o: 0 },
  };

  it('produces identical output for same seed and options', () => {
    const a = generateSettlements(heightmap, biomeMap, options);
    const b = generateSettlements(heightmap, biomeMap, options);
    expect(a).toEqual(b);
  });

  it('all settlements are on valid elevation', () => {
    const settlements = generateSettlements(heightmap, biomeMap, options);
    for (const {x, y} of settlements) {
      const elev = heightmap[y][x];
      expect(elev).toBeGreaterThanOrEqual(options.seaLevel);
      expect(elev).toBeLessThan(options.mountainLevel);
    }
  });

  it('all settlements are at least minDistance apart', () => {
    const settlements = generateSettlements(heightmap, biomeMap, options);
    for (let i = 0; i < settlements.length; i++) {
      for (let j = i + 1; j < settlements.length; j++) {
        const dx = settlements[i].x - settlements[j].x;
        const dy = settlements[i].y - settlements[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        expect(dist).toBeGreaterThanOrEqual(options.minDistance);
      }
    }
  });

  it('returns the requested number of settlements', () => {
    const settlements = generateSettlements(heightmap, biomeMap, options);
    expect(settlements.length).toBe(options.count);
  });
}); 