// The fence this lesson builds. Not a diagram itself. A curved path is resampled every `spacing`
// metres (rounded so a whole number fits, as Resample Curve's Length mode does), a 1 m post stands
// on each point, and two rails 4 by 10 cm run along the path at 0.4 and 0.8 m.
import { box, join, translate } from '../../../diagrams/mesh.mjs';
import { autoPath, pathPoints, sweep, rectangle } from './curves.mjs';

export const PATH = autoPath([[-4, 0, 0], [-1.5, 1.6, 0], [1.5, -0.6, 0], [4, 1, 0]]);

export function resample(points, spacing) {
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) lengths.push(lengths[i - 1] + Math.hypot(...points[i].map((v, k) => v - points[i - 1][k])));
  const total = lengths[lengths.length - 1];
  const n = Math.max(1, Math.floor(total / spacing));
  return Array.from({ length: n + 1 }, (_, i) => {
    const d = (total * i) / n;
    let k = 1;
    while (k < lengths.length - 1 && lengths[k] < d) k += 1;
    const t = (d - lengths[k - 1]) / (lengths[k] - lengths[k - 1] || 1);
    return points[k - 1].map((v, j) => v + (points[k][j] - v) * t);
  });
}

// A post 1 m tall with its origin at its base, or at its middle when `centred`.
export const post = (centred = false) => box({ size: [0.12, 0.12, 1], center: [0, 0, centred ? 0 : 0.5] });

export function fence({ spacing = 1.5, centred = false } = {}) {
  const pts = resample(pathPoints(PATH, 16), spacing);
  const posts = join(...pts.map((p) => translate(post(centred), p)));
  const rails = [0.4, 0.8].map((z) => translate(sweep(pts, rectangle(0.04, 0.1), { caps: true }), [0, 0, z - (centred ? 0.5 : 0)]));
  return { pts, posts, rails };
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
