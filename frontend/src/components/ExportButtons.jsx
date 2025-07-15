import { exportMapAsSVG, exportMapAsPNG, exportMapData } from '../utils/export.js';

export default function ExportButtons({ svgId, data }) {
  const downloadSVG = () => {
    const svg = document.getElementById(svgId);
    const svgString = exportMapAsSVG(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'map.svg'; a.click();
  };

  const downloadPNG = async () => {
    const svg = document.getElementById(svgId);
    const dataUrl = await exportMapAsPNG(svg, 1000, 1000);
    const a = document.createElement('a');
    a.href = dataUrl; a.download = 'map.png'; a.click();
  };

  const downloadJSON = () => {
    const json = exportMapData(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'map.json'; a.click();
  };

  return (
    <div className="exports">
      <button onClick={downloadSVG}>Download SVG</button>
      <button onClick={downloadPNG}>Download PNG</button>
      <button onClick={downloadJSON}>Download JSON</button>
    </div>
  );
} 