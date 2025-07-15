# Devlog
All entries in YYYY-MM-DD format.

## 2025-07-15
- **Heightmap Module**: Added optional `seed` parameter for deterministic noise and `falloffCurve` (`linear|smooth|power`) to `generateHeightmap` in `src/utils/heightmap.js`.
- **Testing**: Created Vitest suite in `src/utils/heightmap.test.js` to verify determinism, value normalization, and work of `gradientFalloff` options.

<!-- Add future entries here as tasks progress --> 