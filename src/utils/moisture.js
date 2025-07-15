import { createNoise2D } from 'simplex-noise';
import seedrandom from 'seedrandom';

/**
 * Generates a 2D moisture map using multi-octave 2D Simplex noise.
 *
 * @param {number} width - Number of columns in the map
 * @param {number} height - Number of rows in the map
 * @param {Object} [options] - Noise options
 * @param {number} [options.octaves=4] - Number of noise octaves (layers)
 * @param {number} [options.frequency=1] - Base frequency of the noise
 * @param {number} [options.amplitude=1] - Base amplitude of the noise
 * @param {number} [options.persistence=0.5] - Amplitude multiplier per octave
 * @param {number} [options.lacunarity=2.0] - Frequency multiplier per octave
 * @param {number} [options.seed] - Optional seed for deterministic noise
 * @returns {number[][]} 2D array of normalized moisture values (0-1)
 */
export function generateMoistureMap(width, height, options = {}) {
  const {
    octaves = 4,
    frequency = 1,
    amplitude = 1,
    persistence = 0.5,
    lacunarity = 2.0,
    seed,
  } = options;

  const rng = seed !== undefined ? seedrandom(seed.toString()) : Math.random;
  const noise2D = createNoise2D(rng);
  const map = Array.from({ length: height }, () => Array(width).fill(0));

  let min = Infinity;
  let max = -Infinity;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = x / width - 0.5;
      let ny = y / height - 0.5;
      let value = 0;
      let amp = amplitude;
      let freq = frequency;
      for (let o = 0; o < octaves; o++) {
        value += noise2D(nx * freq, ny * freq) * amp;
        amp *= persistence;
        freq *= lacunarity;
      }
      map[y][x] = value;
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }

  // Normalize to [0, 1]
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      map[y][x] = (map[y][x] - min) / (max - min);
    }
  }

  return map;
} 