// The fall: Set Position moves every point by an Offset of (0, 0, -2) scaled by the Simulation
// Input's Delta Time, the seconds between frames, so the points drop 2 m every second.
import { graph } from './graph.mjs';

export default (kit) => kit.svg({ width: 390, height: 262 },
  graph(kit, { show: ['sim-in', 'join', 'scale', 'fall'], mark: ['scale', 'fall'], dx: 120, dy: 100, zone: false }),
  kit.text(190, 250, 'Vector Math set to Scale, Vector (0, 0, -2)', { anchor: 'middle', size: 11 }),
);
