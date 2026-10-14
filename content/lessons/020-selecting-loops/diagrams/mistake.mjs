// Wrong: the pointer in the middle of a face is nearest a vertical edge, so Alt+click selects a
// vertical loop. Right: the pointer right on a horizontal edge selects the horizontal loop.
import { view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { pipe, loopAt, columnAt } from './shapes.mjs';

export default (kit) => {
  const t = pipe();
  const left = view({ at: [126, 110], scale: 58, target: [0, 0, 1] });
  const right = view({ at: [384, 110], scale: 58, target: [0, 0, 1] });
  const k = 11;
  const a = (2 * Math.PI * (k + 0.38)) / 12;
  const [lx, ly] = left.project([0.5 * Math.cos(a), 0.5 * Math.sin(a), 1.17]);
  const b = (2 * Math.PI * 11.5) / 12;
  const [rx, ry] = right.project([0.49 * Math.cos(b), 0.49 * Math.sin(b), 1]);
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 190),
    drawMesh(kit, t, left, { width: 1.2, select: { edges: columnAt(t, k) } }),
    cursor(kit, lx, ly),
    kit.tag(126, 230, 'middle of a face', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 190),
    drawMesh(kit, t, right, { width: 1.2, select: { edges: loopAt(t, 3) } }),
    cursor(kit, rx, ry),
    kit.tag(384, 230, 'right on the edge'),
  );
};
