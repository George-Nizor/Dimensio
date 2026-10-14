// The spine built in Edit Mode, seen from the side: the first bone moved up to run from the hips,
// then four more extruded from each tip with E: spine, chest, neck and head. The last tip is
// selected, ready to extrude again.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, skeleton, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const v = views.right({ at: [160, 150], scale: 130, target: [0, 0, 0.9] });
  const middle = skeleton().filter((b) => !b.name.includes('.'));
  const [tx, ty] = v.project([0, 0, 1.8]);
  return kit.svg({ width: 420, height: 290 },
    frame(kit, 14, 14, 392, 262),
    drawMesh(kit, character().mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, middle, { marked: ['head'] }),
    kit.dot(tx, ty, { r: 4.4, cls: 'd-mark-fill' }),
    middle.map((b) => {
      const [x, y] = v.project([0, 0.13, (b.head[2] + b.tail[2]) / 2]);
      return [kit.line(x - 8, y, x + 6, y, { cls: 'd-guide', width: 1 }), kit.text(x + 10, y + 4, b.name, { size: 12 })];
    }),
    kit.text(270, 120, 'each new bone:', { size: 12 }),
    kit.text(270, 140, 'E from the tip', { size: 12 }),
    kit.text(270, 160, 'of the last', { size: 12 }),
  );
};
