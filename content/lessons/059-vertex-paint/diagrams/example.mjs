// The exercise's tree after vertex painting: the trunk filled with a wood colour and the canopy
// filled green, each colour stopping at an edge.
import { view } from '../../../diagrams/mesh.mjs';
import { tree, drawPainted } from './parts.mjs';

const COLOUR = { trunk: 'd-key-mark', low: 'd-gizmo-y', top: 'd-gizmo-y' };

export default (kit) => {
  const { mesh, part } = tree();
  const v = view({ azimuth: 30, elevation: 14, scale: 84, at: [190, 124], target: [0, 0, 1.3] });
  return kit.svg({ width: 380, height: 260 }, drawPainted(kit, mesh, v, (i) => COLOUR[part(i)], { width: 1 }));
};
