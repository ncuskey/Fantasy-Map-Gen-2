import { useEffect, useRef } from 'react';
import { renderMap } from '../utils/render.js';

export default function MapCanvas({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    console.log('🏗️  Calling renderMap with svgRef:', svgRef.current, 'data:', data);
    const svg = svgRef.current;
    // clear old content
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // call your renderMap:
    renderMap(svg, data, {
      contour:    { interval: 0.1, className: 'contour' },
      river:      { strokeWidth: 2, strokeColor: '#00f' },
      biome:      { palette: {/*...*/} },
      roadRender: { strokeWidth: 2, strokeColor: '#888' },
      settlementRender: { symbolSize: 4, fillColor: '#fff' },
      label:      { font: '10px serif', fillColor: '#000' },
      // note: no top-level `sea` here—seaMask is already baked into data,
      // so you don't need options.sea for drawing.
    });
  }, [data]);

  return (
    <div className="map-container">
      <svg id="map-svg" ref={svgRef} width={500} height={500} />
    </div>
  );
} 