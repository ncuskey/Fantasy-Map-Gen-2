export default function ControlPanel({
  seed, setSeed,
  seaLevel, setSeaLevel,
  noiseOpts, setNoiseOpts,
  moistOpts, setMoistOpts,
  townOpts, setTownOpts,
  roadOpts, setRoadOpts,
}) {
  return (
    <aside className="controls">
      <div>
        <label>Seed</label>
        <input
          type="number"
          value={seed}
          onChange={e => setSeed(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Sea Level: {seaLevel.toFixed(2)}</label>
        <input
          type="range" min="0" max="1" step="0.01"
          value={seaLevel}
          onChange={e => setSeaLevel(Number(e.target.value))}
        />
      </div>
      <fieldset>
        <legend>Heightmap Noise</legend>
        <label>Octaves: {noiseOpts.octaves}</label>
        <input type="range" min="1" max="8" value={noiseOpts.octaves} onChange={e => setNoiseOpts({...noiseOpts, octaves:Number(e.target.value)})} />
        <label>Frequency: {noiseOpts.frequency}</label>
        <input type="range" min="0.1" max="4" step="0.1" value={noiseOpts.frequency} onChange={e => setNoiseOpts({...noiseOpts, frequency:Number(e.target.value)})} />
        <label>Persistence: {noiseOpts.persistence}</label>
        <input type="range" min="0" max="1" step="0.01" value={noiseOpts.persistence} onChange={e => setNoiseOpts({...noiseOpts, persistence:Number(e.target.value)})} />
        <label>Lacunarity: {noiseOpts.lacunarity}</label>
        <input type="range" min="1" max="4" step="0.1" value={noiseOpts.lacunarity} onChange={e => setNoiseOpts({...noiseOpts, lacunarity:Number(e.target.value)})} />
      </fieldset>
      <fieldset>
        <legend>Moisture Noise</legend>
        <label>Octaves: {moistOpts.octaves}</label>
        <input type="range" min="1" max="8" value={moistOpts.octaves} onChange={e => setMoistOpts({...moistOpts, octaves:Number(e.target.value)})} />
        <label>Frequency: {moistOpts.frequency}</label>
        <input type="range" min="0.1" max="4" step="0.1" value={moistOpts.frequency} onChange={e => setMoistOpts({...moistOpts, frequency:Number(e.target.value)})} />
        <label>Persistence: {moistOpts.persistence}</label>
        <input type="range" min="0" max="1" step="0.01" value={moistOpts.persistence} onChange={e => setMoistOpts({...moistOpts, persistence:Number(e.target.value)})} />
        <label>Lacunarity: {moistOpts.lacunarity}</label>
        <input type="range" min="1" max="4" step="0.1" value={moistOpts.lacunarity} onChange={e => setMoistOpts({...moistOpts, lacunarity:Number(e.target.value)})} />
      </fieldset>
      <fieldset>
        <legend>Towns</legend>
        <label>Count: {townOpts.count}</label>
        <input type="range" min="1" max="100" value={townOpts.count} onChange={e => setTownOpts({...townOpts, count:Number(e.target.value)})} />
        <label>Min Distance: {townOpts.minDistance}</label>
        <input type="range" min="10" max="200" value={townOpts.minDistance} onChange={e => setTownOpts({...townOpts, minDistance:Number(e.target.value)})} />
      </fieldset>
      <fieldset>
        <legend>Roads</legend>
        <label>Extra Edge Probability: {roadOpts.extraEdgeProbability}</label>
        <input type="range" min="0" max="1" step="0.01" value={roadOpts.extraEdgeProbability} onChange={e => setRoadOpts({...roadOpts, extraEdgeProbability:Number(e.target.value)})} />
        <label>Jitter: {roadOpts.jitter}</label>
        <input type="range" min="0" max="5" step="0.1" value={roadOpts.jitter} onChange={e => setRoadOpts({...roadOpts, jitter:Number(e.target.value)})} />
      </fieldset>
    </aside>
  );
} 