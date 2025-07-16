/**
 * @param {number[][]} field - 2D elevation grid
 * @param {number} level     - contour value
 * @returns {Array<[{x:number,y:number},{x:number,y:number}]>} array of line segments
 */
export function generateSegments(field, level) {
  const segments = [];
  const height = field.length;
  const width = field[0].length;
  
  // Marching squares implementation
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      // Get the four corners of the current cell
      const a = field[y][x];
      const b = field[y][x + 1];
      const c = field[y + 1][x + 1];
      const d = field[y + 1][x];
      
      // Determine which corners are above/below the contour level
      const corners = [a, b, c, d].map(v => v >= level ? 1 : 0);
      const caseIndex = corners[0] + corners[1] * 2 + corners[2] * 4 + corners[3] * 8;
      
      // Generate line segments based on the marching squares case
      if (caseIndex === 0 || caseIndex === 15) {
        // No contour line in this cell
        continue;
      }
      
      // Interpolate edge intersections
      const edges = [];
      if ((corners[0] !== corners[1])) {
        const t = (level - a) / (b - a);
        edges.push({ x: x + t, y: y });
      }
      if ((corners[1] !== corners[2])) {
        const t = (level - b) / (c - b);
        edges.push({ x: x + 1, y: y + t });
      }
      if ((corners[2] !== corners[3])) {
        const t = (level - c) / (d - c);
        edges.push({ x: x + 1 - t, y: y + 1 });
      }
      if ((corners[3] !== corners[0])) {
        const t = (level - d) / (a - d);
        edges.push({ x: x, y: y + 1 - t });
      }
      
      // Add line segments (pairs of points)
      for (let i = 0; i < edges.length; i += 2) {
        if (i + 1 < edges.length) {
          segments.push([edges[i], edges[i + 1]]);
        }
      }
    }
  }
  
  return segments;
}

/** Convert one segment to an SVG path "d=" string */
export function segToPathD([[p0, p1]]) {
  return `M${p0.x} ${p0.y} L${p1.x} ${p1.y}`;
} 