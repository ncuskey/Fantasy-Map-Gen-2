// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { placeRegionLabels, placeTownLabels, placeRiverLabels } from './labels.js';

/**
 * Vitest tests for label placement
 */
describe('placeRegionLabels', () => {
  it('appends one <text> per region label with correct textContent and x,y', () => {
    const dom = new JSDOM(`<svg></svg>`);
    const svg = dom.window.document.querySelector('svg');
    const centroids = [ {regionId:0,x:10,y:20}, {regionId:1,x:30,y:40} ];
    const labels = ['A','B'];
    placeRegionLabels(svg, centroids, labels, { offset: 0 });
    const texts = svg.querySelectorAll('text');
    expect(texts).toHaveLength(2);
    expect(texts[0].textContent).toBe('A');
    expect(texts[0].getAttribute('x')).toBe('10');
    expect(texts[0].getAttribute('y')).toBe('20');
    expect(texts[1].textContent).toBe('B');
    expect(texts[1].getAttribute('x')).toBe('30');
    expect(texts[1].getAttribute('y')).toBe('40');
  });
});

describe('placeTownLabels', () => {
  it('adds correct number of <text> with offsets', () => {
    const dom = new JSDOM(`<svg></svg>`);
    const svg = dom.window.document.querySelector('svg');
    const towns = [ {x:5,y:10,name:'Foo'}, {x:15,y:20,name:'Bar'} ];
    placeTownLabels(svg, towns, { offset: 3 });
    const texts = svg.querySelectorAll('text');
    expect(texts).toHaveLength(2);
    expect(texts[0].textContent).toBe('Foo');
    expect(texts[0].getAttribute('x')).toBe('8');
    expect(texts[0].getAttribute('y')).toBe('7');
    expect(texts[1].textContent).toBe('Bar');
    expect(texts[1].getAttribute('x')).toBe('18');
    expect(texts[1].getAttribute('y')).toBe('17');
  });
});

describe('placeRiverLabels', () => {
  it('creates <defs> paths and <textPath> elements matched by id and content', () => {
    const dom = new JSDOM(`<svg></svg>`);
    const svg = dom.window.document.querySelector('svg');
    const rivers = [ [ {x:0,y:0}, {x:10,y:0} ] ];
    placeRiverLabels(svg, rivers, ['River1'], {});
    const defs = svg.querySelector('defs');
    expect(defs).toBeTruthy();
    const path = defs.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('id')).toBe('riverPath0');
    expect(path.getAttribute('d')).toBe('M0 0 L10 0');
    const text = svg.querySelector('text');
    expect(text).toBeTruthy();
    const textPath = text.querySelector('textPath');
    expect(textPath).toBeTruthy();
    expect(textPath.getAttribute('xlink:href')).toBe('#riverPath0');
    expect(textPath.textContent).toBe('River1');
  });
}); 