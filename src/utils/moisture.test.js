import { describe, it, expect } from 'vitest';
import { generateMoistureMap } from './moisture.js';

/**
 * Vitest suite for generateMoistureMap
 */
describe('generateMoistureMap', () => {
  const opts = { seed: 123, octaves: 3, frequency: 2, amplitude: 1, persistence: 0.5, lacunarity: 2 };

  it('produces identical output for same seed and options', () => {
    const a = generateMoistureMap(10, 10, opts);
    const b = generateMoistureMap(10, 10, opts);
    expect(a).toEqual(b);
  });

  it('all values are normalized to [0, 1]', () => {
    const map = generateMoistureMap(10, 10, opts);
    for (const row of map) {
      for (const val of row) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    }
  });

  it('different seeds produce different maps', () => {
    const map1 = generateMoistureMap(10, 10, { ...opts, seed: 1 });
    const map2 = generateMoistureMap(10, 10, { ...opts, seed: 2 });
    // Not guaranteed to be different, but very likely
    expect(map1).not.toEqual(map2);
  });
}); 