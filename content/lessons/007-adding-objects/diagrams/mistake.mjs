// Wrong: after Shift+D and Esc, the copy sits exactly on top of the original, and only the Outliner
// shows it. Right: the copy moved along X, where you can see it.
import { cube, view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';

const outliner = (kit, x, y) => [
  `<rect x="${x}" y="${y}" width="96" height="58" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(x + 10, y + 16, 'Outliner', { size: 10 }),
  kit.text(x + 14, y + 34, 'Cube', { size: 11 }),
  kit.text(x + 14, y + 50, 'Cube.001', { size: 11 }),
];

export default (kit) => {
  const lv = view({ at: [80, 110], scale: 30, target: [0, 0, 1] });
  const rv = view({ at: [376, 116], scale: 21, target: [1.6, 0, 1] });
  const c = translate(cube(2), [0, 0, 1]);
  return kit.svg({ width: 500, height: 228 },
    panel(kit, 14, 14, 220, 176),
    drawMesh(kit, c, lv, { width: 1.6, cls: 'd-mark' }),
    outliner(kit, 130, 24),
    kit.tag(124, 214, 'copy hidden inside', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 176),
    drawMesh(kit, c, rv, { width: 1.6 }),
    drawMesh(kit, translate(c, [3.2, 0, 0]), rv, { width: 1.6, cls: 'd-mark' }),
    outliner(kit, 276, 24),
    kit.tag(376, 214, 'copy moved aside'),
  );
};
