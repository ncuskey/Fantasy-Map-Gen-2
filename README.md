# Fantasy Map Gen 2

A modular, test-driven procedural map generator built with modern JavaScript/ES6. This system generates fantasy maps with realistic terrain, hydrology, biomes, settlements, and road networks.

## Features

### Core Map Generation
- **Heightmap Generation**: Perlin noise-based elevation with configurable parameters
- **Hydrology System**: River networks, watershed analysis, and flow accumulation
- **Biome Assignment**: Climate and elevation-based biome mapping
- **Contour Rendering**: Marching squares algorithm for smooth contour lines
- **Sea Level Integration**: Dynamic coastline and island generation

### Advanced Features
- **Settlement Placement**: Poisson-disc sampling with elevation and biome constraints
- **Road Networks**: Minimum spanning tree with additional connections and jitter
- **Region Mapping**: Voronoi-based political and cultural boundaries
- **Label Placement**: Geographic feature labeling for regions, towns, and rivers
- **Export Functionality**: SVG and PNG export with data serialization

### Frontend Interface
- **Interactive Controls**: Real-time parameter adjustment
- **Live Preview**: Instant map regeneration on parameter changes
- **Export Options**: Multiple export formats with custom settings
- **Responsive Design**: Modern UI with professional styling

## Performance Optimizations

### Contour Rendering
- **Safety Limits**: Maximum 10,000 cells processed for full detail
- **Smart Sampling**: Automatic cell sampling for large grids (500x500+)
- **Level Limiting**: Maximum 10 contour levels to prevent performance issues
- **Dynamic Intervals**: Automatic interval adjustment for optimal detail

### Testing Optimizations
- **Cypress Detection**: Reduced map sizes during automated testing
- **Fast Execution**: 100x100 test maps with minimal smoothing iterations
- **Reliable Results**: Deterministic outputs for consistent test results

## Installation

### Backend Setup
```bash
npm install
npm test  # Run all tests
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start development server
npm run test:e2e  # Run Cypress tests
```

## Usage

### Backend API

```javascript
import { generateHeightmap } from './src/utils/heightmap.js';
import { generateRivers } from './src/utils/hydrology.js';
import { assignBiomes } from './src/utils/biomes.js';
import { renderMap } from './src/utils/render.js';

// Generate map data
const heightmap = generateHeightmap(500, 500, { octaves: 4, persistence: 0.5 });
const rivers = generateRivers(heightmap);
const biomes = assignBiomes(heightmap, moistureMap, { seaLevel: 0.3 });

// Render to SVG
renderMap('map-container', { heightmap, rivers, biomes }, {
  contours: { interval: 0.1, className: 'contour-line' },
  rivers: { stroke: '#0066cc', strokeWidth: 2 },
  biomePalette: { 'forest': '#228b22', 'desert': '#f4a460' }
});
```

### Frontend Integration

```javascript
// React component with live updates
const [seaLevel, setSeaLevel] = useState(0.3);
const [mapData, setMapData] = useState(null);

useEffect(() => {
  const data = generateMapData({ seaLevel });
  setMapData(data);
}, [seaLevel]);

// Render with parameter controls
<ControlPanel seaLevel={seaLevel} onSeaLevelChange={setSeaLevel} />
<MapCanvas data={mapData} />
<ExportButtons data={mapData} />
```

## Architecture

### Module Structure
```
src/utils/
├── heightmap.js      # Elevation generation
├── hydrology.js      # River networks and flow
├── biomes.js         # Climate and biome assignment
├── contours.js       # Marching squares contour generation
├── render.js         # SVG rendering pipeline
├── settlements.js    # Town and city placement
├── roads.js          # Transportation networks
├── regions.js        # Political boundaries
├── labels.js         # Geographic labeling
└── export.js         # Export utilities
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.jsx           # Main application component
│   ├── ControlPanel.jsx  # Parameter controls
│   ├── MapCanvas.jsx     # SVG rendering container
│   ├── ExportButtons.jsx # Export functionality
│   └── utils/            # Backend utilities (copied)
├── cypress/              # E2E test suite
└── public/               # Static assets
```

## Testing

### Backend Tests
- **Vitest Framework**: Fast, modern testing with full coverage
- **Deterministic Results**: Consistent outputs for reliable testing
- **Module Isolation**: Each utility tested independently
- **JSDoc Validation**: Documentation accuracy verification

### Frontend Tests
- **Cypress E2E**: Comprehensive UI interaction testing
- **Performance Optimized**: Reduced map sizes for fast execution
- **Export Validation**: SVG, PNG, and JSON export testing
- **Parameter Interaction**: Real-time control testing

## Development

### Adding New Features
1. Create module in `src/utils/`
2. Add comprehensive JSDoc documentation
3. Implement Vitest test suite
4. Update README and DEVLOG
5. Copy to frontend if needed

### Performance Guidelines
- **Large Grids**: Use sampling for grids > 10,000 cells
- **Contour Levels**: Limit to 10 levels maximum
- **Memory Management**: Avoid excessive array concatenation
- **Testing**: Use smaller maps during development

### Code Quality
- **ES6 Modules**: Use import/export syntax
- **JSDoc Comments**: Document all public functions
- **Type Definitions**: Include typedefs for complex objects
- **Error Handling**: Provide meaningful error messages

## Export Options

### SVG Export
- **Vector Graphics**: Scalable, editable output
- **Layer Support**: Separate layers for different map elements
- **Style Preservation**: CSS classes and inline styles maintained

### PNG Export
- **Raster Graphics**: High-resolution bitmap output
- **Custom Sizes**: Configurable width and height
- **Background Support**: Transparent or colored backgrounds

### Data Export
- **JSON Serialization**: Complete map data preservation
- **Metadata Inclusion**: Generation parameters and timestamps
- **Compression**: Optional data compression for large maps

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

## Roadmap

- [ ] Advanced climate simulation
- [ ] Cultural region generation
- [ ] Historical map styles
- [ ] 3D terrain visualization
- [ ] Multi-language support
- [ ] Plugin architecture 