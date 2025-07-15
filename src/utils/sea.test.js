import { describe, it, expect } from 'vitest';
import { generateSeaMask, smoothSeaMask } from './sea.js';

describe('generateSeaMask', () => {
  it('correctly marks sea cells for a 3x3 heightmap', () => {
    const heightmap = [
      [0.1, 0.3, 0.2],
      [0.05, 0.25, 0.21],
      [0.19, 0.22, 0.18],
    ];
    // seaLevel = 0.2
    // true if < 0.2
    const expected = [
      [true, false, false],
      [true, false, false],
      [true, false, true],
    ];
    expect(generateSeaMask(heightmap)).toEqual(expected);
  });
});

describe('smoothSeaMask', () => {
  it('smooths a jagged mask (1 iteration, threshold 5)', () => {
    // Jagged mask: only center and corners are true
    const mask = [
      [true, false, true],
      [false, true, false],
      [true, false, true],
    ];
    // For each cell, count 3x3 block; set true if >=5 trues
    // Only center will have 5 trues (itself + 4 corners)
    const expected = [
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ];
    expect(smoothSeaMask(mask, 1, 5)).toEqual(expected);
  });
}); 