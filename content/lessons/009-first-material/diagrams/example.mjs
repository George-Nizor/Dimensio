// Five shapes in three colours in Material Preview: a red cube, a blue cylinder, a green cone, a red
// sphere and a blue torus.
import { view } from '../../../diagrams/mesh.mjs';
import { drawColoured } from './parts.mjs';
import { five } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 14, elevation: 22, at: [270, 104], scale: 48, target: [4.45, 0, 0.6] });
  const shapes = five().sort((a, b) => v.depth(a[0].verts[0]) - v.depth(b[0].verts[0]));
  return kit.svg({ width: 540, height: 190 }, shapes.map(([m, fill]) => drawColoured(kit, m, v, fill, { width: 1.3 })));
};
