/**
 * @typedef {Object} ContourOptions
 * @property {number} interval - Elevation interval between contours
 * @property {string} [className] - CSS class for contour paths
 */

/**
 * @typedef {Object} RiverRenderOptions
 * @property {string} [stroke] - Stroke color for rivers
 * @property {number} [strokeWidth] - Stroke width for rivers
 * @property {number} [jitter] - Max random offset for hand-drawn effect
 * @property {string} [className] - CSS class for river paths
 */

/**
 * @typedef {Object} CoastlineOptions
 * @property {number} [seaLevel] - Elevation threshold for sea (for coastline)
 * @property {number} [coastSmoothness] - Number of smoothing iterations for coastline
 */

/**
 * @typedef {Object} RenderOptions
 * @property {ContourOptions} [contours]
 * @property {RiverRenderOptions} [rivers]
 * @property {Record<string,string>} [biomePalette]
 * @property {CoastlineOptions} [coastline]
 */

/**
 * Draws contour lines on an SVG element using Marching Squares.
 * @param {SVGElement} svg - The SVG element to append paths to
 * @param {number[][]} heightmap - 2D array of elevation values
 * @param {ContourOptions} options - Contour interval and styling
 */
export function drawContours(svg, heightmap, options) {
  // Placeholder: Implement Marching Squares for contours
  // For each contour level, generate paths and append to svg
  // Example: svg.appendChild(pathEl)
}

/**
 * Draws river polylines on an SVG element with hand-drawn jitter.
 * @param {SVGElement} svg - The SVG element to append paths to
 * @param {Array<Array<{x:number,y:number}>>} rivers - Array of river polylines
 * @param {RiverRenderOptions} options - Stroke and jitter options
 */
export function drawRivers(svg, rivers, options) {
  // Placeholder: For each river, create a path with random jitter
  // Example: svg.appendChild(pathEl)
}

/**
 * Fills biomes on an SVG element using a palette.
 * @param {SVGElement} svg - The SVG element to append shapes to
 * @param {string[][]} biomes - 2D array of biome names
 * @param {Record<string,string>} palette - Mapping of biome names to fill colors
 */
export function fillBiomes(svg, biomes, palette) {
  // Placeholder: For each cell, append a <rect> or <polygon> with fill=palette[biome]
  // Example: svg.appendChild(rectEl)
}

/**
 * Draws a greyscale overlay for a 2D numeric map (e.g. moisture).
 * @param {SVGElement} svg - The SVG element to append to
 * @param {number[][]} map - 2D array of values in [0,1]
 * @param {string} [className] - Optional CSS class
 */
function drawGreyscaleOverlay(svg, map, className = 'moisture-debug') {
  const h = map.length;
  const w = map[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const val = Math.round(map[y][x] * 255);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', 1);
      rect.setAttribute('height', 1);
      rect.setAttribute('fill', `rgb(${val},${val},${val})`);
      if (className) rect.setAttribute('class', className);
      svg.appendChild(rect);
    }
  }
}

/**
 * Renders the full map into a container by ID, creating an SVG and calling the above functions.
 * @param {string} canvasId - The ID of the container element
 * @param {{heightmap: number[][], rivers: Array<Array<{x:number,y:number}>>, biomes?: string[][], moistureMap?: number[][]}} data - Map data
 * @param {RenderOptions & {seaLevel?: number, coastSmoothness?: number, moisture?: object, debugMoisture?: boolean}} options - Rendering options for contours, rivers, biomes, coastline, and moisture
 */
export function renderMap(canvasId, data, options) {
  // Create SVG element
  const container = document.getElementById(canvasId);
  if (!container) throw new Error('Container not found');
  container.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', data.heightmap[0].length);
  svg.setAttribute('height', data.heightmap.length);
  container.appendChild(svg);

  // Generate moisture map if not provided
  let moistureMap = data.moistureMap;
  if (!moistureMap) {
    moistureMap = generateMoistureMap(data.heightmap[0].length, data.heightmap.length, options.moisture);
  }

  // Assign biomes if not provided
  let biomes = data.biomes;
  if (!biomes && moistureMap) {
    biomes = assignBiomes(data.heightmap, moistureMap, options.biomeOptions);
  }

  // Debug overlay for moisture
  if (options.debugMoisture) {
    drawGreyscaleOverlay(svg, moistureMap, 'moisture-debug');
  }

  // Fill biomes
  if (biomes && options.biomePalette) fillBiomes(svg, biomes, options.biomePalette);
  // Draw coastline if options provided
  if (typeof options.seaLevel === 'number' && typeof options.coastSmoothness === 'number') {
    const seaMask = generateSeaMask(data.heightmap, options.seaLevel);
    const smoothMask = smoothSeaMask(seaMask, options.coastSmoothness);
    // Convert boolean mask to numeric for contouring
    const maskNumeric = smoothMask.map(row => row.map(v => v ? 1 : 0));
    drawContours(svg, maskNumeric, { interval: 0.5, className: 'coastline' });
  }
  // Draw contours
  if (data.heightmap && options.contours) drawContours(svg, data.heightmap, options.contours);
  // Draw rivers
  if (data.rivers && options.rivers) drawRivers(svg, data.rivers, options.rivers);
} 