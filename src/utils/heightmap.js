import SimplexNoise from 'simplex-noise';

/**
 * @typedef {Object} HeightmapOptions
 * @property {number} octaves - Number of noise octaves (layers)
 * @property {number} frequency - Base frequency of the noise
 * @property {number} amplitude - Base amplitude of the noise
 * @property {number} persistence - Amplitude multiplier per octave
 * @property {number} lacunarity - Frequency multiplier per octave
 * @property {'circular'|'none'} gradientFalloff - Type of gradient falloff to apply
 * @property {number} [seed] - Optional seed for deterministic noise
 * @property {'linear'|'smooth'|'power'} [falloffCurve] - Optional falloff curve for circular gradient
 */

/**
 * Generates a 2D heightmap using multi-octave 2D Simplex noise (from 'simplex-noise') and optional radial gradient.
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
    seed,
    falloffCurve,
  } = options;

  // Use seed if provided
  const noise = seed !== undefined
    ? new SimplexNoise(seed.toString())
    : new SimplexNoise();
  const map = Array.from({ length: height }, () => Array(width).fill(0));

  // Center for radial gradient
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  let min = Infinity;
  let max = -Infinity;

  // Default falloffCurve for circular gradient
  const effectiveFalloffCurve = (gradientFalloff === 'circular') ? (falloffCurve || 'linear') : undefined;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = x / width - 0.5;
      let ny = y / height - 0.5;
      let value = 0;
      let amp = amplitude;
      let freq = frequency;

      // Multi-octave Simplex noise
      for (let o = 0; o < octaves; o++) {
        value += noise.noise2D(nx * freq, ny * freq) * amp;
        amp *= persistence;
        freq *= lacunarity;
      }

      // Apply radial gradient for island effect
      if (gradientFalloff === 'circular') {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        let falloff = 1;
        switch (effectiveFalloffCurve) {
          case 'smooth': {
            // smoothstep: 1 - (3t^2 - 2t^3)
            const t = dist;
            falloff = 1 - (3 * t * t - 2 * t * t * t);
            break;
          }
          case 'power': {
            falloff = Math.pow(1 - dist, 2);
            break;
          }
          case 'linear':
          default: {
            falloff = 1 - dist;
            break;
          }
        }
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