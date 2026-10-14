// The exercise: a column twisted with Simple Deform, a sign bent with Simple Deform, and a row of
// planks laid along a sagging curve with the Curve modifier.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { column, sign, plankRow } from './shapes.mjs';

export default (kit) => kit.svg({ width: 540, height: 230 },
  drawMesh(kit, column(), view({ at: [60, 190], scale: 50, target: [0, 0, 0] }), { width: 1 }),
  drawMesh(kit, sign(), view({ at: [190, 140], scale: 60, target: [0, 0, 0] }), { width: 1 }),
  drawMesh(kit, plankRow(), view({ at: [410, 120], scale: 52, elevation: 24, target: [0, 0, 0] }), { width: 0.9 }),
  kit.text(60, 222, 'twist', { anchor: 'middle', size: 12 }),
  kit.text(190, 222, 'bend', { anchor: 'middle', size: 12 }),
  kit.text(410, 222, 'along a curve', { anchor: 'middle', size: 12 }),
);
