import { useEffect, useRef } from 'react';
import { renderMap } from '../utils/render.js';

export default function MapCanvas({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = svgRef.current;
    // clear old content
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // call your renderMap:
    renderMap(svg, data, {
      sea: { seaLevel: data.seaLevel, coastSmoothness: 2 },
      contour: { interval: 0.1, className: 'contour' },
      river: { strokeColor: '#00f', strokeWidth: 2 },
      biome: { palette: {/*...*/} },
      roadRender: { strokeColor: '#888', strokeWidth: 2 },
      settlementRender: { symbolSize: 4, fillColor: '#fff' },
      label: { font: '10px serif', fillColor: '#000' },
    });
  }, [data]);

  return (
    <div className="map-container">
      <svg id="map-svg" ref={svgRef} width={500} height={500} />
    </div>
  );
} 