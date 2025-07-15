import { generateMoistureMap } from './moisture.js';
import { assignBiomes } from './biomes.js';
import { generateSeaMask, smoothSeaMask } from './sea.js';
import { generateSettlements } from './settlements.js';
import { generateRoads } from './roads.js';

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
 * @typedef {{ x: number; y: number }} Point
 * @typedef {Object} SettlementRenderOptions
 * @property {number} [symbolSize=5] - Radius of the settlement symbol
 * @property {string} [fillColor='#ffffff'] - Fill color of the symbol
 * @property {string} [strokeColor='#000000'] - Outline color of the symbol
 * @property {boolean} [label=false] - Whether to render a text label
 * @property {string} [labelFont='10px sans-serif'] - Font for labels
 */
/**
 * @typedef {Object} RoadRenderOptions
 * @property {number} [strokeWidth=2] - Width of the road stroke
 * @property {string} [strokeColor='#888888'] - Color of the road stroke
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
 * Renders settlement symbols onto the SVG.
 * @param {SVGElement} svg - The target SVG element
 * @param {Point[]} towns - Array of settlement coordinates
 * @param {SettlementRenderOptions} options - Rendering options
 */
export function drawSettlements(svg, towns, options = {}) {
  const {
    symbolSize = 5,
    fillColor = '#ffffff',
    strokeColor = '#000000',
    label = false,
    labelFont = '10px sans-serif',
  } = options;
  towns.forEach(({ x, y }, i) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', String(symbolSize));
    circle.setAttribute('fill', fillColor);
    circle.setAttribute('stroke', strokeColor);
    svg.appendChild(circle);
    if (label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('x', String(x + symbolSize + 2));
      text.setAttribute('y', String(y));
      text.setAttribute('font', labelFont);
      text.textContent = `Town ${i+1}`;
      svg.appendChild(text);
    }
  });
}

/**
 * Renders road polylines onto the SVG.
 * @param {SVGElement} svg - The target SVG element
 * @param {{ path: Point[] }[]} roads - Array of road objects
 * @param {RoadRenderOptions} options - Rendering options
 */
export function drawRoads(svg, roads, options = {}) {
  const {
    strokeWidth = 2,
    strokeColor = '#888888',
  } = options;
  roads.forEach(({ path }) => {
    const d = path.map(({x,y}, i) => `${i===0 ? 'M' : 'L'}${x} ${y}`).join(' ');
    const roadPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    roadPath.setAttribute('d', d);
    roadPath.setAttribute('fill', 'none');
    roadPath.setAttribute('stroke-width', String(strokeWidth));
    roadPath.setAttribute('stroke', strokeColor);
    svg.appendChild(roadPath);
  });
}

/**
 * Renders the full map into a container or SVG element.
 * @param {string|HTMLElement|SVGElement} target - ID of a container, a container element, or an existing SVG element
 * @param {Object} data - Map data (heightmap, rivers, biomes, etc.)
 * @param {RenderOptions & {...}} options - Rendering options
 */
export function renderMap(target, data, options) {
  let svg;
  // If string, treat as container ID
  if (typeof target === 'string') {
    const container = document.getElementById(target);
    if (!container) throw new Error('Container not found');
    container.innerHTML = '';
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(data.heightmap[0].length));
    svg.setAttribute('height', String(data.heightmap.length));
    container.appendChild(svg);
  }
  // If SVG element, clear it and reuse
  else if (target instanceof SVGElement) {
    svg = target;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }
  // If generic container element, create a new SVG inside it
  else if (target instanceof HTMLElement) {
    const container = target;
    container.innerHTML = '';
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(data.heightmap[0].length));
    svg.setAttribute('height', String(data.heightmap.length));
    container.appendChild(svg);
  }
  else {
    throw new Error('Container not found');
  }

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

  // Generate settlements if not provided
  let settlements = data.settlements;
  if (!settlements && options.settlements) {
    settlements = generateSettlements(
      data.heightmap,
      biomes,
      options.settlements
    );
  }

  // Generate roads if not provided
  let roads = data.roads;
  if (!roads && settlements && options.roads) {
    roads = generateRoads(settlements, options.roads);
  }

  // Debug overlay for moisture
  if (options.debugMoisture) {
    drawGreyscaleOverlay(svg, moistureMap, 'moisture-debug');
  }

  // Debug overlay for settlements
  if (options.debugSettlements && settlements) {
    drawSettlements(svg, settlements, 'settlement-debug');
  }

  // Debug overlay for roads
  if (options.debugRoads && roads) {
    drawRoads(svg, roads, 'road-debug');
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
  // Draw roads and settlements overlays
  if (data.roads && data.roads.length) drawRoads(svg, data.roads, options.roadRender);
  if (data.towns && data.towns.length) drawSettlements(svg, data.towns, options.settlementRender);
  // Draw settlements (main overlay)
  if (settlements && !options.debugSettlements) {
    drawSettlements(svg, settlements, 'settlement');
  }
  // Draw roads (main overlay)
  if (roads && !options.debugRoads) {
    drawRoads(svg, roads, 'road');
  }
} 