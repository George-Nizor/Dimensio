// Edge loops at the joints, picked out on the character from the front: one ring below each
// shoulder and hip, and three close together at each elbow and knee, where the limbs will bend.
import { views, drawMesh, box, join, edgesWhere } from '../../../diagrams/mesh.mjs';

// A limb as boxes between `cuts` along one axis, so each cut is a ring of edges.
function limb(axis, cuts, lo, hi) {
  const parts = [];
  for (let i = 0; i < cuts.length - 1; i += 1) {
    const a = [...lo];
    const b = [...hi];
    a[axis] = cuts[i];
    b[axis] = cuts[i + 1];
    parts.push(box({ size: [b[0] - a[0], b[1] - a[1], b[2] - a[2]], center: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] }));
  }
  return join(...parts);
}

export default (kit) => {
  const armCuts = [0.19, 0.25, 0.42, 0.47, 0.52, 0.84];
  const legCuts = [0.95, 0.88, 0.56, 0.51, 0.46, 0.1];
  const body = join(
    box({ size: [0.38, 0.22, 0.5], center: [0, 0, 1.2] }),
    box({ size: [0.09, 0.12, 0.09], center: [0, 0, 1.495] }),
    box({ size: [0.24, 0.23, 0.26], center: [0, 0, 1.67] }),
    ...[1, -1].flatMap((s) => [
      limb(0, armCuts.map((x) => x * s).sort((a, b) => a - b), [0, -0.06, 1.31], [0, 0.06, 1.45]),
      limb(2, [...legCuts].sort((a, b) => a - b), [s > 0 ? 0.045 : -0.19, -0.11, 0], [s > 0 ? 0.19 : -0.045, 0.11, 0]),
    ]),
  );
  const joints = edgesWhere(body, (a, b) => {
    const arm = a[2] > 1.3 && Math.abs(a[0] - b[0]) < 1e-6 && [0.25, 0.42, 0.47, 0.52].some((x) => Math.abs(Math.abs(a[0]) - x) < 1e-6);
    const leg = a[2] < 0.95 && Math.abs(a[2] - b[2]) < 1e-6 && [0.88, 0.56, 0.51, 0.46].some((z) => Math.abs(a[2] - z) < 1e-6);
    return arm || leg;
  });
  const v = views.front({ at: [240, 150], scale: 140, target: [0, 0, 0.9] });
  const p = (q) => v.project(q);
  return kit.svg({ width: 480, height: 300 },
    drawMesh(kit, body, v, { width: 0.9, select: { edges: joints } }),
    kit.text(p([0.6, 0, 1.2])[0], p([0.6, 0, 1.2])[1], 'elbow: three loops', { anchor: 'middle', size: 12 }),
    kit.text(p([-0.5, 0, 1.2])[0], p([-0.5, 0, 1.2])[1], 'shoulder: one', { anchor: 'middle', size: 12 }),
    kit.text(p([0.3, 0, 0.51])[0], p([0.3, 0, 0.51])[1] + 4, 'knee: three', { size: 12 }),
    kit.text(p([0.3, 0, 0.88])[0], p([0.3, 0, 0.88])[1] + 4, 'hip: one', { size: 12 }),
  );
};
