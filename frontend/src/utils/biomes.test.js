import { describe, it, expect } from 'vitest';
import { assignBiomes } from './biomes.js';

describe('assignBiomes', () => {
  // 3x3 synthetic maps
  // Elevation:  [0.1, 0.22, 0.85]
  //              [0.3, 0.65, 0.78]
  //              [0.5, 0.6, 0.9]
  // Moisture:   [0.1, 0.3, 0.8]
  //              [0.15, 0.5, 0.75]
  //              [0.25, 0.45, 0.9]
  const heightmap = [
    [0.1, 0.22, 0.85],
    [0.3, 0.65, 0.78],
    [0.5, 0.6, 0.9],
  ];
  const moistureMap = [
    [0.1, 0.3, 0.8],
    [0.15, 0.5, 0.75],
    [0.25, 0.45, 0.9],
  ];

  it('assigns correct biomes with default options', () => {
    const expected = [
      ['Ocean', 'Beach', 'Mountain'],
      ['Desert', 'Snow', 'Snow'],
      ['Grassland', 'Tundra', 'Mountain'],
    ];
    const result = assignBiomes(heightmap, moistureMap);
    expect(result).toStrictEqual(expected);
  });

  it('changing oceanLevel changes biome map', () => {
    const options = { oceanLevel: 0.5 };
    const expected = [
      ['Ocean', 'Ocean', 'Mountain'],
      ['Ocean', 'Snow', 'Snow'],
      ['Grassland', 'Tundra', 'Mountain'],
    ];
    const result = assignBiomes(heightmap, moistureMap, options);
    expect(result).toStrictEqual(expected);
  });
}); 