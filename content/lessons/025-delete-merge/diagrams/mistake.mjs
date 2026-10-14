// Wrong: the loop round the box's middle removed with X > Edges, which deletes the faces on both
// sides of it and leaves a gap all the way round. Right: the same loop dissolved with Ctrl+X, and
// the box stays closed.
import { view } from '../../../diagrams/mesh.mjs';
import { panel, cutBox, deleteFaces, drawOpen } from './helpers.mjs';
import { normal } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const m = cutBox({ size: [2, 1, 1], cuts: { x: [-0.5, 0, 0.5] } });
  const touching = m.faces.map((f, i) => [f, i]).filter(([f]) => f.some((vi) => Math.abs(m.verts[vi][0]) < 1e-6) && Math.abs(normal(m, f)[0]) < 0.5).map(([, i]) => i);
  const gapped = deleteFaces(m, touching);
  const dissolved = cutBox({ size: [2, 1, 1], cuts: { x: [-0.5, 0.5] } });
  const left = view({ at: [126, 108], scale: 54, elevation: 30 });
  const right = view({ at: [384, 108], scale: 54, elevation: 30 });
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 184),
    drawOpen(kit, gapped, left, { width: 1.4 }),
    kit.tag(126, 228, 'X > Edges', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 184),
    drawOpen(kit, dissolved, right, { width: 1.4 }),
    kit.tag(384, 228, 'Ctrl+X'),
  );
};
