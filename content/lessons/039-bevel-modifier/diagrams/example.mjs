// The exercise's table: a top and four legs, every edge bevelled by the Bevel modifier.
import { bevelledBox, join, view, drawMesh } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const w = 0.012;
  const table = join(
    bevelledBox({ size: [1.2, 0.8, 0.05], width: w, center: [0, 0, 0.725] }),
    ...[-1, 1].flatMap((x) => [-1, 1].map((y) => bevelledBox({ size: [0.05, 0.05, 0.7], width: w, center: [x * 0.55, y * 0.35, 0.35] }))),
  );
  return kit.svg({ width: 460, height: 260 }, drawMesh(kit, table, view({ at: [230, 150], scale: 230, target: [0, 0, 0.4] }), { width: 1 }));
};
