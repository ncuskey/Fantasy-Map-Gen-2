import { describe, it, expect } from 'vitest';
import { generateHeightmap } from './heightmap.js';

const baseOptions = {
  octaves: 2,
  frequency: 2,
  amplitude: 1,
  persistence: 0.5,
  lacunarity: 2,
  gradientFalloff: 'circular',
  seed: 123,
};

describe('generateHeightmap', () => {
  it('produces deterministic output for the same options and seed', () => {
    const map1 = generateHeightmap(10, 10, baseOptions);
    const map2 = generateHeightmap(10, 10, baseOptions);
    expect(map1).toStrictEqual(map2);
  });

  it('produces values normalized between 0 and 1', () => {
    const map = generateHeightmap(10, 10, baseOptions);
    for (const row of map) {
      for (const val of row) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    }
  });

  it('circular falloff lowers the corner value compared to none', () => {
    const optionsNone = { ...baseOptions, gradientFalloff: 'none' };
    const optionsCircular = { ...baseOptions, gradientFalloff: 'circular' };
    const mapNone = generateHeightmap(10, 10, optionsNone);
    const mapCircular = generateHeightmap(10, 10, optionsCircular);
    // Top-left corner (0,0)
    const cornerNone = mapNone[0][0];
    const cornerCircular = mapCircular[0][0];
    expect(cornerNone).toBeGreaterThan(cornerCircular);
  });
}); 