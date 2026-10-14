// A row of five shapes 2 m apart: a 1 m cube, an 8-sided cylinder, a 6-sided cone, a UV sphere with
// 12 segments and 6 rings, and an ico sphere with one subdivision.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { shapes } from './row.mjs';

export default (kit) => {
  const v = view({ azimuth: 12, elevation: 20, at: [270, 100], scale: 60, target: [4, 0, 0.5] });
  const names = ['cube', 'cylinder', 'cone', 'UV sphere', 'ico sphere'];
  return kit.svg({ width: 540, height: 180 },
    shapes().map((m) => drawMesh(kit, m, v, { width: 1.5 })),
    names.map((name, i) => { const [x] = v.project([i * 2, 0, 0]); return kit.text(x, 168, name, { anchor: 'middle', size: 12 }); }),
  );
};
