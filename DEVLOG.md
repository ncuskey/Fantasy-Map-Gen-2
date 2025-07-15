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
- **Documentation**: Updated `README.md` to fully describe all modules, options, and test setup, including `render.js` and jsdom requirements. Confirmed all modules have JSDoc and inline documentation. Added a development section to the README. Maintenance and documentation work completed.

<!-- Add future entries here as tasks progress --> 