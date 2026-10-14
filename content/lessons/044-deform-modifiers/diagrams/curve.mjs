// The Curve modifier from the front. Above, the row of planks from an Array, straight. Below, the
// Path with its middle point moved down, and the same row with a Curve modifier following its sag.
import { views, drawMesh, box, join, translate } from '../../../diagrams/mesh.mjs';
import { path, plankRow } from './shapes.mjs';

export default (kit) => {
  const v = (y) => views.front({ at: [260, y], scale: 110, target: [0, 0, 0] });
  const plank = box({ size: [0.2, 1, 0.05], center: [0.1, 0, 0] });
  const straight = translate(join(...Array.from({ length: 12 }, (_, i) => translate(plank, [i * 0.32, 0, 0]))), [-2, 0, 0]);
  const low = v(150);
  const pts = path().map(([x, z]) => low.project([x, 0, z - 0.06]));
  const control = [[-2, 0], [-1, 0], [0, -0.6], [1, 0], [2, 0]].map(([x, z]) => low.project([x, 0, z - 0.06]));
  return kit.svg({ width: 520, height: 258 },
    kit.text(260, 30, 'an Array of planks, straight', { anchor: 'middle', size: 12 }),
    drawMesh(kit, straight, v(56), { width: 1 }),
    kit.polyline(control, { cls: 'd-guide', width: 1, dash: '4 4' }),
    control.map(([x, y], i) => kit.dot(x, y, { r: i === 2 ? 4.5 : 3, cls: i === 2 ? 'd-mark-fill' : 'd-dot' })),
    kit.polyline(pts, { cls: 'd-mark', width: 2 }),
    drawMesh(kit, plankRow(), low, { width: 1 }),
    kit.text(260, 250, 'with a Curve modifier: the planks follow the Path', { anchor: 'middle', size: 12 }),
  );
};
