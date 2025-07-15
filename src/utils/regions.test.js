import { describe, it, expect } from 'vitest';
import { generateRegionMap, computeRegionCentroids } from './regions.js';

/**
 * Vitest tests for regions
 */
describe('generateRegionMap', () => {
  it('returns a 5x5 array and corner cells map to correct town', () => {
    const towns = [ {x:0,y:0}, {x:4,y:4} ];
    const map = generateRegionMap(5, 5, towns, {});
    expect(map).toHaveLength(5);
    expect(map[0]).toHaveLength(5);
    expect(map[0][0]).toBe(0);
    expect(map[4][4]).toBe(1);
  });
});

describe('computeRegionCentroids', () => {
  it('computes correct averages for a small regionMap', () => {
    // region 0: (0,0),(1,0),(0,1); region 1: (1,1)
    const regionMap = [ [0,0], [0,1] ];
    const centroids = computeRegionCentroids(regionMap);
    // region 0: avg x=(0+1+0)/3=0.333..., y=(0+0+1)/3=0.333...
    // region 1: x=1, y=1
    const c0 = centroids.find(c => c.regionId === 0);
    const c1 = centroids.find(c => c.regionId === 1);
    expect(c0.x).toBeCloseTo(0.333, 2);
    expect(c0.y).toBeCloseTo(0.333, 2);
    expect(c1.x).toBeCloseTo(1);
    expect(c1.y).toBeCloseTo(1);
  });
}); 