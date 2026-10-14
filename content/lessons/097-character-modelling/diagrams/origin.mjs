// The character from the side, standing on the floor with its feet at Z 0 and its origin, an
// orange dot, on the floor between the feet. It is 1.8 m tall.
import { views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { character, frame } from './charkit.mjs';

export default (kit) => {
  const v = views.right({ at: [180, 266], scale: 130, target: [0, 0, 0] });
  const [ox, oy] = v.project([0, 0, 0]);
  return kit.svg({ width: 420, height: 300 },
    frame(kit, 14, 14, 392, 272),
    kit.line(40, oy, 380, oy, { cls: 'd-guide', width: 1.4 }),
    drawMesh(kit, character().mesh, v, { width: 1.1 }),
    dimension(kit, v, [0, 0.3, 0], [0, 0.3, 1.8], { offset: [0, 0.25, 0], label: '1.8 m' }),
    kit.dot(ox, oy, { r: 6, cls: 'd-mark-fill' }),
    kit.text(ox - 10, oy + 16, 'origin at Z 0', { anchor: 'end', size: 12 }),
    kit.text(60, 40, 'front', { size: 12 }),
  );
};
