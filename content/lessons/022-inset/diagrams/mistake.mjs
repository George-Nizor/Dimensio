// Wrong: every face of the box selected and inset as one patch: a closed box has no outside edge,
// so nothing changes. Right: the same inset as individual faces, a border on every side.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, insetEven } from './helpers.mjs';

export default (kit) => {
  const start = cube();
  const all = start.faces.map((_, i) => i);
  let done = start;
  for (const f of all) done = insetEven(done, f, 0.3).mesh;
  const left = view({ at: [126, 104], scale: 44 });
  const right = view({ at: [384, 104], scale: 44 });
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 180, 'one patch: no change'),
    drawMesh(kit, start, left, { width: 1.5, select: { faces: all } }),
    kit.tag(126, 228, 'I once', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 180, 'individual faces'),
    drawMesh(kit, done, right, { width: 1.5, select: { faces: all } }),
    kit.tag(384, 228, 'I twice'),
  );
};
