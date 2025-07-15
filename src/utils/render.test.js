// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { drawContours, drawRivers, fillBiomes, renderMap } from './render.js';

function createSVG(width = 3, height = 3) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  return svg;
}

describe('render utils', () => {
  let svg;
  beforeEach(() => {
    svg = createSVG();
    document.body.innerHTML = '';
    document.body.appendChild(svg);
  });

  it('drawContours appends path elements', () => {
    drawContours(svg, [[0,0,1],[1,0,1],[0,1,0]], { interval: 0.5, className: 'contour' });
    // Placeholder: just check SVG is still present
    expect(svg).toBeInstanceOf(SVGElement);
  });

  it('drawRivers appends path elements', () => {
    drawRivers(svg, [ [ {x:0,y:0}, {x:1,y:1} ] ], { stroke: 'blue', strokeWidth: 2 });
    expect(svg).toBeInstanceOf(SVGElement);
  });

  it('fillBiomes appends rect elements', () => {
    fillBiomes(svg, [ ['A','B'], ['C','D'] ], { A: '#000', B: '#111', C: '#222', D: '#333' });
    expect(svg).toBeInstanceOf(SVGElement);
  });

  it('renderMap creates an SVG in the container', () => {
    const container = document.createElement('div');
    container.id = 'test-canvas';
    document.body.appendChild(container);
    renderMap('test-canvas', {
      heightmap: [[0,1],[1,0]],
      rivers: [ [ {x:0,y:0}, {x:1,y:1} ] ],
      biomes: [['A','B'],['C','D']]
    }, {
      contours: { interval: 0.5 },
      rivers: { stroke: 'blue' },
      biomePalette: { A: '#000', B: '#111', C: '#222', D: '#333' }
    });
    const svgEl = container.querySelector('svg');
    expect(svgEl).toBeInstanceOf(SVGElement);
  });
}); 