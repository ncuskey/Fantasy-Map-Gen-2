# Fantasy Map Gen 2

## Overview
A procedural fantasy map generator inspired by Perilous Shores. Generates terrain, hydrology, biomes, and renders in a hand-drawn SVG style.

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

- `src/utils/heightmap.js` — Heightmap generation with seeded noise and flexible falloff options
- `src/utils/hydrology.js` — Flow direction, accumulation, and river extraction utilities (`computeFlowDirections`, `computeFlowAccumulation`, `extractRivers`)
- `src/utils/biomes.js` — Biome assignment based on elevation and moisture
- `src/utils/render.js` — SVG rendering pipeline for map elements
- `DEVLOG.md` — Development log tracking changes and decisions

## Tests
Run the Vitest suite with:
```bash
npm test
```
`src/utils/heightmap.test.js` validates deterministic noise, normalization, and falloff.
// (And in future)

`src/utils/hydrology.test.js` can cover flow‐direction and accumulation rules.

## Contributing

Contributions welcome! Please submit pull requests and follow established coding conventions. 