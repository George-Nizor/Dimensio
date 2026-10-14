// The Pipe with the vertical edges of its fourth row selected all the way round: an edge ring,
// after Ctrl+Alt+click on one of them.
import { view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { pipe, ringAt } from './shapes.mjs';

export default (kit) => {
  const t = pipe();
  const v = view({ at: [170, 140], scale: 82, target: [0, 0, 1] });
  const a = (2 * Math.PI * 11) / 12;
  const [x, y] = v.project([0.5 * Math.cos(a), 0.5 * Math.sin(a), 1.17]);
  return kit.svg({ width: 400, height: 280 },
    drawMesh(kit, t, v, { width: 1.3, select: { edges: ringAt(t, 3) } }),
    cursor(kit, x, y),
    kit.text(300, 150, 'Ctrl + Alt + click', { anchor: 'middle', size: 12 }),
  );
};
