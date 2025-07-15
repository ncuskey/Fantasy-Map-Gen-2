# Devlog
All entries in YYYY-MM-DD format.

## 2025-07-15
- **Heightmap Module**: Added optional `seed` parameter for deterministic noise and `falloffCurve` (`linear|smooth|power`) to `generateHeightmap` in `src/utils/heightmap.js`.
- **Testing**: Created Vitest suite in `src/utils/heightmap.test.js` to verify determinism, value normalization, and work of `gradientFalloff` options.
- **Hydrology Module**: Added `computeFlowDirections`, `computeFlowAccumulation`, and `extractRivers` to `src/utils/hydrology.js` for river network analysis.
- **Testing**: Created Vitest suite in `src/utils/hydrology.test.js` to cover flow direction, accumulation, and river extraction.
- **Heightmap Module**: Switched to `simplex-noise` with `seedrandom` for deterministic, multi-octave noise. All tests now pass.
- **Biomes Module**: Added `assignBiomes` in `src/utils/biomes.js` with full test coverage for biome assignment and threshold overrides.

## 2025-07-16
- **Render Module**: Created `src/utils/render.js` with JSDoc and placeholder logic for drawing contours, rivers, filling biomes, and rendering the map. Added minimal Vitest test suite (`render.test.js`) and set up jsdom environment for SVG testing.
- **Coastline Integration**: Integrated `generateSeaMask` and `smoothSeaMask` from `src/utils/sea.js` into the render pipeline. Coastline rendering now uses `seaLevel` and `coastSmoothness` options to generate and smooth the sea mask before drawing coastline contours.
- **Moisture Integration**: Integrated `generateMoistureMap` from `src/utils/moisture.js` into the render pipeline. Biome assignment now uses the generated moisture field, and a `debugMoisture` overlay option is available for visualizing the moisture map in the SVG output.
- **Settlements Integration**: Integrated `generateSettlements` from `src/utils/settlements.js` into the render pipeline. Settlement placement now uses Poisson-disc sampling with elevation, biome, and spacing constraints, and a `debugSettlements` overlay option is available for visualizing settlements in the SVG output.
- **Roads Integration**: Integrated `generateRoads` from `src/utils/roads.js` into the render pipeline. Road network generation now uses MST, extra edges, and jitter, and a `debugRoads` overlay option is available for visualizing roads in the SVG output.
- **Render Exports**: `drawSettlements` and `drawRoads` are now exported from `render.js` with full rendering options and typedefs. Overlay rendering is tested in `render.test.js`.
- **Regions Module**: Added `src/utils/regions.js` for Voronoi region assignment (`generateRegionMap`) and centroid computation (`computeRegionCentroids`), with full tests.
- **Labels Module**: Added `src/utils/labels.js` for SVG label placement for regions, towns, and rivers (`placeRegionLabels`, `placeTownLabels`, `placeRiverLabels`), with full DOM/JSDOM test coverage.
- **Documentation**: Updated `README.md` to fully describe all modules, options, and test setup, including `render.js` and jsdom requirements. Confirmed all modules have JSDoc and inline documentation. Added a development section to the README. Maintenance and documentation work completed.

<!-- Add future entries here as tasks progress --> 