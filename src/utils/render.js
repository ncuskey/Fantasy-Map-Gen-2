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
 * @typedef {Object} RenderOptions
 * @property {ContourOptions} [contours]
 * @property {RiverRenderOptions} [rivers]
 * @property {Record<string,string>} [biomePalette]
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
 * Renders the full map into a container by ID, creating an SVG and calling the above functions.
 * @param {string} canvasId - The ID of the container element
 * @param {{heightmap: number[][], rivers: Array<Array<{x:number,y:number}>>, biomes: string[][]}} data - Map data
 * @param {RenderOptions} options - Rendering options for contours, rivers, and biomes
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
  // Fill biomes
  if (data.biomes && options.biomePalette) fillBiomes(svg, data.biomes, options.biomePalette);
  // Draw contours
  if (data.heightmap && options.contours) drawContours(svg, data.heightmap, options.contours);
  // Draw rivers
  if (data.rivers && options.rivers) drawRivers(svg, data.rivers, options.rivers);
} 