# Fantasy Map Gen 2

## Overview
A procedural fantasy map generator inspired by Perilous Shores. Generates terrain, hydrology, biomes, settlements, roads, and renders in a hand-drawn SVG style.

## Installation
```bash
npm install
```

## Usage
```bash
npm run build
npm start
```

## Project Structure

- `src/utils/heightmap.js` — Heightmap generation with multi-octave simplex-noise and deterministic seeding via seedrandom. Supports options for octaves, frequency, amplitude, persistence, lacunarity, gradient falloff, falloff curve, and seed.
- `src/utils/hydrology.js` — Flow direction, accumulation, and river extraction utilities (`computeFlowDirections`, `computeFlowAccumulation`, `extractRivers`).
- `src/utils/biomes.js` — Biome assignment based on elevation and moisture (`assignBiomes`), with configurable thresholds and biome table.
- `src/utils/moisture.js` — Moisture map generation (`generateMoistureMap`) using multi-octave Simplex noise, with deterministic seeding and normalization.
- `src/utils/sea.js` — Sea mask generation (`generateSeaMask`) and smoothing (`smoothSeaMask`) utilities for coastline detection and cleanup.
- `src/utils/settlements.js` — Settlement placement using Poisson-disc sampling with elevation, biome, and spacing constraints (`generateSettlements`).
- `src/utils/roads.js` — Road network generation using MST, extra edges, and jitter (`generateRoads`).
- `src/utils/regions.js` — Voronoi region assignment and centroid computation (`generateRegionMap`, `computeRegionCentroids`).
- `src/utils/labels.js` — SVG label placement for regions, towns, and rivers (`placeRegionLabels`, `placeTownLabels`, `placeRiverLabels`). DOM/JSDOM focused, with full test coverage.
- `src/utils/render.js` — SVG rendering pipeline for map elements. Exports `drawSettlements` and `drawRoads` with full rendering options and typedefs. Integrates coastline rendering (see options: `seaLevel`, `coastSmoothness`), moisture map generation (`moisture`), settlement placement (`settlements`), road network generation (`roads`), and debug overlays for moisture (`debugMoisture`), settlements (`debugSettlements`), and roads (`debugRoads`). Biomes now reflect the generated moisture field. Requires a DOM environment (jsdom) for testing.
- `src/utils/export.js` — Export utilities for exporting map data and SVG renderings.
- `DEVLOG.md` — Development log tracking changes and decisions.

## Tests
Run the Vitest suite with:
```bash
npm test
```
- `src/utils/heightmap.test.js` validates deterministic noise (using simplex-noise + seedrandom), normalization, and falloff.
- `src/utils/hydrology.test.js` covers flow direction, accumulation, and river extraction.
- `src/utils/biomes.test.js` covers biome assignment logic and threshold overrides.
- `src/utils/moisture.test.js` covers moisture map generation and determinism.
- `src/utils/sea.test.js` covers sea mask and smoothing logic.
- `src/utils/settlements.test.js` covers settlement placement, spacing, and determinism.
- `src/utils/roads.test.js` covers road network generation, MST, extra edges, jitter, and determinism.
- `src/utils/regions.test.js` covers Voronoi region assignment and centroid computation.
- `src/utils/labels.test.js` covers SVG label placement for regions, towns, and rivers.
- `src/utils/render.test.js` covers SVG rendering logic (requires jsdom environment).
- `src/utils/export.test.js` covers SVG serialization, JSON round-trip, and PNG export.

## Development
- All modules are ES6 and fully documented with JSDoc.
- Tests use [Vitest](https://vitest.dev/) and [jsdom](https://github.com/jsdom/jsdom) for DOM emulation.
- To add features, update the relevant module and its test file, then document changes in `DEVLOG.md` and `README.md`.

## Contributing

Contributions welcome! Please submit pull requests and follow established coding conventions. 

## Frontend React App (`frontend/`)

The frontend is a Vite-powered React app for interactive procedural map generation and export.

### Project Structure

- `frontend/src/App.jsx` — Main app, manages generator state and ties together all components.
- `frontend/src/components/ControlPanel.jsx` — UI for adjusting map generation parameters (seed, sea level, noise, towns, roads, etc.).
- `frontend/src/components/MapCanvas.jsx` — Renders the SVG map using the backend's renderMap utility.
- `frontend/src/components/ExportButtons.jsx` — Provides buttons to export the map as SVG, PNG, or JSON using the shared export utilities.
- `frontend/src/utils/` — Contains all backend utility modules (copied from `src/utils/`), reused directly in the browser.
- `frontend/src/index.css` — CSS for layout and styling (flexbox, sidebar, map container, export buttons).

### Usage

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. Open the local dev URL (usually http://localhost:5173) to use the app.

### Notes
- All map generation logic is shared between backend and frontend via ES6 modules.
- The UI is modular and extensible, with all generator parameters exposed for live tweaking.
- Export options use the same tested logic as the backend. 