// With Affect Only Origins on, G moves the origin down on its own while the crate stays still.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const v = view({ at: [170, 136], scale: 120, target: [0, 0, 0.5] });
  const [ax, ay] = v.project([0, 0, 0.5]);
  const [bx, by] = v.project([0, 0, 0]);
  return kit.svg({ width: 440, height: 270 },
    drawMesh(kit, crate(), v, { mode: 'xray', width: 1.6 }),
    kit.circle(ax, ay, 6, { cls: 'd-guide', width: 1.2, dash: '2 2' }),
    kit.line(ax, ay + 8, bx, by - 10, { cls: 'd-mark', width: 2 }), kit.arrowhead(bx, by - 10, Math.PI / 2, { size: 7 }),
    origin(kit, bx, by),
    keycap(kit, 350, 50, 'Ctrl+.', { size: 12 }),
    kit.text(350, 88, 'Affect Only Origins', { anchor: 'middle', size: 12 }),
    keycap(kit, 350, 140, 'G'),
    kit.text(350, 174, 'moves the dot only', { anchor: 'middle', size: 12 }),
  );
};
