/**
 * @typedef {{ regionId: number; x: number; y: number; name: string }} RegionLabel
 * @typedef {{ x: number; y: number }[]} River
 * @typedef {{ x: number; y: number; name: string }[]} TownLabels
 * @typedef {Object} LabelOptions
 * @property {string} [font='10px sans-serif']
 * @property {string} [fillColor='#000000']
 * @property {number} [offset=5]
 */

/**
 * Places a <text> element at each centroid’s (x,y) with corresponding label text.
 * Applies font and fillColor, offsetting y by options.offset.
 * Ensures no two region labels overlap by skipping or adjusting ones too close.
 * @param {SVGElement} svg
 * @param {{regionId:number,x:number,y:number}[]} centroids
 * @param {string[]} labels
 * @param {LabelOptions} [options]
 */
export function placeRegionLabels(svg, centroids, labels, options = {}) {
  const {
    font = '10px sans-serif',
    fillColor = '#000000',
    offset = 5,
  } = options;
  const placed = [];
  for (let i = 0; i < centroids.length; i++) {
    const { x, y } = centroids[i];
    // Check for overlap (simple: skip if too close to any placed label)
    let tooClose = false;
    for (const p of placed) {
      const dx = x - p.x, dy = y - p.y;
      if (dx * dx + dy * dy < (offset * 2) * (offset * 2)) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y + offset));
    text.setAttribute('font-family', font);
    text.setAttribute('fill', fillColor);
    text.textContent = labels[i];
    svg.appendChild(text);
    placed.push({ x, y: y + offset });
  }
}

/**
 * For each river, places a label at the midpoint using <textPath> and <defs>.
 * @param {SVGElement} svg
 * @param {River[]} rivers
 * @param {string[]} names
 * @param {LabelOptions} [options]
 */
export function placeRiverLabels(svg, rivers, names, options = {}) {
  const {
    font = '10px sans-serif',
    fillColor = '#000000',
    offset = 5,
  } = options;
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  rivers.forEach((river, i) => {
    const pathId = `riverPath${i}`;
    const d = river.map(({x,y},j) => `${j===0?'M':'L'}${x} ${y}`).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', pathId);
    path.setAttribute('d', d);
    defs.appendChild(path);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('font-family', font);
    text.setAttribute('fill', fillColor);
    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    textPath.setAttribute('startOffset', '50%');
    textPath.setAttribute('text-anchor', 'middle');
    textPath.textContent = names[i];
    text.appendChild(textPath);
    svg.appendChild(text);
  });
}

/**
 * Places a <text> at (x+offset, y-offset) for each town with its name.
 * @param {SVGElement} svg
 * @param {{x:number,y:number,name:string}[]} towns
 * @param {LabelOptions} [options]
 */
export function placeTownLabels(svg, towns, options = {}) {
  const {
    font = '10px sans-serif',
    fillColor = '#000000',
    offset = 5,
  } = options;
  towns.forEach(({ x, y, name }) => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x + offset));
    text.setAttribute('y', String(y - offset));
    text.setAttribute('font-family', font);
    text.setAttribute('fill', fillColor);
    text.textContent = name;
    svg.appendChild(text);
  });
} 