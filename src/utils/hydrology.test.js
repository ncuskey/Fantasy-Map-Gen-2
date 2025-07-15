import { describe, it, expect } from 'vitest';
import {
  computeFlowDirections,
  computeFlowAccumulation,
  extractRivers
} from './hydrology.js';

describe('Hydrology utilities', () => {
  // Simple 2×2 heightmap:
  // [2, 1]
  // [1, 0]
  const heightmap = [
    [2, 1],
    [1, 0],
  ];

  const expectedFlowDir = [
    [3, 4],  // (0,0)->SE, (1,0)->S
    [2, -1], // (0,1)->E, (1,1)->no flow
  ];

  it('computeFlowDirections assigns the steepest-downhill neighbor', () => {
    const flowDir = computeFlowDirections(heightmap);
    expect(flowDir).toStrictEqual(expectedFlowDir);
  });

  it('computeFlowAccumulation propagates counts correctly', () => {
    const flowAcc = computeFlowAccumulation(expectedFlowDir, heightmap);
    // Only the bottom-right cell (1,1) accumulates all upstream flow
    expect(flowAcc).toStrictEqual([
      [1, 1],
      [1, 4],
    ]);
  });

  it('extractRivers builds a river polyline above threshold=1', () => {
    const flowDir = computeFlowDirections(heightmap);
    const flowAcc = computeFlowAccumulation(flowDir, heightmap);
    const rivers = extractRivers(flowAcc, flowDir, 1);

    // We should get exactly one river: from (0,0) → (1,1)
    expect(rivers).toHaveLength(1);
    expect(rivers[0]).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('extractRivers returns empty array when threshold is too high', () => {
    const flowDir = computeFlowDirections(heightmap);
    const flowAcc = computeFlowAccumulation(flowDir, heightmap);
    const rivers = extractRivers(flowAcc, flowDir, 5);
    expect(rivers).toHaveLength(0);
  });
}); 