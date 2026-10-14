// Top: the bevel's Resolution sets the points around the tube: 0 gives 4, 1 gives 6, 4 gives 12.
// Bottom: Resolution Preview U sets the points between two control points: 12 and 4.
import { view } from '../../../diagrams/mesh.mjs';
import { DEFAULT_CURVE, pathPoints, ring } from './curves.mjs';

export default (kit) => {
  const sections = [[0, 4], [1, 6], [4, 12]].map(([res, sides], i) => {
    const cx = 90 + i * 150;
    const pts = ring(34, sides).map(([u, v]) => [cx + u, 66 - v]);
    return [
      kit.polyline([...pts, pts[0]], { cls: 'd-ink', width: 2 }),
      pts.map(([x, y]) => kit.dot(x, y, { r: 3, cls: 'd-mark-fill' })),
      kit.text(cx, 124, `resolution ${res}: ${sides} sides`, { anchor: 'middle', size: 12 }),
    ];
  });
  const lines = [[12, 150], [4, 380]].map(([u, cx]) => {
    const v = view({ azimuth: 0, elevation: 90, at: [cx, 186], scale: 48 });
    const pts = pathPoints(DEFAULT_CURVE, u).map((p) => v.project(p));
    return [
      kit.polyline(pts, { cls: 'd-ink', width: 2 }),
      pts.map(([x, y]) => kit.dot(x, y, { r: 2.6 })),
      [pts[0], pts[pts.length - 1]].map(([x, y]) => kit.dot(x, y, { r: 4.2, cls: 'd-mark-fill' })),
      kit.text(cx, 246, `resolution preview U ${u}`, { anchor: 'middle', size: 12 }),
    ];
  });
  return kit.svg({ width: 520, height: 260 },
    sections,
    kit.line(20, 142, 500, 142, { cls: 'd-guide', width: 1, dash: '4 6' }),
    lines,
  );
};
