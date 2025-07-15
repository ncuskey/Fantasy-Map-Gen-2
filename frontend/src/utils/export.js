/**
 * @typedef {Object} ExportData
 * @property {number[][]} heightmap
 * @property {number[][]} moistureMap
 * @property {number[][]} regionMap
 * @property {{x:number,y:number}[]} towns
 * @property {{ path: {x:number,y:number}[] }[]} roads
 * @property {string[][]} biomes
 */

/**
 * Serializes the given SVGElement to an XML string.
 * @param {SVGElement} svg - The SVG element to serialize.
 * @returns {string} The serialized SVG as a string.
 */
export function exportMapAsSVG(svg) {
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Converts an SVGElement to a PNG data URL string.
 * @param {SVGElement} svg - The SVG element to convert.
 * @param {number} width - The width of the output PNG.
 * @param {number} height - The height of the output PNG.
 * @returns {Promise<string>} A promise that resolves to a PNG data URL string.
 */
export async function exportMapAsPNG(svg, width, height) {
  const svgString = exportMapAsSVG(svg);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const img = new window.Image();
  const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = svgDataUrl;
  });
}

/**
 * Serializes the map data to a JSON string.
 * @param {ExportData} data - The map data to export.
 * @returns {string} The JSON string representation of the data.
 */
export function exportMapData(data) {
  return JSON.stringify(data);
} 