// The chest from the right. Wrong: the lid's origin left in its middle, so turning it on X spins it
// in place and half of it sinks into the body. Right: the origin on the hinge, so it swings up and
// open.
import { views, rotate, translate } from '../../../diagrams/mesh.mjs';
import { body, lid, openOnHinge, drawParts, SIZE } from './chest.mjs';
import { drawPainted } from './painted.mjs';

function spunInPlace(part, degrees) {
  const middle = [0, 0, SIZE.height + 0.17];
  return { mesh: translate(rotate(translate(part.mesh, middle.map((x) => -x)), 'x', degrees), middle), parts: part.parts };
}

export default (kit) => {
  const left = views.right({ at: [130, 190], scale: 140, target: [0, 0, 0.4] });
  const right = views.right({ at: [390, 190], scale: 140, target: [0, 0, 0.4] });
  const [mx, my] = left.project([0, 0, SIZE.height + 0.17]);
  const [hx, hy] = right.project([0, SIZE.depth / 2, SIZE.height]);
  return kit.svg({ width: 520, height: 300 },
    drawParts(kit, left, [spunInPlace(lid(), -60), body()], drawPainted),
    kit.dot(mx, my, { r: 4.5, cls: 'd-mark-fill' }),
    kit.tag(130, 288, 'origin in the middle', { tone: 'bad' }),
    drawParts(kit, right, [openOnHinge(lid(), -60), body()], drawPainted),
    kit.dot(hx, hy, { r: 4.5, cls: 'd-mark-fill' }),
    kit.tag(390, 288, 'origin on the hinge'),
  );
};
