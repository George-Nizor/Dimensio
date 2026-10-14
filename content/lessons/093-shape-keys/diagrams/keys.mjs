// Keyframing the squash Value: a curve over frames 1 to 12 that rises from 0 at frame 1 to 1 at
// frame 6 and falls back to 0 at frame 12, with a diamond at each key and the sack above each one.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { ruler, key, timeScale } from '../../092-drivers/diagrams/animkit.mjs';
import { sack, frame } from './sackkit.mjs';

export default (kit) => {
  const x = 76;
  const w = 330;
  const at = timeScale(x, w, 1, 12);
  const y0 = 220;
  const y1 = 150;
  const curve = [];
  for (let f = 1; f <= 12; f += 0.25) {
    const t = f <= 6 ? (f - 1) / 5 : 1 - (f - 6) / 6;
    const s = t * t * (3 - 2 * t);
    curve.push([at(f), y0 + (y1 - y0) * s]);
  }
  return kit.svg({ width: 470, height: 290 },
    frame(kit, 14, 14, 442, 262),
    [[1, 0], [6, 1], [12, 0]].map(([f, val]) => drawMesh(kit, sack(val), view({ at: [at(f), 100], scale: 30, elevation: 18 }), { width: 1 })),
    kit.text(x - 8, y1 + 4, '1', { anchor: 'end', size: 11 }),
    kit.text(x - 8, y0 + 4, '0', { anchor: 'end', size: 11 }),
    kit.smooth(curve, { cls: 'd-mark', width: 2 }),
    [[1, y0], [6, y1], [12, y0]].map(([f, y]) => key(kit, at(f), y, { mark: true })),
    ruler(kit, x, 262, w, 1, 12, 1),
  );
};
