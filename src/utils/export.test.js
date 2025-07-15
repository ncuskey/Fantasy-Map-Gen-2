import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { exportMapAsSVG, exportMapAsPNG, exportMapData } from './export.js';

describe('export.js', () => {
  it('exportMapAsSVG serializes SVG to string', () => {
    const dom = new JSDOM('<!DOCTYPE html><svg xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2"/></svg>', { contentType: 'image/svg+xml' });
    const svg = dom.window.document.querySelector('svg');
    const result = exportMapAsSVG(svg);
    expect(result).toContain('<svg');
    expect(result).toContain('<circle');
  });

  it('exportMapData serializes and parses data correctly', () => {
    const data = {
      heightmap: [[0,1],[1,0]],
      moistureMap: [[0.5,0.5],[0.5,0.5]],
      regionMap: [[1,2],[2,1]],
      towns: [{x:1,y:2}],
      roads: [{ path: [{x:1,y:2},{x:2,y:3}] }],
      biomes: [['forest','desert'],['plains','mountain']]
    };
    const json = exportMapData(data);
    expect(JSON.parse(json)).toEqual(data);
  });

  it('exportMapAsPNG returns a PNG data URL', async () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg></body></html>', { pretendToBeVisual: true, runScripts: 'dangerously', resources: 'usable' });
    global.document = dom.window.document;
    global.window = dom.window;
    const svg = dom.window.document.querySelector('svg');
    const dataUrl = await exportMapAsPNG(svg, 10, 10);
    expect(dataUrl).toMatch(/^data:image\/png/);
  });
}); 