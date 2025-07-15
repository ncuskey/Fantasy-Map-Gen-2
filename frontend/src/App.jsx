import { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import MapCanvas from './components/MapCanvas';
import ExportButtons from './components/ExportButtons';
import './index.css';

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
    // lazy‑import your pipeline functions
    import('./utils/heightmap.js').then(({ generateHeightmap }) => {
      import('./utils/sea.js').then(({ generateSeaMask, smoothSeaMask }) => {
        import('./utils/moisture.js').then(({ generateMoistureMap }) => {
          import('./utils/biomes.js').then(({ assignBiomes }) => {
            import('./utils/hydrology.js').then(({ computeFlowDirections, computeFlowAccumulation, extractRivers }) => {
              import('./utils/regions.js').then(({ generateRegionMap, computeRegionCentroids }) => {
                import('./utils/settlements.js').then(({ generateSettlements }) => {
                  import('./utils/roads.js').then(({ generateRoads }) => {
                    import('./utils/export.js'); // for ExportButtons
                    // 1. Heightmap
                    const heightmap = generateHeightmap(500, 500, { seed, ...noiseOpts, gradientFalloff:'circular' });
                    // 2. Sea mask
                    const rawMask   = generateSeaMask(heightmap, seaLevel);
                    const seaMask   = smoothSeaMask(rawMask, 2, 5);
                    // 3. Moisture
                    const moistureMap = generateMoistureMap(500, 500, { seed: seed+1, ...moistOpts });
                    // 4. Biomes
                    const biomeMap = assignBiomes(heightmap, moistureMap);
                    // 5. Hydrology
                    const flowDir = computeFlowDirections(heightmap);
                    const flowAcc = computeFlowAccumulation(flowDir, heightmap);
                    const rivers  = extractRivers(flowAcc, flowDir, 20);
                    // 6. Regions & towns
                    const regionMap = generateRegionMap(500, 500, generateSettlements(heightmap, biomeMap, townOpts), {});
                    const centroids = computeRegionCentroids(regionMap);
                    const towns     = generateSettlements(heightmap, biomeMap, townOpts);
                    // 7. Roads
                    const roads = generateRoads(towns, { seed, ...roadOpts });
                    // 8. Package data
                    setMapData({ heightmap, seaMask, moistureMap, biomeMap, rivers, regionMap, centroids, towns, roads, seaLevel });
                  });
                });
              });
            });
          });
        });
      });
    });
  }, [seed, seaLevel, noiseOpts, moistOpts, townOpts, roadOpts]);

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
