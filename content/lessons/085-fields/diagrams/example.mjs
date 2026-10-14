// The exercise's result: a flat grid rippled into waves, each point raised or lowered by an amount
// worked out from its own X position.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { rippled } from './wave.mjs';

export default (kit) => {
  const v = view({ azimuth: 20, elevation: 32, at: [220, 120], scale: 72 });
  return kit.svg({ width: 440, height: 250 }, drawMesh(kit, rippled(20), v, { width: 0.8 }));
};
