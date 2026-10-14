// Seen from the top. The Rock stands at (9, -1.5) and the Tree at (9, 1.5), 9 m along X from the
// world origin. Wrong: without Reset
// Children every copy keeps that offset and lands beside its point, off the hill. Right: with it,
// each copy stands on its point.
import { views } from '../../../diagrams/mesh.mjs';
import { points, panel } from './scene.mjs';

export default (kit) => {
  const pts = points(24, 9);
  const half = (x0, offset, tone) => {
    const v = views.top({ at: [x0 + 70, 100], scale: 9 });
    const [ax, ay] = v.project([-6, 6, 0]);
    return [
      `<rect x="${ax}" y="${ay}" width="${12 * 9}" height="${12 * 9}" class="d-face-2" stroke="none"/>`,
      kit.polyline([[ax, ay], [ax + 108, ay], [ax + 108, ay + 108], [ax, ay + 108], [ax, ay]], { cls: 'd-guide', width: 1.2 }),
      pts.map(({ p, pick }) => {
        const [px, py] = v.project(p);
        const [qx, qy] = v.project([p[0] + offset, p[1] + (offset ? (pick ? 1.5 : -1.5) : 0), 0]);
        return [kit.dot(px, py, { r: 2, cls: 'd-mark-fill' }), pick ? kit.circle(qx, qy, 4.5, { cls: tone, width: 1.8 }) : `<rect x="${qx - 3.5}" y="${qy - 3.5}" width="7" height="7" class="d-face-1 ${tone}" stroke-width="1.6"/>`];
      }),
    ];
  };
  return kit.svg({ width: 500, height: 236 },
    panel(kit, 14, 14, 230, 170, 'Reset Children off'),
    half(14, 9, 'd-bad'),
    kit.tag(129, 222, 'copies 9 m to the side', { tone: 'bad' }),
    panel(kit, 256, 14, 230, 170, 'Reset Children on'),
    half(256, 0, 'd-ink'),
    kit.tag(371, 222, 'on their points'),
  );
};
