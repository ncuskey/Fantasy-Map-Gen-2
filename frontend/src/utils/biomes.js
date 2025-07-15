/**
 * @typedef {Object} BiomeOptions
 * @property {number} oceanLevel - Elevation threshold below which is 'Ocean'
 * @property {number} beachLevel - Elevation threshold below which is 'Beach'
 * @property {number} mountainLevel - Elevation threshold at or above which is 'Mountain'
 * @property {number} tundraLevel - Elevation threshold below which high elevations become 'Tundra' or 'Snow'
 * @property {number} desertMoisture - Moisture threshold below which is 'Desert'
 * @property {number} grasslandMoisture - Moisture threshold below which is 'Grassland'
 * @property {number} forestMoisture - Moisture threshold below which is 'Forest'
 * @property {Record<string, string>} [biomeTable] - Optional mapping of biome keys to display names
 */

const defaultBiomeOptions = {
  oceanLevel: 0.2,
  beachLevel: 0.25,
  mountainLevel: 0.8,
  tundraLevel: 0.6,
  desertMoisture: 0.2,
  grasslandMoisture: 0.4,
  forestMoisture: 0.7,
  biomeTable: {
    ocean: 'Ocean',
    beach: 'Beach',
    desert: 'Desert',
    grassland: 'Grassland',
    forest: 'Forest',
    rainforest: 'Rainforest',
    tundra: 'Tundra',
    snow: 'Snow',
    mountain: 'Mountain',
  },
};

/**
 * Assigns biomes to each cell based on elevation and moisture.
 *
 * @param {number[][]} heightmap - 2D array of elevation values (0-1)
 * @param {number[][]} moistureMap - 2D array of moisture values (0-1)
 * @param {BiomeOptions} options - Biome classification thresholds and table
 * @returns {string[][]} 2D array of biome names (same shape as heightmap)
 */
export function assignBiomes(heightmap, moistureMap, options = {}) {
  const opts = { ...defaultBiomeOptions, ...options };
  const table = opts.biomeTable || defaultBiomeOptions.biomeTable;
  const h = heightmap.length;
  const w = heightmap[0].length;
  const biomes = Array.from({ length: h }, () => Array(w));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const elev = heightmap[y][x];
      const moist = moistureMap[y][x];
      let biomeKey;
      if (elev < opts.oceanLevel) {
        biomeKey = 'ocean';
      } else if (elev < opts.beachLevel) {
        biomeKey = 'beach';
      } else if (elev >= opts.mountainLevel) {
        biomeKey = 'mountain';
      } else if (elev >= opts.tundraLevel) {
        biomeKey = moist < 0.5 ? 'tundra' : 'snow';
      } else {
        if (moist < opts.desertMoisture) {
          biomeKey = 'desert';
        } else if (moist < opts.grasslandMoisture) {
          biomeKey = 'grassland';
        } else if (moist < opts.forestMoisture) {
          biomeKey = 'forest';
        } else {
          biomeKey = 'rainforest';
        }
      }
      biomes[y][x] = table[biomeKey] || biomeKey;
    }
  }
  return biomes;
} 