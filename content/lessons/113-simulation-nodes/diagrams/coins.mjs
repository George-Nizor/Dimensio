// After the zone: Instance on Points puts a Cylinder, 4 cm across and 8 mm thick, on every point
// that comes out of the Simulation Output, and sends the coins to the Group Output.
import { graph } from './graph.mjs';

export default (kit) => kit.svg({ width: 420, height: 212 },
  graph(kit, { show: ['sim-out', 'cyl', 'inst', 'group-out'], mark: ['cyl', 'inst'], dx: 820, dy: 100, zone: false }),
  kit.text(210, 200, 'Cylinder: Radius 0.04 m, Depth 0.008 m', { anchor: 'middle', size: 11 }),
);
