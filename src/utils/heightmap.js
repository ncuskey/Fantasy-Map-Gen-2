import { Perlin2 } from 'tumult';

/**
 * @typedef {Object} HeightmapOptions
 * @property {number} octaves - Number of noise octaves (layers)
 * @property {number} frequency - Base frequency of the noise
 * @property {number} amplitude - Base amplitude of the noise
 * @property {number} persistence - Amplitude multiplier per octave
 * @property {number} lacunarity - Frequency multiplier per octave
 * @property {'circular'|'none'} gradientFalloff - Type of gradient falloff to apply
 */

/**
 * Generates a 2D heightmap using multi-octave Perlin noise and optional radial gradient.
 *
 * @param {number} width - Number of columns in the heightmap
 * @param {number} height - Number of rows in the heightmap
 * @param {HeightmapOptions} options - Options for noise and gradient
 * @returns {number[][]} 2D array of normalized elevation values (0-1)
 */
export function generateHeightmap(width, height, options) {
  const {
    octaves = 4,
    frequency = 1,
    amplitude = 1,
    persistence = 0.5,
    lacunarity = 2.0,
    gradientFalloff = 'circular',
  } = options;

  const noise = new Perlin2();
  const map = Array.from({ length: height }, () => Array(width).fill(0));

  // Center for radial gradient
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  let min = Infinity;
  let max = -Infinity;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = x / width - 0.5;
      let ny = y / height - 0.5;
      let value = 0;
      let amp = amplitude;
      let freq = frequency;

      // Multi-octave Perlin noise
      for (let o = 0; o < octaves; o++) {
        value += noise.gen(nx * freq, ny * freq) * amp;
        amp *= persistence;
        freq *= lacunarity;
      }

      // Apply radial gradient for island effect
      if (gradientFalloff === 'circular') {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        // Smooth falloff: 1 at center, 0 at edge
        const falloff = 1 - dist;
        value *= Math.max(0, falloff);
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