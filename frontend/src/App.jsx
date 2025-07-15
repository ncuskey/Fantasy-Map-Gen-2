import { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import MapCanvas from './components/MapCanvas';
import ExportButtons from './components/ExportButtons';
import './index.css';

// Static imports so that re-running the effect is immediate and reliable
import { generateHeightmap } from './utils/heightmap.js';
import { generateSeaMask, smoothSeaMask } from './utils/sea.js';
import { generateMoistureMap } from './utils/moisture.js';
import { assignBiomes } from './utils/biomes.js';
import {
  computeFlowDirections,
  computeFlowAccumulation,
  extractRivers
} from './utils/hydrology.js';
import { generateRegionMap, computeRegionCentroids } from './utils/regions.js';
import { generateSettlements } from './utils/settlements.js';
import { generateRoads } from './utils/roads.js';
import { exportMapAsSVG, exportMapAsPNG, exportMapData } from './utils/export.js';

const isCypress = typeof window !== 'undefined' && window.Cypress;

export default function App() {
  // Map data
  const [seed,      setSeed]      = useState(123);
  const [seaLevel,  setSeaLevel]  = useState(0.2);
  const [noiseOpts, setNoiseOpts] = useState({ octaves:4, frequency:1, persistence:0.5, lacunarity:2 });
  const [moistOpts, setMoistOpts] = useState({ octaves:4, frequency:1, persistence:0.5, lacunarity:2 });
  const [townOpts,  setTownOpts]  = useState({ count:20, minDistance:50 });
  const [roadOpts,  setRoadOpts]  = useState({ extraEdgeProbability:0.1, jitter:1 });
  // Data refs
  const [mapData, setMapData] = useState(null);

  // Regenerate map when parameters change
  useEffect(() => {
    const MAP_SIZE = isCypress ? 100 : 500;
    const SMOOTH_ITERS = isCypress ? 1 : 2;

    // 1. Heightmap
    const heightmap = generateHeightmap(
      MAP_SIZE,
      MAP_SIZE,
      { seed, ...noiseOpts, gradientFalloff: 'circular' }
    );
    // 2. Sea mask
    const rawMask = generateSeaMask(heightmap, seaLevel);
    const seaMask = smoothSeaMask(rawMask, SMOOTH_ITERS, 5);
    // 3. Moisture
    const moistureMap = generateMoistureMap(
      MAP_SIZE,
      MAP_SIZE,
      { seed: seed + 1, ...moistOpts }
    );
    // 4. Biomes (respecting the UI's seaLevel slider)
    const biomeMap = assignBiomes(heightmap, moistureMap, { oceanLevel: seaLevel });
    // 5. Hydrology
    const flowDir = computeFlowDirections(heightmap);
    const flowAcc = computeFlowAccumulation(flowDir, heightmap);
    const rivers  = extractRivers(flowAcc, flowDir, 20);
    // 6. Towns & regions
    const towns     = generateSettlements(heightmap, biomeMap, townOpts);
    const regionMap = generateRegionMap(MAP_SIZE, MAP_SIZE, towns, {});
    const centroids = computeRegionCentroids(regionMap);
    // 7. Roads
    const roads = generateRoads(towns, { seed, ...roadOpts });

    setMapData({
      heightmap,
      seaMask,
      moistureMap,
      biomeMap,
      rivers,
      regionMap,
      centroids,
      towns,
      roads,
      seaLevel
    });
  }, [
    seed,
    seaLevel,
    noiseOpts,
    moistOpts,
    townOpts,
    roadOpts
  ]);

  return (
    <div className="app">
      <ControlPanel
        seed={seed} setSeed={setSeed}
        seaLevel={seaLevel} setSeaLevel={setSeaLevel}
        noiseOpts={noiseOpts} setNoiseOpts={setNoiseOpts}
        moistOpts={moistOpts} setMoistOpts={setMoistOpts}
        townOpts={townOpts} setTownOpts={setTownOpts}
        roadOpts={roadOpts} setRoadOpts={setRoadOpts}
      />
      {mapData && <MapCanvas data={mapData} />}
      {mapData && <ExportButtons svgId="map-svg" data={mapData} />}
    </div>
  );
}
