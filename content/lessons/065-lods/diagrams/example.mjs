// The rock and two lighter versions of it, side by side, each with fewer and larger faces. In
// the exercise they sit in the same place; here they stand apart to compare.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { rock } from './shapes.mjs';

export default (kit) => {
  const cells = [[rock(3), 'Rock_LOD0'], [rock(2), 'Rock_LOD1'], [rock(1), 'Rock_LOD2']];
  return kit.svg({ width: 540, height: 200 }, cells.map(([m, label], i) => {
    const x = 90 + i * 180;
    const v = view({ azimuth: 25, elevation: 22, scale: 95, at: [x, 105], target: [0, 0, 0.3] });
    return [drawMesh(kit, m, v, { width: i === 0 ? 0.5 : 0.9 }), kit.text(x, 185, label, { size: 12, anchor: 'middle' })];
  }));
};
