// Ctrl+R with 4 cuts, centred with a right click: four rings of edges 0.24 m apart, selected.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
import { paint } from './paint.mjs';

export const ringEdges = (rings) => rings.flatMap((k) => [...Array(12).keys()].map((i) => [k * 12 + i, k * 12 + ((i + 1) % 12)]));

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 20, at: [230, 126], scale: 150, target: [0, 0, 0.6] });
  return kit.svg({ width: 460, height: 250 }, paint(kit, barrel('rings'), v, { width: 1.4, select: { edges: ringEdges([1, 2, 3, 4]) } }));
};
