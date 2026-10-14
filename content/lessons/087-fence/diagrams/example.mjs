// The project's fence: posts every 1.5 m along a curved path and two rails between them, made by a
// Geometry Nodes group that works on any curve.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { fence } from './fence.mjs';

export default (kit) => {
  const { posts, rails } = fence();
  const v = view({ azimuth: 20, elevation: 22, at: [260, 140], scale: 54, target: [0, 0.4, 0.5] });
  return kit.svg({ width: 520, height: 250 }, drawMesh(kit, posts, v, { width: 1.1 }), rails.map((r) => drawMesh(kit, r, v, { width: 1.1 })));
};
